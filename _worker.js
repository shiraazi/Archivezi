function escapeMarkdownV2(text) {
  if (!text) return '';
  return text.replace(/([_*\[\]()~`>#+-=|{}.!])/g, '\\$1');
}

export default {
  async fetch(request, env) {
    if (request.method !== "POST") return new Response("Bot running", { status: 200 });

    try {
      const update = await request.json();
      const msg = update.message;
      if (!msg) return new Response("No message", { status: 200 });

      const chatId = "@archivzi"; // کانال مقصد

      // ساخت لیبل‌ها
      let labels = `📌 *Info:*\n`;
      labels += `• From: ${escapeMarkdownV2(msg.from?.username || msg.from?.first_name || 'Unknown')}\n`;
      labels += `• Chat ID: ${msg.chat.id}\n`;
      labels += `• Message ID: ${msg.message_id}\n`;
      labels += `• Date: ${new Date(msg.date * 1000).toLocaleString()}\n`;
      if (msg.forward_from) {
        labels += `• Forwarded from: ${escapeMarkdownV2(msg.forward_from.username || msg.forward_from.first_name || 'Unknown')}\n`;
      }
      if (msg.caption) {
        labels += `• Caption: ${escapeMarkdownV2(msg.caption)}\n`;
      }

      // متن
      if (msg.text) {
        await fetch(`https://api.telegram.org/bot${env.TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: `${escapeMarkdownV2(msg.text)}\n\n${labels}`,
            parse_mode: "MarkdownV2"
          }),
        });
      }
      // عکس
      else if (msg.photo) {
        const fileId = msg.photo[msg.photo.length - 1].file_id;
        await fetch(`https://api.telegram.org/bot${env.TOKEN}/sendPhoto`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            photo: fileId,
            caption: `${escapeMarkdownV2(msg.caption || '')}\n\n${labels}`,
            parse_mode: "MarkdownV2"
          }),
        });
      }
      // ویدیو
      else if (msg.video) {
        await fetch(`https://api.telegram.org/bot${env.TOKEN}/sendVideo`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            video: msg.video.file_id,
            caption: `${escapeMarkdownV2(msg.caption || '')}\n\n${labels}`,
            parse_mode: "MarkdownV2"
          }),
        });
      }
      // فایل
      else if (msg.document) {
        await fetch(`https://api.telegram.org/bot${env.TOKEN}/sendDocument`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            document: msg.document.file_id,
            caption: `${escapeMarkdownV2(msg.caption || '')}\n\n${labels}`,
            parse_mode: "MarkdownV2"
          }),
        });
      }

      return new Response("OK");
    } catch (err) {
      return new Response("Error: " + err.message, { status: 500 });
    }
  }
};
