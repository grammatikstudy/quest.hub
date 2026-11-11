import React, { useState } from 'react';
import { DeckUnit } from '../types';
import { playSound } from '../utils/soundEffects';
import { UnderFourWarningModal } from './UnderFourWarningModal';
import { Layers, HelpCircle, PenTool, ArrowLeft } from 'lucide-react';

interface StudyModeSelectorProps {
  deck: DeckUnit;
  isLanguageReversed: boolean;
  onToggleLanguageReversal: () => void;
  autoTtsEnabled: boolean;
  onToggleAutoTts: () => void;
  onSelectMode: (mode: 'flashcards' | 'mc' | 'quiz') => void;
  onBackToLanding: () => void;
}

export const StudyModeSelector: React.FC<StudyModeSelectorProps> = ({
  deck,
  onSelectMode,
  onBackToLanding
}) => {
  const [warningModalOpen, setWarningModalOpen] = useState(false);

  const handleMCClick = () => {
    playSound('click');
    const hideWarning = localStorage.getItem('quest_hide_under_four_warning') === 'true';
    if (deck.items.length < 4 && !hideWarning) {
      setWarningModalOpen(true);
    } else {
      onSelectMode('mc');
    }
  };

  const handleNeverShowAgain = () => {
    localStorage.setItem('quest_hide_under_four_warning', 'true');
  };

  return (
    <div className="flex-1 max-w-lg w-full mx-auto px-4 py-8 flex flex-col justify-center">
      <div className="bg-slate-900 border-2 border-indigo-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6">
        <div>
          <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
            Study Station
          </span>
          <h2 className="text-2xl font-black text-white mt-3">{deck.title}</h2>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            {deck.items.length} vocabulary terms
          </p>
        </div>

        {/* Study Mode Launchers (Solid buttons, no gradients, clean icons) */}
        <div className="space-y-3">
          {/* Flashcards */}
          <button
            type="button"
            onClick={() => { playSound('click'); onSelectMode('flashcards'); }}
            className="w-full py-3.5 px-5 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm rounded-2xl shadow-lg transition-all flex items-center justify-between cursor-pointer active:scale-95"
          >
            <div className="flex items-center gap-3">
              <Layers className="w-5 h-5 text-indigo-200" />
              <div className="text-left">
                <span className="block font-black text-sm">Flashcards</span>
                <span className="block text-[10px] text-indigo-200 font-medium">Flip through terms with native audio</span>
              </div>
            </div>
            <span className="text-xs text-indigo-200 font-bold font-mono">Start</span>
          </button>

          {/* Multiple Choice (Learn) */}
          <button
            type="button"
            onClick={handleMCClick}
            className="w-full py-3.5 px-5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm rounded-2xl shadow-lg transition-all flex items-center justify-between cursor-pointer active:scale-95"
          >
            <div className="flex items-center gap-3">
              <HelpCircle className="w-5 h-5 text-slate-950" />
              <div className="text-left">
                <span className="block font-black text-sm">Multiple Choice</span>
                <span className="block text-[10px] text-slate-900 font-medium">Learn via 4-option matching mode</span>
              </div>
            </div>
            <span className="text-xs text-slate-950 font-bold font-mono">Start</span>
          </button>

          {/* Quiz (Test) */}
          <button
            type="button"
            onClick={() => { playSound('click'); onSelectMode('quiz'); }}
            className="w-full py-3.5 px-5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm rounded-2xl shadow-lg transition-all flex items-center justify-between cursor-pointer active:scale-95"
          >
            <div className="flex items-center gap-3">
              <PenTool className="w-5 h-5 text-emerald-200" />
              <div className="text-left">
                <span className="block font-black text-sm">Quiz (Test)</span>
                <span className="block text-[10px] text-emerald-100 font-medium">Written vocabulary challenge</span>
              </div>
            </div>
            <span className="text-xs text-emerald-100 font-bold font-mono">Start</span>
          </button>
        </div>

        <button
          type="button"
          onClick={onBackToLanding}
          className="text-xs text-slate-400 hover:text-white font-bold transition-colors cursor-pointer flex items-center justify-center gap-1 mx-auto pt-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Mission Control</span>
        </button>

        {/* Warning Modal for decks with < 4 items */}
        <UnderFourWarningModal
          isOpen={warningModalOpen}
          itemCount={deck.items.length}
          onContinue={() => {
            setWarningModalOpen(false);
            onSelectMode('mc');
          }}
          onGoBack={() => setWarningModalOpen(false)}
          onNeverShowAgain={handleNeverShowAgain}
        />
      </div>
    </div>
  );
};
