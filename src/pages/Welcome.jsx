// src/pages/Welcome.jsx
// Welcome/landing page

import { useNavigate } from 'react-router-dom';
import { Shield, Heart, Phone, MessageCircle } from 'lucide-react';

function Welcome() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #1a1025 0%, #0c0a14 100%)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 50%, #f97316 100%)',
        borderRadius: '0 0 40px 40px',
        padding: '60px 20px 50px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '16px' }}>💜</div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '8px' }}>
          Dara
        </h1>
        <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>
          Date Alert Response App
        </p>
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        maxWidth: '480px',
        margin: '0 auto',
        padding: '40px 20px',
        width: '100%'
      }}>
        <h2 style={{
          fontSize: '1.5rem',
          textAlign: 'center',
          marginBottom: '12px',
          color: '#f8fafc'
        }}>
          Date safely, always
        </h2>
        <p style={{
          textAlign: 'center',
          color: '#94a3b8',
          marginBottom: '40px',
          fontSize: '0.95rem'
        }}>
          Your AI-powered safety companion for dating
        </p>

        {/* Features */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
          <FeatureItem
            icon={<Shield size={24} />}
            title="AI Safety Analysis"
            description="Get real-time risk assessment for your dates"
            color="#7c3aed"
          />
          <FeatureItem
            icon={<Phone size={24} />}
            title="Fake Call Escape"
            description="AI-generated voice calls to help you leave"
            color="#ec4899"
          />
          <FeatureItem
            icon={<MessageCircle size={24} />}
            title="Chat with Dara"
            description="Your AI companion, always there for you"
            color="#14b8a6"
          />
          <FeatureItem
            icon={<Heart size={24} />}
            title="Trusted Contacts"
            description="Alert your safety circle with one tap"
            color="#f97316"
          />
        </div>

        {/* Buttons */}
        <button
          onClick={() => navigate('/signup')}
          style={{
            width: '100%',
            padding: '18px',
            background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
            border: 'none',
            borderRadius: '16px',
            color: 'white',
            fontSize: '1.1rem',
            fontWeight: '600',
            cursor: 'pointer',
            marginBottom: '12px',
            boxShadow: '0 8px 30px rgba(124, 58, 237, 0.4)'
          }}
        >
          Get Started
        </button>

        <button
          onClick={() => navigate('/login')}
          style={{
            width: '100%',
            padding: '18px',
            background: 'transparent',
            border: '1px solid #2e2844',
            borderRadius: '16px',
            color: '#94a3b8',
            fontSize: '1rem',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          I already have an account
        </button>
      </div>

      {/* Footer */}
      <div style={{
        textAlign: 'center',
        padding: '20px',
        color: '#64748b',
        fontSize: '0.8rem'
      }}>
        Made with 💜 to keep you safe
      </div>
    </div>
  );
}

function FeatureItem({ icon, title, description, color }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      background: 'linear-gradient(145deg, #1e1a2e, #161222)',
      border: '1px solid #2e2844',
      borderRadius: '16px',
      padding: '16px'
    }}>
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        background: `${color}20`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: color
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontWeight: '600', marginBottom: '2px' }}>{title}</div>
        <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{description}</div>
      </div>
    </div>
  );
}

export default Welcome;