import React, { useState } from 'react';
import { PhilosophyType } from '../types';
import { 
  Compass, 
  Sparkles, 
  BookOpen, 
  CheckCircle2, 
  ShieldAlert, 
  ArrowRight, 
  BrainCircuit, 
  Bot, 
  Zap, 
  MessageSquare,
  Feather,
  ChevronDown,
  ChevronUp,
  Quote,
  Check,
  Star,
  Layers,
  Activity,
  Lock,
  RefreshCw
} from 'lucide-react';

interface LandingPageProps {
  onStartChat: (philosophy?: PhilosophyType) => void;
  selectedPhilosophy: PhilosophyType;
  onSelectPhilosophy: (p: PhilosophyType) => void;
  darkMode?: boolean;
}

interface PhilosophyDetail {
  type: PhilosophyType;
  title: string;
  motto: string;
  keyFigure: string;
  tags: string[];
  icon: string;
  color: string;
}

const PHILOSOPHIES: PhilosophyDetail[] = [
  { 
    type: 'Stoicism', 
    title: 'Stoicism', 
    motto: 'Focus on what is within your control; embrace what is not.', 
    keyFigure: 'Marcus Aurelius & Epictetus',
    tags: ['Dichotomy of Control', 'Amor Fati', 'Voluntary Hardship'],
    icon: '🏛️',
    color: 'from-amber-500/10 to-stone-500/10'
  },
  { 
    type: 'Jungian', 
    title: 'Jungian Psychology', 
    motto: 'Uncover the shadow, integrate the unconscious, achieve individuation.', 
    keyFigure: 'Carl Gustav Jung',
    tags: ['Shadow Integration', 'Archetypes', 'Active Imagination'],
    icon: '👁️',
    color: 'from-purple-500/10 to-indigo-500/10'
  },
  { 
    type: 'Existentialism', 
    title: 'Existentialism', 
    motto: 'Existence precedes essence. Accept radical responsibility to forge meaning.', 
    keyFigure: 'Viktor Frankl & Jean-Paul Sartre',
    tags: ['Radical Freedom', 'Meaning Making', 'Authenticity'],
    icon: '🌌',
    color: 'from-blue-500/10 to-cyan-500/10'
  },
  { 
    type: 'Taoism', 
    title: 'Taoism', 
    motto: 'Practice non-striving (Wu Wei) and flow in natural harmony.', 
    keyFigure: 'Lao Tzu & Chuang Tzu',
    tags: ['Wu Wei (Effortless Action)', 'Yin & Yang', 'Natural Harmony'],
    icon: '☯️',
    color: 'from-emerald-500/10 to-teal-500/10'
  },
  { 
    type: 'Buddhism', 
    title: 'Buddhism', 
    motto: 'Cultivate mindful awareness, understand impermanence, transcend suffering.', 
    keyFigure: 'Siddhartha Gautama (The Buddha)',
    tags: ['Four Noble Truths', 'Mindfulness', 'Impermanence'],
    icon: '🪷',
    color: 'from-rose-500/10 to-orange-500/10'
  },
  { 
    type: 'REBT', 
    title: 'Rational Emotive Behavior', 
    motto: 'Events do not disturb us; our irrational beliefs about events do.', 
    keyFigure: 'Albert Ellis',
    tags: ['ABCDE Framework', 'Cognitive Reframing', 'Rational Thinking'],
    icon: '💡',
    color: 'from-sky-500/10 to-blue-500/10'
  },
];

