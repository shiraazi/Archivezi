export default {
  async fetch(request, env) {
    try {
      // فقط POST برای webhook تلگرام قبول می‌کنیم
      if (request.method !== "POST") {
        return new Response("Method Not Allowed", { status: 405 });
      }

      const update = await request.json();

      if (!update.message) {
        return new Response("No message found", { status: 200 });
      }

      const chatIdFrom = update.message.chat.id;
      const messageId = update.message.message_id;

      // 1️⃣ فوروارد پیام به کانال
      await fetch(`https://api.telegram.org/bot${env.TOKEN}/forwardMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: env.CHANNEL_ID,    // کانال مقصد
          from_chat_id: chatIdFrom,   // فرستنده اصلی
          message_id: messageId
        })
      });

      // 2️⃣ اضافه کردن پیام تاییدی با المان‌ها زیر پست
      const text = `
📌 پیام فوروارد شد
- فرستنده: ${update.message.from?.username || update.message.from?.first_name || "ناشناخته"}
- زمان: ${new Date(update.message.date * 1000).toLocaleString()}
- متن: ${update.message.text?.slice(0, 200) || "[media/بدون متن]"}
- چت اصلی: ${chatIdFrom}
`;

      await fetch(`https://api.telegram.org/bot${env.TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: env.CHANNEL_ID,
          text: text
        })
      });

      return new Response("OK", { status: 200 });
    } catch (err) {
      console.error(err);
      return new Response("Error: " + err.message, { status: 500 });
    }
  }
};
