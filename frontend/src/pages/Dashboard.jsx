import { useEffect, useState } from 'react';
import { analyticsService } from '@/services';
import { useSettings } from '@/hooks/useSettings';
import { StatCard } from '@/components/ui/StatCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Truck, Users, MapPin, Wrench, Activity } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#714b67', '#9e6089', '#b980a6', '#d4adc8'];

export default function Dashboard() {
  const { t } = useSettings();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsService.getDashboard()
      .then(r => setData(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500" />
    </div>
  );

  if (!data) return <p className="text-gray-500 dark:text-gray-400">Failed to load dashboard.</p>;

  const vehiclePieData = [
    { name: 'Active', value: data.vehicles.active },
    { name: 'On Trip', value: data.vehicles.outOfService },
    { name: 'Maintenance', value: data.vehicles.maintenance },
    { name: 'Retired', value: data.vehicles.retired },
  ].filter(d => d.value > 0);

  const costBarData = [
    { name: 'Fuel', amount: data.costs.fuel },
    { name: 'Maintenance', amount: data.costs.maintenance },
    { name: 'Other', amount: data.costs.other },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-black dark:text-white">{t.dashboard}</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{t.fleetOperationsOverview}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard title={t.totalVehicles} value={data.vehicles.total} icon={Truck} color="purple" />
        <StatCard title={t.activeVehicles} value={data.vehicles.active} icon={Truck} color="green" />
        <StatCard title={t.inMaintenance} value={data.vehicles.maintenance} icon={Wrench} color="yellow" />
        <StatCard title={t.activeTrips} value={data.trips.active} icon={MapPin} color="blue" />
        <StatCard title={t.activeDrivers} value={data.drivers.active} icon={Users} color="purple" />
        <StatCard title={t.fleetUtilization} value={`${data.fleetUtilization}%`} icon={Activity} color="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>{t.operationalCosts}</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={costBarData}>
                <XAxis dataKey="name" stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <YAxis stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }}
                  labelStyle={{ color: '#f9fafb' }}
                  formatter={(v) => [`₹${v.toFixed(2)}`, 'Amount']}
                />
                <Bar dataKey="amount" fill="#714b67" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>{t.vehicleStatusDist}</CardTitle></CardHeader>
          <CardContent>
            {vehiclePieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={vehiclePieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" paddingAngle={3}>
                    {vehiclePieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }} />
                  <Legend wrapperStyle={{ color: '#9ca3af', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[220px] text-gray-500 dark:text-gray-400">No vehicle data</div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader><CardTitle>{t.costSummary}</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: t.fuelCosts, value: data.costs.fuel, color: 'text-blue-400' },
              { label: t.maintenance, value: data.costs.maintenance, color: 'text-yellow-400' },
              { label: t.otherExpenses, value: data.costs.other, color: 'text-purple-400' },
              { label: t.total, value: data.costs.total, color: 'text-black dark:text-white font-bold' },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex justify-between items-center">
                <span className="text-gray-500 dark:text-gray-400 text-sm">{label}</span>
                <span className={`text-sm ${color}`}>₹{value.toFixed(2)}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>{t.tripSummary}</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: t.totalTrips, value: data.trips.total },
              { label: t.scheduled, value: data.trips.scheduled },
              { label: t.inProgress, value: data.trips.active },
              { label: t.completed, value: data.trips.completed },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center">
                <span className="text-gray-500 dark:text-gray-400 text-sm">{label}</span>
                <span className="text-black dark:text-white text-sm font-medium">{value}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>{t.driverSummary}</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: t.totalDrivers, value: data.drivers.total },
              { label: t.active, value: data.drivers.active },
              { label: t.inactive, value: data.drivers.inactive },
              { label: t.suspended, value: data.drivers.suspended },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center">
                <span className="text-gray-500 dark:text-gray-400 text-sm">{label}</span>
                <span className="text-black dark:text-white text-sm font-medium">{value}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
