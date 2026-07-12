import { useEffect, useState } from 'react';
import { fuelService, expenseService, vehicleService, driverService } from '@/services';
import { useSettings } from '@/hooks/useSettings';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Table, Thead, Th, Tbody, Tr, Td } from '@/components/ui/Table';
import { Card, CardContent } from '@/components/ui/Card';
import { Plus, Fuel, Receipt } from 'lucide-react';

const EXPENSE_CATEGORIES = ['Toll', 'Insurance', 'Permit', 'Fuel', 'Maintenance', 'Other'];

export default function Finance() {
  const { t } = useSettings();
  const [fuel, setFuel] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [fuelModal, setFuelModal] = useState(false);
  const [expenseModal, setExpenseModal] = useState(false);
  const [fuelForm, setFuelForm] = useState({ vehicle_id: '', driver_id: '', fuel_quantity: '', unit_price: '', total_cost: '', odometer_reading: '', date: new Date().toISOString().split('T')[0] });
  const [expForm, setExpForm] = useState({ vehicle_id: '', category: 'Toll', amount: '', date: new Date().toISOString().split('T')[0], description: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const load = () => {
    fuelService.getAll().then(r => setFuel(r.data));
    expenseService.getAll().then(r => setExpenses(r.data));
    vehicleService.getAll().then(r => setVehicles(r.data));
    driverService.getAll().then(r => setDrivers(r.data));
  };
  useEffect(() => { load(); }, []);

  const setF = (k) => (e) => {
    const updated = { ...fuelForm, [k]: e.target.value };
    // Auto-calculate total cost
    if (k === 'fuel_quantity' || k === 'unit_price') {
      const qty = k === 'fuel_quantity' ? e.target.value : fuelForm.fuel_quantity;
      const price = k === 'unit_price' ? e.target.value : fuelForm.unit_price;
      if (qty && price) updated.total_cost = (parseFloat(qty) * parseFloat(price)).toFixed(2);
    }
    setFuelForm(updated);
  };
  const setE = (k) => (e) => setExpForm(p => ({ ...p, [k]: e.target.value }));

  const submitFuel = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try { await fuelService.create(fuelForm); setFuelModal(false); load(); }
    catch (err) { setError(err.response?.data?.error || 'Failed'); }
    finally { setLoading(false); }
  };

  const submitExpense = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try { await expenseService.create(expForm); setExpenseModal(false); load(); }
    catch (err) { setError(err.response?.data?.error || 'Failed'); }
    finally { setLoading(false); }
  };

  const totalFuel = fuel.reduce((s, f) => s + Number(f.total_cost), 0);
  const totalExp = expenses.reduce((s, e) => s + Number(e.amount), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black dark:text-white">Finance</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{t.fuelLogs} & {t.expenses}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => { setError(''); setFuelModal(true); }}><Fuel size={16} /> {t.addFuelLog}</Button>
          <Button onClick={() => { setError(''); setExpenseModal(true); }}><Plus size={16} /> {t.addExpense}</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card><CardContent>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{t.totalFuelCost}</p>
          <p className="text-2xl font-bold text-blue-400 mt-1">₹{totalFuel.toFixed(2)}</p>
          <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">{fuel.length} {t.logs}</p>
        </CardContent></Card>
        <Card><CardContent>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{t.totalExpenses}</p>
          <p className="text-2xl font-bold text-purple-400 mt-1">₹{totalExp.toFixed(2)}</p>
          <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">{expenses.length} {t.records}</p>
        </CardContent></Card>
        <Card><CardContent>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{t.totalOperationalCost}</p>
          <p className="text-2xl font-bold text-white dark:text-white mt-1">₹{(totalFuel + totalExp).toFixed(2)}</p>
          <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">{t.fuelPlusExpenses}</p>
        </CardContent></Card>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-black dark:text-white mb-3 flex items-center gap-2"><Fuel size={18} className="text-blue-400" /> {t.fuelLogs}</h2>
        <Table>
          <Thead><Th>{t.vehicle}</Th><Th>{t.driver}</Th><Th>{t.quantity}</Th><Th>{t.unitPrice}</Th><Th>{t.totalCost}</Th><Th>{t.odometer}</Th><Th>{t.date}</Th></Thead>
          <Tbody>
            {fuel.length === 0 ? (
              <Tr><Td className="text-center py-6 text-gray-500 dark:text-gray-400" colSpan={7}>{t.noFuelLogs}</Td></Tr>
            ) : fuel.map(f => (
              <Tr key={f.id}>
                <Td className="text-black dark:text-white font-medium">{f.vehicles?.registration_number || '—'}</Td>
                <Td>{f.drivers?.name || '—'}</Td>
                <Td>{f.fuel_quantity}L</Td>
                <Td>₹{Number(f.unit_price).toFixed(2)}/L</Td>
                <Td>₹{Number(f.total_cost).toFixed(2)}</Td>
                <Td>{Number(f.odometer_reading).toLocaleString()} km</Td>
                <Td>{new Date(f.date).toLocaleDateString()}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-black dark:text-white mb-3 flex items-center gap-2"><Receipt size={18} className="text-purple-400" /> {t.expenses}</h2>
        <Table>
          <Thead><Th>{t.vehicle}</Th><Th>{t.category}</Th><Th>{t.amount}</Th><Th>{t.description}</Th><Th>{t.date}</Th></Thead>
          <Tbody>
            {expenses.length === 0 ? (
              <Tr><Td className="text-center py-6 text-gray-500 dark:text-gray-400" colSpan={5}>{t.noExpenses}</Td></Tr>
            ) : expenses.map(e => (
              <Tr key={e.id}>
                <Td className="text-black dark:text-white font-medium">{e.vehicles?.registration_number || '—'}</Td>
                <Td>{e.category}</Td>
                <Td>₹{Number(e.amount).toFixed(2)}</Td>
                <Td>{e.description || '—'}</Td>
                <Td>{e.date}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </div>

      {/* Fuel Modal */}
      <Modal open={fuelModal} onClose={() => setFuelModal(false)} title={t.addFuelLog}>
        {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3 mb-4">{error}</div>}
        <form onSubmit={submitFuel} className="space-y-4">
          <Select label={t.vehicle} value={fuelForm.vehicle_id} onChange={setF('vehicle_id')} required>
            <option value="">{t.selectVehicle}</option>
            {vehicles.map(v => <option key={v.id} value={v.id}>{v.registration_number} — {v.make} {v.model}</option>)}
          </Select>
          <Select label={t.driverOptional} value={fuelForm.driver_id} onChange={setF('driver_id')}>
            <option value="">{t.selectDriver}</option>
            {drivers.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </Select>
          <div className="grid grid-cols-2 gap-3">
            <Input label={t.quantityLiters} type="number" step="0.01" value={fuelForm.fuel_quantity} onChange={setF('fuel_quantity')} required />
            <Input label={t.unitPricePerL} type="number" step="0.001" value={fuelForm.unit_price} onChange={setF('unit_price')} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label={t.totalCost} type="number" step="0.01" value={fuelForm.total_cost} onChange={setF('total_cost')} required />
            <Input label={t.odometerKm} type="number" value={fuelForm.odometer_reading} onChange={setF('odometer_reading')} required />
          </div>
          <Input label={t.date} type="date" value={fuelForm.date} onChange={setF('date')} />
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setFuelModal(false)}>{t.cancel}</Button>
            <Button type="submit" className="flex-1" disabled={loading}>{loading ? t.saving : t.save}</Button>
          </div>
        </form>
      </Modal>

      {/* Expense Modal */}
      <Modal open={expenseModal} onClose={() => setExpenseModal(false)} title={t.addExpense}>
        {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3 mb-4">{error}</div>}
        <form onSubmit={submitExpense} className="space-y-4">
          <Select label={t.vehicleOptional} value={expForm.vehicle_id} onChange={setE('vehicle_id')}>
            <option value="">{t.selectVehicle}</option>
            {vehicles.map(v => <option key={v.id} value={v.id}>{v.registration_number} — {v.make} {v.model}</option>)}
          </Select>
          <div className="grid grid-cols-2 gap-3">
            <Select label={t.category} value={expForm.category} onChange={setE('category')}>
              {EXPENSE_CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </Select>
            <Input label={t.amount} type="number" step="0.01" value={expForm.amount} onChange={setE('amount')} required />
          </div>
          <Input label={t.description} placeholder="Optional notes..." value={expForm.description} onChange={setE('description')} />
          <Input label={t.date} type="date" value={expForm.date} onChange={setE('date')} required />
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setExpenseModal(false)}>{t.cancel}</Button>
            <Button type="submit" className="flex-1" disabled={loading}>{loading ? t.saving : t.save}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
