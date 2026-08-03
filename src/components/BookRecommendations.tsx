import React from 'react';
import { BookRecommendation } from '../types';
import { BookOpen, ExternalLink, Bookmark, Sparkles } from 'lucide-react';

interface BookRecommendationsProps {
  books?: BookRecommendation[];
  philosophy: string;
  darkMode?: boolean;
}

export const BookRecommendations: React.FC<BookRecommendationsProps> = ({ books = [], philosophy, darkMode = false }) => {
  const safeBooks = Array.isArray(books) ? books : [];

  if (safeBooks.length === 0) {
    return (
      <div className={`rounded-2xl border p-5 text-center text-xs shadow-xs ${
        darkMode ? 'bg-[#1E2026] border-gray-800 text-gray-400' : 'bg-white border-gray-100 text-gray-400'
      }`}>
        <BookOpen className="h-4 w-4 mx-auto mb-1 text-[#5B7B7A]" />
        No book recommendations yet. Explore a topic to view curated reading material!
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
            <span>Reading Recommendations</span>
          </h3>
          <p className="text-[11px] text-gray-400 mt-0.5">{philosophy} literature</p>
        </div>
        <BookOpen className="h-4 w-4 text-[#5B7B7A]" />
      </div>

      <div className="space-y-3">
        {safeBooks.map((book, idx) => {
          const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(`${book.title} ${book.author} book`)}`;
          return (
            <div
              key={idx}
              className={`group p-3 rounded-xl border transition-all cursor-pointer ${
                darkMode
                  ? 'bg-[#121417] border-gray-800 hover:border-gray-700'
                  : 'bg-gray-50/50 border-gray-100 hover:bg-gray-100/60'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5">
                  <div className={`mt-0.5 p-1.5 rounded-lg shrink-0 ${
                    darkMode ? 'bg-brand-900/30 text-brand-300' : 'bg-brand-50 text-[#5B7B7A]'
                  }`}>
                    <Bookmark className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <h4 className={`text-xs font-semibold group-hover:text-[#5B7B7A] transition-colors leading-tight ${
                      darkMode ? 'text-gray-200' : 'text-gray-800'
                    }`}>
                      {book.title}
                    </h4>
                    <p className="text-[10px] text-gray-400 italic">by {book.author}</p>
                  </div>
                </div>
                <a
                  href={searchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-1 transition-colors ${
                    darkMode ? 'text-gray-500 hover:text-[#5B7B7A]' : 'text-gray-300 hover:text-[#5B7B7A]'
                  }`}
                  title="Search book details"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
              <p className={`text-[11px] mt-2 leading-relaxed ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {book.reason}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
