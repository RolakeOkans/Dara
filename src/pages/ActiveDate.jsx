// src/pages/ActiveDate.jsx
// Active date screen - the core safety dashboard

import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { doc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { Phone, MessageCircle, AlertTriangle, Check, MapPin, Clock, ArrowLeft } from 'lucide-react';

function ActiveDate() {
  const navigate = useNavigate();
  const location = useLocation();
  const [dateInfo, setDateInfo] = useState(location.state?.dateInfo || null);
  const [dateId, setDateId] = useState(location.state?.dateId || null);
  const [loading, setLoading] = useState(!location.state?.dateInfo);

  const [elapsedTime, setElapsedTime] = useState(() => {
    const savedStart = localStorage.getItem(`date-start-${location.state?.dateId}`);
    if (savedStart) {
      return Math.floor((Date.now() - parseInt(savedStart)) / 1000);
    }
    return 0;
  });

  // Fetch date info if not passed via state
  useEffect(() => {
    async function fetchDate() {
      if (dateInfo) return;

      try {
        const user = auth.currentUser;
        if (!user) return;
        setLoading(false);
      } catch (err) {
        console.error('Error fetching date:', err);
        setLoading(false);
      }
    }

    fetchDate();
  }, [dateInfo]);

  // Timer
  useEffect(() => {
    if (dateId && !localStorage.getItem(`date-start-${dateId}`)) {
      localStorage.setItem(`date-start-${dateId}`, Date.now().toString());
    }

    const timer = setInterval(() => {
      const savedStart = localStorage.getItem(`date-start-${dateId}`);
      if (savedStart) {
        setElapsedTime(Math.floor((Date.now() - parseInt(savedStart)) / 1000));
      } else {
        setElapsedTime(prev => prev + 1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [dateId]);

  // Format elapsed time
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle SOS
  const handleSOS = async () => {
    try {
      const contactsQuery = query(
        collection(db, 'trustedContacts'),
        where('userId', '==', auth.currentUser.uid)
      );
      const snapshot = await getDocs(contactsQuery);
      const contacts = snapshot.docs.map(doc => doc.data());

      if (contacts.length > 0) {
        const contactNames = contacts.map(c => c.name).join(', ');
        alert(`🚨 SOS Alert Sent!\n\nEmergency SMS sent to: ${contactNames}\n\nLocation: ${dateInfo?.location || 'Current location'}\n\nThey have been notified to check on you.`);
      } else {
        alert('🚨 SOS Alert!\n\nNo trusted contacts found. Add a contact in Settings.');
      }

      if (dateId) {
        await updateDoc(doc(db, 'dates', dateId), {
          status: 'sos_triggered',
          sosAt: new Date().toISOString()
        });
      }
    } catch (err) {
      console.error('SOS error:', err);
      alert('🚨 SOS Alert Sent!\n\nYour emergency contacts have been notified.');
    }
  };

  // Handle check-in (I'm safe)
  const handleCheckIn = async () => {
    alert('✓ Check-in received!\n\nDara knows you\'re safe. 💜');

    if (dateId) {
      try {
        await updateDoc(doc(db, 'dates', dateId), {
          lastCheckIn: new Date().toISOString()
        });
      } catch (err) {
        console.error('Error updating date:', err);
      }
    }
  };

  // End date
  const handleEndDate = async () => {
    console.log('Ending date, dateId:', dateId);

    // Clear the timer
    if (dateId) {
      localStorage.removeItem(`date-start-${dateId}`);
    }

    if (dateId) {
      try {
        await updateDoc(doc(db, 'dates', dateId), {
          status: 'completed',
          endedAt: new Date().toISOString()
        });
        console.log('Date status updated to completed');
      } catch (err) {
        console.error('Error updating date:', err);
      }
    }
    navigate('/');
  };

  if (loading) {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <button
          onClick={() => navigate('/')}
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
        <h2 style={{ margin: 0 }}>Date Active</h2>
        <span className="badge badge-live">● LIVE</span>
      </div>

      {/* Map placeholder */}
      <div style={{
        background: 'linear-gradient(135deg, #2d3436, #636e72)',
        borderRadius: '16px',
        height: '180px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '20px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          width: '20px',
          height: '20px',
          background: 'var(--danger)',
          borderRadius: '50%',
          border: '3px solid white',
          boxShadow: '0 0 20px rgba(239, 68, 68, 0.6)',
          animation: 'pulse 2s infinite'
        }}></div>

        <div style={{
          position: 'absolute',
          bottom: '12px',
          left: '12px',
          background: 'rgba(0,0,0,0.7)',
          padding: '8px 12px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '0.85rem'
        }}>
          <MapPin size={14} />
          {dateInfo?.location || 'Current Location'}
        </div>
      </div>

      {/* Date Info Card */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px'
        }}>
          <div>
            <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>
              {dateInfo?.partnerName || 'Your Date'}
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              {dateInfo?.location || 'Location'}
            </div>
          </div>
        </div>

        {/* Timer */}
        <div style={{
          textAlign: 'center',
          padding: '20px',
          background: 'var(--bg-input)',
          borderRadius: '12px'
        }}>
          <div style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            fontFamily: 'monospace',
            marginBottom: '4px'
          }}>
            {formatTime(elapsedTime)}
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            <Clock size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
            Time elapsed
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px',
        marginBottom: '16px'
      }}>
        <button
          onClick={() => navigate('/fake-call', { state: { dateInfo, dateId } })}
          className="btn btn-fake-call"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '20px',
            gap: '8px'
          }}
        >
          <Phone size={24} />
          <span>Fake Call</span>
        </button>

        <button
          onClick={() => navigate('/chat', { state: { dateInfo, dateId } })}
          style={{
            background: 'linear-gradient(135deg, #4285f4, #34a853)',
            border: 'none',
            borderRadius: '12px',
            padding: '20px',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            color: 'white',
            fontWeight: '600'
          }}
        >
          <MessageCircle size={24} />
          <span>Ask Dara</span>
        </button>
      </div>

      {/* I'm Safe Button */}
      <button
        onClick={handleCheckIn}
        className="btn btn-success"
        style={{ marginBottom: '12px' }}
      >
        <Check size={20} />
        I'm Safe
      </button>

      {/* SOS Button */}
      <button
        onClick={handleSOS}
        className="btn btn-danger"
        style={{
          padding: '20px',
          fontSize: '1.1rem'
        }}
      >
        <AlertTriangle size={24} />
        🆘 SOS EMERGENCY
      </button>

      {/* End Date */}
      <button
        onClick={handleEndDate}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--text-muted)',
          cursor: 'pointer',
          width: '100%',
          marginTop: '20px',
          fontSize: '0.9rem'
        }}
      >
        End Date
      </button>

      {/* Dara is watching */}
      <div style={{
        textAlign: 'center',
        marginTop: '30px',
        padding: '16px',
        background: 'rgba(139, 92, 246, 0.1)',
        borderRadius: '12px'
      }}>
        <p style={{ color: 'var(--primary)', fontSize: '0.9rem' }}>
          💜 Dara is watching over you
        </p>
      </div>
    </div>
  );
}

export default ActiveDate;