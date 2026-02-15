// src/App.jsx
// Main application with routing

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect, createContext, useContext } from 'react';
import { auth } from './config/firebase';
import { onAuthStateChanged } from 'firebase/auth';

// Pages
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import AddContact from './pages/AddContact';
import CreateDate from './pages/CreateDate';
import SafetyAnalysis from './pages/SafetyAnalysis';
import ActiveDate from './pages/ActiveDate';
import FakeCall from './pages/FakeCall';
import Chat from './pages/Chat';
import Settings from './pages/Settings';

// Create Auth Context
const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

// Protected Route wrapper
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/welcome" />;
  }
  
  return children;
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/add-contact" element={
            <ProtectedRoute>
              <AddContact />
            </ProtectedRoute>
          } />
          <Route path="/create-date" element={
            <ProtectedRoute>
              <CreateDate />
            </ProtectedRoute>
          } />
          <Route path="/safety-analysis" element={
            <ProtectedRoute>
              <SafetyAnalysis />
            </ProtectedRoute>
          } />
          <Route path="/active-date" element={
            <ProtectedRoute>
              <ActiveDate />
            </ProtectedRoute>
          } />
          <Route path="/fake-call" element={
            <ProtectedRoute>
              <FakeCall />
            </ProtectedRoute>
          } />
          <Route path="/chat" element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />
          {/* Default redirect */}
          <Route path="*" element={<Navigate to="/welcome" />} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}


export default App;