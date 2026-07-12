import { useEffect, useState } from 'react';
import { tripService, vehicleService, driverService } from '@/services';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Table, Thead, Th, Tbody, Tr, Td } from '@/components/ui/Table';
import { Plus, ChevronRight } from 'lucide-react';

const EMPTY = { start_location: '', end_location: '', vehicle_id: '', driver_id: '', start_mileage: '' };
const NEXT_STATUS = { Scheduled: 'In Progress', 'In Progress': 'Completed' };

export default function Trips() {
  const [trips, setTrips] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const load = () => {
    tripService.getAll().then(r => setTrips(r.data));
    vehicleService.getAll().then(r => setVehicles(r.data));
    driverService.getAll().then(r => setDrivers(r.data));
  };
  useEffect(() => { load(); }, []);

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      await tripService.create(form);
      setModal(false); setForm(EMPTY); load();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create trip');
    } finally { setLoading(false); }
  };

  const handleAdvance = async (trip) => {
    const next = NEXT_STATUS[trip.status];
    if (!next) return;
    try { await tripService.updateStatus(trip.id, next); load(); }
    catch (err) { alert(err.response?.data?.error || 'Status update failed'); }
  };

  const handleCancel = async (trip) => {
    if (!confirm('Cancel this trip?')) return;
    try { await tripService.updateStatus(trip.id, 'Cancelled'); load(); }
    catch (err) { alert(err.response?.data?.error || 'Cancel failed'); }
  };

  const activeVehicles = vehicles.filter(v => v.status === 'Active');
  const activeDrivers = drivers.filter(d => d.status === 'Active');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Trips</h1>
          <p className="text-gray-400 text-sm mt-1">{trips.length} total trips</p>
        </div>
        <Button onClick={() => { setForm(EMPTY); setError(''); setModal(true); }}>
          <Plus size={16} /> New Trip
        </Button>
      </div>

      <Table>
        <Thead>
          <Th>Route</Th><Th>Vehicle</Th><Th>Driver</Th><Th>Start Mileage</Th><Th>Start Time</Th><Th>Status</Th><Th>Actions</Th>
        </Thead>
        <Tbody>
          {trips.length === 0 ? (
            <Tr><Td className="text-center py-8 text-gray-500" colSpan={7}>No trips found</Td></Tr>
          ) : trips.map(t => (
            <Tr key={t.id}>
              <Td>
                <div className="flex items-center gap-1 text-white font-medium">
                  {t.start_location}
                  {t.end_location && <><ChevronRight size={14} className="text-gray-500" />{t.end_location}</>}
                </div>
              </Td>
              <Td>{t.vehicles?.registration_number || '—'}</Td>
              <Td>{t.drivers?.name || '—'}</Td>
              <Td>{t.start_mileage} km</Td>
              <Td>{t.start_time ? new Date(t.start_time).toLocaleDateString() : '—'}</Td>
              <Td><Badge status={t.status} /></Td>
              <Td>
                <div className="flex gap-2">
                  {NEXT_STATUS[t.status] && (
                    <Button size="sm" onClick={() => handleAdvance(t)}>→ {NEXT_STATUS[t.status]}</Button>
                  )}
                  {(t.status === 'Scheduled' || t.status === 'In Progress') && (
                    <Button size="sm" variant="danger" onClick={() => handleCancel(t)}>Cancel</Button>
                  )}
                </div>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Modal open={modal} onClose={() => setModal(false)} title="Create New Trip">
        {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3 mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input label="Start Location" placeholder="City / Location" value={form.start_location} onChange={set('start_location')} required />
            <Input label="End Location" placeholder="City / Location" value={form.end_location} onChange={set('end_location')} />
          </div>
          <Select label="Vehicle" value={form.vehicle_id} onChange={set('vehicle_id')} required>
            <option value="">Select vehicle...</option>
            {activeVehicles.map(v => (
              <option key={v.id} value={v.id}>{v.registration_number} — {v.make} {v.model}</option>
            ))}
          </Select>
          <Select label="Driver" value={form.driver_id} onChange={set('driver_id')} required>
            <option value="">Select driver...</option>
            {activeDrivers.map(d => (
              <option key={d.id} value={d.id}>{d.name} — {d.license_number}</option>
            ))}
          </Select>
          <Input label="Start Mileage (km)" type="number" value={form.start_mileage} onChange={set('start_mileage')} required />
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setModal(false)}>Cancel</Button>
            <Button type="submit" className="flex-1" disabled={loading}>{loading ? 'Creating...' : 'Create Trip'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
