import React, { useState, useEffect } from 'react';
import { PhilosophyType, AppView } from './types';
import { Header } from './components/Header';
import { DailyNotificationBanner } from './components/DailyNotificationBanner';
import { SafetyDisclaimer } from './components/SafetyDisclaimer';
import { LandingPage } from './pages/LandingPage';
import { ChatPage } from './pages/ChatPage';
import { HabitsPage } from './pages/HabitsPage';
import { RecommendationsPage } from './pages/RecommendationsPage';
import { ReflectionsPage } from './pages/ReflectionsPage';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [selectedPhilosophy, setSelectedPhilosophy] = useState<PhilosophyType>('Stoicism');
  const [showSafetyModal, setShowSafetyModal] = useState(false);

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('mindmentor_theme') === 'dark';
    }
    return false;
  });

  const toggleDarkMode = () => {
    const nextTheme = !darkMode;
    setDarkMode(nextTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('mindmentor_theme', nextTheme ? 'dark' : 'light');
    }
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors ${
      darkMode ? 'bg-[#121417] text-[#F0F2F5]' : 'bg-[#F9FAFB] text-[#1A1A1A]'
    }`}>
      
      {/* Realtime Notification Banner */}
      <DailyNotificationBanner 
        onSelectPhilosophy={(p) => {
          setSelectedPhilosophy(p as PhilosophyType);
          setCurrentView('chat');
        }} 
        darkMode={darkMode}
      />

      {/* Main Header */}
      <Header
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view)}
        selectedPhilosophy={selectedPhilosophy}
        onPhilosophyChange={(p) => setSelectedPhilosophy(p)}
        onToggleSafetyNotice={() => setShowSafetyModal(true)}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {currentView === 'landing' && (
          <LandingPage
            onStartChat={(philosophy) => {
              if (philosophy) setSelectedPhilosophy(philosophy);
              setCurrentView('chat');
            }}
            selectedPhilosophy={selectedPhilosophy}
            onSelectPhilosophy={(p) => setSelectedPhilosophy(p)}
            darkMode={darkMode}
          />
        )}

        {currentView === 'chat' && (
          <ChatPage
            selectedPhilosophy={selectedPhilosophy}
            onPhilosophyChange={(p) => setSelectedPhilosophy(p)}
            darkMode={darkMode}
          />
        )}

        {currentView === 'habits' && (
          <HabitsPage
            selectedPhilosophy={selectedPhilosophy}
            darkMode={darkMode}
            onNavigateToChat={() => setCurrentView('chat')}
          />
        )}

        {currentView === 'recommendations' && (
          <RecommendationsPage
            selectedPhilosophy={selectedPhilosophy}
            darkMode={darkMode}
            onNavigateToChat={() => setCurrentView('chat')}
            onNavigateToHabits={() => setCurrentView('habits')}
          />
        )}

        {currentView === 'reflections' && (
          <ReflectionsPage
            selectedPhilosophy={selectedPhilosophy}
            darkMode={darkMode}
          />
        )}
      </div>

      {/* Safety Notice Modal */}
      {showSafetyModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`max-w-lg w-full rounded-2xl p-6 shadow-xl border ${
            darkMode ? 'bg-[#1E2026] border-gray-800 text-white' : 'bg-white border-gray-100 text-gray-900'
          }`}>
            <SafetyDisclaimer onClose={() => setShowSafetyModal(false)} />
            <div className="mt-4 text-right">
              <button
                onClick={() => setShowSafetyModal(false)}
                className="px-4 py-2 bg-[#5B7B7A] text-white rounded-xl text-xs font-semibold hover:bg-[#4A6463] transition-colors cursor-pointer"
              >
                I Understand & Agree
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}


