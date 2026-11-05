export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
  
  const token = process.env.TELEGRAM_TOKEN;
  const chat_id = process.env.TELEGRAM_CHAT_ID;
  
  const { photo, caption, parse_mode, reply_markup } = req.body;
  
  try {
    const bin = Buffer.from(photo.split(',')[1], 'base64');
    const blob = new Blob([bin], { type: 'image/jpeg' });
    
    const fd = new FormData();
    fd.append('chat_id', chat_id);
    fd.append('photo', blob, 'foto.jpg');
    if (caption) fd.append('caption', caption);
    if (parse_mode) fd.append('parse_mode', parse_mode);
    if (reply_markup) fd.append('reply_markup', JSON.stringify(reply_markup));
    
    const r = await fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
      method: 'POST',
      body: fd
    });
    
    const data = await r.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
}
