import { handleRequest } from './bot.js';

export default {
  async fetch(request, env) {
    if (request.method !== 'POST') {
      return new Response('Telegram Archive Bot Worker Running!');
    }

    const update = await request.json();
    const result = await handleRequest(update, env);

    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
