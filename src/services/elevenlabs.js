// src/services/elevenlabs.js
// ElevenLabs integration for Dara's fake call feature

const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;

console.log('ElevenLabs Key length:', ELEVENLABS_API_KEY?.length, 'First 5 chars:', ELEVENLABS_API_KEY?.substring(0, 5));

// Voice IDs from ElevenLabs (free tier voices)
const VOICES = {
  rachel: '21m00Tcm4TlvDq8ikWAM',  // Warm female voice - great for "Mom" or "Sister"
  drew: '29vD33N1CtxCmqQRPOHJ',    // Male voice - good for "Dad" or "Brother"
  sarah: 'EXAVITQu4vr4xnSDxMaL',   // Another female option
};

/**
 * Generate speech from text using ElevenLabs
 * @param {string} text - The text to convert to speech
 * @param {string} voiceType - 'female' or 'male'
 * @returns {Blob} - Audio blob that can be played
 */
export async function generateSpeech(text, voiceType = 'female') {
  const voiceId = voiceType === 'male' ? VOICES.drew : VOICES.rachel;
  
  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,          // More natural variation
            similarity_boost: 0.75,  // Sound consistent
          }
        })
      }
    );

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    // Return audio blob
    const audioBlob = await response.blob();
    return audioBlob;
  } catch (error) {
    console.error('ElevenLabs error:', error);
    throw error;
  }
}

/**
 * Play audio blob through speakers
 * @param {Blob} audioBlob - The audio to play
 * @returns {HTMLAudioElement} - The audio element (for stopping later)
 */
export function playAudio(audioBlob) {
  const audioUrl = URL.createObjectURL(audioBlob);
  const audio = new Audio(audioUrl);
  audio.play();
  return audio;
}

/**
 * Generate and play a fake call
 * @param {string} script - What the "caller" should say
 * @param {string} voiceType - 'female' or 'male'
 * @returns {HTMLAudioElement} - The audio element
 */
export async function generateAndPlayFakeCall(script, voiceType = 'female') {
  const audioBlob = await generateSpeech(script, voiceType);
  return playAudio(audioBlob);
}

/**
 * Pre-generate fake call audio for faster playback
 * Returns a function that plays the audio when called
 */
export async function preloadFakeCall(script, voiceType = 'female') {
  try {
    const audioBlob = await generateSpeech(script, voiceType);
    const audioUrl = URL.createObjectURL(audioBlob);
    
    return () => {
      const audio = new Audio(audioUrl);
      audio.play();
      return audio;
    };
  } catch (error) {
    console.error('Preload error:', error);
    return null;
  }
}

/**
 * Check if ElevenLabs API is configured
 */
export function isElevenLabsConfigured() {
  return !!ELEVENLABS_API_KEY;
}