import React, { useState } from 'react';
import { PhilosophyType, AppView } from '../types';
import { Compass, ShieldAlert, MessageSquare, LayoutGrid, PenTool, BookOpen, Sun, Moon, CheckCircle2, Sparkles, Menu, X } from 'lucide-react';

interface HeaderProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  selectedPhilosophy: PhilosophyType;
  onPhilosophyChange: (p: PhilosophyType) => void;
  onToggleSafetyNotice: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

const PHILOSOPHIES: PhilosophyType[] = [
  'Stoicism',
  'Jungian',
  'Existentialism',
  'Taoism',
  'Buddhism',
  'REBT'
];

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  selectedPhilosophy,
  onPhilosophyChange,
  onToggleSafetyNotice,
  darkMode,
  onToggleDarkMode
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { view: 'landing', label: 'Guide', icon: LayoutGrid },
    { view: 'chat', label: 'AI Chat', icon: MessageSquare },
    { view: 'habits', label: 'Practice Habits', icon: CheckCircle2 },
    { view: 'recommendations', label: 'Recommendations', icon: Sparkles },
    { view: 'reflections', label: 'Reflections', icon: PenTool },
  ] as const;

  const handleNavigate = (view: AppView) => {
    onNavigate(view);
    setIsMenuOpen(false);
  };

  return (
    <header className={`sticky top-0 z-40 border-b transition-colors ${
      darkMode ? 'bg-[#1E2026] text-[#F0F2F5] border-gray-800' : 'bg-white text-[#1A1A1A] border-gray-100'
    } shadow-xs`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Brand Logo */}
        <div 
          onClick={() => handleNavigate('landing')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-[#5B7B7A] flex items-center justify-center text-white shadow-xs group-hover:bg-[#4A6463] transition-colors">
            <div className="w-4 h-4 border-2 border-white rounded-full flex items-center justify-center">
              <Compass className="h-2.5 w-2.5 text-white" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight">MindMentor</span>
            </div>
          </div>
        </div>

        {/* Desktop Page Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1 p-1 rounded-xl bg-gray-100/60 dark:bg-[#121417] border border-gray-200/60 dark:border-gray-800">
          {navItems.map(item => (
            <button
              key={item.view}
              onClick={() => handleNavigate(item.view)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                currentView === item.view
                  ? 'bg-[#5B7B7A] text-white shadow-xs'
                  : darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <item.icon className="h-3.5 w-3.5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Center Philosophy Selector for quick selection */}
        <div className="hidden xl:flex items-center gap-1 p-1 rounded-lg bg-gray-50 dark:bg-[#121417] border border-gray-100 dark:border-gray-800">
          {PHILOSOPHIES.map((p) => {
            const isSelected = selectedPhilosophy === p;
            return (
              <button
                key={p}
                onClick={() => {
                  onPhilosophyChange(p);
                }}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#5B7B7A] text-white font-bold shadow-2xs'
                    : darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>

        {/* Right Nav & Utilities */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Theme Toggle Button */}
          <button
            onClick={onToggleDarkMode}
            className={`p-2 rounded-xl transition-colors cursor-pointer border ${
              darkMode 
                ? 'bg-[#121417] text-amber-300 border-gray-700 hover:bg-gray-800' 
                : 'bg-gray-50 text-stone-700 border-gray-200 hover:bg-gray-100'
            }`}
            title={darkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <button
            onClick={onToggleSafetyNotice}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              darkMode 
                ? 'bg-[#121417] text-amber-400 border-gray-700 hover:bg-amber-950/40' 
                : 'bg-gray-50 text-amber-700 border-gray-200 hover:bg-amber-50'
            }`}
            title="Safety Notice"
          >
            <ShieldAlert className="h-4 w-4" />
          </button>
          
          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-xl border border-gray-200 dark:border-gray-800 cursor-pointer"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className={`lg:hidden border-t border-gray-200 dark:border-gray-800 ${
          darkMode ? 'bg-[#1E2026]' : 'bg-white'
        }`}>
          <div className="px-4 py-4 space-y-2">
            {navItems.map(item => (
              <button
                key={item.view}
                onClick={() => handleNavigate(item.view)}
                className={`flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  currentView === item.view
                    ? 'bg-[#5B7B7A] text-white'
                    : darkMode ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};



