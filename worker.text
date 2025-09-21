export default {
  async fetch(request, env) {
    if (request.method === "POST") {
      try {
        const update = await request.json();

        // بررسی اینکه پیام وجود دارد
        if (update.message) {
          const chatId = update.message.chat.id;
          const messageId = update.message.message_id;

          // فوروارد پیام به کانال @archivzi
          await fetch(`https://api.telegram.org/bot${env.TOKEN}/forwardMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: "@archivzi",
              from_chat_id: chatId,
              message_id: messageId
            }),
          });
        }

        return new Response("OK", { status: 200 });
      } catch (err) {
        return new Response("Error: " + err.message, { status: 500 });
      }
    }

    return new Response("Bot is running!", { status: 200 });
  }
};
