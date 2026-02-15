// src/components/BottomNav.jsx
// Instagram-style bottom navigation

import { useNavigate, useLocation } from 'react-router-dom';
import { Home, PlusCircle, MessageCircle, Settings, User } from 'lucide-react';

function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const tabs = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/create-date', icon: PlusCircle, label: 'New Date' },
    { path: '/chat', icon: MessageCircle, label: 'Dara' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'var(--bg-card)',
      borderTop: '1px solid var(--border)',
      display: 'flex',
      justifyContent: 'space-around',
      padding: '10px 0 20px',
      maxWidth: '480px',
      margin: '0 auto',
      zIndex: 100
    }}>
      {tabs.map(tab => {
        const isActive = currentPath === tab.path;
        const Icon = tab.icon;
        
        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              color: isActive ? 'var(--primary)' : 'var(--text-muted)',
              transition: 'color 0.2s'
            }}
          >
            <Icon size={24} fill={isActive ? 'var(--primary)' : 'none'} />
            <span style={{ fontSize: '0.7rem' }}>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default BottomNav;