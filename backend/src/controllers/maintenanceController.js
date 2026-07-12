const supabase = require('../config/supabase');

const getAll = async (req, res) => {
  const { data, error } = await supabase
    .from('maintenance')
    .select('*, vehicles(registration_number,make,model)')
    .order('scheduled_date', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

const create = async (req, res) => {
  const { vehicle_id, type, description, cost, scheduled_date, service_provider } = req.body;
  if (!vehicle_id || !description || !type || !scheduled_date)
    return res.status(400).json({ error: 'vehicle_id, type, description, scheduled_date required' });

  const { data, error } = await supabase
    .from('maintenance')
    .insert([{
      vehicle_id,
      type: type || 'Routine',
      description,
      cost: cost || 0,
      scheduled_date,
      service_provider: service_provider || null,
      status: 'Scheduled',
    }])
    .select().single();

  if (error) return res.status(400).json({ error: error.message });

  // Set vehicle to Maintenance
  await supabase.from('vehicles').update({ status: 'Maintenance' }).eq('id', vehicle_id);

  res.status(201).json(data);
};

const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const { data: record, error: fetchErr } = await supabase
    .from('maintenance').select('*').eq('id', id).single();
  if (fetchErr || !record) return res.status(404).json({ error: 'Record not found' });

  const updatePayload = { status };
  if (status === 'Completed') updatePayload.completed_date = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('maintenance').update(updatePayload).eq('id', id).select().single();
  if (error) return res.status(400).json({ error: error.message });

  if (status === 'Completed' || status === 'Cancelled') {
    await supabase.from('vehicles').update({ status: 'Active' }).eq('id', record.vehicle_id);
  }

  res.json(data);
};

module.exports = { getAll, create, updateStatus };
