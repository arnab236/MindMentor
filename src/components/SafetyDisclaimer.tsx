import React from 'react';
import { ShieldAlert, Heart, X } from 'lucide-react';

interface SafetyDisclaimerProps {
  onClose?: () => void;
  inline?: boolean;
}

export const SafetyDisclaimer: React.FC<SafetyDisclaimerProps> = ({ onClose, inline = false }) => {
  const content = (
    <div className={`rounded-xl border border-amber-200/80 bg-amber-50/90 p-4 shadow-sm text-amber-900 ${inline ? 'my-3' : ''}`}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5 rounded-lg bg-amber-100 p-2 text-amber-700 shrink-0">
          <ShieldAlert className="h-5 w-5" />
        </div>
        <div className="flex-1 text-sm leading-relaxed">
          <h4 className="font-semibold text-amber-950 flex items-center gap-1.5 mb-1">
            <span>Safety & Intent Notice</span>
            <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-amber-200/60 text-amber-800">Growth & Philosophy</span>
          </h4>
          <p className="text-amber-800/90 text-xs sm:text-sm">
            <strong>MindMentor is an educational and philosophical guide</strong> designed strictly for personal growth, self-reflection, and ancient wisdom exploration. It is <strong>NOT a medical, clinical, or psychiatric service</strong>. MindMentor does not diagnose medical conditions, provide therapy, or prescribe psychiatric treatment.
          </p>
          <div className="mt-2 text-xs text-amber-700/80 flex items-center gap-2">
            <Heart className="h-3.5 w-3.5 text-rose-500 shrink-0" />
            <span>If you are experiencing a mental health emergency or severe crisis, please consult a licensed medical professional or local hotline.</span>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-amber-700 hover:text-amber-900 p-1 rounded-md hover:bg-amber-100/80 transition-colors"
            title="Dismiss notice"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );

  if (inline) {
    return content;
  }

  return content;
};
