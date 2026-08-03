import React, { useState, useEffect } from 'react';
import { PhilosophyType, DailyHabit } from '../types';
import { 
  CheckCircle2, 
  Plus, 
  Compass, 
  Flame, 
  Clock, 
  Filter, 
  Sparkles, 
  Calendar, 
  Trash2, 
  RotateCcw,
  Check,
  Brain,
  Zap,
  Target
} from 'lucide-react';

interface HabitsPageProps {
  selectedPhilosophy: PhilosophyType;
  darkMode: boolean;
  onNavigateToChat?: () => void;
}

const DEFAULT_PHILOSOPHY_HABITS: Record<PhilosophyType, DailyHabit[]> = {
  Stoicism: [
    {
      id: 'st-1',
      title: 'Morning Control Audit (Dichotomy of Control)',
      description: 'List 3 things worrying you today. Separate them into Column A (Within My Control) and Column B (Outside My Control).',
      time_estimate: '3 mins',
      category: 'Mindset Practice',
      philosophy: 'Stoicism',
      completed: false
    },
    {
      id: 'st-2',
      title: 'Pre-Mortem Mental Preparation',
      description: 'Anticipate 1 potential obstacle today and visualize remaining calm, rational, and virtuous if it occurs.',
      time_estimate: '2 mins',
      category: 'Action Routine',
      philosophy: 'Stoicism',
      completed: false
    },
    {
      id: 'st-3',
      title: 'Evening Virtuous Reflection',
      description: 'Ask: Where did I respond with wisdom? Where did I let external emotion sway my judgment?',
      time_estimate: '5 mins',
      category: 'Reflective Journaling',
      philosophy: 'Stoicism',
      completed: false
    }
  ],
  Jungian: [
    {
      id: 'jung-1',
      title: 'Shadow Integration Check-in',
      description: 'When feeling irritated by someone else today, ask: "What disowned trait in myself might this represent?"',
      time_estimate: '4 mins',
      category: 'Mindset Practice',
      philosophy: 'Jungian',
      completed: false
    },
    {
      id: 'jung-2',
      title: 'Dream & Archetype Journaling',
      description: 'Record any vivid imagery, symbols, or recurring feelings from your dreams or morning daydreaming.',
      time_estimate: '5 mins',
      category: 'Reflective Journaling',
      philosophy: 'Jungian',
      completed: false
    }
  ],
  Existentialism: [
    {
      id: 'ex-1',
      title: 'Radical Freedom & Choice Audit',
      description: 'Reframe 1 "I have to do X" task into "I choose to do X because I value Y."',
      time_estimate: '2 mins',
      category: 'Mindset Practice',
      philosophy: 'Existentialism',
      completed: false
    },
    {
      id: 'ex-2',
      title: 'Meaning Creation Action',
      description: 'Perform 1 deliberate, authentic choice today purely aligned with your intrinsic values.',
      time_estimate: '10 mins',
      category: 'Action Routine',
      philosophy: 'Existentialism',
      completed: false
    }
  ],
  Taoism: [
    {
      id: 'tao-1',
      title: 'Wu Wei Effortless Flow Pause',
      description: 'In the middle of work pressure, pause for 60 seconds and release physical tension in shoulders and jaw.',
      time_estimate: '1 min',
      category: 'Grounding Routine',
      philosophy: 'Taoism',
      completed: false
    },
    {
      id: 'tao-2',
      title: 'Mindful Unstructured Walking',
      description: 'Take a 10-minute walk observing nature without headphones, goals, or phone distractions.',
      time_estimate: '10 mins',
      category: 'Action Routine',
      philosophy: 'Taoism',
      completed: false
    }
  ],
  Buddhism: [
    {
      id: 'bud-1',
      title: 'Box Breathing & Impermanence Meditative Focus',
      description: 'Practice 4-4-4-4 Box Breathing while silently observing that emotions rise, peak, and dissolve like waves.',
      time_estimate: '5 mins',
      category: 'Grounding Routine',
      philosophy: 'Buddhism',
      completed: false
    },
    {
      id: 'bud-2',
      title: 'Loving-Kindness (Metta) Pause',
      description: 'Offer a silent wish of peace and well-being to someone you find challenging or distant.',
      time_estimate: '3 mins',
      category: 'Mindset Practice',
      philosophy: 'Buddhism',
      completed: false
    }
  ],
  REBT: [
    {
      id: 'rebt-1',
      title: 'ABCDE Irrational Belief Disputing',
      description: 'Identify 1 mandatory "must/should" thought and replace it with a rational preference.',
      time_estimate: '5 mins',
      category: 'Mindset Practice',
      philosophy: 'REBT',
      completed: false
    },
    {
      id: 'rebt-2',
      title: 'Cognitive Re-framing Practice',
      description: 'Write down a frustration and dispute the belief that it is an intolerable tragedy.',
      time_estimate: '4 mins',
      category: 'Reflective Journaling',
      philosophy: 'REBT',
      completed: false
    }
  ]
};

