export default {
  async fetch(request, env) {
    if (request.method === "POST") {
      try {
        const update = await request.json();
        // اینجا می‌تونی bot.js رو صدا بزنی و پیام رو به کانال بفرستی
        return new Response("OK", { status: 200 });
      } catch (err) {
        return new Response("Error: " + err.message, { status: 500 });
      }
    }

    // برای تست در مرورگر
    return new Response("Telegram Archive Bot Worker Running!", { status: 200 });
  }
};