const DEMO_PREVIEWS: Record<string, {
  prompt: string;
  philosophy: PhilosophyType;
  quote: { text: string; author: string; source: string };
  habits: string[];
  synthesis: string;
}> = {
  stress: {
    prompt: "I feel overwhelmed by workload deadlines and constantly anxious about making mistakes.",
    philosophy: 'Stoicism',
    quote: {
      text: "You have power over your mind — not outside events. Realize this, and you will find strength.",
      author: "Marcus Aurelius",
      source: "Meditations, Book IV"
    },
    habits: [
      "1-Min Dichotomy Audit: Draw two columns (Control vs. Outside Control) before starting work.",
      "Evening Pre-Mortem: Write down worst-case outcomes and notice how manageable they truly are."
    ],
    synthesis: "The Stoic lens highlights that external pressures hold no power until you grant them judgment. Divide your tasks strictly into what is within your immediate agency vs. outcomes you cannot guarantee."
  },
  doubt: {
    prompt: "I am struggling with self-doubt and imposter syndrome in my creative project.",
    philosophy: 'Jungian',
    quote: {
      text: "One does not become enlightened by imagining figures of light, but by making the darkness conscious.",
      author: "Carl Jung",
      source: "Alchemical Studies"
    },
    habits: [
      "Shadow Dialogue: Write down what your inner critic is afraid of without judging yourself.",
      "Micro-Creation: Produce 10 minutes of unpolished work daily purely for process over perfection."
    ],
    synthesis: "Imposter feelings often signal your Shadow asserting unintegrated perfectionist standards. Acknowledge the critic as a protective voice trying to keep you safe from criticism."
  },
  purpose: {
    prompt: "I feel stuck in a routine and unsure how to find deeper direction in life.",
    philosophy: 'Existentialism',
    quote: {
      text: "Those who have a 'why' to live, can bear with almost any 'how'.",
      author: "Viktor Frankl",
      source: "Man's Search for Meaning"
    },
    habits: [
      "Values Alignment Checklist: Identify 3 core values and verify if today's actions served them.",
      "Evening Gratitude for Agency: Record 2 choices you made today that proved your personal freedom."
    ],
    synthesis: "Meaning is not discovered pre-packaged; it is constructed through intentional choice. Accept radical ownership of your current trajectory to forge purpose through small everyday actions."
  }
};

