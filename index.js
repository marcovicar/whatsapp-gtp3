const { create, Client } = require('venom-bot');
const { OpenAI } = require('openai');
const dotenv = require('dotenv');

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });

const venomConfig = {
  session: 'whatsapp-gpt-bot',
  browserArgs: ['--no-sandbox'], // Adicione isso se você estiver executando no Linux
  disableWelcome: true,
  headless: true,
  logQR: true,
};

create(venomConfig)
  .then((client) => start(client))
  .catch((erro) => {
    console.error(erro);
  });

const getDavinciResponse = async (clientText) => {
  const options = {
    model: "text-davinci-003",
    prompt: clientText,
    temperature: 0.7,
    max_tokens: 3000,
  };

  try {
    const response = await openai.completions.create(options);
    return response.choices[0].text;
  } catch (e) {
    console.error(`OpenAI Response Error: ${e.message}`);
    return "Erro ao processar a solicitação.";
  }
};

const commands = (client, message) => {
  if (message.body.startsWith("/bot")) {
    const userText = message.body.slice(4).trim();
    getDavinciResponse(userText).then((response) => {
      client.sendText(message.from, response);
    });
  }
};

async function start(client) {
  client.onMessage((message) => {
    commands(client, message);
  });
}

//https://github.com/openai/openai-node/discussions/217

//https://www.tabnews.com.br/victorharry/guia-completo-de-como-integrar-o-chat-gpt-com-whatsapp