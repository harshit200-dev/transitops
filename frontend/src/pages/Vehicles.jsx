import { useEffect, useState } from 'react';
import { vehicleService } from '@/services';
import { useSettings } from '@/hooks/useSettings';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Table, Thead, Th, Tbody, Tr, Td } from '@/components/ui/Table';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

const FUEL_TYPES = ['Diesel', 'Gasoline', 'Electric', 'Hybrid'];
const STATUSES = ['Active', 'Maintenance', 'Retired', 'Out of Service'];
const EMPTY = { registration_number: '', make: '', model: '', year: new Date().getFullYear(), fuel_type: 'Diesel', current_mileage: 0, capacity: '' };

export default function Vehicles() {
  const { t, theme } = useSettings();
  const [vehicles, setVehicles] = useState([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const load = () => vehicleService.getAll().then(r => setVehicles(r.data));
  useEffect(() => { load(); }, []);

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));
  const openAdd = () => { setEditing(null); setForm(EMPTY); setError(''); setModal(true); };
  const openEdit = (v) => { setEditing(v); setForm(v); setError(''); setModal(true); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      if (editing) await vehicleService.update(editing.id, form);
      else await vehicleService.create(form);
      setModal(false); load();
    } catch (err) {
      setError(err.response?.data?.error || 'Operation failed');
    } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this vehicle?')) return;
    await vehicleService.delete(id); load();
  };

  const filtered = vehicles.filter(v => {
    const matchSearch = v.registration_number.toLowerCase().includes(search.toLowerCase()) ||
      v.model.toLowerCase().includes(search.toLowerCase()) ||
      v.make.toLowerCase().includes(search.toLowerCase());
    return matchSearch && (!filterStatus || v.status === filterStatus);
  });

  const inputClass = cn(
    'w-full border rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-purple-500',
    theme === 'dark'
      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
  );

  const selectClass = cn(
    'border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500',
    theme === 'dark'
      ? 'bg-gray-800 border-gray-700 text-white'
      : 'bg-white border-gray-300 text-gray-900'
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className={cn('text-2xl font-bold', theme === 'dark' ? 'text-white' : 'text-gray-900')}>{t.vehicles}</h1>
          <p className={cn('text-sm mt-1', theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}>{vehicles.length} {t.totalVehicles}</p>
        </div>
        <Button onClick={openAdd}><Plus size={16} /> {t.addVehicle}</Button>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input className={inputClass} placeholder={t.search} value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className={selectClass} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">{t.allStatuses}</option>
          {STATUSES.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      <Table>
        <Thead>
          <Th>{t.registration}</Th>
          <Th>{t.make} / {t.model}</Th>
          <Th>{t.year}</Th>
          <Th>{t.fuelType}</Th>
          <Th>{t.capacity}</Th>
          <Th>{t.mileage}</Th>
          <Th>{t.status}</Th>
          <Th>{t.actions}</Th>
        </Thead>
        <Tbody>
          {filtered.length === 0 ? (
            <Tr><Td className="text-center py-8 text-gray-500" colSpan={8}>{t.noVehicles}</Td></Tr>
          ) : filtered.map(v => (
            <Tr key={v.id}>
              <Td className={cn('font-medium', theme === 'dark' ? 'text-white' : 'text-gray-900')}>{v.registration_number}</Td>
              <Td>{v.make} {v.model}</Td>
              <Td>{v.year}</Td>
              <Td>{v.fuel_type}</Td>
              <Td>{v.capacity ? `${v.capacity} kg` : '—'}</Td>
              <Td>{Number(v.current_mileage).toLocaleString()} km</Td>
              <Td><Badge status={v.status} /></Td>
              <Td>
                <div className="flex gap-2">
                  <Button size="icon" variant="ghost" onClick={() => openEdit(v)}><Pencil size={14} /></Button>
                  <Button size="icon" variant="ghost" onClick={() => handleDelete(v.id)} className="hover:text-red-400"><Trash2 size={14} /></Button>
                </div>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? t.editVehicle : t.addVehicle}>
        {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3 mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label={t.registration} value={form.registration_number} onChange={set('registration_number')} required />
          <div className="grid grid-cols-2 gap-3">
            <Input label={t.make} placeholder="Toyota" value={form.make} onChange={set('make')} required />
            <Input label={t.model} placeholder="Hilux" value={form.model} onChange={set('model')} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label={t.year} type="number" value={form.year} onChange={set('year')} required />
            <Select label={t.fuelType} value={form.fuel_type} onChange={set('fuel_type')}>
              {FUEL_TYPES.map(ft => <option key={ft}>{ft}</option>)}
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label={t.capacity} type="number" placeholder="e.g. 5000" value={form.capacity} onChange={set('capacity')} />
            <Input label={t.mileage} type="number" value={form.current_mileage} onChange={set('current_mileage')} />
          </div>
          {editing && (
            <Select label={t.status} value={form.status} onChange={set('status')}>
              {STATUSES.map(s => <option key={s}>{s}</option>)}
            </Select>
          )}
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setModal(false)}>{t.cancel}</Button>
            <Button type="submit" className="flex-1" disabled={loading}>{loading ? '...' : t.save}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
