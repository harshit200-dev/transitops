const supabase = require('../config/supabase');

const getAll = async (req, res) => {
  const { data, error } = await supabase
    .from('expenses')
    .select('*, vehicles(registration_number,make,model)')
    .order('date', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

const create = async (req, res) => {
  const { vehicle_id, category, amount, date, description } = req.body;
  if (!category || !amount || !date)
    return res.status(400).json({ error: 'category, amount, date required' });

  const { data, error } = await supabase
    .from('expenses')
    .insert([{
      vehicle_id: vehicle_id || null,
      category,
      amount: parseFloat(amount),
      date,
      description: description || null,
    }])
    .select().single();

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
};

module.exports = { getAll, create };
