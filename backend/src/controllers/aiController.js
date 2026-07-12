const OpenAI = require('openai');
const supabase = require('../config/supabase');

const chat = async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message required' });

  // Gather fleet context
  const [vehicles, drivers, trips, maintenance, fuel] = await Promise.all([
    supabase.from('vehicles').select('*'),
    supabase.from('drivers').select('*'),
    supabase.from('trips').select('*'),
    supabase.from('maintenance').select('*'),
    supabase.from('fuel_logs').select('*'),
  ]);

  const context = {
    vehicles: vehicles.data || [],
    drivers: drivers.data || [],
    trips: trips.data || [],
    maintenance: maintenance.data || [],
    fuel: fuel.data || [],
  };

  const systemPrompt = `You are TransitOps AI Assistant, an expert fleet management analyst.
You have access to real-time fleet data. Analyze it and provide actionable insights.

Current Fleet Data:
- Vehicles: ${JSON.stringify(context.vehicles)}
- Drivers: ${JSON.stringify(context.drivers)}
- Trips: ${JSON.stringify(context.trips)}
- Maintenance Records: ${JSON.stringify(context.maintenance)}
- Fuel Logs: ${JSON.stringify(context.fuel)}

Answer questions about fleet performance, maintenance needs, cost optimization, and safety risks.
Be concise, data-driven, and actionable.`;

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
      max_tokens: 500,
    });
    res.json({ reply: completion.choices[0].message.content });
  } catch (err) {
    // Fallback rule-based responses when OpenAI is unavailable
    const reply = generateFallbackReply(message, context);
    res.json({ reply });
  }
};

function generateFallbackReply(message, { vehicles, drivers, maintenance, fuel }) {
  const msg = message.toLowerCase();

  if (msg.includes('maintenance')) {
    const inShop = vehicles.filter(v => v.status === 'In Shop');
    return inShop.length
      ? `${inShop.length} vehicle(s) currently in maintenance: ${inShop.map(v => v.registration_number).join(', ')}.`
      : 'No vehicles currently in maintenance.';
  }

  if (msg.includes('fuel') || msg.includes('consumption')) {
    const byVehicle = {};
    fuel.forEach(f => {
      byVehicle[f.vehicle_id] = (byVehicle[f.vehicle_id] || 0) + Number(f.cost);
    });
    const sorted = Object.entries(byVehicle).sort((a, b) => b[1] - a[1]);
    if (!sorted.length) return 'No fuel data available yet.';
    const topId = sorted[0][0];
    const topVehicle = vehicles.find(v => v.id === topId);
    return `Highest fuel cost vehicle: ${topVehicle?.registration_number || topId} with $${sorted[0][1].toFixed(2)} total fuel spend.`;
  }

  if (msg.includes('driver') || msg.includes('safety')) {
    const risks = drivers.filter(d => {
      const expired = new Date(d.license_expiry) < new Date();
      return expired || d.safety_score < 70 || d.status === 'Suspended';
    });
    return risks.length
      ? `${risks.length} driver(s) with safety risks: ${risks.map(d => d.name).join(', ')}.`
      : 'All drivers have acceptable safety profiles.';
  }

  if (msg.includes('cost') || msg.includes('reduce')) {
    const totalFuel = fuel.reduce((s, f) => s + Number(f.cost), 0);
    const totalMaint = maintenance.reduce((s, m) => s + Number(m.cost), 0);
    return `Total fuel cost: $${totalFuel.toFixed(2)}, Total maintenance cost: $${totalMaint.toFixed(2)}. Consider preventive maintenance scheduling to reduce breakdown costs.`;
  }

  return 'I can help with maintenance schedules, fuel consumption analysis, cost reduction, and driver safety. Please ask a specific question about your fleet.';
}

module.exports = { chat };
