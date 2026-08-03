import React, { useState, useRef, useEffect } from 'react';
import { PhilosophyType, ChatMessage, BookRecommendation, DailyHabit, Quote } from '../types';
import { Sidebar } from '../components/Sidebar';
import { SafetyDisclaimer } from '../components/SafetyDisclaimer';
import { 
  Send, 
  Compass, 
  Sparkles, 
  Bot, 
  User, 
  BookOpen, 
  Volume2, 
  Copy, 
  Check, 
  RefreshCw, 
  Lightbulb, 
  Feather,
  Heart
} from 'lucide-react';

interface ChatPageProps {
  selectedPhilosophy: PhilosophyType;
  onPhilosophyChange: (p: PhilosophyType) => void;
  darkMode?: boolean;
}

const PRESET_PROMPTS: Record<PhilosophyType, string[]> = {
  Stoicism: [
    "How can I stay calm when external circumstances are beyond my control?",
    "What is Amor Fati and how do I apply it to recent setbacks?",
    "How do I practice the Dichotomy of Control in my daily routine?"
  ],
  Jungian: [
    "How do I begin shadow work without feeling overwhelmed by guilt?",
    "What does Carl Jung mean by individuation?",
    "How can I understand recurring themes or feelings in my dreams?"
  ],
  Existentialism: [
    "How do I find authentic meaning when feeling stuck or unmotivated?",
    "What did Viktor Frankl mean by 'meaning through responsibility'?",
    "How do I cope with the anxiety of freedom and big choices?"
  ],
  Taoism: [
    "What is Wu Wei (effortless action) and how do I apply it to work?",
    "How do I cultivate patience when everything feels urgent?",
    "How does simplicity reduce stress according to Lao Tzu?"
  ],
  Buddhism: [
    "How can mindfulness help me let go of overthinking?",
    "What is Anicca (impermanence) and why is it comforting?",
    "How do I practice non-attachment in relationships?"
  ],
  REBT: [
    "How do I identify and dispute my own irrational 'musts' and 'shoulds'?",
    "How can I build unconditional self-acceptance using REBT?",
    "What is the ABC model for emotional regulation?"
  ]
};

const STORAGE_KEY_MESSAGES = 'mindmentor_chat_messages';
const STORAGE_KEY_SIDEBAR = 'mindmentor_sidebar_state';

