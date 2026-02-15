// src/pages/Home.jsx
// Main dashboard / home page

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../App';
import { Plus, Calendar, MapPin, Shield, Heart } from 'lucide-react';
import BottomNav from '../components/BottomNav';

function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [dates, setDates] = useState([]);
  const [loading, setLoading] = useState(true);

  const firstName = user?.displayName?.split(' ')[0] || 'Friend';

  useEffect(() => {
    async function fetchData() {
      if (!user) return;

      try {
        const contactsQuery = query(
          collection(db, 'trustedContacts'),
          where('userId', '==', user.uid)
        );
        const contactsSnapshot = await getDocs(contactsQuery);
        const contactsList = contactsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setContacts(contactsList);

        const datesQuery = query(
          collection(db, 'dates'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc'),
          limit(10)
        );
        const datesSnapshot = await getDocs(datesQuery);
        const allDates = datesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setDates(allDates);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  const activeDates = dates.filter(d => d.status === 'active' || d.status === 'scheduled');
  const completedDates = dates.filter(d => d.status === 'completed').length;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #1a1025 0%, #0c0a14 100%)',
      paddingBottom: '100px'
    }}>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 50%, #f97316 100%)',
        borderRadius: '0 0 32px 32px',
        padding: '40px 20px 30px',
        marginBottom: '24px'
      }}>
        <div style={{ maxWidth: '480px', margin: '0 auto' }}>
          <p style={{ opacity: 0.9, marginBottom: '4px', fontSize: '0.95rem' }}>Welcome back,</p>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '20px' }}>
            {firstName} 👋
          </h1>
          
          {/* Stats Row */}
          <div style={{
            display: 'flex',
            gap: '12px',
            marginTop: '16px'
          }}>
            <div style={{
              flex: 1,
              background: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '16px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.8rem', fontWeight: '700' }}>{completedDates}</div>
              <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>Dates Completed</div>
            </div>
            <div style={{
              flex: 1,
              background: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '16px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.8rem', fontWeight: '700' }}>{contacts.length}</div>
              <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>Trusted Contacts</div>
            </div>
            <div style={{
              flex: 1,
              background: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '16px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.8rem', fontWeight: '700' }}>
                <Shield size={28} />
              </div>
              <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>Protected</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '480px', margin: '0 auto', padding: '0 20px' }}>
        
        {/* New Date Button */}
        <button
          onClick={() => navigate('/create-date')}
          style={{
            width: '100%',
            padding: '20px',
            background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
            border: 'none',
            borderRadius: '20px',
            color: 'white',
            fontSize: '1.1rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            marginBottom: '24px',
            boxShadow: '0 8px 30px rgba(124, 58, 237, 0.4)'
          }}
        >
          <Plus size={24} />
          Plan a New Date
        </button>

        {/* No contacts warning */}
        {contacts.length === 0 && (
          <div
            onClick={() => navigate('/add-contact')}
            style={{
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(249, 115, 22, 0.1))',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: '16px',
              padding: '16px',
              marginBottom: '20px',
              cursor: 'pointer'
            }}
          >
            <p style={{ color: '#fbbf24', fontWeight: '600', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Heart size={18} /> Add a Trusted Contact
            </p>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
              Someone who can help if you need them
            </p>
          </div>
        )}

        {/* Upcoming Dates Section */}
        {activeDates.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{
              fontSize: '1.1rem',
              color: '#94a3b8',
              marginBottom: '12px',
              fontWeight: '600'
            }}>
              Upcoming Dates
            </h2>
            
            {activeDates.map(date => (
              <div
                key={date.id}
                onClick={() => navigate('/active-date', { state: { dateId: date.id, dateInfo: date } })}
                style={{
                  background: date.status === 'active'
                    ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(20, 184, 166, 0.1))'
                    : 'linear-gradient(145deg, #1e1a2e, #161222)',
                  border: date.status === 'active'
                    ? '1px solid rgba(16, 185, 129, 0.3)'
                    : '1px solid #2e2844',
                  borderRadius: '20px',
                  padding: '20px',
                  marginBottom: '12px',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '4px' }}>
                      {date.partnerName}
                    </h3>
                    <span style={{
                      fontSize: '0.75rem',
                      padding: '4px 10px',
                      borderRadius: '20px',
                      background: date.status === 'active' ? '#10b981' : 'rgba(245, 158, 11, 0.2)',
                      color: date.status === 'active' ? 'white' : '#fbbf24',
                      fontWeight: '600'
                    }}>
                      {date.status === 'active' ? '● LIVE' : 'UPCOMING'}
                    </span>
                  </div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: '#94a3b8', fontSize: '0.9rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin size={16} style={{ color: '#7c3aed' }} />
                    {date.location}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Calendar size={16} style={{ color: '#ec4899' }} />
                    {date.dateTime}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {activeDates.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: '#64748b'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>💜</div>
            <p style={{ marginBottom: '8px', fontWeight: '500', color: '#94a3b8' }}>No dates planned yet</p>
            <p style={{ fontSize: '0.9rem' }}>Tap the button above to plan your first safe date!</p>
          </div>
        )}

        {/* Trusted Contacts */}
        {contacts.length > 0 && (
          <div>
            <h2 style={{
              fontSize: '1.1rem',
              color: '#94a3b8',
              marginBottom: '12px',
              fontWeight: '600'
            }}>
              Your Safety Circle
            </h2>
            
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {contacts.map(contact => (
                <div
                  key={contact.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: 'linear-gradient(145deg, #1e1a2e, #161222)',
                    border: '1px solid #2e2844',
                    borderRadius: '16px',
                    padding: '12px 16px'
                  }}
                >
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '600',
                    fontSize: '0.9rem'
                  }}>
                    {contact.name[0].toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{contact.name}</div>
                    <div style={{ color: '#64748b', fontSize: '0.8rem' }}>{contact.relation}</div>
                  </div>
                </div>
              ))}
              
              <button
                onClick={() => navigate('/add-contact')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'transparent',
                  border: '1px dashed #2e2844',
                  borderRadius: '16px',
                  padding: '12px 16px',
                  color: '#64748b',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                <Plus size={20} />
                Add
              </button>
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}

export default Home;