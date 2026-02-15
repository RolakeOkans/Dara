// src/pages/Chat.jsx
// Chat with Dara - Gemini-powered safety companion

import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { chatWithDara } from '../services/gemini';
import { ArrowLeft, Send, Phone, Shield } from 'lucide-react';
import BottomNav from '../components/BottomNav';

function Chat() {
  const navigate = useNavigate();
  const location = useLocation();
  const dateInfo = location.state?.dateInfo;

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hey! I'm here for you 💜 How's the date going? Tell me anything — I'm listening."
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();

    if (userMessage.toLowerCase().includes('call me') || userMessage.toLowerCase().includes('call now')) {
      navigate('/fake-call', { state: { dateInfo } });
      return;
    }

    setInput('');
    setLoading(true);

    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      const response = await chatWithDara(
        userMessage,
        messages.map(m => ({ role: m.role, content: m.content })),
        dateInfo
      );

      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm having trouble connecting right now. But trust your instincts — if something feels off, it's okay to leave. 💜"
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickActions = [
    { text: "I need an excuse to leave", emoji: "🚪" },
    { text: "Something feels off", emoji: "😟" },
    { text: "I'm feeling unsafe", emoji: "⚠️" },
    { text: "Call me now", emoji: "📞" },
  ];

  const handleQuickAction = (action) => {
    if (action.text.toLowerCase().includes('call me')) {
      navigate('/fake-call', { state: { dateInfo } });
    } else {
      setInput(action.text);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      maxWidth: '480px',
      margin: '0 auto',
      background: 'var(--bg-dark)'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '16px 20px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg-card)'
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '0',
          }}
        >
          <ArrowLeft size={24} />
        </button>

        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          💜
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: '600' }}>Dara</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--success)' }}>
            ● Always here for you
          </div>
        </div>

        <button
          onClick={() => navigate('/fake-call', { state: { dateInfo } })}
          style={{
            background: 'var(--bg-input)',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            padding: '8px 12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: 'var(--text-primary)',
            fontSize: '0.85rem'
          }}
        >
          <Phone size={16} />
          Call
        </button>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px',
        paddingBottom: '80px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
            }}
          >
            <div style={{
              maxWidth: '80%',
              padding: '12px 16px',
              borderRadius: '18px',
              background: msg.role === 'user'
                ? 'linear-gradient(135deg, var(--primary), var(--primary-dark))'
                : 'var(--bg-card)',
              color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
              border: msg.role === 'user' ? 'none' : '1px solid var(--border)',
              borderBottomRightRadius: msg.role === 'user' ? '4px' : '18px',
              borderBottomLeftRadius: msg.role === 'user' ? '18px' : '4px',
            }}>
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{
              padding: '12px 16px',
              borderRadius: '18px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderBottomLeftRadius: '4px',
            }}>
              <div style={{ display: 'flex', gap: '4px' }}>
                <span className="typing-dot" style={{ animationDelay: '0s' }}>•</span>
                <span className="typing-dot" style={{ animationDelay: '0.2s' }}>•</span>
                <span className="typing-dot" style={{ animationDelay: '0.4s' }}>•</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div style={{
        padding: '8px 20px',
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        borderTop: '1px solid var(--border)',
        background: 'var(--bg-dark)'
      }}>
        {quickActions.map((action, i) => (
          <button
            key={i}
            onClick={() => handleQuickAction(action)}
            style={{
              flexShrink: 0,
              padding: '8px 12px',
              borderRadius: '20px',
              border: '1px solid var(--border)',
              background: 'var(--bg-card)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            {action.emoji} {action.text}
          </button>
        ))}
      </div>

      {/* Input */}
      <div style={{
        padding: '12px 20px 24px',
        display: 'flex',
        gap: '12px',
        background: 'var(--bg-card)',
        borderTop: '1px solid var(--border)'
      }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Tell Dara anything..."
          style={{
            flex: 1,
            padding: '12px 16px',
            borderRadius: '24px',
            border: '1px solid var(--border)',
            background: 'var(--bg-input)',
            color: 'var(--text-primary)',
            fontSize: '1rem',
            outline: 'none'
          }}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || loading}
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: input.trim() && !loading
              ? 'linear-gradient(135deg, var(--primary), var(--primary-dark))'
              : 'var(--bg-input)',
            border: 'none',
            cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
          }}
        >
          <Send size={20} />
        </button>
      </div>

      {/* Gemini badge */}
      <div style={{
        textAlign: 'center',
        padding: '8px',
        paddingBottom: '70px',
        background: 'var(--bg-dark)',
        fontSize: '0.75rem',
        color: 'var(--text-muted)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px'
      }}>
        <Shield size={12} style={{ color: '#4285f4' }} />
        Powered by Google Gemini
      </div>

      <BottomNav />

      <style>
        {`
          .typing-dot {
            animation: typing 1s infinite;
            color: var(--text-muted);
          }
          @keyframes typing {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 1; }
          }
        `}
      </style>
    </div>
  );
}

export default Chat;