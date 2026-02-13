import TelegramBot from 'node-telegram-bot-api';
import mercadopago from 'mercadopago';

// Configuração dos tokens (serão puxados da Railway automaticamente)
const bot = new TelegramBot(process.env.BOT_TOKEN, {polling: true});
mercadopago.configurations.setAccessToken(process.env.MP_ACCESS_TOKEN);

// --- COMANDO /START: VÍDEO + TEXTO + BOTÕES ---
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  
  // O LINK DO SEU VÍDEO JÁ ESTÁ AQUI:
  const urlVideo = "https://i.imgur.com/yYJiJNM.mp4"; 

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

  // Envia o vídeo com a sua legenda e os botões clicáveis
  bot.sendVideo(chatId, urlVideo, { 
    caption: textoCatalogo, 
    parse_mode: "Markdown", 
    ...teclado 
  });
});

// --- FUNÇÃO QUE GERA O PAGAMENTO AO CLICAR NO BOTÃO ---
bot.on('callback_query', (query) => {
  const chatId = query.message.chat.id;
  const valorPlano = parseFloat(query.data);

  let preference = {
    items: [{
      title: `Plano VIP - R$ ${query.data}`,
      unit_price: valorPlano,
      quantity: 1,
    }]
  };

  mercadopago.preferences.create(preference).then((response) => {
    bot.sendMessage(chatId, `✅ *PAGAMENTO GERADO!*\n\nClique no link abaixo para pagar via Pix e liberar seu acesso:\n${response.body.init_point}`, { parse_mode: "Markdown" });
  });
});
                    
