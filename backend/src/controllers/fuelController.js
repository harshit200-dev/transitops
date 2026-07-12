const supabase = require('../config/supabase');

const getAll = async (req, res) => {
  const { data, error } = await supabase
    .from('fuel_logs')
    .select('*, vehicles(registration_number,make,model), drivers(name)')
    .order('date', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

const create = async (req, res) => {
  const { vehicle_id, driver_id, fuel_quantity, unit_price, total_cost, odometer_reading, date } = req.body;
  if (!vehicle_id || !fuel_quantity || !unit_price || !total_cost || !odometer_reading)
    return res.status(400).json({ error: 'vehicle_id, fuel_quantity, unit_price, total_cost, odometer_reading required' });

  const { data, error } = await supabase
    .from('fuel_logs')
    .insert([{
      vehicle_id,
      driver_id: driver_id || null,
      fuel_quantity: parseFloat(fuel_quantity),
      unit_price: parseFloat(unit_price),
      total_cost: parseFloat(total_cost),
      odometer_reading: parseFloat(odometer_reading),
      date: date || new Date().toISOString(),
    }])
    .select().single();

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
};

module.exports = { getAll, create };
