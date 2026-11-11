import React, { useState, useEffect } from 'react';
import { DeckUnit, FontSize } from '../types';
import { playSound, speakNaturalText } from '../utils/soundEffects';
import {
  Volume2,
  ArrowLeft,
  ArrowRight,
  Rotate3d,
  Settings,
  X,
  ArrowLeftRight,
  Sparkles,
  Mic
} from 'lucide-react';

interface FlashcardScreenProps {
  deck: DeckUnit;
  customItems?: { prompt: string; de: string[] }[];
  isLanguageReversed: boolean;
  onToggleLanguageReversal?: () => void;
  autoTtsEnabled: boolean;
  onToggleAutoTts?: () => void;
  onTakeQuiz: () => void;
  onExit: () => void;
  onRightClickWord: (word: string, lang: string) => void;
  fontSize?: FontSize;
  onSelectFontSize?: (size: FontSize) => void;
}

export const FlashcardScreen: React.FC<FlashcardScreenProps> = ({
  deck,
  customItems,
  isLanguageReversed,
  onToggleLanguageReversal,
  autoTtsEnabled,
  onToggleAutoTts,
  onTakeQuiz,
  onExit,
  onRightClickWord,
  fontSize = 'normal',
  onSelectFontSize
}) => {
  const items = customItems || deck.items;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Auto-listen mode: 'off' | 'front' | 'back' | 'both'
  const [autoListenMode, setAutoListenMode] = useState<'off' | 'front' | 'back' | 'both'>(() => {
    return autoTtsEnabled ? 'back' : 'off';
  });

  const currentItem = items[currentIndex] || { prompt: '', de: [''] };

  const frontText = isLanguageReversed ? currentItem.de[0] : currentItem.prompt;
  const backText = isLanguageReversed ? currentItem.prompt : currentItem.de.join(' • ');

  const frontLang = isLanguageReversed ? deck.lang2 : deck.lang1;
  const backLang = isLanguageReversed ? deck.lang1 : deck.lang2;

  // Speak when card changes if prompt auto-listen is on
  useEffect(() => {
    if (autoListenMode === 'front' || autoListenMode === 'both') {
      const timer = setTimeout(() => {
        speakNaturalText(frontText, frontLang);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, isLanguageReversed]);

  const handleFlip = () => {
    playSound('click');
    const nextFlipped = !isFlipped;
    setIsFlipped(nextFlipped);

    if (nextFlipped && (autoListenMode === 'back' || autoListenMode === 'both')) {
      speakNaturalText(backText, backLang);
    }
  };

  const handleNext = () => {
    playSound('click');
    setIsFlipped(false);
    setCurrentIndex(prev => (prev + 1) % items.length);
  };

  const handlePrev = () => {
    playSound('click');
    setIsFlipped(false);
    setCurrentIndex(prev => (prev - 1 + items.length) % items.length);
  };

  const handleWordClick = (e: React.MouseEvent, text: string, lang: string) => {
    e.stopPropagation();
    // Foreign languages (German or Latin) open pronunciation training modal
    if (lang === 'en-GB' || lang === 'en-US' || lang === 'en') {
      speakNaturalText(text, lang);
      return;
    }
    onRightClickWord(text, lang);
  };

  return (
    <div className="flex-1 max-w-2xl w-full mx-auto px-4 py-6 flex flex-col justify-center">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6">
        {/* Header with Title, Progress, and In-Session Settings Gear */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 flex-wrap gap-2">
          <div className="text-left">
            <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30">
              Flashcards
            </span>
            <h2 className="text-xl font-black text-white mt-1">{deck.title}</h2>
          </div>

          <div className="flex items-center gap-2">
            {/* In-Session Settings Button */}
            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors"
              title="Open Flashcards Settings"
            >
              <Settings className="w-4 h-4 text-indigo-400" />
            </button>

            <button
              type="button"
              onClick={onTakeQuiz}
              className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-md cursor-pointer transition-colors"
            >
              Take Quiz
            </button>

            <div className="text-xs font-black bg-indigo-950 text-indigo-300 border border-indigo-800 px-3 py-1.5 rounded-xl font-mono">
              {currentIndex + 1} / {items.length}
            </div>
          </div>
        </div>

        {/* 3D Flip Card */}
        <div
          className="perspective-1000 w-full h-64 sm:h-72 cursor-pointer select-none"
          onClick={handleFlip}
          title="Click card background to flip"
        >
          <div
            className="relative w-full h-full duration-500 transform-style-3d shadow-2xl rounded-2xl"
            style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
          >
            {/* FRONT FACE */}
            <div
              className="absolute inset-0 w-full h-full bg-slate-950 border-2 border-slate-800 hover:border-amber-400/60 rounded-2xl p-6 flex flex-col items-center justify-between backface-hidden transition-colors"
            >
              <div className="w-full flex justify-between items-center text-[10px] font-extrabold uppercase text-amber-400">
                <span>Prompt</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    speakNaturalText(frontText, frontLang);
                  }}
                  className="p-1 px-2.5 bg-indigo-600/30 hover:bg-indigo-600 text-amber-300 hover:text-white rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                  title="Listen pronunciation"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Listen</span>
                </button>
              </div>

              {/* Clickable word: triggers pronunciation modal */}
              <div
                onClick={(e) => handleWordClick(e, frontText, frontLang)}
                className="group/word cursor-pointer inline-flex items-center gap-2 p-2 rounded-xl hover:bg-slate-900 transition-colors"
                title="Click to open pronunciation trainer"
              >
                <h3 className="text-2xl sm:text-3xl font-black text-white group-hover/word:text-amber-300 transition-colors max-w-md break-words">
                  {frontText}
                </h3>
                <Mic className="w-4 h-4 text-slate-500 group-hover/word:text-amber-400 opacity-60 group-hover/word:opacity-100 transition-opacity" />
              </div>

              <span className="text-[10px] text-slate-500">
                Click word for pronunciation • Click card to flip
              </span>
            </div>

            {/* BACK FACE */}
            <div
              className="absolute inset-0 w-full h-full bg-indigo-950/90 border-2 border-indigo-500/50 hover:border-amber-400/60 rounded-2xl p-6 flex flex-col items-center justify-between backface-hidden rotate-y-180 transition-colors"
            >
              <div className="w-full flex justify-between items-center text-[10px] font-extrabold uppercase text-indigo-300">
                <span>Definition</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    speakNaturalText(backText, backLang);
                  }}
                  className="p-1 px-2.5 bg-amber-400/20 hover:bg-amber-400 text-amber-300 hover:text-slate-950 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                  title="Listen pronunciation"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Listen</span>
                </button>
              </div>

              {/* Clickable word: triggers pronunciation modal */}
              <div
                onClick={(e) => handleWordClick(e, backText, backLang)}
                className="group/word cursor-pointer inline-flex items-center gap-2 p-2 rounded-xl hover:bg-indigo-900/40 transition-colors"
                title="Click to open pronunciation trainer"
              >
                <h3 className="text-2xl sm:text-3xl font-black text-amber-300 group-hover/word:text-white transition-colors max-w-md break-words">
                  {backText}
                </h3>
                <Mic className="w-4 h-4 text-indigo-300 group-hover/word:text-white opacity-60 group-hover/word:opacity-100 transition-opacity" />
              </div>

              <span className="text-[10px] text-indigo-400">
                Click word for pronunciation • Click card to flip back
              </span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={handlePrev}
            className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <button
            type="button"
            onClick={handleFlip}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-lg active:scale-95"
          >
            <Rotate3d className="w-4 h-4" />
            <span>Flip</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors active:scale-95"
          >
            <span>Next</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Exit link */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onExit}
            className="text-xs text-slate-500 hover:text-slate-300 font-medium cursor-pointer"
          >
            Return to Arena Dashboard
          </button>
        </div>
      </div>

      {/* IN-SESSION SETTINGS PANEL MODAL */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-indigo-500 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 text-left">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-indigo-400" />
                <h3 className="text-base font-black text-white">Flashcard Settings</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSettingsOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 1. Language Direction */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                Language Direction
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (isLanguageReversed && onToggleLanguageReversal) onToggleLanguageReversal();
                  }}
                  className={`p-2.5 rounded-xl border text-xs font-bold cursor-pointer transition-colors ${
                    !isLanguageReversed
                      ? 'bg-indigo-600 text-white border-indigo-500'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  Standard
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!isLanguageReversed && onToggleLanguageReversal) onToggleLanguageReversal();
                  }}
                  className={`p-2.5 rounded-xl border text-xs font-bold cursor-pointer transition-colors ${
                    isLanguageReversed
                      ? 'bg-indigo-600 text-white border-indigo-500'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  Reversed
                </button>
              </div>
            </div>

            {/* 2. Automatic Audio Listen */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                Automatic Voice Pronunciation
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setAutoListenMode('off')}
                  className={`p-2 rounded-xl border font-bold cursor-pointer ${
                    autoListenMode === 'off'
                      ? 'bg-indigo-600 text-white border-indigo-500'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  Off
                </button>
                <button
                  type="button"
                  onClick={() => setAutoListenMode('front')}
                  className={`p-2 rounded-xl border font-bold cursor-pointer ${
                    autoListenMode === 'front'
                      ? 'bg-indigo-600 text-white border-indigo-500'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  Prompt Side Only
                </button>
                <button
                  type="button"
                  onClick={() => setAutoListenMode('back')}
                  className={`p-2 rounded-xl border font-bold cursor-pointer ${
                    autoListenMode === 'back'
                      ? 'bg-indigo-600 text-white border-indigo-500'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  Definition Side Only
                </button>
                <button
                  type="button"
                  onClick={() => setAutoListenMode('both')}
                  className={`p-2 rounded-xl border font-bold cursor-pointer ${
                    autoListenMode === 'both'
                      ? 'bg-indigo-600 text-white border-indigo-500'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  Both Sides
                </button>
              </div>
            </div>

            {/* 3. Large Print Mode */}
            {onSelectFontSize && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                  Large Print Typography
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => onSelectFontSize('normal')}
                    className={`p-2 rounded-xl border text-xs font-bold cursor-pointer ${
                      fontSize === 'normal'
                        ? 'bg-indigo-600 text-white border-indigo-500'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    Standard
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelectFontSize('large')}
                    className={`p-2 rounded-xl border text-xs font-bold cursor-pointer ${
                      fontSize === 'large'
                        ? 'bg-indigo-600 text-white border-indigo-500'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    Large Print
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelectFontSize('xlarge')}
                    className={`p-2 rounded-xl border text-xs font-bold cursor-pointer ${
                      fontSize === 'xlarge'
                        ? 'bg-indigo-600 text-white border-indigo-500'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    Extra Large
                  </button>
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setIsSettingsOpen(false)}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                Apply & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
