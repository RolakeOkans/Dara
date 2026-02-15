// src/services/gemini.js
// Gemini AI integration for Dara

import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
/**
 * Analyze date safety using Gemini
 * @param {Object} dateInfo - The date details
 * @returns {Object} - Safety analysis with score, tips, and concerns
 */

console.log('Gemini API Key:', import.meta.env.VITE_GEMINI_API_KEY ? 'Found' : 'MISSING');

export async function analyzeDateSafety(dateInfo) {
  const { partnerName, location, dateTime, duration } = dateInfo;
  
  const prompt = `You are Dara, a caring dating safety advisor. Analyze this date plan and provide safety insights.

Date Details:
- Meeting: ${partnerName}
- Location: ${location}
- Time: ${dateTime}
- Expected Duration: ${duration} hours

Provide a JSON response with:
1. "score": A safety score from 1-10 (10 being safest)
2. "tips": An array of 3-4 specific safety tips (short, actionable)
3. "concerns": An array of any concerns (can be empty if none)
4. "positives": An array of positive aspects about this date plan
5. "summary": A one-sentence overall assessment

Consider factors like:
- Is it a public place?
- Time of day
- First date vs established relationship
- General location safety

Respond ONLY with valid JSON, no markdown or other text.`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    // Clean the response (remove markdown code blocks if present)
    const cleanJson = response.replace(/```json\n?|\n?```/g, '').trim();
    
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error('Gemini analysis error:', error);
    // Return a default response if AI fails
    return {
      score: 7,
      tips: [
        "Share your location with a trusted friend",
        "Meet in a public place",
        "Have your own transportation",
        "Trust your instincts"
      ],
      concerns: [],
      positives: ["You're being proactive about safety!"],
      summary: "Remember to stay aware and trust your instincts."
    };
  }
}

/**
 * Chat with Dara (safety companion)
 * @param {string} message - User's message
 * @param {Array} history - Previous messages in conversation
 * @param {Object} dateContext - Current date information
 * @returns {string} - Dara's response
 */
export async function chatWithDara(message, history = [], dateContext = null) {
  const systemContext = `You are Dara, a supportive and caring dating safety companion. You're like a best friend who's watching out for someone on a date.

Your personality:
- Warm, supportive, and non-judgmental
- Validating of feelings and instincts
- Practical and action-oriented
- Brief and clear (keep responses to 2-3 sentences max)
- Use occasional emojis but don't overdo it 💜

Your capabilities:
- Give advice on uncomfortable situations
- Help them trust their instincts
- Suggest ways to exit gracefully
- Offer to trigger a fake call if needed
- Provide emotional support

${dateContext ? `Current date context:
- With: ${dateContext.partnerName}
- Location: ${dateContext.location}
- Started: ${dateContext.startTime}` : ''}

Remember: Be concise. Be supportive. Help them stay safe.`;

  // Build conversation history for context
  const conversationHistory = history.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }]
  }));

  try {
    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: systemContext }] },
        { role: 'model', parts: [{ text: "I understand. I'm Dara, ready to support and keep them safe. 💜" }] },
        ...conversationHistory
      ]
    });

    const result = await chat.sendMessage(message);
    return result.response.text();
  } catch (error) {
    console.error('Gemini chat error:', error);
    return "I'm here for you. Trust your instincts - if something feels off, it probably is. Would you like me to help you leave? 💜";
  }
}

/**
 * Generate a fake call script
 * @param {string} excuseType - Type of excuse (family, work, friend, pet)
 * @param {string} callerName - Name of the "caller"
 * @returns {string} - Script for the fake call
 */
export async function generateFakeCallScript(excuseType = 'family', callerName = 'Mom') {
  const prompt = `Generate a realistic, urgent phone call script for someone who needs to leave a date immediately.

Caller: ${callerName}
Excuse type: ${excuseType}

Requirements:
- Sound natural and believable
- Create urgency without being over-dramatic
- About 3-4 sentences
- Something that requires immediate attention
- Spoken directly as if the caller is talking

Examples of good excuses:
- Family: Something happened at home, need to come back
- Work: Emergency at work, server down, need you now
- Friend: Friend is stranded/upset, needs pickup
- Pet: Pet got out, neighbor found them hurt

Return ONLY the spoken script, nothing else. No quotes, no "say this", just the actual words to speak.`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error('Script generation error:', error);
    // Fallback scripts
    const fallbacks = {
      family: "Hey, I'm so sorry to bother you but I really need you to come home right now. Dad's okay but something happened and I need your help. Can you leave now? I'll explain when you get here.",
      work: "Hey, we have a major issue at work. The system is down and we need all hands on deck right now. Can you come in? I know it's bad timing but this is urgent.",
      friend: "Hey, I'm really sorry but I need your help. My car broke down and I'm stuck. Can you come get me? I'm kind of freaking out here.",
      pet: "Hey, your neighbor just called me. Apparently your dog got out and they found her but she seems hurt. You should probably get home right away."
    };
    return fallbacks[excuseType] || fallbacks.family;
  }
}

/**
 * Smart check-in message
 * @param {number} elapsedMinutes - How long the date has been going
 * @returns {string} - A natural check-in message
 */
export async function generateCheckInMessage(elapsedMinutes) {
  const hours = Math.floor(elapsedMinutes / 60);
  const mins = elapsedMinutes % 60;
  const timeString = hours > 0 ? `${hours} hour${hours > 1 ? 's' : ''}` : `${mins} minutes`;

  const prompt = `You're Dara, checking in on someone who's been on a date for ${timeString}. 

Write a brief, friendly check-in message (1-2 sentences). Be warm but not intrusive. Ask how things are going.

Examples of good check-ins:
- "Hey! Just checking in 💜 How's it going?"
- "Hope you're having fun! Everything okay?"
- "Checking in on you! All good?"

Return ONLY the message, nothing else.`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    return "Hey! Just checking in 💜 How's everything going?";
  }
}