const functions = require('firebase-functions');
const twilio = require('twilio');
require('dotenv').config();

// Twilio credentials from .env
const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE;

const client = twilio(accountSid, authToken);

// Send SOS alert
exports.sendSOS = functions.https.onCall(async (data, context) => {
  const { contactPhone, contactName, userName, location } = data;
  
  try {
    const message = await client.messages.create({
      body: `🚨 EMERGENCY ALERT from Dara:\n\n${userName} pressed the SOS button and may need help.\n\nLast known location: ${location}\n\nPlease try to reach them immediately.`,
      from: twilioPhone,
      to: contactPhone
    });
    
    console.log('SOS sent:', message.sid);
    return { success: true, messageId: message.sid };
  } catch (error) {
    console.error('SMS error:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

// Send date notification
exports.sendDateNotification = functions.https.onCall(async (data, context) => {
  const { contactPhone, contactName, userName, partnerName, location, dateTime } = data;
  
  try {
    const message = await client.messages.create({
      body: `Hey ${contactName}! 💜\n\n${userName} is going on a date with ${partnerName}.\n\n📍 Location: ${location}\n🕐 Time: ${dateTime}\n\nJust keeping you in the loop!\n\n- Dara`,
      from: twilioPhone,
      to: contactPhone
    });
    
    console.log('Notification sent:', message.sid);
    return { success: true, messageId: message.sid };
  } catch (error) {
    console.error('SMS error:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});