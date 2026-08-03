import React, { useState, useEffect } from 'react';
import { PhilosophyType, RecommendationItem, DailyHabit } from '../types';
import { 
  Sparkles, 
  BookOpen, 
  HeartPulse, 
  Activity, 
  Search, 
  Plus, 
  Check, 
  ExternalLink, 
  Bookmark, 
  BrainCircuit, 
  Compass, 
  MessageSquare,
  ArrowRight
} from 'lucide-react';

interface RecommendationsPageProps {
  selectedPhilosophy: PhilosophyType;
  darkMode: boolean;
  onNavigateToChat?: () => void;
  onNavigateToHabits?: () => void;
}

const INITIAL_RECOMMENDATIONS: RecommendationItem[] = [
  // Mental Health Practices
  {
    id: 'mh-1',
    type: 'mental_health',
    title: 'Cognitive Reframing (ABCDE Model)',
    subtitle: '5-Minute Mental Resilience Exercise',
    philosophy: 'REBT',
    description: 'When experiencing irrational anxiety or anger, decompose the event into Activating Event (A), Belief (B), and Emotional Consequence (C). Then actively Dispute (D) the irrational belief to achieve Effective new outlook (E).',
    keyBenefit: 'Reduces emotional reactivity and replaces catastrophic thinking with rational preferences.',
    actionableSteps: [
      'Write down the event causing distress without emotional exaggeration.',
      'Identify the mandatory "must" or "should" statement behind your reaction.',
      'Ask: "Is this thought 100% logically true or helpful?"',
      'Replace it with a flexible preference: "I would prefer X, but I can handle Y."'
    ],
    tags: ['Anxiety Reduction', 'Cognitive Reframing', 'Rational Thinking']
  },
  {
    id: 'mh-2',
    type: 'mental_health',
    title: '4-4-4-4 Box Breathing & Impermanence Meditation',
    subtitle: 'Grounding Stress Relief Exercise',
    philosophy: 'Buddhism',
    description: 'A physiologically proven technique to regulate the nervous system while observing emotional impermanence (Anicca).',
    keyBenefit: 'Slowing breathing activates parasympathetic recovery, reducing acute bodily anxiety.',
    actionableSteps: [
      'Inhale deeply through the nose for 4 seconds.',
      'Hold air gently in lungs for 4 seconds.',
      'Exhale slowly through mouth for 4 seconds.',
      'Hold empty lungs for 4 seconds.',
      'Repeat 4 cycles while observing that feelings rise, peak, and fade.'
    ],
    tags: ['Nervous System Reset', 'Mindfulness', 'Stress Reduction']
  },
  {
    id: 'mh-3',
    type: 'mental_health',
    title: 'Shadow Dialogue & Projection Audit',
    subtitle: 'Jungian Unconscious Integration',
    philosophy: 'Jungian',
    description: 'Examine emotional triggers caused by others. Projections often highlight unintegrated parts of your own shadow self.',
    keyBenefit: 'Fosters deep self-acceptance, reduces interpersonal resentment, and builds emotional maturity.',
    actionableSteps: [
      'Identify a person whose traits irritate you intenseley.',
      'Write down 3 specific qualities that bother you most.',
      'Reflect honestly: "In what subtle way do I suppress or fear these traits in myself?"',
      'Acknowledge the trait compassionately to integrate it.'
    ],
    tags: ['Self-Awareness', 'Shadow Integration', 'Emotional Growth']
  },
  {
    id: 'mh-4',
    type: 'mental_health',
    title: 'The Dichotomy of Control Audit',
    subtitle: 'Stoic Anxiety Dissolution',
    philosophy: 'Stoicism',
    description: 'Systematically divide any overwhelming life scenario into elements strictly within your choices vs external outcomes.',
    keyBenefit: 'Eliminates helplessness by redirecting 100% of energy onto personal agency.',
    actionableSteps: [
      'Draw two columns: "My Agency" vs "Outside Control".',
      'Place opinion, effort, and values in Column A.',
      'Place other people, results, and past events in Column B.',
      'Formally release attachment to Column B.'
    ],
    tags: ['Stoic Discipline', 'Anxiety Reset', 'Focus']
  },

  // Daily Activities
  {
    id: 'act-1',
    type: 'daily_activity',
    title: 'Wu Wei Mindful Unstructured Walking',
    subtitle: 'Effortless Action Routine',
    philosophy: 'Taoism',
    description: 'Take a 15-minute walk without headphones, devices, or structured destination. Practice effortless observation of natural surroundings.',
    keyBenefit: 'Restores cognitive attention, alleviates digital sensory fatigue, and fosters calm flow state.',
    actionableSteps: [
      'Leave phone or smartwatch behind or set to Do Not Disturb.',
      'Walk at a natural, unhurried pace.',
      'Notice wind, sky, trees, and physical footing without judging or analyzing.'
    ],
    tags: ['Nature Immersion', 'Wu Wei', 'Digital Detox']
  },
  {
    id: 'act-2',
    type: 'daily_activity',
    title: 'Voluntary Discomfort Practice',
    subtitle: 'Building Psychological Hardiness',
    philosophy: 'Stoicism',
    description: 'Introduce a mild voluntary hardship (e.g. 30-second cold shower ending, taking stairs, skipping coffee) to condition resilience.',
    keyBenefit: 'Proves to your subconscious that you can comfortably endure inconvenience without fear.',
    actionableSteps: [
      'Choose a small voluntary discomfort during your routine.',
      'Engage in it willingly without complaining.',
      'Silently repeat Seneca’s reminder: "Is this the condition that I feared?"'
    ],
    tags: ['Mental Toughness', 'Stoic Hardiness', 'Comfort Zone']
  },
  {
    id: 'act-3',
    type: 'daily_activity',
    title: 'Evening Values Alignment Journaling',
    subtitle: 'Existential Meaning Check-in',
    philosophy: 'Existentialism',
    description: 'End your day with a 3-question audit to ensure your daily choices reflect your chosen authentic values.',
    keyBenefit: 'Ensures life direction is actively forged rather than mindlessly dictated by routine.',
    actionableSteps: [
      'Name your 3 highest core values (e.g., Integrity, Curiosity, Kindness).',
      'Write down 1 action today that honored each value.',
      'Note 1 adjustment for tomorrow.'
    ],
    tags: ['Authenticity', 'Meaning Creation', 'Journaling']
  },

  // Books
  {
    id: 'book-1',
    type: 'book',
    title: 'Meditations',
    subtitle: 'by Marcus Aurelius',
    philosophy: 'Stoicism',
    description: 'The personal private journals of Roman Emperor Marcus Aurelius detailing daily self-reminders on resilience, duty, and peace of mind.',
    keyBenefit: 'Timeless blueprint for maintaining inner composure during high-stakes responsibilities.',
    tags: ['Stoicism', 'Primary Text', 'Resilience']
  },
  {
    id: 'book-2',
    type: 'book',
    title: 'Man’s Search for Meaning',
    subtitle: 'by Viktor Frankl',
    philosophy: 'Existentialism',
    description: 'Psychiatrist Viktor Frankl describes his concentration camp survival and introduces Logotherapy—finding purpose through adversity.',
    keyBenefit: 'Provides profound perspective on how human freedom lies in choosing one’s attitude in any circumstance.',
    tags: ['Existentialism', 'Psychology', 'Meaning']
  },
  {
    id: 'book-3',
    type: 'book',
    title: 'Tao Te Ching',
    subtitle: 'by Lao Tzu',
    philosophy: 'Taoism',
    description: 'Foundational Chinese classic on living in harmony with nature through non-striving, humility, and effortless action (Wu Wei).',
    keyBenefit: 'Calms overthinking and teaches gentle strength in friction-filled environments.',
    tags: ['Taoism', 'Wisdom', 'Flow']
  },
  {
    id: 'book-4',
    type: 'book',
    title: 'Memories, Dreams, Reflections',
    subtitle: 'by Carl Gustav Jung',
    philosophy: 'Jungian',
    description: 'Autobiographical work exploring Jung’s internal journey into dreams, shadow integration, and the collective unconscious.',
    keyBenefit: 'Deepens self-understanding of subconscious drivers and personal symbolism.',
    tags: ['Jungian', 'Psychology', 'Self-Discovery']
  }
];

