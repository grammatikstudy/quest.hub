import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';

interface UnderFourWarningModalProps {
  isOpen: boolean;
  itemCount?: number;
  onGoBack: () => void;
  onContinue: () => void;
  onNeverShowAgain: () => void;
}

export const UnderFourWarningModal: React.FC<UnderFourWarningModalProps> = ({
  isOpen,
  itemCount,
  onGoBack,
  onContinue,
  onNeverShowAgain
}) => {
  const [neverShow, setNeverShow] = useState(false);

  if (!isOpen) return null;

  const handleContinue = () => {
    if (neverShow) {
      onNeverShowAgain();
    }
    onContinue();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border-2 border-amber-400 rounded-3xl p-6 sm:p-8 max-w-md w-full text-center shadow-2xl space-y-4">
        <div className="w-12 h-12 bg-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <h3 className="text-xl font-black text-white">
          Deck Size Warning
        </h3>

        <p className="text-xs text-slate-300 font-medium leading-relaxed">
          This deck has fewer than 4 questions. Multiple Choice (Learn) mode is designed for decks with at least 4 items to generate 4 unique distractors.
        </p>

        <label className="flex items-center justify-center gap-2 text-xs text-slate-400 font-bold cursor-pointer py-1">
          <input
            type="checkbox"
            checked={neverShow}
            onChange={e => setNeverShow(e.target.checked)}
            className="accent-amber-400 rounded"
          />
          Never show again
        </label>

        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={onGoBack}
            className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl cursor-pointer"
          >
            Go Back
          </button>
          <button
            type="button"
            onClick={handleContinue}
            className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg cursor-pointer"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};
