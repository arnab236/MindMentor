import React, { useState } from 'react';
import { PhilosophyType } from '../types';
import { BookOpen, Search, Bookmark, ExternalLink, Quote, Sparkles } from 'lucide-react';

interface LibraryPageProps {
  selectedPhilosophy: PhilosophyType;
  darkMode: boolean;
}

interface CuratedBook {
  title: string;
  author: string;
  philosophy: PhilosophyType;
  description: string;
  keyTakeaway: string;
}

const LIBRARY_BOOKS: CuratedBook[] = [
  {
    title: 'Meditations',
    author: 'Marcus Aurelius',
    philosophy: 'Stoicism',
    description: 'Personal private journal of Roman emperor Marcus Aurelius reflecting on Stoic principles, duty, and emotional resilience.',
    keyTakeaway: 'You have power over your mind—not outside events. Realize this, and you will find strength.'
  },
  {
    title: 'Enchiridion (The Manual)',
    author: 'Epictetus',
    philosophy: 'Stoicism',
    description: 'Short handbook of Stoic ethical advice focusing on distinguishing what is within our control from what is not.',
    keyTakeaway: 'Happiness and freedom begin with a clear understanding of one principle: some things are within our control and some things are not.'
  },
  {
    title: 'Man’s Search for Meaning',
    author: 'Viktor Frankl',
    philosophy: 'Existentialism',
    description: 'Psychiatrist Viktor Frankl’s memoir of surviving concentration camps and introducing logotherapy—finding purpose through suffering.',
    keyTakeaway: 'When we are no longer able to change a situation, we are challenged to change ourselves.'
  },
  {
    title: 'The Archetypes and the Collective Unconscious',
    author: 'Carl Jung',
    philosophy: 'Jungian',
    description: 'Foundational text exploring psychological archetypes, the shadow, and the process of individuation.',
    keyTakeaway: 'Until you make the unconscious conscious, it will direct your life and you will call it fate.'
  },
  {
    title: 'Tao Te Ching',
    author: 'Lao Tzu',
    philosophy: 'Taoism',
    description: 'Classic Chinese text advocating alignment with the Tao through natural flow (Wu Wei) and effortless action.',
    keyTakeaway: 'When you are content to be simply yourself and don’t compare or compete, everyone will respect you.'
  },
  {
    title: 'The Heart of the Buddha’s Teaching',
    author: 'Thich Nhat Hanh',
    philosophy: 'Buddhism',
    description: 'Accessible guide to core Buddhist teachings on mindfulness, non-attachment, and the Four Noble Truths.',
    keyTakeaway: 'Breathing in, I calm body and mind. Breathing out, I smile. Dwelling in the present moment I know this is the only moment.'
  },
  {
    title: 'A Guide to Rational Living',
    author: 'Albert Ellis',
    philosophy: 'REBT',
    description: 'Pioneering work in Rational Emotive Behavior Therapy explaining how beliefs determine emotional outcomes.',
    keyTakeaway: 'People are not disturbed by things, but by the view which they take of them.'
  }
];

export const LibraryPage: React.FC<LibraryPageProps> = ({ selectedPhilosophy, darkMode }) => {
  const [filterPhilosophy, setFilterPhilosophy] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = LIBRARY_BOOKS.filter((b) => {
    const matchesPhilosophy = filterPhilosophy === 'All' || b.philosophy === filterPhilosophy;
    const matchesSearch = b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPhilosophy && matchesSearch;
  });

  return (
    <div className={`flex-1 py-8 px-4 sm:px-6 lg:px-8 transition-colors ${darkMode ? 'bg-[#121417] text-[#F0F2F5]' : 'bg-[#F9FAFB] text-[#1A1A1A]'}`}>
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Page Header */}
        <div className="border-b pb-6 border-gray-200 dark:border-gray-800">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3 bg-brand-50 dark:bg-brand-900/30 text-[#5B7B7A] dark:text-brand-300">
            <BookOpen className="h-3.5 w-3.5" />
            <span>Curated Philosophical Literature</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            The Philosophy Library
          </h1>
          <p className={`text-sm mt-1.5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Essential reading recommendations and foundational texts curated across wisdom traditions.
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Philosophy Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none py-1">
            {['All', 'Stoicism', 'Jungian', 'Existentialism', 'Taoism', 'Buddhism', 'REBT'].map((p) => (
              <button
                key={p}
                onClick={() => setFilterPhilosophy(p)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 cursor-pointer ${
                  filterPhilosophy === p
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

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search title, author..."
              className={`w-full pl-9 pr-4 py-2 rounded-xl text-xs border focus:outline-none focus:border-[#5B7B7A] transition-all ${
                darkMode
                  ? 'bg-[#1E2026] border-gray-800 text-white placeholder-gray-500'
                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
              }`}
            />
          </div>

        </div>

        {/* Books Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((book, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-2xl border transition-all flex flex-col justify-between shadow-xs hover:shadow-md ${
                darkMode ? 'bg-[#1E2026] border-gray-800' : 'bg-white border-gray-100'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-brand-50 dark:bg-brand-900/30 text-[#5B7B7A] dark:text-brand-300">
                      <Bookmark className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base leading-tight">
                        {book.title}
                      </h3>
                      <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        by {book.author}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-brand-50 dark:bg-brand-900/30 text-[#5B7B7A] dark:text-brand-300 border border-brand-100 dark:border-brand-800 shrink-0">
                    {book.philosophy}
                  </span>
                </div>

                <p className={`text-xs leading-relaxed mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {book.description}
                </p>
              </div>

              {/* Key Takeaway Box */}
              <div className={`p-3.5 rounded-xl border text-xs font-serif italic ${
                darkMode ? 'bg-[#121417] border-gray-800 text-gray-300' : 'bg-gray-50 border-gray-100 text-gray-700'
              }`}>
                <div className="flex items-center gap-1 text-[10px] uppercase font-sans font-bold text-[#5B7B7A] not-italic mb-1">
                  <Sparkles className="h-3 w-3" />
                  <span>Core Insight</span>
                </div>
                "{book.keyTakeaway}"
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs">
                <a
                  href={`https://www.google.com/search?q=${encodeURIComponent(book.title + ' ' + book.author)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[#5B7B7A] hover:underline font-semibold"
                >
                  <span>Explore Book</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