const getInitialMessages = (philosophy: PhilosophyType): ChatMessage[] => {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MESSAGES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load chat history from localStorage', e);
    }
  }
  return [
    {
      id: 'welcome-1',
      sender: 'ai',
      text: `Welcome to **MindMentor**. I am your multi-agent AI guide grounded in **${philosophy}** and wisdom traditions.\n\nShare what you are navigating today—whether it's anxiety over choices, seeking focus, or understanding self-discipline. I will consult my Research and Planner agents to provide tailored guidance and daily practices.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      philosophy: philosophy,
      conceptName: 'Welcome to MindMentor',
      coreInsight: 'Wisdom is not merely knowing principles, but translating them into daily character and action.',
      quote: {
        text: 'He who lives in harmony with himself lives in harmony with the universe.',
        author: 'Marcus Aurelius',
        source: 'Meditations'
      }
    }
  ];
};

export const ChatPage: React.FC<ChatPageProps> = ({
  selectedPhilosophy,
  onPhilosophyChange,
  darkMode = false
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => getInitialMessages(selectedPhilosophy));

  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showSafetyBanner, setShowSafetyBanner] = useState(true);

  // Active state for sidebar
  const [books, setBooks] = useState<BookRecommendation[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_SIDEBAR);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.books) return parsed.books;
        }
      } catch (e) {}
    }
    return [
      { title: 'Meditations', author: 'Marcus Aurelius', reason: 'Personal journal on emotional resilience and duty.' },
      { title: 'Man’s Search for Meaning', author: 'Viktor Frankl', reason: 'Discovering purpose amidst adversity.' }
    ];
  });

  const [habits, setHabits] = useState<DailyHabit[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_SIDEBAR);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.habits) return parsed.habits;
        }
      } catch (e) {}
    }
    return [
      { id: 'h1', title: 'Morning Control Audit', description: 'Separate what is within your power from what lies outside it.', time_estimate: '3 mins', category: 'Mindset' },
      { id: 'h2', title: 'Box Breathing Pause', description: 'Take 4 slow breaths when feeling reactive.', time_estimate: '2 mins', category: 'Action' }
    ];
  });

  const [activeConcept, setActiveConcept] = useState<{ name?: string; insight?: string; quote?: Quote }>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_SIDEBAR);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.activeConcept) return parsed.activeConcept;
        }
      } catch (e) {}
    }
    return {
      name: 'Dichotomy of Control',
      insight: 'Focus energy solely on choices within your power; release attachment to external outcomes.',
      quote: { text: 'You have power over your mind - not outside events. Realize this, and you will find strength.', author: 'Marcus Aurelius' }
    };
  });

  const [reflectionPrompt, setReflectionPrompt] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_SIDEBAR);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.reflectionPrompt) return parsed.reflectionPrompt;
        }
      } catch (e) {}
    }
    return 'Where did I spend my attention today, and was it aligned with my highest values?';
  });

  const [mindsetMantra, setMindsetMantra] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_SIDEBAR);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.mindsetMantra) return parsed.mindsetMantra;
        }
      } catch (e) {}
    }
    return 'I control my choices and attitude; external events do not define me.';
  });

  // Persist messages to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && messages.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(messages));
      } catch (e) {
        console.error('Failed to persist chat messages to localStorage', e);
      }
    }
  }, [messages]);

  // Persist sidebar state to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY_SIDEBAR, JSON.stringify({
          books,
          habits,
          activeConcept,
          reflectionPrompt,
          mindsetMantra
        }));
      } catch (e) {
        console.error('Failed to persist sidebar state to localStorage', e);
      }
    }
  }, [books, habits, activeConcept, reflectionPrompt, mindsetMantra]);

  const handleClearChat = () => {
    const defaultWelcome: ChatMessage = {
      id: `welcome-${Date.now()}`,
      sender: 'ai',
      text: `Welcome to **MindMentor**. I am your multi-agent AI guide grounded in **${selectedPhilosophy}** and wisdom traditions.\n\nShare what you are navigating today—whether it's anxiety over choices, seeking focus, or understanding self-discipline. I will consult my Research and Planner agents to provide tailored guidance and daily practices.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      philosophy: selectedPhilosophy,
      conceptName: 'Welcome to MindMentor',
      coreInsight: 'Wisdom is not merely knowing principles, but translating them into daily character and action.',
      quote: {
        text: 'He who lives in harmony with himself lives in harmony with the universe.',
        author: 'Marcus Aurelius',
        source: 'Meditations'
      }
    };
    const cleared = [defaultWelcome];
    setMessages(cleared);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(cleared));
    }
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = async (promptToUse?: string) => {
    const textToSend = promptToUse || inputPrompt;
    if (!textToSend || !textToSend.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      philosophy: selectedPhilosophy
    };

    setMessages(prev => [...prev, userMessage]);
    if (!promptToUse) setInputPrompt('');
    setIsLoading(true);

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('mindmentor_last_chat_topic', textToSend);
      } catch (e) {}
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
          philosophy: selectedPhilosophy,
          history: messages.slice(-4).map(m => ({ role: m.sender, content: m.text }))
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch response from MindMentor server');
      }

      const data = await response.json();

      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.message || data.core_insight || 'Here is guidance based on your prompt.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        philosophy: selectedPhilosophy,
        conceptName: data.concept_name,
        coreInsight: data.core_insight,
        quote: data.quote,
        books: data.books,
        habits: data.habits,
        reflectionPrompt: data.reflection_prompt,
        mindsetMantra: data.mindset_mantra,
        agentUsed: data.agent_used
      };

      setMessages(prev => [...prev, aiMessage]);

      // Update sidebar state
      if (data.books && data.books.length > 0) setBooks(data.books);
      if (data.habits && data.habits.length > 0) setHabits(data.habits);
      if (data.concept_name) {
        setActiveConcept({
          name: data.concept_name,
          insight: data.core_insight,
          quote: data.quote
        });
      }
      if (data.reflection_prompt) setReflectionPrompt(data.reflection_prompt);
      if (data.mindset_mantra) setMindsetMantra(data.mindset_mantra);

    } catch (err) {
      console.error('Chat error:', err);
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'ai',
        text: 'I encountered an issue connecting to the multi-agent service. Let us reflect: even when technology falters, our internal equilibrium remains ours to command.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        philosophy: selectedPhilosophy
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const speakQuote = (text: string, author?: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(`${text}. By ${author || 'Philosopher'}`);
      utterance.rate = 0.9;
      utterance.pitch = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const currentPresets = PRESET_PROMPTS[selectedPhilosophy] || PRESET_PROMPTS.Stoicism;

  return (
    <div className={`min-h-[calc(100vh-4rem)] font-sans flex flex-col flex-1 transition-colors ${
      darkMode ? 'bg-[#121417] text-[#F0F2F5]' : 'bg-[#F9FAFB] text-[#1A1A1A]'
    }`}>
      
      {/* Top Notice Banner */}
      {showSafetyBanner && (
        <div className="max-w-7xl mx-auto w-full px-4 pt-3">
          <SafetyDisclaimer onClose={() => setShowSafetyBanner(false)} inline />
        </div>
      )}

      <div className="max-w-7xl mx-auto w-full px-4 py-4 sm:px-6 lg:px-8 flex-1 flex flex-col">
        <div className="flex flex-col lg:flex-row gap-6 flex-1">
          
          {/* Main Chat Column */}
          <main className={`flex-1 flex flex-col rounded-2xl border shadow-xs overflow-hidden h-[60vh] lg:h-[75vh] relative transition-colors ${
            darkMode ? 'bg-[#1E2026] border-gray-800' : 'bg-white border-gray-100'
          }`}>
            
            {/* Chat Sub-Header */}
            <div className={`px-6 py-4 border-b flex items-center justify-between transition-colors ${
              darkMode ? 'bg-[#1E2026] border-gray-800' : 'bg-white border-gray-100'
            }`}>
              <div className="flex items-center space-x-2 text-xs">
                <span className={`font-medium ${darkMode ? 'text-gray-400' : 'text-gray-400'}`}>Current Session</span>
                <span className={darkMode ? 'text-gray-600' : 'text-gray-300'}>/</span>
                <span className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{selectedPhilosophy} Guidance</span>
              </div>

              <div className="flex items-center space-x-3 text-xs">
                <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#5B7B7A] px-2.5 py-0.5 rounded-md border ${
                  darkMode ? 'bg-brand-900/30 border-brand-800 text-brand-300' : 'bg-brand-50 border-brand-100'
                }`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5B7B7A]"></span>
                  Multi-Agent Pipeline
                </span>
                <button
                  onClick={handleClearChat}
                  className={`transition-colors cursor-pointer ${
                    darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-700'
                  }`}
                  title="Clear conversation and reset local history"
                >
                  Clear Chat
                </button>
              </div>
            </div>

            {/* Chat Messages Scroll Area */}
            <div className={`flex-1 overflow-y-auto p-6 space-y-6 pb-28 transition-colors ${
              darkMode ? 'bg-[#121417]/80' : 'bg-[#F9FAFB]/50'
            }`}>
              {messages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col space-y-1.5 max-w-[85%] sm:max-w-[80%] ${
                      isUser ? 'ml-auto items-end' : 'mr-auto items-start'
                    }`}
                  >
                    {/* Agent Badge for AI */}
                    {!isUser && msg.agentUsed && (
                      <div className="mb-1 inline-flex items-center gap-1 text-[10px] font-bold text-[#5B7B7A] uppercase tracking-wider">
                        <Sparkles className="h-3 w-3 text-[#5B7B7A]" />
                        <span>{msg.agentUsed}</span>
                      </div>
                    )}

                    {/* Message Bubble */}
                    <div className={`p-4 rounded-2xl shadow-xs text-sm leading-relaxed ${
                      isUser
                        ? 'bg-[#5B7B7A] rounded-tr-none text-white'
                        : darkMode 
                          ? 'bg-[#252830] border border-gray-800 rounded-tl-none text-gray-200' 
                          : 'bg-white border border-gray-100 rounded-tl-none text-gray-700'
                    }`}>
                      
                      {/* Main Text Content */}
                      <div className="whitespace-pre-wrap space-y-2">
                        {msg.text}
                      </div>

                      {/* Quote Card inside AI reply if present */}
                      {!isUser && msg.quote && msg.quote.text && (
                        <div className={`mt-3 p-3 rounded-xl border text-xs relative group ${
                          darkMode 
                            ? 'bg-[#181A1F] border-gray-800 text-gray-200' 
                            : 'bg-gray-50 border-gray-100 text-gray-800'
                        }`}>
                          <p className="italic font-serif text-sm">"{msg.quote.text}"</p>
                          <div className={`mt-2 flex items-center justify-between text-[11px] font-medium ${
                            darkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            <span>— {msg.quote.author} {msg.quote.source ? `(${msg.quote.source})` : ''}</span>
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => speakQuote(msg.quote!.text, msg.quote!.author)}
                                className={`p-1 rounded ${darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-200/60 text-gray-600'}`}
                                title="Read quote aloud"
                              >
                                <Volume2 className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => copyToClipboard(`"${msg.quote!.text}" — ${msg.quote!.author}`, msg.id)}
                                className={`p-1 rounded ${darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-200/60 text-gray-600'}`}
                                title="Copy quote"
                              >
                                {copiedId === msg.id ? <Check className="h-3.5 w-3.5 text-[#5B7B7A]" /> : <Copy className="h-3.5 w-3.5" />}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Timestamp */}
                    <span className={`text-[10px] text-gray-400 uppercase tracking-tighter ${isUser ? 'mr-1' : 'ml-1'}`}>
                      {isUser ? 'You' : 'MindMentor'} • {msg.timestamp}
                    </span>
                  </div>
                );
              })}

              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex flex-col space-y-1 max-w-[80%] items-start">
                  <div className={`border p-4 rounded-2xl rounded-tl-none shadow-xs text-xs flex items-center gap-2 ${
                    darkMode ? 'bg-[#252830] border-gray-800 text-gray-300' : 'bg-white border-gray-100 text-gray-600'
                  }`}>
                    <Sparkles className="h-4 w-4 text-[#5B7B7A] animate-spin" />
                    <span>Synthesizing philosophical perspective...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Bottom Input Area with Gradient Overlay & Pill Container */}
            <div className={`absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t ${
              darkMode ? 'from-[#1E2026] via-[#1E2026]/90 to-transparent' : 'from-[#F9FAFB] via-[#F9FAFB]/90 to-transparent'
            }`}>
              {/* Presets Bar */}
              <div className="max-w-2xl mx-auto mb-2.5 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest shrink-0 flex items-center gap-1 mr-1">
                  <Lightbulb className="h-3 w-3 text-[#5B7B7A]" />
                  Presets:
                </span>
                {currentPresets.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSubmit(p)}
                    disabled={isLoading}
                    className={`shrink-0 border px-3 py-1 rounded-full text-[11px] transition-colors whitespace-nowrap shadow-2xs cursor-pointer ${
                      darkMode 
                        ? 'text-gray-300 bg-[#252830] hover:bg-gray-800 border-gray-700' 
                        : 'text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-50 border-gray-200'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              {/* Pill Floating Input Form */}
              <div className="max-w-2xl mx-auto relative">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                  }}
                  className="relative"
                >
                  <input
                    type="text"
                    value={inputPrompt}
                    onChange={(e) => setInputPrompt(e.target.value)}
                    placeholder="Describe your current state or ask a philosophical question..."
                    className={`w-full border rounded-full py-3.5 px-6 pr-16 shadow-lg focus:outline-none focus:border-[#5B7B7A] transition-all text-xs sm:text-sm ${
                      darkMode 
                        ? 'bg-[#121417] border-gray-700 text-white placeholder-gray-500' 
                        : 'bg-white border-gray-200 text-gray-800 placeholder-gray-400'
                    }`}
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !inputPrompt.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#5B7B7A] text-white p-2.5 rounded-full hover:bg-[#4A6463] disabled:opacity-40 transition-colors shadow-xs cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
                <p className={`text-center mt-2.5 text-[10px] ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  Philosophy for personal growth. Not a medical diagnostic tool.
                </p>
              </div>
            </div>

          </main>

          {/* Sidebar Column */}
          <Sidebar
            selectedPhilosophy={selectedPhilosophy}
            onPhilosophyChange={onPhilosophyChange}
            activeConceptName={activeConcept.name}
            activeCoreInsight={activeConcept.insight}
            activeQuote={activeConcept.quote}
            books={books}
            habits={habits}
            reflectionPrompt={reflectionPrompt}
            mindsetMantra={mindsetMantra}
            darkMode={darkMode}
            onHabitToggled={async (title) => {
              try {
                await fetch('/api/notifications/complete-habit', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ title, philosophy: selectedPhilosophy })
                });
              } catch (e) {}
            }}
          />

        </div>
      </div>
    </div>
  );
};
