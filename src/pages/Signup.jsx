// src/pages/Signup.jsx
// Sign up page

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { ArrowLeft, Mail, Lock, User } from 'lucide-react';

function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: name });

      await setDoc(doc(db, 'users', user.uid), {
        name: name,
        email: email,
        createdAt: new Date().toISOString()
      });

      navigate('/');
    } catch (err) {
      console.error('Signup error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Email already in use');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address');
      } else {
        setError('Failed to create account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #1a1025 0%, #0c0a14 100%)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)',
        borderRadius: '0 0 32px 32px',
        padding: '20px 20px 40px'
      }}>
        <div style={{ maxWidth: '480px', margin: '0 auto' }}>
          <button
            onClick={() => navigate('/welcome')}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '12px',
              padding: '10px',
              cursor: 'pointer',
              color: 'white',
              marginBottom: '20px'
            }}
          >
            <ArrowLeft size={20} />
          </button>
          
          <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>💜</div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '4px' }}>
            Create account
          </h1>
          <p style={{ opacity: 0.9, fontSize: '0.95rem' }}>
            Join Dara and date safely
          </p>
        </div>
      </div>

      {/* Form */}
      <div style={{
        flex: 1,
        maxWidth: '480px',
        margin: '0 auto',
        padding: '32px 20px',
        width: '100%'
      }}>
        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#ef4444',
            padding: '12px 16px',
            borderRadius: '12px',
            marginBottom: '20px',
            fontSize: '0.9rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSignup}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#94a3b8',
              fontSize: '0.9rem',
              fontWeight: '500'
            }}>
              Your Name
            </label>
            <div style={{ position: 'relative' }}>
              <User size={20} style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#64748b'
              }} />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="What should Dara call you?"
                required
                style={{
                  width: '100%',
                  padding: '16px 16px 16px 48px',
                  background: '#1e1a2e',
                  border: '1px solid #2e2844',
                  borderRadius: '12px',
                  color: '#f8fafc',
                  fontSize: '1rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#94a3b8',
              fontSize: '0.9rem',
              fontWeight: '500'
            }}>
              Email
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={20} style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#64748b'
              }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                style={{
                  width: '100%',
                  padding: '16px 16px 16px 48px',
                  background: '#1e1a2e',
                  border: '1px solid #2e2844',
                  borderRadius: '12px',
                  color: '#f8fafc',
                  fontSize: '1rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#94a3b8',
              fontSize: '0.9rem',
              fontWeight: '500'
            }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={20} style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#64748b'
              }} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password (min 6 characters)"
                required
                style={{
                  width: '100%',
                  padding: '16px 16px 16px 48px',
                  background: '#1e1a2e',
                  border: '1px solid #2e2844',
                  borderRadius: '12px',
                  color: '#f8fafc',
                  fontSize: '1rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '18px',
              background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
              border: 'none',
              borderRadius: '16px',
              color: 'white',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              boxShadow: '0 8px 30px rgba(124, 58, 237, 0.4)'
            }}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={{
          textAlign: 'center',
          marginTop: '24px',
          color: '#64748b',
          fontSize: '0.95rem'
        }}>
          Already have an account?{' '}
          <span
            onClick={() => navigate('/login')}
            style={{ color: '#a78bfa', cursor: 'pointer', fontWeight: '500' }}
          >
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
}

export default Signup;