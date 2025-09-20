// bot.js
export async function handleRequest(update, env) {
  const TELEGRAM_TOKEN = env.TELEGRAM_BOT_TOKEN;
  const ARCHIVE_CHANNEL_ID = env.ARCHIVE_CHANNEL_ID;
  const API_URL = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;

  const msg = update.message;
  if (!msg) return { ok: true };

  // ساخت لیبل ساده
  let labels = `فرستنده: ${msg.from?.first_name || ""}\n`;
  labels += `ID: ${msg.from?.id}\n`;
  labels += `زمان: ${new Date(msg.date * 1000).toLocaleString()}\n`;

  // ارسال پیام به کانال
  if (msg.text) {
    await fetch(`${API_URL}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: ARCHIVE_CHANNEL_ID,
        text: `${msg.text}\n\n${labels}`
      })
    });
  } else if (msg.photo) {
    const photo = msg.photo[msg.photo.length - 1];
    await fetch(`${API_URL}/sendPhoto`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: ARCHIVE_CHANNEL_ID,
        photo: photo.file_id,
        caption: labels
      })
    });
  }

  return { ok: true };
}
