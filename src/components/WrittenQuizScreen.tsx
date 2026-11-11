import React, { useState, useRef } from 'react';
import { DeckUnit, VocabItem, FontSize } from '../types';
import { checkLatinOrGermanAnswer } from '../utils/latinValidator';
import { playSound, speakNaturalText } from '../utils/soundEffects';
import { GermanAccentBar } from './GermanAccentBar';
import { Volume2, ArrowLeft, Settings, X, Mic, CheckCircle2 } from 'lucide-react';

interface WrittenQuizScreenProps {
  deck: DeckUnit;
  isLanguageReversed: boolean;
  onToggleLanguageReversal?: () => void;
  onSubmitQuiz: (
    score: number,
    total: number,
    answersLog: { prompt: string; userAns: string; correctAns: string; isCorrect: boolean }[],
    missedItems: VocabItem[]
  ) => void;
  onExit: () => void;
  onRightClickWord?: (word: string, lang: string) => void;
  fontSize?: FontSize;
  onSelectFontSize?: (size: FontSize) => void;
}

export const WrittenQuizScreen: React.FC<WrittenQuizScreenProps> = ({
  deck,
  isLanguageReversed,
  onToggleLanguageReversal,
  onSubmitQuiz,
  onExit,
  onRightClickWord,
  fontSize = 'normal',
  onSelectFontSize
}) => {
  const [userInputs, setUserInputs] = useState<Record<number, string>>({});
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);

  const isLatin = deck.lang1 === 'la' || deck.lang2 === 'la';
  const isGerman = deck.lang1 === 'de-DE' || deck.lang2 === 'de-DE';

  const handleInputChange = (idx: number, val: string) => {
    setUserInputs(prev => ({ ...prev, [idx]: val }));
  };

  const handleInsertChar = (char: string) => {
    const currentVal = userInputs[focusedIndex] || '';
    handleInputChange(focusedIndex, currentVal + char);
  };

  const handleSubmit = () => {
    playSound('click');
    let correctCount = 0;
    const answersLog: { prompt: string; userAns: string; correctAns: string; isCorrect: boolean }[] = [];
    const missedItems: VocabItem[] = [];

    deck.items.forEach((item, idx) => {
      const userVal = (userInputs[idx] || '').trim();
      const prompt = isLanguageReversed ? item.de[0] : item.prompt;
      const acceptedAnswers = isLanguageReversed ? [item.prompt] : item.de;

      const evalRes = checkLatinOrGermanAnswer(userVal, acceptedAnswers, isLatin);

      if (evalRes.isCorrect) {
        correctCount++;
      } else {
        missedItems.push(item);
      }

      answersLog.push({
        prompt,
        userAns: userVal || '(Blank)',
        correctAns: acceptedAnswers.join(' / '),
        isCorrect: evalRes.isCorrect
      });
    });

    onSubmitQuiz(correctCount, deck.items.length, answersLog, missedItems);
  };

  const handlePromptClick = (text: string, lang: string) => {
    if (onRightClickWord && lang !== 'en-GB' && lang !== 'en-US' && lang !== 'en') {
      onRightClickWord(text, lang);
    } else {
      speakNaturalText(text, lang);
    }
  };

  const answeredCount = Object.keys(userInputs).filter(k => !!userInputs[Number(k)]?.trim()).length;

  return (
    <div className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 flex flex-col justify-center">
      <div className="bg-slate-900 border-2 border-emerald-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                Test Mode • Exam Sheet
              </span>
              <span className="text-xs font-mono font-bold text-amber-300">
                {answeredCount} / {deck.items.length} Answered
              </span>
            </div>
            <h2 className="text-2xl font-black text-white mt-1">{deck.title}</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Fill in all translations below on this exam sheet, then submit for assessment grading.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors"
              title="Open Test Settings"
            >
              <Settings className="w-4 h-4 text-indigo-400" />
            </button>

            <button
              type="button"
              onClick={onExit}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl cursor-pointer"
            >
              Exit
            </button>
          </div>
        </div>

        {/* German Quick Accent Bar if German deck */}
        {isGerman && (
          <GermanAccentBar onInsertChar={handleInsertChar} visible={true} />
        )}

        {/* SINGLE FULL-PAGE EXAM ROSTER */}
        <div className="space-y-3.5 max-h-[62vh] overflow-y-auto pr-2">
          {deck.items.map((item, idx) => {
            const prompt = isLanguageReversed ? item.de[0] : item.prompt;
            const promptLang = isLanguageReversed ? deck.lang2 : deck.lang1;
            const isAnswered = !!userInputs[idx]?.trim();

            return (
              <div
                key={idx}
                className={`p-4 rounded-2xl border transition-all ${
                  isAnswered
                    ? 'bg-slate-950 border-emerald-500/40 shadow-sm'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-800 text-amber-400 font-mono font-black text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <h3
                      onClick={() => handlePromptClick(prompt, promptLang)}
                      className="text-base sm:text-lg font-black text-white hover:text-amber-300 cursor-pointer transition-colors"
                      title="Click for pronunciation"
                    >
                      {prompt}
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => speakNaturalText(prompt, promptLang)}
                    className="text-indigo-400 hover:text-amber-300 font-bold text-xs inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Listen</span>
                  </button>
                </div>

                <input
                  type="text"
                  value={userInputs[idx] || ''}
                  onFocus={() => setFocusedIndex(idx)}
                  onChange={e => handleInputChange(idx, e.target.value)}
                  placeholder="Type translation here..."
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 focus:border-amber-400 rounded-xl text-amber-300 font-bold text-sm outline-none transition-colors"
                />
              </div>
            );
          })}
        </div>

        {/* Submit Exam Button */}
        <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-400">
            {answeredCount === deck.items.length ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                All {deck.items.length} questions completed! Ready to submit.
              </span>
            ) : (
              <span>{deck.items.length - answeredCount} questions remaining unblanked.</span>
            )}
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            className="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm rounded-2xl shadow-xl cursor-pointer transition-colors active:scale-95"
          >
            Submit Exam
          </button>
        </div>
      </div>

      {/* IN-SESSION SETTINGS MODAL */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-indigo-500 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 text-left">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-indigo-400" />
                <h3 className="text-base font-black text-white">Test Mode Settings</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSettingsOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Language Direction */}
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

            {/* Large Print Mode */}
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
