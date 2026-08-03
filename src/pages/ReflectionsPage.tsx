import React, { useState } from 'react';
import { PhilosophyType, DailyHabit } from '../types';
import { HabitTracker } from '../components/HabitTracker';
import { PenTool, Sparkles, Calendar, CheckCircle2, BookOpen, Quote as QuoteIcon, Heart } from 'lucide-react';

interface ReflectionsPageProps {
  selectedPhilosophy: PhilosophyType;
  darkMode: boolean;
}

export const ReflectionsPage: React.FC<ReflectionsPageProps> = ({ selectedPhilosophy, darkMode }) => {
  const [reflectionText, setReflectionText] = useState('');
  
  const [habits] = useState<DailyHabit[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('mindmentor_habits');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {}
    }
    return [
      {
        id: 'st-1',
        title: 'Morning Control Audit',
        description: 'Separate worries into Column A (Within Control) and Column B (Outside Control).',
        time_estimate: '3 mins',
        category: 'Mindset Practice',
        philosophy: 'Stoicism',
        completed: false
      }
    ];
  });

  const [savedReflections, setSavedReflections] = useState<Array<{ id: string; text: string; date: string; philosophy: string }>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('mindmentor_reflections');
        if (saved) return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      {
        id: '1',
        text: 'Focused on separating my immediate emotional reaction from my chosen response during a stressful team meeting. The dichotomy of control was very grounding.',
        date: new Date(Date.now() - 86400000).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
        philosophy: 'Stoicism'
      }
    ];
  });

  const handleSaveReflection = () => {
    if (!reflectionText.trim()) return;
    const newEntry = {
      id: Date.now().toString(),
      text: reflectionText.trim(),
      date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
      philosophy: selectedPhilosophy
    };
    const updated = [newEntry, ...savedReflections];
    setSavedReflections(updated);
    setReflectionText('');
    if (typeof window !== 'undefined') {
      localStorage.setItem('mindmentor_reflections', JSON.stringify(updated));
    }
  };

  return (
    <div className={`flex-1 py-8 px-4 sm:px-6 lg:px-8 transition-colors ${darkMode ? 'bg-[#121417] text-[#F0F2F5]' : 'bg-[#F9FAFB] text-[#1A1A1A]'}`}>
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Page Header */}
        <div className="border-b pb-6 border-gray-200 dark:border-gray-800">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3 bg-brand-50 dark:bg-brand-900/30 text-[#5B7B7A] dark:text-brand-300">
            <PenTool className="h-3.5 w-3.5" />
            <span>Daily Practice & Reflection Journal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Reflections & Daily Habits
          </h1>
          <p className={`text-sm mt-1.5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Translate {selectedPhilosophy} wisdom into concrete actions, evening journal logs, and self-examination.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Habits & Progress */}
          <div className="lg:col-col-span-1 lg:col-span-1 space-y-6">
            <HabitTracker habits={habits} philosophy={selectedPhilosophy} darkMode={darkMode} />
          </div>

          {/* Right Column: Journaling Workspace */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Active Reflection Prompt Box */}
            <div className={`p-6 rounded-2xl border shadow-xs transition-colors ${darkMode ? 'bg-[#1E2026] border-gray-800' : 'bg-white border-gray-100'}`}>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-[#5B7B7A]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#5B7B7A]">
                  Evening Reflection Prompt
                </h3>
              </div>
              <p className="text-base font-serif italic mb-4">
                "Where did I spend my attention today, and did my actions align with my highest virtue?"
              </p>
              
              <textarea
                value={reflectionText}
                onChange={(e) => setReflectionText(e.target.value)}
                placeholder="Write your evening reflections here..."
                rows={4}
                className={`w-full p-4 rounded-xl text-sm border focus:outline-none focus:border-[#5B7B7A] transition-all resize-none ${
                  darkMode 
                    ? 'bg-[#121417] border-gray-800 text-white placeholder-gray-500' 
                    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                }`}
              />

              <div className="mt-3 flex items-center justify-between">
                <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  Entries saved securely in local storage
                </span>
                <button
                  onClick={handleSaveReflection}
                  disabled={!reflectionText.trim()}
                  className="px-5 py-2.5 bg-[#5B7B7A] hover:bg-[#4A6463] text-white text-xs font-semibold rounded-xl disabled:opacity-40 transition-colors shadow-xs"
                >
                  Save Reflection Entry
                </button>
              </div>
            </div>

            {/* Saved Past Reflections History */}
            <div className={`p-6 rounded-2xl border shadow-xs ${darkMode ? 'bg-[#1E2026] border-gray-800' : 'bg-white border-gray-100'}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-[#5B7B7A]" />
                  <span>Journal History ({savedReflections.length})</span>
                </h3>
              </div>

              {savedReflections.length === 0 ? (
                <p className={`text-xs text-center py-6 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  No saved reflections yet. Write your first entry above!
                </p>
              ) : (
                <div className="space-y-4">
                  {savedReflections.map((entry) => (
                    <div
                      key={entry.id}
                      className={`p-4 rounded-xl border transition-all ${
                        darkMode ? 'bg-[#121417] border-gray-800' : 'bg-gray-50/70 border-gray-100'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-[#5B7B7A] bg-brand-50/50 dark:bg-brand-900/30 px-2.5 py-0.5 rounded-md border border-brand-100 dark:border-brand-800">
                          {entry.philosophy}
                        </span>
                        <span className={`text-[11px] ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          {entry.date}
                        </span>
                      </div>
                      <p className={`text-xs leading-relaxed whitespace-pre-wrap ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {entry.text}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
