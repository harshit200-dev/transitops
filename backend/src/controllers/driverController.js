const supabase = require('../config/supabase');

const getAll = async (req, res) => {
  const { data, error } = await supabase
    .from('drivers').select('*').order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

const create = async (req, res) => {
  const { name, license_number, license_class, license_expiry, phone } = req.body;
  if (!name || !license_number || !license_expiry || !phone || !license_class)
    return res.status(400).json({ error: 'name, license_number, license_class, license_expiry, phone required' });

  if (!/^[0-9]{10}$/.test(phone))
    return res.status(400).json({ error: 'Phone number must be exactly 10 digits' });

  const { data, error } = await supabase
    .from('drivers')
    .insert([{ name, license_number, license_class, license_expiry, phone, status: 'Active' }])
    .select().single();

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
};

const update = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('drivers').update(req.body).eq('id', id).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
};

const remove = async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('drivers').delete().eq('id', id);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Driver deleted' });
};

module.exports = { getAll, create, update, remove };
