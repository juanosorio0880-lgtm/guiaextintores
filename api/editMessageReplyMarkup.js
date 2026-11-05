export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
  
  const token = process.env.TELEGRAM_TOKEN;
  const chat_id = process.env.TELEGRAM_CHAT_ID;
  
  const body = { ...req.body, chat_id };
  
  try {
    const r = await fetch(`https://api.telegram.org/bot${token}/editMessageReplyMarkup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    
    const data = await r.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
}
