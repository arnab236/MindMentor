import React from 'react';
import { PhilosophyType, BookRecommendation, DailyHabit, Quote } from '../types';
import { HabitTracker } from './HabitTracker';
import { BookRecommendations } from './BookRecommendations';
import { Compass, BookOpen, Quote as QuoteIcon, PenTool, Sparkles, CheckCircle } from 'lucide-react';

interface SidebarProps {
  selectedPhilosophy: PhilosophyType;
  onPhilosophyChange: (p: PhilosophyType) => void;
  activeConceptName?: string;
  activeCoreInsight?: string;
  activeQuote?: Quote;
  books?: BookRecommendation[];
  habits?: DailyHabit[];
  reflectionPrompt?: string;
  mindsetMantra?: string;
  onHabitToggled?: (title: string, completed: boolean) => void;
  darkMode?: boolean;
}

const PHILOSOPHY_INFO: Record<PhilosophyType, { subtitle: string; desc: string }> = {
  Stoicism: {
    subtitle: 'Marcus Aurelius, Epictetus, Seneca',
    desc: 'Focus on what is within your power, accept external fate, and build virtue.'
  },
  Jungian: {
    subtitle: 'Carl Jung, Marie-Louise von Franz',
    desc: 'Integrate shadow aspects, examine dream symbols, and pursue individuation.'
  },
  Existentialism: {
    subtitle: 'Frankl, Sartre, Camus, Nietzsche',
    desc: 'Accept radical freedom, take personal responsibility, and forge authentic meaning.'
  },
  Taoism: {
    subtitle: 'Lao Tzu, Chuang Tzu',
    desc: 'Practice Wu Wei (effortless action), simplicity, and flow with nature.'
  },
  Buddhism: {
    subtitle: 'The Buddha, Thich Nhat Hanh',
    desc: 'Cultivate mindful awareness, recognize impermanence, and transcend suffering.'
  },
  REBT: {
    subtitle: 'Albert Ellis',
    desc: 'Identify irrational beliefs, challenge cognitive distortions, and cultivate emotional resilience.'
  }
};

export const Sidebar: React.FC<SidebarProps> = ({
  selectedPhilosophy,
  onPhilosophyChange,
  activeConceptName,
  activeCoreInsight,
  activeQuote,
  books = [],
  habits = [],
  reflectionPrompt,
  mindsetMantra,
  onHabitToggled,
  darkMode = false
}) => {
  const currentMeta = PHILOSOPHY_INFO[selectedPhilosophy] || PHILOSOPHY_INFO.Stoicism;

  return (
    <aside className="w-full lg:w-72 flex-shrink-0 space-y-5">
      
      {/* Philosophy Focus Card */}
      <div className={`rounded-2xl border p-5 shadow-xs transition-colors ${
        darkMode ? 'bg-[#1E2026] border-gray-800' : 'bg-white border-gray-100'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <span className={`text-[10px] font-bold uppercase tracking-wider text-[#5B7B7A] px-2.5 py-0.5 rounded-md border ${
            darkMode ? 'bg-brand-900/30 border-brand-800 text-brand-300' : 'bg-brand-50 border-brand-100'
          }`}>
            Active Philosophy
          </span>
          <Compass className="h-4 w-4 text-[#5B7B7A]" />
        </div>
        
        <select
          value={selectedPhilosophy}
          onChange={(e) => onPhilosophyChange(e.target.value as PhilosophyType)}
          className={`w-full mt-1 border font-medium text-xs rounded-lg p-2.5 focus:outline-none focus:border-[#5B7B7A] transition-colors cursor-pointer ${
            darkMode ? 'bg-[#121417] border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-800'
          }`}
        >
          {Object.keys(PHILOSOPHY_INFO).map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        <p className={`text-[11px] mt-2.5 italic ${darkMode ? 'text-gray-400' : 'text-gray-400'}`}>
          {currentMeta.subtitle}
        </p>
        <p className={`text-xs mt-1 leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {currentMeta.desc}
        </p>
      </div>

      {/* Active Concept Insight */}
      {activeConceptName && (
        <div className={`rounded-2xl border p-5 shadow-xs transition-colors ${
          darkMode ? 'bg-[#1E2026] border-gray-800' : 'bg-white border-gray-100'
        }`}>
          <div className={`flex items-center gap-1.5 text-xs font-semibold mb-1.5 ${
            darkMode ? 'text-gray-200' : 'text-gray-800'
          }`}>
            <Sparkles className="h-3.5 w-3.5 text-[#5B7B7A]" />
            <span>{activeConceptName}</span>
          </div>
          {activeCoreInsight && (
            <p className={`text-xs leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {activeCoreInsight}
            </p>
          )}

          {activeQuote && activeQuote.text && (
            <div className={`mt-3 p-3 rounded-xl border text-xs italic ${
              darkMode ? 'bg-[#121417] border-gray-800 text-gray-200' : 'bg-gray-50 border-gray-100 text-gray-800'
            }`}>
              <QuoteIcon className="h-3 w-3 text-[#5B7B7A] mb-1" />
              <p className="font-serif">"{activeQuote.text}"</p>
              <div className={`text-[10px] not-italic font-medium mt-1.5 text-right ${
                darkMode ? 'text-gray-400' : 'text-gray-400'
              }`}>
                — {activeQuote.author} {activeQuote.source ? `(${activeQuote.source})` : ''}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Habit Tracker (Planner Agent) */}
      <HabitTracker 
        habits={habits} 
        philosophy={selectedPhilosophy} 
        onHabitToggled={onHabitToggled}
        darkMode={darkMode}
      />

      {/* Book Recommendations (Research Agent) */}
      <BookRecommendations 
        books={books} 
        philosophy={selectedPhilosophy} 
        darkMode={darkMode}
      />

      {/* Evening Reflection Journal Prompt */}
      {reflectionPrompt && (
        <div className={`rounded-2xl border p-5 shadow-xs ${
          darkMode ? 'bg-[#1E2026] border-gray-800 text-gray-200' : 'bg-white border-gray-100 text-gray-800'
        }`}>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#5B7B7A] mb-2">
            <PenTool className="h-3.5 w-3.5" />
            <span>Evening Reflection</span>
          </div>
          <p className={`text-xs leading-relaxed italic font-serif ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            "{reflectionPrompt}"
          </p>
          {mindsetMantra && (
            <div className={`mt-3 text-[11px] pt-2.5 border-t ${
              darkMode ? 'border-gray-800 text-gray-400' : 'border-gray-100 text-gray-500'
            }`}>
              <strong className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Mantra:</strong> {mindsetMantra}
            </div>
          )}
        </div>
      )}

    </aside>
  );
};