export const RecommendationsPage: React.FC<RecommendationsPageProps> = ({
  selectedPhilosophy,
  darkMode,
  onNavigateToChat,
  onNavigateToHabits
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'mental_health' | 'daily_activity' | 'book'>('all');
  const [selectedPhilosophyFilter, setSelectedPhilosophyFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [addedHabits, setAddedHabits] = useState<Set<string>>(new Set());

  // Check recent chat topic from localStorage if available
  const [recentTopic, setRecentTopic] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const lastTopic = localStorage.getItem('mindmentor_last_chat_topic');
        if (lastTopic) setRecentTopic(lastTopic);
      } catch (e) {}
    }
  }, []);

  const handleAddToHabits = (item: RecommendationItem) => {
    if (typeof window !== 'undefined') {
      try {
        const existingHabitsRaw = localStorage.getItem('mindmentor_habits');
        const existingHabits: DailyHabit[] = existingHabitsRaw ? JSON.parse(existingHabitsRaw) : [];
        
        const newHabit: DailyHabit = {
          id: 'rec-habit-' + Date.now(),
          title: item.title,
          description: item.description,
          time_estimate: item.type === 'mental_health' ? '5 mins' : '10 mins',
          category: item.type === 'mental_health' ? 'Mindset Practice' : 'Action Routine',
          philosophy: item.philosophy,
          completed: false
        };

        const updated = [newHabit, ...existingHabits];
        localStorage.setItem('mindmentor_habits', JSON.stringify(updated));
        
        setAddedHabits(prev => new Set(prev).add(item.id));
      } catch (e) {}
    }
  };

  const filteredItems = INITIAL_RECOMMENDATIONS.filter(item => {
    const matchesTab = activeTab === 'all' || item.type === activeTab;
    const matchesPhil = selectedPhilosophyFilter === 'All' || item.philosophy === selectedPhilosophyFilter;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.subtitle && item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesPhil && matchesSearch;
  });

  return (
    <div className={`flex-1 py-8 px-4 sm:px-6 lg:px-8 transition-colors ${
      darkMode ? 'bg-[#121417] text-[#F0F2F5]' : 'bg-[#F9FAFB] text-[#1A1A1A]'
    }`}>
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="border-b pb-6 border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3 bg-brand-50 dark:bg-brand-900/30 text-[#5B7B7A] dark:text-brand-300">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Personalized Wisdom & Action Recommendations</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Recommendations Studio
              </h1>
              <p className={`text-sm mt-1.5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Tailored books, mental health resilience practices, and daily physical routines derived from your chat topics.
              </p>
            </div>

            {/* Recent Chat Topic Banner */}
            {recentTopic && (
              <div className={`p-4 rounded-2xl border text-xs flex items-center gap-3 shrink-0 ${
                darkMode ? 'bg-[#1E2026] border-gray-800' : 'bg-white border-gray-200 shadow-xs'
              }`}>
                <div className="p-2 rounded-xl bg-[#5B7B7A]/10 text-[#5B7B7A]">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-gray-400">Recent Chat Focus</div>
                  <div className="font-semibold text-gray-800 dark:text-gray-200">{recentTopic}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Top Category Tabs Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-4">
          
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto scrollbar-none">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-[#5B7B7A] text-white shadow-xs'
                  : darkMode ? 'bg-[#1E2026] text-gray-400 hover:text-white' : 'bg-white text-gray-600 hover:text-gray-900 border border-gray-200'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>All Recommendations</span>
            </button>

            <button
              onClick={() => setActiveTab('mental_health')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'mental_health'
                  ? 'bg-[#5B7B7A] text-white shadow-xs'
                  : darkMode ? 'bg-[#1E2026] text-gray-400 hover:text-white' : 'bg-white text-gray-600 hover:text-gray-900 border border-gray-200'
              }`}
            >
              <HeartPulse className="h-3.5 w-3.5" />
              <span>Mental Health Practices</span>
            </button>

            <button
              onClick={() => setActiveTab('daily_activity')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'daily_activity'
                  ? 'bg-[#5B7B7A] text-white shadow-xs'
                  : darkMode ? 'bg-[#1E2026] text-gray-400 hover:text-white' : 'bg-white text-gray-600 hover:text-gray-900 border border-gray-200'
              }`}
            >
              <Activity className="h-3.5 w-3.5" />
              <span>Daily Activities</span>
            </button>

            <button
              onClick={() => setActiveTab('book')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'book'
                  ? 'bg-[#5B7B7A] text-white shadow-xs'
                  : darkMode ? 'bg-[#1E2026] text-gray-400 hover:text-white' : 'bg-white text-gray-600 hover:text-gray-900 border border-gray-200'
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>Literature & Books</span>
            </button>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search recommendations..."
              className={`w-full pl-8 pr-4 py-2 rounded-xl text-xs border focus:outline-none focus:border-[#5B7B7A] ${
                darkMode ? 'bg-[#1E2026] border-gray-800 text-white placeholder-gray-500' : 'bg-white border-gray-200 text-gray-900'
              }`}
            />
          </div>

        </div>

        {/* Philosophy Lens Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
          <span className="text-xs font-semibold text-gray-400 mr-2 shrink-0">Filter Philosophy:</span>
          {['All', 'Stoicism', 'Jungian', 'Existentialism', 'Taoism', 'Buddhism', 'REBT'].map((p) => (
            <button
              key={p}
              onClick={() => setSelectedPhilosophyFilter(p)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all shrink-0 cursor-pointer ${
                selectedPhilosophyFilter === p
                  ? 'bg-gray-800 text-white dark:bg-gray-100 dark:text-gray-900 font-semibold'
                  : darkMode ? 'bg-[#1E2026] text-gray-400' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Recommendations Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredItems.map((item) => {
            const isBook = item.type === 'book';
            const isAdded = addedHabits.has(item.id);

            return (
              <div
                key={item.id}
                className={`p-6 rounded-2xl border transition-all flex flex-col justify-between shadow-xs hover:shadow-md ${
                  darkMode ? 'bg-[#1E2026] border-gray-800' : 'bg-white border-gray-200'
                }`}
              >
                <div>
                  {/* Category Header */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`p-2 rounded-xl text-xs font-bold ${
                        item.type === 'mental_health'
                          ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                          : item.type === 'daily_activity'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                      }`}>
                        {item.type === 'mental_health' ? (
                          <HeartPulse className="h-4 w-4" />
                        ) : item.type === 'daily_activity' ? (
                          <Activity className="h-4 w-4" />
                        ) : (
                          <BookOpen className="h-4 w-4" />
                        )}
                      </span>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                          {item.type === 'mental_health' 
                            ? 'Mental Health Practice' 
                            : item.type === 'daily_activity'
                              ? 'Daily Activity Routine'
                              : 'Recommended Literature'}
                        </span>
                        <h3 className="font-bold text-base leading-tight text-gray-900 dark:text-white">
                          {item.title}
                        </h3>
                        {item.subtitle && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">{item.subtitle}</p>
                        )}
                      </div>
                    </div>

                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-brand-50 dark:bg-brand-900/30 text-[#5B7B7A] dark:text-brand-300 border border-brand-100 dark:border-brand-800 shrink-0">
                      {item.philosophy}
                    </span>
                  </div>

                  {/* Description */}
                  <p className={`text-xs leading-relaxed mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {item.description}
                  </p>

                  {/* Actionable Steps list if available */}
                  {item.actionableSteps && (
                    <div className={`p-3.5 rounded-xl border mb-4 ${
                      darkMode ? 'bg-[#121417] border-gray-800' : 'bg-gray-50 border-gray-100'
                    }`}>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#5B7B7A] mb-2">
                        How to Execute
                      </div>
                      <ol className="text-xs space-y-1.5 text-gray-700 dark:text-gray-300 list-decimal pl-4">
                        {item.actionableSteps.map((step, idx) => (
                          <li key={idx} className="leading-tight">{step}</li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {/* Benefit badge */}
                  <div className={`p-3 rounded-xl text-xs font-serif italic mb-4 ${
                    darkMode ? 'bg-brand-900/20 text-brand-300 border border-brand-800/40' : 'bg-brand-50/60 text-brand-900 border border-brand-100'
                  }`}>
                    <strong>Key Outcome:</strong> {item.keyBenefit}
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="mt-2 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                  {isBook ? (
                    <a
                      href={`https://www.google.com/search?q=${encodeURIComponent(item.title + ' ' + item.subtitle)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5B7B7A] hover:underline"
                    >
                      <span>Explore Literature</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  ) : (
                    <button
                      onClick={() => handleAddToHabits(item)}
                      disabled={isAdded}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        isAdded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#5B7B7A] hover:bg-[#4A6463] text-white shadow-2xs'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          <span>Added to Practice Habits</span>
                        </>
                      ) : (
                        <>
                          <Plus className="h-3.5 w-3.5" />
                          <span>Add to Practice Habits</span>
                        </>
                      )}
                    </button>
                  )}

                  {onNavigateToHabits && !isBook && isAdded && (
                    <button
                      onClick={onNavigateToHabits}
                      className="text-xs text-[#5B7B7A] hover:underline font-semibold flex items-center gap-1"
                    >
                      <span>View in Habits</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
