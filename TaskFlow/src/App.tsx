import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { LandingPage } from './components/landing/LandingPage';
import { TaskApp } from './components/app/TaskApp';
import { AuthModal } from './components/auth/AuthModal';
import { useToast, ToastContainer } from './components/ui/Toast';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [sessionKey, setSessionKey] = useState<string | null>(null); // Key to reset TaskApp state
  const { toasts, addToast, removeToast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    if (token && userId) {
      setIsLoggedIn(true);
      setSessionKey(userId);
    }
  }, []);

  const handleLoginSuccess = () => {
    const userId = localStorage.getItem('userId');
    setIsLoggedIn(true);
    setIsAuthModalOpen(false);
    if(userId) setSessionKey(userId);
    addToast('success', 'Login successful!');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setIsLoggedIn(false);
    setSessionKey(null);
    addToast('info', 'You have been logged out.');
  };

  return (
    <div className="app">
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      {isLoggedIn && sessionKey ? (
        <TaskApp key={sessionKey} onLogout={handleLogout} addToast={addToast} />
      ) : (
        <LandingPage onGetStarted={() => setIsAuthModalOpen(true)} />
      )}
      <AnimatePresence>
        {isAuthModalOpen && <AuthModal onClose={() => setIsAuthModalOpen(false)} onLoginSuccess={handleLoginSuccess} addToast={addToast}/>}
      </AnimatePresence>
    </div>
  );
}

export default App;