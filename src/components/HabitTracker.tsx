import React, { useState } from 'react';
import { DailyHabit } from '../types';
import { CheckCircle2, Circle, Clock, Tag, Sparkles } from 'lucide-react';

interface HabitTrackerProps {
  habits?: DailyHabit[];
  philosophy: string;
  onHabitToggled?: (habitTitle: string, isCompleted: boolean) => void;
  darkMode?: boolean;
}

export const HabitTracker: React.FC<HabitTrackerProps> = ({ habits = [], philosophy, onHabitToggled, darkMode = false }) => {
  const [completedIds, setCompletedIds] = useState<Record<string, boolean>>({});

  const safeHabits = Array.isArray(habits) ? habits : [];

  const toggleHabit = (h: DailyHabit) => {
    const nextState = !completedIds[h.id];
    setCompletedIds(prev => ({ ...prev, [h.id]: nextState }));

    if (nextState && onHabitToggled) {
      onHabitToggled(h.title, true);
    }
  };

  const completedCount = Object.values(completedIds).filter(Boolean).length;
  const totalCount = safeHabits.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  if (safeHabits.length === 0) {
    return (
      <div className={`rounded-2xl border p-5 text-center text-xs shadow-xs ${
        darkMode ? 'bg-[#1E2026] border-gray-800 text-gray-400' : 'bg-white border-gray-100 text-gray-400'
      }`}>
        <Sparkles className="h-4 w-4 mx-auto mb-1 text-[#5B7B7A]" />
        No active daily habits yet. Ask MindMentor for habit practices!
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border p-5 shadow-xs transition-colors ${
      darkMode ? 'bg-[#1E2026] border-gray-800' : 'bg-white border-gray-100'
    }`}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className={`text-xs font-bold flex items-center gap-1.5 uppercase tracking-wider ${
            darkMode ? 'text-gray-200' : 'text-gray-800'
          }`}>
            <span>Daily Practice Habits</span>
          </h3>
          <p className="text-[11px] text-gray-400 mt-0.5">{philosophy} routines</p>
        </div>
        <div className="text-right">
          <span className="text-xs font-semibold text-[#5B7B7A]">{completedCount}/{totalCount} Done</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className={`w-full rounded-full h-1.5 mb-3 overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
        <div 
          className="bg-[#5B7B7A] h-1.5 rounded-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="space-y-2">
        {safeHabits.map((h) => {
          const isDone = !!completedIds[h.id];
          return (
            <div
              key={h.id}
              onClick={() => toggleHabit(h)}
              className={`group flex items-start gap-2.5 p-3 rounded-xl border transition-all cursor-pointer ${
                isDone
                  ? darkMode ? 'bg-brand-900/20 border-brand-800 text-gray-500' : 'bg-brand-50/50 border-brand-100 text-gray-500'
                  : darkMode ? 'bg-[#121417] border-gray-800 hover:border-gray-700' : 'bg-gray-50/60 border-gray-100 hover:bg-gray-100/60 hover:border-gray-200'
              }`}
            >
              <button className="mt-0.5 text-[#5B7B7A] shrink-0">
                {isDone ? (
                  <CheckCircle2 className="h-4 w-4 text-[#5B7B7A]" />
                ) : (
                  <Circle className={`h-4 w-4 group-hover:text-[#5B7B7A] ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
                )}
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h4 className={`text-xs font-medium truncate ${
                    isDone ? 'line-through text-gray-500' : darkMode ? 'text-gray-200' : 'text-gray-800'
                  }`}>
                    {h.title}
                  </h4>
                  <div className="flex items-center gap-1 shrink-0 text-[10px] text-gray-400">
                    <Clock className="h-3 w-3" />
                    <span>{h.time_estimate}</span>
                  </div>
                </div>
                <p className={`text-[11px] mt-0.5 leading-normal ${
                  isDone ? 'text-gray-500' : darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {h.description}
                </p>
                <div className="mt-1.5 flex items-center gap-1">
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium uppercase tracking-wider ${
                    darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {h.category || 'Mindset'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
