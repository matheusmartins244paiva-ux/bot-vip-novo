import TelegramBot from 'node-telegram-bot-api';
import mercadopago from 'mercadopago';

// Configuração dos tokens (puxados automaticamente da Railway)
const bot = new TelegramBot(process.env.BOT_TOKEN, {polling: true});
mercadopago.configurations.setAccessToken(process.env.MP_ACCESS_TOKEN);

// --- COMANDO /START: APENAS TEXTO + BOTÕES ---
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  
  const textoCatalogo = `⭐ *SEJA BEM-VINDO!* ⭐\n\n` +
                        `NOSSO VIP TEM PLANOS PARA TODOS OS GOSTOS E BOLSOS! CONFIRA NOSSO CATÁLOGO 👇🏻\n\n` +
                        `↪️ 0nlyf4ns\n↪️ Pr1v4cy\n↪️ Tiktoks +18\n↪️ Vzds de famosos\n` +
                        `↪️ Amadores\n↪️ Xv1de0s red\n↪️ P0rnhub premium\n` +
                        `↪️ N0vinh4s\n↪️ F4milia Sacana/Tufos\n↪️ Lives\n\n` +
                        `✅ *Atualizações diárias*\n\n` +
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

  // Envia apenas a mensagem de texto com os botões
  bot.sendMessage(chatId, textoCatalogo, { 
    parse_mode: "Markdown", 
    ...teclado 
  });
});

// --- FUNÇÃO CORRIGIDA PARA GERAR O LINK DE PAGAMENTO ---
bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const valorPlano = parseFloat(query.data);
  
  const preference = {
    items: [{
      title: `Plano VIP - R$ ${query.data}`,
      unit_price: valorPlano,
      quantity: 1,
      currency_id: 'BRL'
    }],
    payment_methods: {
      excluded_payment_types: [{ id: "ticket" }], // Remove boleto para focar no Pix
      installments: 1
    }
  };

  try {
    const response = await mercadopago.preferences.create(preference);
    // Envia o link de pagamento real (init_point) gerado pelo Mercado Pago
    bot.sendMessage(chatId, `✅ *PAGAMENTO GERADO!*\n\nClique no link abaixo para pagar via Pix e liberar seu acesso:\n\n🔗 ${response.body.init_point}`, { parse_mode: "Markdown" });
  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, "❌ Erro ao gerar link de pagamento. Verifique se o seu Token do Mercado Pago está correto.");
  }
});
