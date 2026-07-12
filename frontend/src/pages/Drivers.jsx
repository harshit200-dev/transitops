import { useEffect, useState } from 'react';
import { driverService } from '@/services';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Table, Thead, Th, Tbody, Tr, Td } from '@/components/ui/Table';
import { Plus, Pencil, Trash2, Search, AlertTriangle } from 'lucide-react';

const EMPTY = { name: '', license_number: '', license_class: '', license_expiry: '', phone: '' };
const STATUSES = ['Active', 'Suspended', 'Inactive'];

function isExpired(date) { return new Date(date) < new Date(); }
function isExpiringSoon(date) {
  const d = new Date(date), soon = new Date();
  soon.setDate(soon.getDate() + 30);
  return d > new Date() && d <= soon;
}

export default function Drivers() {
  const [drivers, setDrivers] = useState([]);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const load = () => driverService.getAll().then(r => setDrivers(r.data));
  useEffect(() => { load(); }, []);

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));
  const openAdd = () => { setEditing(null); setForm(EMPTY); setError(''); setModal(true); };
  const openEdit = (d) => { setEditing(d); setForm(d); setError(''); setModal(true); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      if (editing) await driverService.update(editing.id, form);
      else await driverService.create(form);
      setModal(false); load();
    } catch (err) {
      setError(err.response?.data?.error || 'Operation failed');
    } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this driver?')) return;
    await driverService.delete(id); load();
  };

  const filtered = drivers.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.license_number.toLowerCase().includes(search.toLowerCase())
  );

  const alerts = drivers.filter(d => isExpired(d.license_expiry) || isExpiringSoon(d.license_expiry));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Drivers</h1>
          <p className="text-gray-400 text-sm mt-1">{drivers.length} total drivers</p>
        </div>
        <Button onClick={openAdd}><Plus size={16} /> Add Driver</Button>
      </div>

      {alerts.length > 0 && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle size={18} className="text-yellow-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-yellow-400 font-medium text-sm">License Alerts</p>
            <ul className="text-yellow-300/80 text-xs mt-1 space-y-0.5">
              {drivers.filter(d => isExpired(d.license_expiry)).map(d => (
                <li key={d.id}>⚠ {d.name} — license EXPIRED ({d.license_expiry})</li>
              ))}
              {drivers.filter(d => isExpiringSoon(d.license_expiry)).map(d => (
                <li key={d.id}>⏰ {d.name} — expiring soon ({d.license_expiry})</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="relative max-w-xs">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-9 pr-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500"
          placeholder="Search drivers..." value={search} onChange={e => setSearch(e.target.value)}
        />
      </div>

      <Table>
        <Thead>
          <Th>Name</Th><Th>License #</Th><Th>Class</Th><Th>Expiry</Th><Th>Phone</Th><Th>Status</Th><Th>Actions</Th>
        </Thead>
        <Tbody>
          {filtered.length === 0 ? (
            <Tr><Td className="text-center py-8 text-gray-500" colSpan={7}>No drivers found</Td></Tr>
          ) : filtered.map(d => (
            <Tr key={d.id}>
              <Td className="font-medium text-white">{d.name}</Td>
              <Td>{d.license_number}</Td>
              <Td>{d.license_class}</Td>
              <Td>
                <span className={isExpired(d.license_expiry) ? 'text-red-400' : isExpiringSoon(d.license_expiry) ? 'text-yellow-400' : 'text-gray-300'}>
                  {d.license_expiry}{isExpired(d.license_expiry) && ' ⚠'}
                </span>
              </Td>
              <Td>{d.phone}</Td>
              <Td><Badge status={d.status} /></Td>
              <Td>
                <div className="flex gap-2">
                  <Button size="icon" variant="ghost" onClick={() => openEdit(d)}><Pencil size={14} /></Button>
                  <Button size="icon" variant="ghost" onClick={() => handleDelete(d.id)} className="hover:text-red-400"><Trash2 size={14} /></Button>
                </div>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Driver' : 'Add Driver'}>
        {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3 mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Full Name" value={form.name} onChange={set('name')} required />
          <div className="grid grid-cols-2 gap-3">
            <Input label="License Number" value={form.license_number} onChange={set('license_number')} required />
            <Input label="License Class" placeholder="e.g. Class A" value={form.license_class} onChange={set('license_class')} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="License Expiry" type="date" value={form.license_expiry} onChange={set('license_expiry')} required />
            <Input label="Phone" value={form.phone} onChange={set('phone')} required />
          </div>
          {editing && (
            <Select label="Status" value={form.status} onChange={set('status')}>
              {STATUSES.map(s => <option key={s}>{s}</option>)}
            </Select>
          )}
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setModal(false)}>Cancel</Button>
            <Button type="submit" className="flex-1" disabled={loading}>{loading ? 'Saving...' : 'Save'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
