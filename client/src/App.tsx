import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ChatPage } from './pages/ChatPage.tsx';
import { useAuthStore } from './store/authStore';
import { LoadingSpinner } from './components/LoadingSpinner';

function App() {
  const { user, initialize, initialized } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (!initialized) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={user ? <Navigate to="/chat" replace /> : <LoginPage />} 
        />
        <Route 
          path="/register" 
          element={user ? <Navigate to="/chat" replace /> : <RegisterPage />} 
        />
        <Route
          path="/chat"
          element={user ? <ChatPage /> : <Navigate to="/login" replace />}
        />
        <Route 
          path="/" 
          element={<Navigate to={user ? "/chat" : "/login"} replace />} 
        />
      </Routes>
    </Router>
  );
}

export default App;