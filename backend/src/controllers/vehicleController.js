const supabase = require('../config/supabase');

const getAll = async (req, res) => {
  const { data, error } = await supabase
    .from('vehicles').select('*').order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

const create = async (req, res) => {
  const { registration_number, make, model, year, fuel_type, current_mileage, capacity } = req.body;
  if (!registration_number || !make || !model || !year)
    return res.status(400).json({ error: 'registration_number, make, model, year required' });

  const { data, error } = await supabase
    .from('vehicles')
    .insert([{
      registration_number,
      make,
      model,
      year: parseInt(year),
      fuel_type: fuel_type || 'Diesel',
      current_mileage: current_mileage || 0,
      capacity: capacity ? parseFloat(capacity) : null,
      status: 'Active',
    }])
    .select().single();

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
};

const update = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('vehicles').update(req.body).eq('id', id).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
};

const remove = async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('vehicles').delete().eq('id', id);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Vehicle deleted' });
};

module.exports = { getAll, create, update, remove };