export const HabitsPage: React.FC<HabitsPageProps> = ({
  selectedPhilosophy,
  darkMode,
  onNavigateToChat
}) => {
  const [activePhilosophyFilter, setActivePhilosophyFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // Custom habit input state
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newTime, setNewTime] = useState('5 mins');
  const [newCategory, setNewCategory] = useState('Mindset Practice');

  const [habits, setHabits] = useState<DailyHabit[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('mindmentor_habits');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {}
    }
    // Default fallback combining all philosophy habits
    return Object.values(DEFAULT_PHILOSOPHY_HABITS).flat();
  });

  const [streak, setStreak] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      return Number(localStorage.getItem('mindmentor_habit_streak') || 3);
    }
    return 3;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('mindmentor_habits', JSON.stringify(habits));
    }
  }, [habits]);

  const toggleHabit = (id: string) => {
    setHabits(prev => prev.map(h => {
      if (h.id === id) {
        return { ...h, completed: !h.completed };
      }
      return h;
    }));
  };

  const deleteHabit = (id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
  };

  const handleAddCustomHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newHabit: DailyHabit = {
      id: 'custom-' + Date.now(),
      title: newTitle.trim(),
      description: newDesc.trim() || 'Custom daily practice habit.',
      time_estimate: newTime,
      category: newCategory,
      philosophy: selectedPhilosophy,
      completed: false
    };

    setHabits(prev => [newHabit, ...prev]);
    setNewTitle('');
    setNewDesc('');
    setShowAddModal(false);
  };

  const resetAllHabits = () => {
    setHabits(prev => prev.map(h => ({ ...h, completed: false })));
  };

  // Filter logic
  const filteredHabits = habits.filter(h => {
    const matchesPhil = activePhilosophyFilter === 'All' || h.philosophy === activePhilosophyFilter;
    const matchesCat = categoryFilter === 'All' 
      ? true 
      : categoryFilter === 'Completed' 
        ? h.completed 
        : categoryFilter === 'Incomplete'
          ? !h.completed
          : h.category === categoryFilter;
    return matchesPhil && matchesCat;
  });

  const completedCount = habits.filter(h => h.completed).length;
  const progressPercent = habits.length > 0 ? Math.round((completedCount / habits.length) * 100) : 0;

  return (
    <div className={`flex-1 py-8 px-4 sm:px-6 lg:px-8 transition-colors ${
      darkMode ? 'bg-[#121417] text-[#F0F2F5]' : 'bg-[#F9FAFB] text-[#1A1A1A]'
    }`}>
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b pb-6 border-gray-200 dark:border-gray-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3 bg-brand-50 dark:bg-brand-900/30 text-[#5B7B7A] dark:text-brand-300">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Daily Mindset & Action Tracker</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Practice Habits Studio
            </h1>
            <p className={`text-sm mt-1.5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Turn wisdom into consistent daily micro-routines, mindset practices, and action habits.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Streak Badge */}
            <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border ${
              darkMode ? 'bg-[#1E2026] border-gray-800 text-amber-400' : 'bg-white border-gray-200 text-amber-600'
            } shadow-xs`}>
              <Flame className="h-5 w-5 fill-amber-500 text-amber-500 animate-pulse" />
              <div>
                <div className="text-xs font-bold">{streak} Day Streak</div>
                <div className="text-[10px] text-gray-400">Consistency Score</div>
              </div>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#5B7B7A] hover:bg-[#4A6463] text-white text-xs font-semibold transition-all shadow-xs cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Add Custom Habit</span>
            </button>
          </div>
        </div>

        {/* Progress & Overview Bar */}
        <div className={`p-6 rounded-2xl border shadow-xs ${
          darkMode ? 'bg-[#1E2026] border-gray-800' : 'bg-white border-gray-200'
        }`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#5B7B7A]">
                Daily Practice Progress
              </span>
              <h2 className="text-lg font-bold mt-0.5">
                {completedCount} of {habits.length} Practices Completed Today ({progressPercent}%)
              </h2>
            </div>
            <button
              onClick={resetAllHabits}
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                darkMode ? 'bg-[#121417] text-gray-300 border-gray-700 hover:bg-gray-800' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
              }`}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset for New Day</span>
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-100 dark:bg-gray-800 h-3 rounded-full overflow-hidden p-0.5">
            <div 
              className="bg-gradient-to-r from-[#5B7B7A] to-[#4A6463] h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          
          {/* Philosophy Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto scrollbar-none py-1">
            <span className="text-xs font-semibold text-gray-400 mr-1 flex items-center gap-1 shrink-0">
              <Filter className="h-3 w-3" /> Lens:
            </span>
            {['All', 'Stoicism', 'Jungian', 'Existentialism', 'Taoism', 'Buddhism', 'REBT'].map((p) => (
              <button
                key={p}
                onClick={() => setActivePhilosophyFilter(p)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 cursor-pointer ${
                  activePhilosophyFilter === p
                    ? 'bg-[#5B7B7A] text-white shadow-xs font-semibold'
                    : darkMode
                      ? 'bg-[#1E2026] text-gray-400 hover:text-white border border-gray-800'
                      : 'bg-white text-gray-600 hover:text-gray-900 border border-gray-200'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto scrollbar-none">
            {['All', 'Incomplete', 'Completed', 'Mindset Practice', 'Action Routine', 'Reflective Journaling', 'Grounding Routine'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${
                  categoryFilter === cat
                    ? 'bg-gray-800 text-white dark:bg-gray-100 dark:text-gray-900 font-semibold'
                    : darkMode
                      ? 'bg-[#121417] text-gray-400 hover:text-white'
                      : 'bg-gray-100 text-gray-600 hover:text-gray-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>

        {/* Habit List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredHabits.length === 0 ? (
            <div className={`col-span-2 p-12 text-center rounded-2xl border ${
              darkMode ? 'bg-[#1E2026] border-gray-800 text-gray-400' : 'bg-white border-gray-200 text-gray-500'
            }`}>
              <CheckCircle2 className="h-10 w-10 mx-auto text-[#5B7B7A] mb-3 opacity-60" />
              <p className="font-semibold text-sm">No habits found in this view.</p>
              <p className="text-xs mt-1">Try resetting your filters or add a new custom habit above.</p>
            </div>
          ) : (
            filteredHabits.map((habit) => (
              <div
                key={habit.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                  habit.completed
                    ? darkMode
                      ? 'bg-[#1A2E2C]/30 border-[#5B7B7A]/40 text-gray-300'
                      : 'bg-emerald-50/40 border-emerald-200/80 text-gray-800'
                    : darkMode
                      ? 'bg-[#1E2026] border-gray-800 hover:border-gray-700'
                      : 'bg-white border-gray-200 hover:border-gray-300 shadow-2xs'
                }`}
              >
                <div>
                  {/* Card Header Tag */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md ${
                        darkMode ? 'bg-gray-800 text-brand-300' : 'bg-brand-50 text-[#5B7B7A]'
                      }`}>
                        {habit.category}
                      </span>
                      {habit.philosophy && (
                        <span className="text-[10px] font-semibold text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                          {habit.philosophy}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-gray-400 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {habit.time_estimate}
                    </span>
                  </div>

                  {/* Habit Title */}
                  <h3 className={`font-bold text-sm ${
                    habit.completed ? 'line-through opacity-70' : darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {habit.title}
                  </h3>

                  {/* Habit Description */}
                  <p className={`text-xs mt-1.5 leading-relaxed ${
                    habit.completed ? 'opacity-60' : darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {habit.description}
                  </p>
                </div>

                {/* Card Actions Footer */}
                <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                  <button
                    onClick={() => toggleHabit(habit.id)}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      habit.completed
                        ? 'bg-emerald-600 text-white shadow-2xs'
                        : darkMode
                          ? 'bg-gray-800 text-gray-200 hover:bg-[#5B7B7A] hover:text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-[#5B7B7A] hover:text-white'
                    }`}
                  >
                    {habit.completed ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        <span>Completed</span>
                      </>
                    ) : (
                      <>
                        <div className="w-3.5 h-3.5 rounded-full border border-current" />
                        <span>Mark Done</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => deleteHabit(habit.id)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                    title="Delete Habit"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

              </div>
            ))
          )}
        </div>

      </div>

      {/* Add Custom Habit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`max-w-md w-full rounded-2xl p-6 shadow-xl border ${
            darkMode ? 'bg-[#1E2026] border-gray-800 text-white' : 'bg-white border-gray-100 text-gray-900'
          }`}>
            <h3 className="text-lg font-bold mb-1">Create Custom Practice Habit</h3>
            <p className={`text-xs mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Define a specific daily micro-habit to track in your personal growth routine.
            </p>

            <form onSubmit={handleAddCustomHabit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Habit Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. 5-Min Morning Control List"
                  className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:border-[#5B7B7A] ${
                    darkMode ? 'bg-[#121417] border-gray-700 text-white' : 'bg-gray-50 border-gray-200'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Actionable Description</label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Explain the specific steps to execute this habit..."
                  className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:border-[#5B7B7A] ${
                    darkMode ? 'bg-[#121417] border-gray-700 text-white' : 'bg-gray-50 border-gray-200'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Time Estimate</label>
                  <select
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none ${
                      darkMode ? 'bg-[#121417] border-gray-700 text-white' : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <option value="1 min">1 min</option>
                    <option value="3 mins">3 mins</option>
                    <option value="5 mins">5 mins</option>
                    <option value="10 mins">10 mins</option>
                    <option value="15 mins">15 mins</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none ${
                      darkMode ? 'bg-[#121417] border-gray-700 text-white' : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <option value="Mindset Practice">Mindset Practice</option>
                    <option value="Action Routine">Action Routine</option>
                    <option value="Reflective Journaling">Reflective Journaling</option>
                    <option value="Grounding Routine">Grounding Routine</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#5B7B7A] hover:bg-[#4A6463] text-white rounded-xl text-xs font-semibold transition-colors shadow-xs"
                >
                  Save Habit
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
