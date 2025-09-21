export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/webhook" && request.method === "POST") {
      try {
        const update = await request.json();

        if (update.message) {
          const chatId = update.message.chat.id;
          const msg = update.message;

          // ساخت متن لیبل‌ها
          let labels = `📌 **Info:**\n`;
          labels += `• From: ${msg.from?.username || 'Unknown'}\n`;
          labels += `• Chat ID: ${chatId}\n`;
          labels += `• Message ID: ${msg.message_id}\n`;
          labels += `• Date: ${new Date(msg.date * 1000).toLocaleString()}\n`;
          if (msg.forward_from) {
            labels += `• Forwarded from: ${msg.forward_from.username || 'Unknown'}\n`;
          }

          // ارسال پست جدید به کانال
          if (msg.text) {
            // متن پیام + لیبل‌ها
            await fetch(`https://api.telegram.org/bot${env.TOKEN}/sendMessage`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                chat_id: "@archivzi",
                text: `${msg.text}\n\n${labels}`,
                parse_mode: "Markdown"
              }),
            });
          } else if (msg.photo) {
            // اگر عکس بود
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
        }

        return new Response("OK");
      } catch (err) {
        return new Response("Error: " + err.message, { status: 500 });
      }
    }

    return new Response("Bot is running!", { status: 200 });
  }
};
