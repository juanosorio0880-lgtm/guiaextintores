export default async function handler(req, res) {
  const token = process.env.TELEGRAM_TOKEN;
  const targetMsgId = req.query.msgId ? parseInt(req.query.msgId) : null;
  
  try {
    const r = await fetch(`https://api.telegram.org/bot${token}/getUpdates`);
    const data = await r.json();
    
    if (data.ok && data.result) {
      if (targetMsgId) {
        // Filter only updates relevant to this msgId to avoid leaking data
        const filteredResult = data.result.filter(u => 
          (u.callback_query && u.callback_query.message && u.callback_query.message.message_id === targetMsgId) ||
          (u.message && u.message.reply_to_message && u.message.reply_to_message.message_id === targetMsgId)
        );
        return res.status(200).json({ ok: true, result: filteredResult });
      } else {
        // Return empty array if no msgId provided to prevent data leak
        return res.status(200).json({ ok: true, result: [] });
      }
    }
    
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
}
