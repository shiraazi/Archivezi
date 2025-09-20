// bot.js
export async function handleRequest(update, env) {
  const TELEGRAM_TOKEN = env.TELEGRAM_BOT_TOKEN;
  const ARCHIVE_CHANNEL_ID = env.ARCHIVE_CHANNEL_ID;
  const API_URL = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;

  const msg = update.message;
  if (!msg) return { ok: true };

  // ساخت لیبل‌ها
  let labels = `👤 فرستنده: ${msg.from?.first_name || ""} ${msg.from?.last_name || ""}\n`;
  labels += `🆔 ID: ${msg.from?.id}\n`;
  labels += `⏰ تاریخ: ${new Date(msg.date * 1000).toLocaleString("fa-IR")}\n`;

  // اگر پیام فوروارد شده است
  if (msg.forward_from_chat) {
    await fetch(`${API_URL}/forwardMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: ARCHIVE_CHANNEL_ID,
        from_chat_id: msg.forward_from_chat.id,
        message_id: msg.message_id
      })
    });

    // ارسال لیبل‌ها بعد از فوروارد
    await fetch(`${API_URL}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: ARCHIVE_CHANNEL_ID,
        text: labels
      })
    });

    return { ok: true };
  }

  // ارسال متن
  if (msg.text) {
    await fetch(`${API_URL}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: ARCHIVE_CHANNEL_ID,
        text: `${msg.text}\n\n${labels}`
      })
    });
  }

  // ارسال عکس
  if (msg.photo) {
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

  // ارسال ویدیو
  if (msg.video) {
    await fetch(`${API_URL}/sendVideo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: ARCHIVE_CHANNEL_ID,
        video: msg.video.file_id,
        caption: labels
      })
    });
  }

  // ارسال فایل
  if (msg.document) {
    await fetch(`${API_URL}/sendDocument`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: ARCHIVE_CHANNEL_ID,
        document: msg.document.file_id,
        caption: labels
      })
    });
  }

  // ارسال استیکر
  if (msg.sticker) {
    await fetch(`${API_URL}/sendSticker`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: ARCHIVE_CHANNEL_ID,
        sticker: msg.sticker.file_id
      })
    });
  }

  return { ok: true };
}
