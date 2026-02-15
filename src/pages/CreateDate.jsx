// src/pages/CreateDate.jsx
// Create a new date

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { ArrowLeft, User, MapPin, Calendar, Clock, FileText } from 'lucide-react';

function CreateDate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    partnerName: '',
    location: '',
    date: '',
    time: '',
    notes: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dateDoc = await addDoc(collection(db, 'dates'), {
        userId: auth.currentUser.uid,
        partnerName: formData.partnerName,
        location: formData.location,
        dateTime: `${formData.date} at ${formData.time}`,
        notes: formData.notes,
        status: 'scheduled',
        createdAt: new Date().toISOString()
      });

      navigate('/safety-analysis', {
        state: {
          dateId: dateDoc.id,
          dateInfo: {
            partnerName: formData.partnerName,
            location: formData.location,
            dateTime: `${formData.date} at ${formData.time}`,
            notes: formData.notes
          }
        }
      });
    } catch (err) {
      console.error('Error creating date:', err);
      alert('Failed to create date. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #1a1025 0%, #0c0a14 100%)'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)',
        borderRadius: '0 0 32px 32px',
        padding: '20px 20px 40px'
      }}>
        <div style={{ maxWidth: '480px', margin: '0 auto' }}>
          <button
            onClick={() => navigate('/')}
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
          
          <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>📅</div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '4px' }}>
            Plan Your Date
          </h1>
          <p style={{ opacity: 0.9, fontSize: '0.95rem' }}>
            Dara will analyze the safety for you
          </p>
        </div>
      </div>

      {/* Form */}
      <div style={{
        maxWidth: '480px',
        margin: '0 auto',
        padding: '32px 20px'
      }}>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#94a3b8',
              fontSize: '0.9rem',
              fontWeight: '500'
            }}>
              Who are you meeting?
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
                name="partnerName"
                value={formData.partnerName}
                onChange={handleChange}
                placeholder="Their name"
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
              Where are you going?
            </label>
            <div style={{ position: 'relative' }}>
              <MapPin size={20} style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#64748b'
              }} />
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Restaurant, cafe, park..."
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

          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
            <div style={{ flex: 1 }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#94a3b8',
                fontSize: '0.9rem',
                fontWeight: '500'
              }}>
                Date
              </label>
              <div style={{ position: 'relative' }}>
                <Calendar size={20} style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#64748b'
                }} />
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
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

            <div style={{ flex: 1 }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#94a3b8',
                fontSize: '0.9rem',
                fontWeight: '500'
              }}>
                Time
              </label>
              <div style={{ position: 'relative' }}>
                <Clock size={20} style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#64748b'
                }} />
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
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
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#94a3b8',
              fontSize: '0.9rem',
              fontWeight: '500'
            }}>
              Notes (optional)
            </label>
            <div style={{ position: 'relative' }}>
              <FileText size={20} style={{
                position: 'absolute',
                left: '16px',
                top: '16px',
                color: '#64748b'
              }} />
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="How did you meet? Any concerns?"
                rows={3}
                style={{
                  width: '100%',
                  padding: '16px 16px 16px 48px',
                  background: '#1e1a2e',
                  border: '1px solid #2e2844',
                  borderRadius: '12px',
                  color: '#f8fafc',
                  fontSize: '1rem',
                  outline: 'none',
                  resize: 'none',
                  fontFamily: 'inherit'
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
            {loading ? 'Creating...' : 'Analyze Safety →'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateDate;