const supabase = require('../config/supabase');

const getAll = async (req, res) => {
  const { data, error } = await supabase
    .from('trips')
    .select('*, vehicles(registration_number,make,model), drivers(name,license_number)')
    .order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

const create = async (req, res) => {
  const { start_location, end_location, vehicle_id, driver_id, start_mileage, start_time } = req.body;
  if (!start_location || !vehicle_id || !driver_id || start_mileage === undefined)
    return res.status(400).json({ error: 'start_location, vehicle_id, driver_id, start_mileage required' });

  const { data, error } = await supabase
    .from('trips')
    .insert([{
      start_location,
      end_location: end_location || null,
      vehicle_id,
      driver_id,
      start_mileage: parseFloat(start_mileage),
      start_time: start_time || new Date().toISOString(),
      status: 'Scheduled',
    }])
    .select().single();

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
};

const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status, end_mileage, fuel_consumed, notes } = req.body;
  const validStatuses = ['Scheduled', 'In Progress', 'Completed', 'Cancelled'];
  if (!validStatuses.includes(status))
    return res.status(400).json({ error: 'Invalid status' });

  const { data: trip, error: tripErr } = await supabase
    .from('trips')
    .select('*, vehicles(*), drivers(*)')
    .eq('id', id).single();

  if (tripErr || !trip) return res.status(404).json({ error: 'Trip not found' });

  if (status === 'In Progress') {
    const vehicle = trip.vehicles;
    const driver = trip.drivers;

    if (vehicle.status !== 'Active')
      return res.status(400).json({ error: `Vehicle is ${vehicle.status}, not Active` });

    if (driver.status !== 'Active')
      return res.status(400).json({ error: `Driver is ${driver.status}, not Active` });

    const today = new Date();
    if (new Date(driver.license_expiry) < today)
      return res.status(400).json({ error: 'Driver license is expired' });

    await supabase.from('vehicles').update({ status: 'Out of Service' }).eq('id', vehicle.id);
    await supabase.from('drivers').update({ status: 'Inactive' }).eq('id', driver.id);
  }

  if (status === 'Completed' || status === 'Cancelled') {
    await supabase.from('vehicles').update({ status: 'Active' }).eq('id', trip.vehicle_id);
    await supabase.from('drivers').update({ status: 'Active' }).eq('id', trip.driver_id);
  }

  const updatePayload = { status };
  if (status === 'Completed') {
    if (end_mileage) updatePayload.end_mileage = parseFloat(end_mileage);
    if (fuel_consumed) updatePayload.fuel_consumed = parseFloat(fuel_consumed);
    if (notes) updatePayload.notes = notes;
    updatePayload.end_time = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from('trips').update(updatePayload).eq('id', id).select().single();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
};

module.exports = { getAll, create, updateStatus };
