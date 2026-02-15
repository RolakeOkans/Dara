// src/pages/SafetyAnalysis.jsx
// Safety analysis page - powered by Gemini

import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { analyzeDateSafety } from '../services/gemini';
import { ArrowLeft, Check, AlertTriangle, Lightbulb, Shield } from 'lucide-react';

function SafetyAnalysis() {
  const navigate = useNavigate();
  const location = useLocation();
  const { dateId, dateInfo } = location.state || {};

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Run analysis on mount
  useEffect(() => {
    async function runAnalysis() {
      if (!dateInfo) {
        navigate('/create-date');
        return;
      }

      try {
        const result = await analyzeDateSafety(dateInfo);
        setAnalysis(result);
      } catch (err) {
        console.error('Analysis error:', err);
        setError('Failed to analyze date. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    runAnalysis();
  }, [dateInfo, navigate]);

  // Confirm and start the date
  const handleConfirm = async () => {
    try {
      // Update date status in Firestore
      if (dateId) {
        await updateDoc(doc(db, 'dates', dateId), {
          status: 'scheduled',
          safetyScore: analysis?.score || 0,
          analyzedAt: new Date().toISOString()
        });
      }
      navigate('/');
    } catch (err) {
      console.error('Error updating date:', err);
    }
  };

  // Start date immediately
  const handleStartNow = async () => {
    try {
      if (dateId) {
        await updateDoc(doc(db, 'dates', dateId), {
          status: 'active',
          safetyScore: analysis?.score || 0,
          startedAt: new Date().toISOString()
        });
      }
      navigate('/active-date', { 
        state: { dateId, dateInfo, analysis } 
      });
    } catch (err) {
      console.error('Error starting date:', err);
    }
  };

  // Get score color
  const getScoreColor = (score) => {
    if (score >= 8) return 'var(--success)';
    if (score >= 6) return 'var(--warning)';
    return 'var(--danger)';
  };

  if (loading) {
    return (
      <div className="container" style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        textAlign: 'center'
      }}>
        <div className="spinner" style={{ marginBottom: '20px' }}></div>
        <h2 style={{ marginBottom: '8px' }}>Analyzing your date...</h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          Dara is reviewing the safety of your plans
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="page-header" style={{ marginTop: '60px' }}>
          <div className="logo">😕</div>
          <h1>Something went wrong</h1>
          <p>{error}</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/create-date')}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Back button */}
      <button 
        onClick={() => navigate('/create-date')}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--text-secondary)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '30px',
          padding: '0',
        }}
      >
        <ArrowLeft size={20} />
        Edit Date
      </button>

      {/* Header */}
      <div className="page-header">
        <div className="logo">🤖</div>
        <h1>Safety Analysis</h1>
        <p>Here's what Dara thinks about your date</p>
      </div>

      {/* Safety Score */}
      <div className="card" style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div style={{
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          background: `conic-gradient(${getScoreColor(analysis?.score)} ${(analysis?.score || 0) * 36}deg, var(--bg-input) 0deg)`,
          margin: '0 auto 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'var(--bg-card)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.8rem',
            fontWeight: 'bold',
            color: getScoreColor(analysis?.score)
          }}>
            {analysis?.score || '?'}
          </div>
        </div>
        <div style={{ fontWeight: '600', marginBottom: '4px' }}>Safety Score</div>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          {analysis?.summary || 'Analysis complete'}
        </div>
      </div>

      {/* Date Details */}
      <div className="card" style={{ marginBottom: '16px' }}>
        <div style={{ fontWeight: '600', marginBottom: '12px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          DATE DETAILS
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div>👤 <strong>{dateInfo?.partnerName}</strong></div>
          <div>📍 {dateInfo?.location}</div>
          <div>📅 {dateInfo?.dateTime}</div>
          <div>⏱️ ~{dateInfo?.duration} hours</div>
        </div>
      </div>

      {/* Positives */}
      {analysis?.positives?.length > 0 && (
        <div className="card" style={{ marginBottom: '16px', borderColor: 'var(--success)' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            marginBottom: '12px',
            color: 'var(--success)'
          }}>
            <Check size={18} />
            <span style={{ fontWeight: '600' }}>Good Signs</span>
          </div>
          {analysis.positives.map((positive, i) => (
            <div key={i} style={{ 
              display: 'flex', 
              alignItems: 'flex-start', 
              gap: '10px',
              padding: '8px 0',
              borderTop: i > 0 ? '1px solid var(--border)' : 'none'
            }}>
              <span style={{ color: 'var(--success)' }}>✓</span>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{positive}</span>
            </div>
          ))}
        </div>
      )}

      {/* Concerns */}
      {analysis?.concerns?.length > 0 && (
        <div className="card" style={{ marginBottom: '16px', borderColor: 'var(--warning)' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            marginBottom: '12px',
            color: 'var(--warning)'
          }}>
            <AlertTriangle size={18} />
            <span style={{ fontWeight: '600' }}>Things to Note</span>
          </div>
          {analysis.concerns.map((concern, i) => (
            <div key={i} style={{ 
              display: 'flex', 
              alignItems: 'flex-start', 
              gap: '10px',
              padding: '8px 0',
              borderTop: i > 0 ? '1px solid var(--border)' : 'none'
            }}>
              <span style={{ color: 'var(--warning)' }}>⚠️</span>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{concern}</span>
            </div>
          ))}
        </div>
      )}

      {/* Tips */}
      {analysis?.tips?.length > 0 && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            marginBottom: '12px',
            color: 'var(--primary)'
          }}>
            <Lightbulb size={18} />
            <span style={{ fontWeight: '600' }}>Safety Tips</span>
          </div>
          {analysis.tips.map((tip, i) => (
            <div key={i} style={{ 
              display: 'flex', 
              alignItems: 'flex-start', 
              gap: '10px',
              padding: '8px 0',
              borderTop: i > 0 ? '1px solid var(--border)' : 'none'
            }}>
              <span style={{ color: 'var(--primary)' }}>💡</span>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{tip}</span>
            </div>
          ))}
        </div>
      )}

      {/* Gemini badge */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '24px',
        padding: '12px',
        background: 'rgba(66, 133, 244, 0.1)',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px'
      }}>
        <Shield size={16} style={{ color: '#4285f4' }} />
        <span style={{ color: '#4285f4', fontSize: '0.85rem' }}>
          Powered by Google Gemini AI
        </span>
      </div>

      {/* Action Buttons */}
      <button 
        className="btn btn-primary"
        onClick={handleStartNow}
        style={{ marginBottom: '12px' }}
      >
        Start Date Now
      </button>

      <button 
        className="btn btn-secondary"
        onClick={handleConfirm}
      >
        Save for Later
      </button>
    </div>
  );
}

export default SafetyAnalysis;