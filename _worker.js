export default {
  async fetch(request, env) {
    try {
      const body = await request.json();

      // فقط پیام‌های جدید
      if (body.message) {
        const text = body.message.text || "";
        const chatId = env.CHANNEL_ID; // از wrangler.toml
        const token = env.TOKEN;

        // فوروارد پیام به کانال
        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: chatId, text: text })
        });
      }

      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    } catch (err) {
      return new Response(JSON.stringify({ ok: false, error: err.message }), { status: 500 });
    }
  }
};
