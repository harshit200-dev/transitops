import { useEffect, useState } from 'react';
import { maintenanceService, vehicleService } from '@/services';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Table, Thead, Th, Tbody, Tr, Td } from '@/components/ui/Table';
import { Plus } from 'lucide-react';

const EMPTY = { vehicle_id: '', type: 'Routine', description: '', cost: '', scheduled_date: new Date().toISOString().split('T')[0], service_provider: '' };
const TYPES = ['Routine', 'Repair', 'Inspection', 'Breakdown'];

export default function Maintenance() {
  const [records, setRecords] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const load = () => {
    maintenanceService.getAll().then(r => setRecords(r.data));
    vehicleService.getAll().then(r => setVehicles(r.data));
  };
  useEffect(() => { load(); }, []);

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      await maintenanceService.create(form);
      setModal(false); setForm(EMPTY); load();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create record');
    } finally { setLoading(false); }
  };

  const handleStatusChange = async (id, status) => {
    try { await maintenanceService.updateStatus(id, status); load(); }
    catch (err) { alert(err.response?.data?.error || 'Update failed'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Maintenance</h1>
          <p className="text-gray-400 text-sm mt-1">{records.length} total records</p>
        </div>
        <Button onClick={() => { setForm(EMPTY); setError(''); setModal(true); }}>
          <Plus size={16} /> Add Record
        </Button>
      </div>

      <Table>
        <Thead>
          <Th>Vehicle</Th><Th>Type</Th><Th>Description</Th><Th>Cost</Th><Th>Scheduled</Th><Th>Provider</Th><Th>Status</Th><Th>Actions</Th>
        </Thead>
        <Tbody>
          {records.length === 0 ? (
            <Tr><Td className="text-center py-8 text-gray-500" colSpan={8}>No maintenance records</Td></Tr>
          ) : records.map(r => (
            <Tr key={r.id}>
              <Td className="font-medium text-white">{r.vehicles?.registration_number || '—'}</Td>
              <Td>{r.type}</Td>
              <Td className="max-w-[200px] truncate">{r.description}</Td>
              <Td>${Number(r.cost).toFixed(2)}</Td>
              <Td>{r.scheduled_date}</Td>
              <Td>{r.service_provider || '—'}</Td>
              <Td><Badge status={r.status} /></Td>
              <Td>
                {r.status !== 'Completed' && r.status !== 'Cancelled' && (
                  <div className="flex gap-2">
                    {r.status === 'Scheduled' && (
                      <Button size="sm" variant="outline" onClick={() => handleStatusChange(r.id, 'In Progress')}>Start</Button>
                    )}
                    {r.status === 'In Progress' && (
                      <Button size="sm" variant="success" onClick={() => handleStatusChange(r.id, 'Completed')}>Complete</Button>
                    )}
                    <Button size="sm" variant="danger" onClick={() => handleStatusChange(r.id, 'Cancelled')}>Cancel</Button>
                  </div>
                )}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Modal open={modal} onClose={() => setModal(false)} title="Add Maintenance Record">
        {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3 mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select label="Vehicle" value={form.vehicle_id} onChange={set('vehicle_id')} required>
            <option value="">Select vehicle...</option>
            {vehicles.map(v => <option key={v.id} value={v.id}>{v.registration_number} — {v.make} {v.model} ({v.status})</option>)}
          </Select>
          <div className="grid grid-cols-2 gap-3">
            <Select label="Type" value={form.type} onChange={set('type')}>
              {TYPES.map(t => <option key={t}>{t}</option>)}
            </Select>
            <Input label="Cost ($)" type="number" step="0.01" value={form.cost} onChange={set('cost')} />
          </div>
          <Input label="Description" placeholder="Describe the maintenance work..." value={form.description} onChange={set('description')} required />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Scheduled Date" type="date" value={form.scheduled_date} onChange={set('scheduled_date')} required />
            <Input label="Service Provider" placeholder="Workshop name" value={form.service_provider} onChange={set('service_provider')} />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setModal(false)}>Cancel</Button>
            <Button type="submit" className="flex-1" disabled={loading}>{loading ? 'Saving...' : 'Save'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
