import { useEffect, useState } from 'react';
import { tripService, vehicleService, driverService } from '@/services';
import { useSettings } from '@/hooks/useSettings';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Table, Thead, Th, Tbody, Tr, Td } from '@/components/ui/Table';
import { Plus, ChevronRight, AlertTriangle } from 'lucide-react';

const EMPTY = { start_location: '', end_location: '', vehicle_id: '', driver_id: '', start_mileage: '', cargo_weight: '' };
const NEXT_STATUS = { Scheduled: 'In Progress', 'In Progress': 'Completed' };

export default function Trips() {
  const { t } = useSettings();
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

  const set = (k) => (e) => {
    const updated = { ...form, [k]: e.target.value };
    // Reset vehicle if cargo weight changes and selected vehicle can't handle it
    if (k === 'cargo_weight') {
      const selectedVehicle = vehicles.find(v => v.id === form.vehicle_id);
      if (selectedVehicle?.capacity && parseFloat(e.target.value) > parseFloat(selectedVehicle.capacity)) {
        updated.vehicle_id = '';
      }
    }
    setForm(updated);
  };

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

  const activeDrivers = drivers.filter(d => d.status === 'Active');

  // Filter vehicles: Active status + capacity >= cargo_weight (if entered)
  const cargoWeight = parseFloat(form.cargo_weight) || 0;
  const eligibleVehicles = vehicles
    .filter(v => v.status === 'Active')
    .filter(v => !cargoWeight || !v.capacity || parseFloat(v.capacity) >= cargoWeight)
    .sort((a, b) => {
      // Sort: vehicles with enough capacity first, then by capacity ascending
      const aCap = parseFloat(a.capacity) || 0;
      const bCap = parseFloat(b.capacity) || 0;
      return aCap - bCap;
    });

  const ineligibleVehicles = cargoWeight > 0
    ? vehicles.filter(v => v.status === 'Active' && v.capacity && parseFloat(v.capacity) < cargoWeight)
    : [];

  const selectedVehicle = vehicles.find(v => v.id === form.vehicle_id);
  const capacityWarning = selectedVehicle?.capacity && cargoWeight > 0 && cargoWeight > parseFloat(selectedVehicle.capacity);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black dark:text-white">Trips</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{trips.length} {t.totalTrips}</p>
        </div>
        <Button onClick={() => { setForm(EMPTY); setError(''); setModal(true); }}>
          <Plus size={16} /> {t.newTrip}
        </Button>
      </div>

      <Table>
        <Thead>
          <Th>{t.route}</Th><Th>{t.vehicle}</Th><Th>{t.driver}</Th><Th>{t.cargoKg}</Th><Th>{t.startMileage}</Th><Th>{t.status}</Th><Th>{t.actions}</Th>
        </Thead>
        <Tbody>
          {trips.length === 0 ? (
            <Tr><Td className="text-center py-8 text-gray-500 dark:text-gray-400" colSpan={7}>{t.noTrips}</Td></Tr>
          ) : trips.map(t => (
            <Tr key={t.id}>
              <Td>
                <div className="flex items-center gap-1 text-black dark:text-white font-medium">
                  {t.start_location}
                  {t.end_location && <><ChevronRight size={14} className="text-gray-500 dark:text-gray-400" />{t.end_location}</>}
                </div>
              </Td>
              <Td>{t.vehicles?.registration_number || '—'}</Td>
              <Td>{t.drivers?.name || '—'}</Td>
              <Td>{t.cargo_weight ? `${t.cargo_weight} kg` : '—'}</Td>
              <Td>{t.start_mileage} km</Td>
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

      <Modal open={modal} onClose={() => setModal(false)} title={t.createTrip}>
        {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3 mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input label={t.startLocation} placeholder="City / Location" value={form.start_location} onChange={set('start_location')} required />
            <Input label={t.endLocation} placeholder="City / Location" value={form.end_location} onChange={set('end_location')} />
          </div>

          {/* Cargo weight FIRST so vehicle list filters accordingly */}
          <Input
            label={t.cargoWeightKg}
            type="number"
            min="0"
            placeholder="Enter cargo weight to filter vehicles"
            value={form.cargo_weight}
            onChange={set('cargo_weight')}
          />

          {/* Vehicle selector — filtered by cargo capacity */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-500 dark:text-gray-400">
              {t.vehicle}
              {cargoWeight > 0 && (
                <span className="ml-2 text-xs text-purple-400">
                  — showing vehicles with capacity ≥ {cargoWeight} kg
                </span>
              )}
            </label>
            <select
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
              value={form.vehicle_id}
              onChange={set('vehicle_id')}
              required
            >
              <option value="">{t.selectVehicle}</option>
              {eligibleVehicles.length > 0 && (
                <optgroup label="✅ Eligible Vehicles">
                  {eligibleVehicles.map(v => (
                    <option key={v.id} value={v.id}>
                      {v.registration_number} — {v.make} {v.model}
                      {v.capacity ? ` (cap: ${v.capacity} kg)` : ' (no capacity set)'}
                    </option>
                  ))}
                </optgroup>
              )}
              {ineligibleVehicles.length > 0 && (
                <optgroup label="❌ Insufficient Capacity" disabled>
                  {ineligibleVehicles.map(v => (
                    <option key={v.id} value={v.id} disabled>
                      {v.registration_number} — {v.make} {v.model} (cap: {v.capacity} kg)
                    </option>
                  ))}
                </optgroup>
              )}
            </select>

            {/* Capacity warning */}
            {capacityWarning && (
              <div className="flex items-center gap-2 text-yellow-400 text-xs mt-1">
                <AlertTriangle size={12} />
                {t.cargoExceedsCapacity}
              </div>
            )}

            {/* No eligible vehicles warning */}
            {cargoWeight > 0 && eligibleVehicles.length === 0 && (
              <div className="flex items-center gap-2 text-red-400 text-xs mt-1">
                <AlertTriangle size={12} />
                {t.noEligibleVehicles} {cargoWeight} kg.
              </div>
            )}
          </div>

          <Select label={t.driver} value={form.driver_id} onChange={set('driver_id')} required>
            <option value="">{t.selectDriver}</option>
            {activeDrivers.map(d => (
              <option key={d.id} value={d.id}>{d.name} — {d.license_number}</option>
            ))}
          </Select>

          <Input label={t.startMileageKm} type="number" value={form.start_mileage} onChange={set('start_mileage')} required />

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setModal(false)}>{t.cancel}</Button>
            <Button type="submit" className="flex-1" disabled={loading}>{loading ? t.creating : t.createTrip}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
