export default {
  async fetch(request, env) {
    try {
      const url = new URL(request.url);

      if (url.pathname === '/webhook' && request.method === 'POST') {
        const update = await request.json();

        if (update.message) {
          const chatId = env.CHANNEL_ID;
          const text = update.message.text || "پیام بدون متن";

          // ارسال پیام جدید به کانال
          await fetch(`https://api.telegram.org/bot${env.TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: chatId,
              text: `Forwarded:\n${text}`
            })
          });
        }

        return new Response('OK', { status: 200 });
      }

      return new Response('Not Found', { status: 404 });
    } catch (err) {
      return new Response('Error: ' + err.message, { status: 500 });
    }
  }
};
