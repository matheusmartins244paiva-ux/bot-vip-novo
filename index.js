import TelegramBot from 'node-telegram-bot-api';
import mercadopago from 'mercadopago';

// Configuração para a versão 1.5.17 (conforme seu package.json)
const bot = new TelegramBot(process.env.BOT_TOKEN, {polling: true});
mercadopago.configurations.setAccessToken(process.env.MP_ACCESS_TOKEN);

const textoCatalogo = `⭐ *SEJA BEM-VINDO!* ⭐\n\n` +
                      `👇 *ESCOLHA SEU PLANO ABAIXO PARA ACESSAR:*`;

const teclado = {
  reply_markup: {
    inline_keyboard: [
      [{ text: "✅ PROMOÇÃO - R$ 7,99", callback_data: "7.99" }],
      [{ text: "📅 30 DIAS - R$ 16,99", callback_data: "16.99" }],
      [{ text: "💎 VITALÍCIO - R$ 39,99", callback_data: "39.99" }]
    ]
  }
};

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, textoCatalogo, { parse_mode: "Markdown", ...teclado });
});

bot.on('callback_query', (query) => {
  const chatId = query.message.chat.id;
  
  let preference = {
    items: [{
      title: `Plano VIP - R$ ${query.data}`,
      unit_price: Number(query.data),
      quantity: 1,
    }]
  };

  mercadopago.preferences.create(preference)
    .then((response) => {
      bot.sendMessage(chatId, `✅ *PAGAMENTO GERADO!*\n\n🔗 ${response.body.init_point}`, { parse_mode: "Markdown" });
    })
    .catch(() => {
      bot.sendMessage(chatId, "❌ Erro nas credenciais do Mercado Pago.");
    });
});
