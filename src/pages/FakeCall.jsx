// src/pages/FakeCall.jsx
// Fake call page - powered by ElevenLabs

import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { generateFakeCallScript } from '../services/gemini';
import { generateSpeech, playAudio, isElevenLabsConfigured } from '../services/elevenlabs';
import { Phone, PhoneOff, User } from 'lucide-react';

function FakeCall() {
  const navigate = useNavigate();
  const location = useLocation();
  const dateInfo = location.state?.dateInfo;

  const [stage, setStage] = useState('setup'); // setup, ringing, connected, ended
  const [callerName, setCallerName] = useState('Mom');
  const [excuseType, setExcuseType] = useState('family');
  const [loading, setLoading] = useState(false);
  const [audioElement, setAudioElement] = useState(null);
  const [error, setError] = useState('');

  // Caller presets
  const callerPresets = [
    { name: 'Mom', type: 'family', voice: 'female' },
    { name: 'Dad', type: 'family', voice: 'male' },
    { name: 'Sister', type: 'family', voice: 'female' },
    { name: 'Best Friend', type: 'friend', voice: 'female' },
    { name: 'Roommate', type: 'friend', voice: 'female' },
    { name: 'Work', type: 'work', voice: 'female' },
  ];

  // Start the fake call
  const startCall = async () => {
    setLoading(true);
    setError('');

    try {
      // Generate script with Gemini
      const script = await generateFakeCallScript(excuseType, callerName);
      console.log('Generated script:', script);

      // Generate audio with ElevenLabs (if configured)
      let audio = null;
      if (isElevenLabsConfigured()) {
        try {
          const selectedPreset = callerPresets.find(p => p.name === callerName);
          const voiceType = selectedPreset?.voice || 'female';
          const audioBlob = await generateSpeech(script, voiceType);
          const audioUrl = URL.createObjectURL(audioBlob);
          audio = new Audio(audioUrl);
        } catch (elevenLabsError) {
          console.warn('ElevenLabs error, using fallback:', elevenLabsError);
        }
      }

      // Show ringing screen
      setStage('ringing');

      // After 3 seconds of "ringing", auto-answer
      setTimeout(() => {
        setStage('connected');
        if (audio) {
          audio.play();
          setAudioElement(audio);
          
          // When audio ends, show option to end call
          audio.onended = () => {
            // Keep connected, user ends manually
          };
        }
      }, 3000);

    } catch (err) {
      console.error('Fake call error:', err);
      setError('Failed to set up call. Starting anyway...');
      // Still show the call even if AI fails
      setStage('ringing');
      setTimeout(() => setStage('connected'), 3000);
    } finally {
      setLoading(false);
    }
  };

  // End the call
  const endCall = () => {
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
    }
    setStage('ended');
    setTimeout(() => {
      navigate(-1); // Go back to active date
    }, 1000);
  };

  // Decline the call
  const declineCall = () => {
    setStage('ended');
    setTimeout(() => {
      navigate(-1);
    }, 1000);
  };

  // Answer the call
  const answerCall = () => {
    setStage('connected');
    if (audioElement) {
      audioElement.play();
    }
  };

  // Setup screen
  if (stage === 'setup') {
    return (
      <div className="container">
        <div className="page-header" style={{ marginTop: '40px' }}>
          <div className="logo">📞</div>
          <h1>Fake Call</h1>
          <p>Set up your escape call</p>
        </div>

        {/* Caller Selection */}
        <div className="card" style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '12px', 
            fontWeight: '600' 
          }}>
            Who should "call" you?
          </label>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr 1fr', 
            gap: '8px' 
          }}>
            {callerPresets.map(preset => (
              <button
                key={preset.name}
                onClick={() => {
                  setCallerName(preset.name);
                  setExcuseType(preset.type);
                }}
                style={{
                  padding: '12px 8px',
                  borderRadius: '10px',
                  border: callerName === preset.name ? '2px solid var(--primary)' : '1px solid var(--border)',
                  background: callerName === preset.name ? 'rgba(139, 92, 246, 0.1)' : 'var(--bg-input)',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  fontSize: '0.85rem'
                }}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Excuse Type */}
        <div className="card" style={{ marginBottom: '24px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '12px', 
            fontWeight: '600' 
          }}>
            Type of emergency
          </label>
          <select
            className="input-field"
            value={excuseType}
            onChange={(e) => setExcuseType(e.target.value)}
          >
            <option value="family">Family emergency</option>
            <option value="work">Work emergency</option>
            <option value="friend">Friend needs help</option>
            <option value="pet">Pet emergency</option>
          </select>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid var(--warning)',
            color: 'var(--warning)',
            padding: '12px',
            borderRadius: '12px',
            marginBottom: '16px',
            fontSize: '0.9rem'
          }}>
            {error}
          </div>
        )}

        {/* Info */}
        <div style={{ 
          background: 'rgba(139, 92, 246, 0.1)',
          padding: '16px',
          borderRadius: '12px',
          marginBottom: '24px'
        }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            🤖 Dara will generate a realistic script and voice for your call using AI.
          </p>
        </div>

        {/* Start Call Button */}
        <button
          onClick={startCall}
          disabled={loading}
          className="btn btn-primary"
        >
          {loading ? (
            <>
              <div className="spinner"></div>
              Preparing call...
            </>
          ) : (
            <>
              <Phone size={20} />
              Start Fake Call
            </>
          )}
        </button>

        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            width: '100%',
            marginTop: '16px'
          }}
        >
          Cancel
        </button>
      </div>
    );
  }

  // Ringing screen
  if (stage === 'ringing') {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        {/* Caller avatar */}
        <div style={{
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '24px',
          fontSize: '3rem'
        }}>
          {callerName[0]}
        </div>

        <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>{callerName}</h1>
        <p style={{ color: 'var(--success)', fontSize: '1.1rem' }}>calling...</p>

        {/* Call buttons */}
        <div style={{
          position: 'absolute',
          bottom: '80px',
          display: 'flex',
          gap: '60px'
        }}>
          <button
            onClick={declineCall}
            style={{
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              background: 'var(--danger)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <PhoneOff size={28} color="white" />
          </button>
          <button
            onClick={answerCall}
            style={{
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              background: 'var(--success)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Phone size={28} color="white" />
          </button>
        </div>

        <p style={{ 
          position: 'absolute', 
          bottom: '30px',
          color: 'var(--text-muted)',
          fontSize: '0.8rem'
        }}>
          Decline &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Accept
        </p>
      </div>
    );
  }

  // Connected screen
  if (stage === 'connected') {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        {/* Caller avatar */}
        <div style={{
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '24px',
          fontSize: '3rem'
        }}>
          {callerName[0]}
        </div>

        <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>{callerName}</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
          Connected
        </p>

        {/* Audio indicator */}
        <div style={{
          display: 'flex',
          gap: '4px',
          margin: '30px 0'
        }}>
          {[1,2,3,4,5].map(i => (
            <div 
              key={i}
              style={{
                width: '4px',
                height: '20px',
                background: 'var(--success)',
                borderRadius: '2px',
                animation: `soundwave ${0.5 + i * 0.1}s ease-in-out infinite alternate`
              }}
            />
          ))}
        </div>

        <style>
          {`
            @keyframes soundwave {
              from { transform: scaleY(0.3); }
              to { transform: scaleY(1); }
            }
          `}
        </style>

        {/* End call button */}
        <button
          onClick={endCall}
          style={{
            position: 'absolute',
            bottom: '80px',
            width: '70px',
            height: '70px',
            borderRadius: '50%',
            background: 'var(--danger)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <PhoneOff size={28} color="white" />
        </button>

        <p style={{ 
          position: 'absolute', 
          bottom: '30px',
          color: 'var(--text-muted)',
          fontSize: '0.8rem'
        }}>
          End Call
        </p>
      </div>
    );
  }

  // Ended screen
  return (
    <div style={{
      minHeight: '100vh',
      background: '#000',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Call Ended</h1>
      <p style={{ color: 'var(--text-secondary)' }}>Returning to date...</p>
    </div>
  );
}

export default FakeCall;