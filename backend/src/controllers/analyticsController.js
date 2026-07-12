const supabase = require('../config/supabase');

const getDashboard = async (req, res) => {
  const [vehicles, drivers, trips, maintenance, fuel, expenses] = await Promise.all([
    supabase.from('vehicles').select('*'),
    supabase.from('drivers').select('*'),
    supabase.from('trips').select('*'),
    supabase.from('maintenance').select('*'),
    supabase.from('fuel_logs').select('*'),
    supabase.from('expenses').select('*'),
  ]);

  const v = vehicles.data || [];
  const d = drivers.data || [];
  const t = trips.data || [];
  const m = maintenance.data || [];
  const f = fuel.data || [];
  const e = expenses.data || [];

  const totalFuelCost = f.reduce((s, x) => s + Number(x.total_cost), 0);
  const totalMaintenanceCost = m.reduce((s, x) => s + Number(x.cost), 0);
  const totalExpenses = e.reduce((s, x) => s + Number(x.amount), 0);

  res.json({
    vehicles: {
      total: v.length,
      active: v.filter(x => x.status === 'Active').length,
      maintenance: v.filter(x => x.status === 'Maintenance').length,
      outOfService: v.filter(x => x.status === 'Out of Service').length,
      retired: v.filter(x => x.status === 'Retired').length,
    },
    drivers: {
      total: d.length,
      active: d.filter(x => x.status === 'Active').length,
      inactive: d.filter(x => x.status === 'Inactive').length,
      suspended: d.filter(x => x.status === 'Suspended').length,
    },
    trips: {
      total: t.length,
      active: t.filter(x => x.status === 'In Progress').length,
      completed: t.filter(x => x.status === 'Completed').length,
      scheduled: t.filter(x => x.status === 'Scheduled').length,
    },
    costs: {
      fuel: totalFuelCost,
      maintenance: totalMaintenanceCost,
      other: totalExpenses,
      total: totalFuelCost + totalMaintenanceCost + totalExpenses,
    },
    fleetUtilization: v.length
      ? Math.round((v.filter(x => x.status === 'Out of Service').length / v.length) * 100)
      : 0,
  });
};

module.exports = { getDashboard };
