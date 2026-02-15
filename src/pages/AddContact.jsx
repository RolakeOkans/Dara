// src/pages/AddContact.jsx
// Add a trusted contact

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { ArrowLeft, User, Phone, Heart } from 'lucide-react';

function AddContact() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    relation: ''
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
      await addDoc(collection(db, 'trustedContacts'), {
        userId: auth.currentUser.uid,
        name: formData.name,
        phone: formData.phone,
        relation: formData.relation,
        createdAt: new Date().toISOString()
      });

      navigate('/');
    } catch (err) {
      console.error('Error adding contact:', err);
      alert('Failed to add contact. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const relations = [
    { value: 'friend', label: '👫 Friend' },
    { value: 'family', label: '👨‍👩‍👧 Family' },
    { value: 'roommate', label: '🏠 Roommate' },
    { value: 'partner', label: '💕 Partner' },
    { value: 'other', label: '🤝 Other' }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #1a1025 0%, #0c0a14 100%)'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #ec4899 0%, #f97316 100%)',
        borderRadius: '0 0 32px 32px',
        padding: '20px 20px 40px'
      }}>
        <div style={{ maxWidth: '480px', margin: '0 auto' }}>
          <button
            onClick={() => navigate(-1)}
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
          
          <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🛡️</div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '4px' }}>
            Add Trusted Contact
          </h1>
          <p style={{ opacity: 0.9, fontSize: '0.95rem' }}>
            Someone who can help in an emergency
          </p>
        </div>
      </div>

      {/* Form */}
      <div style={{
        maxWidth: '480px',
        margin: '0 auto',
        padding: '32px 20px'
      }}>
        {/* Info Card */}
        <div style={{
          background: 'linear-gradient(145deg, #1e1a2e, #161222)',
          border: '1px solid #2e2844',
          borderRadius: '16px',
          padding: '16px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'rgba(236, 72, 153, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Heart size={20} style={{ color: '#ec4899' }} />
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', flex: 1 }}>
            This person will be notified when you press SOS or share your date location.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#94a3b8',
              fontSize: '0.9rem',
              fontWeight: '500'
            }}>
              Their Name
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
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Contact name"
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
              Phone Number
            </label>
            <div style={{ position: 'relative' }}>
              <Phone size={20} style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#64748b'
              }} />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 123-4567"
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

          <div style={{ marginBottom: '32px' }}>
            <label style={{
              display: 'block',
              marginBottom: '12px',
              color: '#94a3b8',
              fontSize: '0.9rem',
              fontWeight: '500'
            }}>
              Relationship
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {relations.map(rel => (
                <button
                  key={rel.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, relation: rel.value })}
                  style={{
                    padding: '12px 16px',
                    background: formData.relation === rel.value
                      ? 'linear-gradient(135deg, #7c3aed, #ec4899)'
                      : '#1e1a2e',
                    border: formData.relation === rel.value
                      ? 'none'
                      : '1px solid #2e2844',
                    borderRadius: '12px',
                    color: formData.relation === rel.value ? 'white' : '#94a3b8',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    fontWeight: formData.relation === rel.value ? '600' : '400'
                  }}
                >
                  {rel.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !formData.relation}
            style={{
              width: '100%',
              padding: '18px',
              background: loading || !formData.relation
                ? '#2e2844'
                : 'linear-gradient(135deg, #7c3aed, #ec4899)',
              border: 'none',
              borderRadius: '16px',
              color: 'white',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: loading || !formData.relation ? 'not-allowed' : 'pointer',
              opacity: loading || !formData.relation ? 0.6 : 1,
              boxShadow: loading || !formData.relation
                ? 'none'
                : '0 8px 30px rgba(124, 58, 237, 0.4)'
            }}
          >
            {loading ? 'Adding...' : 'Add to Safety Circle'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddContact;