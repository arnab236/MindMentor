export type AppView = 'landing' | 'chat' | 'habits' | 'recommendations' | 'reflections';

export type PhilosophyType = 
  | 'Stoicism' 
  | 'Jungian' 
  | 'Existentialism' 
  | 'Taoism' 
  | 'Buddhism' 
  | 'REBT';

export interface BookRecommendation {
  title: string;
  author: string;
  reason: string;
}

export interface RecommendationItem {
  id: string;
  type: 'book' | 'mental_health' | 'daily_activity';
  title: string;
  subtitle?: string;
  philosophy: PhilosophyType;
  description: string;
  keyBenefit: string;
  actionableSteps?: string[];
  tags?: string[];
  chatTopic?: string;
}

export interface Quote {
  text: string;
  author: string;
  source?: string;
}

export interface DailyHabit {
  id: string;
  title: string;
  description: string;
  time_estimate: string;
  category: string;
  completed?: boolean;
  philosophy?: PhilosophyType;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  philosophy?: PhilosophyType;
  conceptName?: string;
  coreInsight?: string;
  quote?: Quote;
  books?: BookRecommendation[];
  habits?: DailyHabit[];
  reflectionPrompt?: string;
  mindsetMantra?: string;
  agentUsed?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  philosophy: string;
  timestamp: string;
}

