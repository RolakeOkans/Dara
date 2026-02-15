// src/pages/Settings.jsx
// Settings page for Dara

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut, updateProfile } from 'firebase/auth';
import { doc, updateDoc, collection, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { useAuth } from '../App';
import { ArrowLeft, User, Users, Bell, LogOut, Trash2 } from 'lucide-react';
import BottomNav from '../components/BottomNav';

function Settings() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [name, setName] = useState(user?.displayName || '');
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function fetchContacts() {
      if (!user) return;
      try {
        const contactsQuery = query(
          collection(db, 'trustedContacts'),
          where('userId', '==', user.uid)
        );
        const snapshot = await getDocs(contactsQuery);
        const contactsList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setContacts(contactsList);
      } catch (err) {
        console.error('Error fetching contacts:', err);
      }
    }
    fetchContacts();
  }, [user]);

  const handleUpdateProfile = async () => {
    if (!name.trim()) return;
    setLoading(true);
    try {
      await updateProfile(auth.currentUser, { displayName: name });
      await updateDoc(doc(db, 'users', user.uid), { name: name });
      setMessage('Profile updated!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setMessage('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteContact = async (contactId) => {
    if (!confirm('Remove this trusted contact?')) return;
    try {
      await deleteDoc(doc(db, 'trustedContacts', contactId));
      setContacts(contacts.filter(c => c.id !== contactId));
    } catch (err) {
      console.error('Error deleting contact:', err);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/welcome');
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  return (
    <div className="container">
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '30px'
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
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Settings</h1>
      </div>

      {/* Success Message */}
      {message && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid var(--success)',
          color: 'var(--success)',
          padding: '12px 16px',
          borderRadius: '12px',
          marginBottom: '20px',
          fontSize: '0.9rem',
        }}>
          {message}
        </div>
      )}

      {/* Profile Section */}
      <div className="card" style={{ marginBottom: '16px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '16px',
          color: 'var(--text-secondary)',
          fontSize: '0.85rem',
          fontWeight: '600'
        }}>
          <User size={16} />
          PROFILE
        </div>

        <div className="input-group" style={{ marginBottom: '12px' }}>
          <label>Your Name</label>
          <input
            type="text"
            className="input-field"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="What should Dara call you?"
          />
        </div>

        <div className="input-group" style={{ marginBottom: '16px' }}>
          <label>Email</label>
          <input
            type="email"
            className="input-field"
            value={user?.email || ''}
            disabled
            style={{ opacity: 0.6 }}
          />
        </div>

        <button
          className="btn btn-primary"
          onClick={handleUpdateProfile}
          disabled={loading || name === user?.displayName}
          style={{ padding: '12px' }}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Trusted Contacts Section */}
      <div className="card" style={{ marginBottom: '16px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: 'var(--text-secondary)',
            fontSize: '0.85rem',
            fontWeight: '600'
          }}>
            <Users size={16} />
            TRUSTED CONTACTS
          </div>
          <button
            onClick={() => navigate('/add-contact')}
            style={{
              background: 'var(--primary)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '0.8rem',
              cursor: 'pointer'
            }}
          >
            + Add
          </button>
        </div>

        {contacts.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            No trusted contacts yet. Add someone who can help in emergencies.
          </p>
        ) : (
          contacts.map(contact => (
            <div
              key={contact.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 0',
                borderTop: '1px solid var(--border)'
              }}
            >
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '600',
                marginRight: '12px'
              }}>
                {contact.name[0].toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '600' }}>{contact.name}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                  {contact.relation} • {contact.phone}
                </div>
              </div>
              <button
                onClick={() => handleDeleteContact(contact.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--danger)',
                  cursor: 'pointer',
                  padding: '8px'
                }}
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* App Info */}
      <div className="card" style={{ marginBottom: '16px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '12px',
          color: 'var(--text-secondary)',
          fontSize: '0.85rem',
          fontWeight: '600'
        }}>
          <Bell size={16} />
          ABOUT
        </div>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          <p style={{ marginBottom: '8px' }}>
            <strong>Dara</strong> - Date Alert Response App
          </p>
          <p style={{ marginBottom: '8px' }}>
            Version 1.0.0
          </p>
          <p style={{ color: 'var(--text-muted)' }}>
            Made with 💜 to keep you safe
          </p>
        </div>
      </div>

      {/* Sign Out */}
      <button
        onClick={handleSignOut}
        className="btn btn-secondary"
        style={{
          color: 'var(--danger)',
          borderColor: 'var(--danger)',
          marginBottom: '100px'
        }}
      >
        <LogOut size={18} />
        Sign Out
      </button>

      <BottomNav />
    </div>
  );
}

export default Settings;