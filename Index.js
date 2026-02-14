import TelegramBot from 'node-telegram-bot-api';
import mercadopago from 'mercadopago';

// Configuração para a versão 1.5.17 (exatamente o que está no seu package.json)
const bot = new TelegramBot(process.env.BOT_TOKEN, {polling: true});
mercadopago.configurations.setAccessToken(process.env.MP_ACCESS_TOKEN);

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
