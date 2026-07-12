import { useEffect, useState } from 'react';
import { analyticsService } from '@/services';
import { StatCard } from '@/components/ui/StatCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Truck, Users, MapPin, Wrench, DollarSign, Activity } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#714b67', '#9e6089', '#b980a6', '#d4adc8'];

export default function Dashboard() {
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

  if (!data) return <p className="text-gray-400">Failed to load dashboard.</p>;

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
        <h1 className="text-2xl font-bold text-black dark:text-white">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Fleet operations overview</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard title="Total Vehicles" value={data.vehicles.total} icon={Truck} color="purple" />
        <StatCard title="Active Vehicles" value={data.vehicles.active} icon={Truck} color="green" />
        <StatCard title="In Maintenance" value={data.vehicles.maintenance} icon={Wrench} color="yellow" />
        <StatCard title="Active Trips" value={data.trips.active} icon={MapPin} color="blue" />
        <StatCard title="Active Drivers" value={data.drivers.active} icon={Users} color="purple" />
        <StatCard title="Fleet Utilization" value={`${data.fleetUtilization}%`} icon={Activity} color="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Operational Costs</CardTitle></CardHeader>
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
          <CardHeader><CardTitle>Vehicle Status Distribution</CardTitle></CardHeader>
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
              <div className="flex items-center justify-center h-[220px] text-gray-500">No vehicle data</div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader><CardTitle>Cost Summary</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: 'Fuel Costs', value: data.costs.fuel, color: 'text-blue-400' },
              { label: 'Maintenance', value: data.costs.maintenance, color: 'text-yellow-400' },
              { label: 'Other Expenses', value: data.costs.other, color: 'text-purple-400' },
              { label: 'Total', value: data.costs.total, color: 'text-black dark:text-white font-bold' },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex justify-between items-center">
                <span className="text-gray-500 dark:text-gray-400 text-sm">{label}</span>
                <span className={`text-sm ${color}`}>₹{value.toFixed(2)}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Trip Summary</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: 'Total Trips', value: data.trips.total },
              { label: 'Scheduled', value: data.trips.scheduled },
              { label: 'In Progress', value: data.trips.active },
              { label: 'Completed', value: data.trips.completed },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center">
                <span className="text-gray-500 dark:text-gray-400 text-sm">{label}</span>
                <span className="text-black dark:text-white text-sm font-medium">{value}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Driver Summary</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: 'Total Drivers', value: data.drivers.total },
              { label: 'Active', value: data.drivers.active },
              { label: 'Inactive', value: data.drivers.inactive },
              { label: 'Suspended', value: data.drivers.suspended },
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
