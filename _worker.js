export default {
  async fetch(request, env) {
    if (request.method === "POST") {
      const update = await request.json();
      const msg = update.message;
      if (!msg) return new Response("No message", { status: 200 });

      // لیبل‌ها
      let labels = `📌 **Info:**\n`;
      labels += `• From: ${msg.from?.username || 'Unknown'}\n`;
      labels += `• Chat ID: ${msg.chat.id}\n`;
      labels += `• Message ID: ${msg.message_id}\n`;
      labels += `• Date: ${new Date(msg.date * 1000).toLocaleString()}\n`;
      if (msg.forward_from) {
        labels += `• Forwarded from: ${msg.forward_from.username || 'Unknown'}\n`;
      }

      // متن
      if (msg.text) {
        await fetch(`https://api.telegram.org/bot${env.TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: "@archivzi",
            text: `${msg.text}\n\n${labels}`,
            parse_mode: "Markdown"
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
            chat_id: "@archivzi",
            photo: fileId,
            caption: labels,
            parse_mode: "Markdown"
          }),
        });
      }
      // ویدیو
      else if (msg.video) {
        await fetch(`https://api.telegram.org/bot${env.TOKEN}/sendVideo`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: "@archivzi",
            video: msg.video.file_id,
            caption: labels,
            parse_mode: "Markdown"
          }),
        });
      }
      // فایل
      else if (msg.document) {
        await fetch(`https://api.telegram.org/bot${env.TOKEN}/sendDocument`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: "@archivzi",
            document: msg.document.file_id,
            caption: labels,
            parse_mode: "Markdown"
          }),
        });
      }

      return new Response("OK");
    }
    return new Response("Bot is running!", { status: 200 });
  }
};