const FAQS = [
  {
    q: "How does the Multi-Agent Pipeline work?",
    a: "When you send a situation, MindMentor routes it through three orchestrated agents: the Research Agent extracts verified primary quotes and books, the Planner Agent formats actionable daily micro-habits and journal prompts, and the Executor Agent synthesizes everything into a compassionate, structured response."
  },
  {
    q: "Is MindMentor a substitute for therapy or medical care?",
    a: "No. MindMentor is strictly an educational tool and philosophical guide for personal reflection, daily habit cultivation, and intellectual growth. It is non-clinical and non-medical. If you are experiencing distress, please consult a qualified mental health professional."
  },
  {
    q: "Can I switch between philosophies at any time?",
    a: "Yes! You can toggle between Stoicism, Jungian Psychology, Existentialism, Taoism, Buddhism, and REBT on the fly. Each session adapts its quotes, habits, and mindset prompts to your active lens."
  },
  {
    q: "How are my daily habits tracked?",
    a: "Habits generated during your chat sessions are automatically synced to your active daily practice checklist in the sidebar. You can mark them complete as you build consistency."
  }
];

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartChat,
  selectedPhilosophy,
  onSelectPhilosophy,
  darkMode = false
}) => {
  const [activeDemoKey, setActiveDemoKey] = useState<'stress' | 'doubt' | 'purpose'>('stress');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const activeDemo = DEMO_PREVIEWS[activeDemoKey];

  return (
    <div className={`min-h-screen font-sans transition-colors ${
      darkMode ? 'bg-[#121417] text-[#F0F2F5]' : 'bg-[#F9FAFB] text-[#1A1A1A]'
    }`}>
      
      {/* Hero Section */}
      <section className={`relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28 border-b transition-colors ${
        darkMode ? 'bg-[#181A1F] border-gray-800' : 'bg-white border-gray-100'
      }`}>
        {/* Modern Background Subtle Gradient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-[#5B7B7A]/10 via-transparent to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-4xl mx-auto">
            
            {/* Pill Badge */}
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-semibold mb-6 backdrop-blur-md shadow-2xs transition-colors ${
              darkMode 
                ? 'bg-[#252830] border-brand-800/60 text-brand-300' 
                : 'bg-brand-50/80 border-brand-200 text-[#5B7B7A]'
            }`}>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5B7B7A] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#5B7B7A]"></span>
              </span>
              <Sparkles className="h-3.5 w-3.5 text-[#5B7B7A]" />
              <span>Multi-Agent Philosophical AI Engine v2.0</span>
            </div>

            {/* Headline */}
            <h1 className={`text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.15] max-w-4xl mx-auto ${
              darkMode ? 'text-white' : 'text-[#1A1A1A]'
            }`}>
              Find clarity, inner fortitude & purpose through{' '}
              <span className="bg-gradient-to-r from-[#5B7B7A] via-[#4A6463] to-[#3B504F] bg-clip-text text-transparent">
                timeless wisdom.
              </span>
            </h1>

            {/* Subtitle */}
            <p className={`mt-6 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-normal ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              MindMentor turns complex philosophy into actionable daily habits. Guided by multi-agent AI specializing in Stoicism, Jungian psychology, and wisdom traditions.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => onStartChat(selectedPhilosophy)}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#5B7B7A] hover:bg-[#4A6463] active:scale-95 text-white font-semibold text-sm shadow-lg shadow-[#5B7B7A]/20 transition-all flex items-center justify-center gap-2 cursor-pointer group"
              >
                <MessageSquare className="h-4 w-4" />
                <span>Begin Guidance Session</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>

              <a
                href="#demo-section"
                className={`w-full sm:w-auto px-7 py-4 rounded-full font-medium text-xs sm:text-sm border transition-all flex items-center justify-center gap-2 ${
                  darkMode 
                    ? 'bg-[#252830] hover:bg-[#2C303A] text-gray-200 border-gray-700' 
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
                }`}
              >
                <span>See Multi-Agent Demo</span>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </a>
            </div>

            {/* Non-medical Notice */}
            <div className={`mt-8 inline-flex items-center gap-2 text-xs px-3.5 py-1.5 rounded-lg border ${
              darkMode 
                ? 'bg-amber-950/40 border-amber-900/50 text-amber-300' 
                : 'bg-amber-50/90 border-amber-200/90 text-amber-900'
            }`}>
              <ShieldAlert className="h-3.5 w-3.5 text-amber-500 shrink-0" />
              <span>Designed for self-reflection & personal philosophy — strictly non-medical.</span>
            </div>

          </div>

          {/* Metrics Bar */}
          <div className={`mt-16 pt-8 border-t grid grid-cols-2 md:grid-cols-4 gap-6 text-center ${
            darkMode ? 'border-gray-800' : 'border-gray-100'
          }`}>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-[#5B7B7A]">6 Lenses</div>
              <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Stoic, Jungian, Taoist & more</p>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-[#5B7B7A]">3 Agents</div>
              <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Research, Planner, Executor</p>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-[#5B7B7A]">100%</div>
              <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Actionable Daily Micro-Habits</p>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-[#5B7B7A]">Zero Clutter</div>
              <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Sleek, focused UI space</p>
            </div>
          </div>

        </div>
      </section>

      {/* Live Preview Demo Sandbox Section */}
      <section id="demo-section" className={`py-16 sm:py-24 border-b transition-colors ${
        darkMode ? 'bg-[#121417] border-gray-800' : 'bg-[#F9FAFB] border-gray-100'
      }`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-3 ${
              darkMode ? 'bg-brand-900/30 text-brand-300' : 'bg-brand-50 text-[#5B7B7A]'
            }`}>
              <Zap className="h-3.5 w-3.5" />
              <span>Interactive Pipeline Preview</span>
            </div>
            <h2 className={`text-2xl sm:text-3xl font-bold ${darkMode ? 'text-white' : 'text-[#1A1A1A]'}`}>
              Experience how MindMentor processes life dilemmas
            </h2>
            <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Click a sample dilemma below to see the three specialized agents in real time.
            </p>
          </div>

          {/* Sample Dilemma Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            <button
              onClick={() => setActiveDemoKey('stress')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                activeDemoKey === 'stress'
                  ? 'bg-[#5B7B7A] text-white border-[#5B7B7A] shadow-xs'
                  : darkMode ? 'bg-[#1E2026] text-gray-300 border-gray-700 hover:border-gray-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
            >
              1. Work Deadline Stress (Stoicism)
            </button>
            <button
              onClick={() => setActiveDemoKey('doubt')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                activeDemoKey === 'doubt'
                  ? 'bg-[#5B7B7A] text-white border-[#5B7B7A] shadow-xs'
                  : darkMode ? 'bg-[#1E2026] text-gray-300 border-gray-700 hover:border-gray-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
            >
              2. Imposter Syndrome & Self-Doubt (Jungian)
            </button>
            <button
              onClick={() => setActiveDemoKey('purpose')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                activeDemoKey === 'purpose'
                  ? 'bg-[#5B7B7A] text-white border-[#5B7B7A] shadow-xs'
                  : darkMode ? 'bg-[#1E2026] text-gray-300 border-gray-700 hover:border-gray-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
            >
              3. Unclear Life Purpose (Existentialism)
            </button>
          </div>

          {/* Interactive Card Output Showcase */}
          <div className={`rounded-2xl border shadow-lg overflow-hidden transition-all ${
            darkMode ? 'bg-[#181A1F] border-gray-800' : 'bg-white border-gray-200'
          }`}>
            {/* Header of Demo Card */}
            <div className={`px-6 py-4 border-b flex flex-wrap items-center justify-between gap-3 ${
              darkMode ? 'bg-[#1E2026] border-gray-800' : 'bg-gray-50 border-gray-100'
            }`}>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-400 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
                <span className={`text-xs font-semibold ml-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  User Prompt Preview
                </span>
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#5B7B7A] bg-brand-50/80 px-2.5 py-0.5 rounded-md border border-brand-100">
                Lens: {activeDemo.philosophy}
              </span>
            </div>

            {/* Prompt Input Box */}
            <div className="p-6 border-b border-gray-100/50">
              <p className={`text-sm italic font-serif ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                "{activeDemo.prompt}"
              </p>
            </div>

            {/* 3 Agent Decomposition Grid */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Agent 1 */}
              <div className={`p-4 rounded-xl border flex flex-col justify-between ${
                darkMode ? 'bg-[#121417] border-gray-800' : 'bg-amber-50/40 border-amber-100'
              }`}>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider flex items-center gap-1">
                      <BookOpen className="h-3 w-3" />
                      Research Agent
                    </span>
                    <span className="text-[9px] text-gray-400">Step 1</span>
                  </div>
                  <blockquote className="text-xs italic font-serif text-gray-700 dark:text-gray-300 mt-2">
                    "{activeDemo.quote.text}"
                  </blockquote>
                  <p className="text-[10px] text-gray-500 font-medium mt-2 text-right">
                    — {activeDemo.quote.author} ({activeDemo.quote.source})
                  </p>
                </div>
              </div>

              {/* Agent 2 */}
              <div className={`p-4 rounded-xl border flex flex-col justify-between ${
                darkMode ? 'bg-[#121417] border-gray-800' : 'bg-brand-50/30 border-brand-100'
              }`}>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-[#5B7B7A] uppercase tracking-wider flex items-center gap-1">
                      <Feather className="h-3 w-3" />
                      Planner Agent
                    </span>
                    <span className="text-[9px] text-gray-400">Step 2</span>
                  </div>
                  <ul className="text-xs text-gray-700 dark:text-gray-300 space-y-1.5 mt-2">
                    {activeDemo.habits.map((h, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#5B7B7A] shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Agent 3 */}
              <div className={`p-4 rounded-xl border flex flex-col justify-between ${
                darkMode ? 'bg-[#121417] border-gray-800' : 'bg-gray-50 border-gray-200'
              }`}>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                      <Bot className="h-3 w-3" />
                      Executor Agent
                    </span>
                    <span className="text-[9px] text-gray-400">Step 3</span>
                  </div>
                  <p className="text-xs leading-relaxed text-gray-700 dark:text-gray-300 mt-2">
                    {activeDemo.synthesis}
                  </p>
                </div>
              </div>

            </div>

            {/* Bottom Launch Button */}
            <div className={`px-6 py-4 border-t text-center ${
              darkMode ? 'bg-[#1E2026] border-gray-800' : 'bg-gray-50/80 border-gray-100'
            }`}>
              <button
                onClick={() => {
                  onSelectPhilosophy(activeDemo.philosophy);
                  onStartChat(activeDemo.philosophy);
                }}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#5B7B7A] hover:bg-[#4A6463] text-white font-semibold text-xs transition-all shadow-xs cursor-pointer"
              >
                <span>Discuss this query in Chat with {activeDemo.philosophy}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* Philosophy Lenses Grid */}
      <section className={`py-16 sm:py-24 border-b transition-colors ${
        darkMode ? 'bg-[#181A1F] border-gray-800' : 'bg-white border-gray-100'
      }`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-3 ${
              darkMode ? 'bg-brand-900/30 text-brand-300' : 'bg-brand-50 text-[#5B7B7A]'
            }`}>
              <Compass className="h-3.5 w-3.5" />
              <span>6 Wisdom Lenses</span>
            </div>
            <h2 className={`text-2xl sm:text-4xl font-bold ${darkMode ? 'text-white' : 'text-[#1A1A1A]'}`}>
              Select Your Philosophical Foundation
            </h2>
            <p className={`text-sm mt-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Every lens offers a distinct, time-tested approach to overcoming obstacles and building character.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PHILOSOPHIES.map((p) => {
              const isSelected = selectedPhilosophy === p.type;
              return (
                <div
                  key={p.type}
                  onClick={() => {
                    onSelectPhilosophy(p.type);
                    onStartChat(p.type);
                  }}
                  className={`group relative p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between overflow-hidden ${
                    isSelected
                      ? darkMode 
                        ? 'bg-[#252830] border-[#5B7B7A] ring-2 ring-[#5B7B7A]/40 shadow-xl' 
                        : 'bg-white border-[#5B7B7A] ring-2 ring-[#5B7B7A]/20 shadow-lg'
                      : darkMode 
                        ? 'bg-[#121417] border-gray-800 hover:border-gray-700 hover:bg-[#1A1D23]' 
                        : 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-md'
                  }`}
                >
                  {/* Subtle Background Glow */}
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${p.color} rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform`} />

                  <div>
                    {/* Icon & Tag Header */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-3xl p-2 rounded-xl bg-gray-50/80 dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700/60 shadow-2xs">
                        {p.icon}
                      </span>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${
                        isSelected 
                          ? 'bg-[#5B7B7A] text-white' 
                          : darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {p.type}
                      </span>
                    </div>

                    <h3 className={`font-bold text-lg group-hover:text-[#5B7B7A] transition-colors ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {p.title}
                    </h3>

                    <p className={`text-xs font-serif italic mt-2 leading-relaxed ${
                      darkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      "{p.motto}"
                    </p>

                    <p className="text-[11px] font-semibold text-gray-400 mt-2">
                      Key Figure: <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{p.keyFigure}</span>
                    </p>

                    {/* Tag Pills */}
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {p.tags.map((t, idx) => (
                        <span 
                          key={idx} 
                          className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${
                            darkMode 
                              ? 'bg-gray-800/60 border-gray-700 text-gray-400' 
                              : 'bg-gray-50 border-gray-200 text-gray-500'
                          }`}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Link */}
                  <div className="mt-6 pt-4 border-t border-gray-100/50 dark:border-gray-800 flex items-center justify-between text-xs font-semibold text-[#5B7B7A]">
                    <span>Start Guidance</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1.5" />
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Architecture Multi-Agent Pipeline */}
      <section id="architecture" className={`py-16 sm:py-24 border-b transition-colors ${
        darkMode ? 'bg-[#121417] border-gray-800' : 'bg-[#F9FAFB] border-gray-100'
      }`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-3 ${
              darkMode ? 'bg-brand-900/30 text-brand-300' : 'bg-brand-50 text-[#5B7B7A]'
            }`}>
              <BrainCircuit className="h-3.5 w-3.5" />
              <span>System Architecture</span>
            </div>
            <h2 className={`text-2xl sm:text-4xl font-bold ${darkMode ? 'text-white' : 'text-[#1A1A1A]'}`}>
              Orchestrated Multi-Agent Pipeline
            </h2>
            <p className={`text-sm mt-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Rather than single unformatted text generations, MindMentor routes each turn through specialized cognitive roles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            
            {/* Step 1 */}
            <div className={`p-6 rounded-2xl border shadow-xs transition-all relative ${
              darkMode ? 'bg-[#181A1F] border-gray-800' : 'bg-white border-gray-200'
            }`}>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold text-sm mb-4">
                01
              </div>
              <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">agents.research</span>
              <h3 className={`font-semibold text-lg mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Research Agent</h3>
              <p className={`text-xs mt-2 leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Cross-references classical texts to source exact primary quotes, historical context, and reading lists matching your dilemma.
              </p>
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 text-[11px] text-gray-500">
                <strong>Output:</strong> Verified Quote Object + Reading Recommendation
              </div>
            </div>

            {/* Step 2 */}
            <div className={`p-6 rounded-2xl border shadow-xs transition-all relative ${
              darkMode ? 'bg-[#181A1F] border-gray-800' : 'bg-white border-gray-200'
            }`}>
              <div className="w-10 h-10 rounded-xl bg-[#5B7B7A]/10 text-[#5B7B7A] flex items-center justify-center font-bold text-sm mb-4">
                02
              </div>
              <span className="text-[10px] font-bold text-[#5B7B7A] uppercase tracking-wider">agents.planner</span>
              <h3 className={`font-semibold text-lg mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Planner Agent</h3>
              <p className={`text-xs mt-2 leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Translates abstract wisdom into 2 actionable daily habits, time estimates, and an evening reflection journal prompt.
              </p>
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 text-[11px] text-gray-500">
                <strong>Output:</strong> Array of DailyHabit objects + Reflection prompt
              </div>
            </div>

            {/* Step 3 */}
            <div className={`p-6 rounded-2xl border shadow-xs transition-all relative ${
              darkMode ? 'bg-[#181A1F] border-gray-800' : 'bg-white border-gray-200'
            }`}>
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold text-sm mb-4">
                03
              </div>
              <span className="text-[10px] font-bold text-purple-500 uppercase tracking-wider">agents.executor</span>
              <h3 className={`font-semibold text-lg mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Executor Agent</h3>
              <p className={`text-xs mt-2 leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Synthesizes research and habits into an empathetic dialogue, attaching safety disclaimers and structured layout formatting.
              </p>
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 text-[11px] text-gray-500">
                <strong>Output:</strong> Empathetic Chat Message + UI Sidebar Sync
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Platform Capabilities Bento Grid */}
      <section className={`py-16 sm:py-24 border-b transition-colors ${
        darkMode ? 'bg-[#181A1F] border-gray-800' : 'bg-white border-gray-100'
      }`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className={`text-2xl sm:text-4xl font-bold ${darkMode ? 'text-white' : 'text-[#1A1A1A]'}`}>
              Built for depth, focus, and daily growth
            </h2>
            <p className={`text-sm mt-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Every tool in MindMentor serves a distinct purpose in your reflection workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Feature 1 */}
            <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-[#121417] border-gray-800' : 'bg-gray-50/50 border-gray-200'}`}>
              <Layers className="h-6 w-6 text-[#5B7B7A] mb-3" />
              <h3 className={`font-semibold text-base ${darkMode ? 'text-white' : 'text-gray-900'}`}>Multi-Agent Pipeline</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                Seamless division of labor across Research, Planning, and Execution agents for richer responses.
              </p>
            </div>

            {/* Feature 2 */}
            <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-[#121417] border-gray-800' : 'bg-gray-50/50 border-gray-200'}`}>
              <Activity className="h-6 w-6 text-[#5B7B7A] mb-3" />
              <h3 className={`font-semibold text-base ${darkMode ? 'text-white' : 'text-gray-900'}`}>Daily Habit Sync</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                Turn philosophical insight directly into tracked micro-habits on your sidebar practice checklist.
              </p>
            </div>

            {/* Feature 3 */}
            <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-[#121417] border-gray-800' : 'bg-gray-50/50 border-gray-200'}`}>
              <BookOpen className="h-6 w-6 text-[#5B7B7A] mb-3" />
              <h3 className={`font-semibold text-base ${darkMode ? 'text-white' : 'text-gray-900'}`}>Curated Wisdom Library</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                Explore key texts from Aurelius, Seneca, Epictetus, Jung, Lao Tzu, Frankl, and Buddha.
              </p>
            </div>

            {/* Feature 4 */}
            <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-[#121417] border-gray-800' : 'bg-gray-50/50 border-gray-200'}`}>
              <Feather className="h-6 w-6 text-[#5B7B7A] mb-3" />
              <h3 className={`font-semibold text-base ${darkMode ? 'text-white' : 'text-gray-900'}`}>Evening Journal Prompts</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                Close your day with targeted reflection questions and stabilizing mindset mantras.
              </p>
            </div>

            {/* Feature 5 */}
            <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-[#121417] border-gray-800' : 'bg-gray-50/50 border-gray-200'}`}>
              <ShieldAlert className="h-6 w-6 text-[#5B7B7A] mb-3" />
              <h3 className={`font-semibold text-base ${darkMode ? 'text-white' : 'text-gray-900'}`}>Safety Guardrail Engine</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                Automated non-clinical disclosures and immediate crisis helpline guidance if distress is detected.
              </p>
            </div>

            {/* Feature 6 */}
            <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-[#121417] border-gray-800' : 'bg-gray-50/50 border-gray-200'}`}>
              <RefreshCw className="h-6 w-6 text-[#5B7B7A] mb-3" />
              <h3 className={`font-semibold text-base ${darkMode ? 'text-white' : 'text-gray-900'}`}>Realtime Local State</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                Your completed habits and session settings persist across page reloads in local browser storage.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className={`py-16 sm:py-24 border-b transition-colors ${
        darkMode ? 'bg-[#121417] border-gray-800' : 'bg-[#F9FAFB] border-gray-100'
      }`}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <h2 className={`text-2xl sm:text-3xl font-bold ${darkMode ? 'text-white' : 'text-[#1A1A1A]'}`}>
              Frequently Asked Questions
            </h2>
            <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Everything you need to know about MindMentor.
            </p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div 
                  key={idx}
                  className={`rounded-2xl border overflow-hidden transition-all ${
                    darkMode ? 'bg-[#181A1F] border-gray-800' : 'bg-white border-gray-200'
                  }`}
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 font-semibold text-sm cursor-pointer"
                  >
                    <span className={darkMode ? 'text-gray-200' : 'text-gray-800'}>{faq.q}</span>
                    {isOpen ? <ChevronUp className="h-4 w-4 text-[#5B7B7A] shrink-0" /> : <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" />}
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-4 pt-1 text-xs leading-relaxed border-t border-gray-100 dark:border-gray-800 text-gray-600 dark:text-gray-400">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-20 bg-[#1A1A1A] text-white text-center relative overflow-hidden">
        <div className="max-w-3xl mx-auto px-4 relative z-10">
          <h2 className="text-2xl sm:text-4xl font-bold">
            Ready to find clarity and daily focus?
          </h2>
          <p className="text-gray-400 text-sm mt-3 max-w-xl mx-auto">
            Select your preferred philosophy lens and start a conversation with MindMentor today.
          </p>
          <button
            onClick={() => onStartChat(selectedPhilosophy)}
            className="mt-8 inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#5B7B7A] hover:bg-[#4A6463] text-white font-semibold text-sm shadow-lg transition-all cursor-pointer group"
          >
            <span>Launch MindMentor Guidance Studio</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </section>

      {/* Footer Disclaimer */}
      <footer className="py-8 bg-black text-gray-400 text-center text-xs border-t border-gray-900">
        <div className="max-w-5xl mx-auto px-4">
          <p>
            © {new Date().getFullYear()} MindMentor AI Studio. Built strictly for personal growth and educational philosophy.
          </p>
          <p className="mt-1 text-[11px] text-gray-500">
            MindMentor is non-medical and non-clinical. If you are experiencing mental health crisis, please reach out to emergency resources or a professional healthcare provider.
          </p>
        </div>
      </footer>

    </div>
  );
};
