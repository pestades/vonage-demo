require('dotenv').config({ path: __dirname + '/../../.env' });

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Auth } = require('@vonage/auth');
const { Vonage } = require('@vonage/server-sdk');


/**
 * Service to managing messages using Vonage API.
 */

const app = express();
app.use(express.json());

const corsOptions = {
  origin: 'http://localhost:3000',  // Frontend's URL
};
app.use(cors(corsOptions));


// Alternative
/*
const credentials = new Auth({
  apiKey: process.env.API_KEY,
  apiSecret: process.env.API_SECRET_KEY
});
const options = {};
const vonage = new Vonage(credentials, options)
*/

const vonage = new Vonage({
  apiKey: process.env.API_KEY,
  apiSecret: process.env.API_SECRET_KEY,
}, { debug: true });

/**
 * Creates/sends a message.
 *
 * @param {string} environment - Production or Sandbox.
 * @param {string} channel - Supperted Vonage channels.
 * @param {message} environment - Only text messages by now.
 */
app.post('/message', async (req, res) => {

  const environment = req.body.environment;
  var channel = req.body.channel;
  const message = req.body.message;

  var fromNumber, toNumber;

  switch (channel) {
    case 'whatsapp':
      fromNumber = process.env.FROM_NUMBER;
      toNumber = process.env.TO_NUMBER;
      break;
    case 'facebook':
      fromNumber = process.env.FB_ID_FROM;
      toNumber = process.env.FB_ID_TO;
      channel = 'messenger';                // rename channel as per vonage naming conventions
      break;
    case 'instagram':
      fromNumber = process.env.IG_ID_FROM;
      toNumber = process.env.IG_ID_TO;
      break;
    default: // sms
      fromNumber = 'Vonage';
      toNumber = process.env.TO_NUMBER;
  }

  const balance = await vonage.accounts.getBalance();
  console.log(`New Message! Account balance is ${balance.value.toFixed(2)}€, environment: ${environment}, channel: ${channel}, from: ${fromNumber}, to: ${toNumber}, message: ${message}`);
  try {
    if (environment == 'production') {
      // sendMessageProduction(channel, fromNumber, toNumber, message);
      await vonage.sms.send({ toNumber, fromNumber, message, type: 'unicode' })
        .then(resp => { console.log('Message sent successfully'); console.log(resp); res.status(200).json({ status: success, message: 'Message sent successfully!' }); })
        .catch(err => { console.log('There was an error sending the messages.'); console.error(err); res.status(500).json({ status: error, message: 'Failed to send message' }); });
    } else {
      sendMessageSandbox(channel, fromNumber, toNumber, message);
    }
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ success: false, message: 'Failed to send message' });
  }
});


async function sendMessageProduction(channel, fromNumber, toNumber, message) {
  // TODO: refactor
}

async function sendMessageSandbox(channel, fromNumber, toNumber, message) {
  console.log('Not yet supperted, please use/see Python implementatioin');
}

const PORT = process.env.NODE_SERVICE_PORT || 5001;
app.listen(PORT, () => {
  console.log('Messaging Service running on port ', PORT);
});