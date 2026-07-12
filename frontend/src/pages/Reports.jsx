import { useEffect, useState } from 'react';
import { vehicleService, fuelService, maintenanceService, tripService } from '@/services';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Table, Thead, Th, Tbody, Tr, Td } from '@/components/ui/Table';
import { Download } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';

export default function Reports() {
  const [vehicles, setVehicles] = useState([]);
  const [fuel, setFuel] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    vehicleService.getAll().then(r => setVehicles(r.data));
    fuelService.getAll().then(r => setFuel(r.data));
    maintenanceService.getAll().then(r => setMaintenance(r.data));
    tripService.getAll().then(r => setTrips(r.data));
  }, []);

  // Per-vehicle analytics
  const vehicleReports = vehicles.map(v => {
    const vFuel = fuel.filter(f => f.vehicle_id === v.id);
    const vMaint = maintenance.filter(m => m.vehicle_id === v.id);
    const vTrips = trips.filter(t => t.vehicle_id === v.id && t.status === 'Completed');

    const totalFuelCost = vFuel.reduce((s, f) => s + Number(f.cost), 0);
    const totalFuelLiters = vFuel.reduce((s, f) => s + Number(f.liters), 0);
    const totalMaintCost = vMaint.reduce((s, m) => s + Number(m.cost), 0);
    const totalDistance = vTrips.reduce((s, t) => s + Number(t.planned_distance), 0);
    const fuelEfficiency = totalFuelLiters > 0 ? (totalDistance / totalFuelLiters).toFixed(2) : '—';
    const operationalCost = totalFuelCost + totalMaintCost;
    const roi = v.acquisition_cost > 0
      ? (((totalDistance * 2) - operationalCost) / Number(v.acquisition_cost) * 100).toFixed(1)
      : '—';

    return {
      ...v,
      totalFuelCost,
      totalMaintCost,
      operationalCost,
      totalDistance,
      fuelEfficiency,
      roi,
      completedTrips: vTrips.length,
    };
  });

  // Monthly fuel cost trend (last 6 months)
  const monthlyFuel = (() => {
    const map = {};
    fuel.forEach(f => {
      const month = f.date?.slice(0, 7);
      if (month) map[month] = (map[month] || 0) + Number(f.cost);
    });
    return Object.entries(map).sort().slice(-6).map(([month, cost]) => ({ month, cost: +cost.toFixed(2) }));
  })();

  const exportCSV = () => {
    const headers = ['Registration', 'Model', 'Completed Trips', 'Total Distance (km)', 'Fuel Cost (INR)', 'Maintenance Cost (INR)', 'Operational Cost (INR)', 'Fuel Efficiency (km/L)', 'ROI (%)'];
    const rows = vehicleReports.map(v => [
      v.registration_number, v.model, v.completedTrips, v.totalDistance,
      v.totalFuelCost.toFixed(2), v.totalMaintCost.toFixed(2),
      v.operationalCost.toFixed(2), v.fuelEfficiency, v.roi
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'transitops-report.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Reports</h1>
          <p className="text-gray-400 text-sm mt-1">Fleet performance analytics</p>
        </div>
        <Button variant="outline" onClick={exportCSV}><Download size={16} /> Export CSV</Button>
      </div>

      {/* Fuel trend chart */}
      {monthlyFuel.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Monthly Fuel Cost Trend</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={monthlyFuel}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <YAxis stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }}
                  formatter={(v) => [`₹${v}`, 'Fuel Cost']}
                />
                <Line type="monotone" dataKey="cost" stroke="#7c3aed" strokeWidth={2} dot={{ fill: '#7c3aed' }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Vehicle ROI table */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-3">Vehicle Performance Report</h2>
        <Table>
          <Thead>
            <Th>Vehicle</Th>
            <Th>Trips</Th>
            <Th>Distance (km)</Th>
            <Th>Fuel Cost</Th>
            <Th>Maint. Cost</Th>
            <Th>Op. Cost</Th>
            <Th>Efficiency (km/L)</Th>
            <Th>ROI %</Th>
          </Thead>
          <Tbody>
            {vehicleReports.length === 0 ? (
              <Tr><Td className="text-center py-8 text-gray-500" colSpan={8}>No data available</Td></Tr>
            ) : vehicleReports.map(v => (
              <Tr key={v.id}>
                <Td className="text-white font-medium">{v.registration_number}</Td>
                <Td>{v.completedTrips}</Td>
                <Td>{v.totalDistance}</Td>
                <Td>₹{v.totalFuelCost.toFixed(2)}</Td>
                <Td>₹{v.totalMaintCost.toFixed(2)}</Td>
                <Td>₹{v.operationalCost.toFixed(2)}</Td>
                <Td>{v.fuelEfficiency}</Td>
                <Td>
                  <span className={v.roi !== '—' && Number(v.roi) > 0 ? 'text-green-400' : 'text-red-400'}>
                    {v.roi !== '—' ? `${v.roi}%` : '—'}
                  </span>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </div>
    </div>
  );
}
