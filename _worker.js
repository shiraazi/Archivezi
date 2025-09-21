// _worker.js
export default {
  async fetch(request, env) {
    try {
      const url = new URL(request.url);

      // فقط مسیر /webhook قبول شود
      if (url.pathname !== "/webhook" || request.method !== "POST") {
        return new Response("Not Found", { status: 404 });
      }

      const update = await request.json();

      // فقط پیام‌ها
      if (!update.message) return new Response("No message", { status: 200 });

      const chatId = update.message.chat.id;
      const messageId = update.message.message_id;

      // اطلاعات لیبل‌ها
      const fromUser = update.message.from ? update.message.from.username || update.message.from.first_name : "Unknown";
      const forwardDate = new Date(update.message.date * 1000).toLocaleString();
      const originalChat = update.message.chat.title || update.message.chat.username || chatId;

      // متن لیبل‌ها
      const labels = `---\n📝 From: ${fromUser}\n📅 Date: ${forwardDate}\n💬 From Chat: ${originalChat}\n🔗 Msg ID: ${messageId}`;

      // 1️⃣ ریپست پیام اصلی به کانال
      await fetch(`https://api.telegram.org/bot${env.TOKEN}/forwardMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: env.CHANNEL_ID, // جایگزین با آیدی کانال numeric یا @username
          from_chat_id: chatId,
          message_id: messageId
        })
      });

      // 2️⃣ ارسال لیبل‌ها زیر پیام به صورت متن جدا
      await fetch(`https://api.telegram.org/bot${env.TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: env.CHANNEL_ID,
          text: labels,
          parse_mode: "Markdown"
        })
      });

      return new Response("OK", { status: 200 });
    } catch (err) {
      return new Response("Error: " + err.message, { status: 500 });
    }
  }
};
