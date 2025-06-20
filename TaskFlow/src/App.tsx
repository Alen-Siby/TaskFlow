import React, { useState, useEffect } from 'react';
import { LandingPage } from './components/landing/LandingPage';
import { TaskApp } from './components/app/TaskApp';
import { CustomCursor } from './components/ui/CustomCursor';
import { useTheme } from './hooks/useTheme';

type AppView = 'landing' | 'app';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const { theme } = useTheme();

  // Initialize theme on app start
  useEffect(() => {
    // Theme is automatically applied by the useTheme hook
  }, []);

  const handleGetStarted = () => {
    setCurrentView('app');
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
  };

  return (
    <div className="app">
      <CustomCursor />
      
      {currentView === 'landing' ? (
        <LandingPage onGetStarted={handleGetStarted} />
      ) : (
        <TaskApp onBack={handleBackToLanding} />
      )}
    </div>
  );
}

export default App;