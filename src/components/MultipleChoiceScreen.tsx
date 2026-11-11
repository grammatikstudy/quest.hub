import React, { useState, useEffect, useRef } from 'react';
import { DeckUnit, VocabItem, FontSize } from '../types';
import { generateMultipleChoiceOptions } from '../utils/distractorGenerator';
import { checkLatinOrGermanAnswer } from '../utils/latinValidator';
import { playSound, speakNaturalText } from '../utils/soundEffects';
import { GermanAccentBar } from './GermanAccentBar';
import { Volume2, ArrowLeft, Settings, X, Mic, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

interface MultipleChoiceScreenProps {
  deck: DeckUnit;
  globalPool: VocabItem[];
  isLanguageReversed: boolean;
  onToggleLanguageReversal?: () => void;
  autoTtsEnabled?: boolean;
  onToggleAutoTts?: () => void;
  onFinishMC: (
    score: number,
    total: number,
    userAnswers: { prompt: string; userAns: string; correctAns: string; isCorrect: boolean }[],
    missedWords: VocabItem[]
  ) => void;
  onExit: () => void;
  onRightClickWord?: (word: string, lang: string) => void;
  fontSize?: FontSize;
  onSelectFontSize?: (size: FontSize) => void;
}

export const MultipleChoiceScreen: React.FC<MultipleChoiceScreenProps> = ({
  deck,
  globalPool,
  isLanguageReversed,
  onToggleLanguageReversal,
  autoTtsEnabled = false,
  onToggleAutoTts,
  onFinishMC,
  onExit,
  onRightClickWord,
  fontSize = 'normal',
  onSelectFontSize
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [questionFormat, setQuestionFormat] = useState<'mc' | 'typing'>('mc');
  const [options, setOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [typedInput, setTypedInput] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCurrentCorrect, setIsCurrentCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [coinsEarned, setCoinsEarned] = useState(0);
  const [userAnswers, setUserAnswers] = useState<
    { prompt: string; userAns: string; correctAns: string; isCorrect: boolean }[]
  >([]);
  const [missedWords, setMissedWords] = useState<VocabItem[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const currentItem = deck.items[currentIndex] || { prompt: '', de: [''] };
  const promptText = isLanguageReversed ? currentItem.de[0] : currentItem.prompt;
  const correctAnswer = isLanguageReversed ? currentItem.prompt : currentItem.de[0];
  const acceptedAnswers = isLanguageReversed ? [currentItem.prompt] : currentItem.de;
  const promptLang = isLanguageReversed ? deck.lang2 : deck.lang1;
  const isLatin = deck.lang1 === 'la' || deck.lang2 === 'la';
  const isGerman = deck.lang1 === 'de-DE' || deck.lang2 === 'de-DE';

  useEffect(() => {
    const rawOptions = generateMultipleChoiceOptions(currentItem, deck.items, globalPool);
    setOptions(rawOptions);
    setSelectedOption(null);
    setTypedInput('');
    setIsAnswered(false);
    setIsCurrentCorrect(false);

    if (autoTtsEnabled && promptText) {
      speakNaturalText(promptText, promptLang);
    }
  }, [currentIndex, deck, isLanguageReversed]);

  const handleInsertChar = (char: string) => {
    setTypedInput(prev => prev + char);
    inputRef.current?.focus();
  };

  const handleSelectOption = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);

    const isCorrect = option.toLowerCase().trim() === correctAnswer.toLowerCase().trim();
    setIsCurrentCorrect(isCorrect);

    if (isCorrect) {
      playSound('correct');
      setScore(prev => prev + 1);
      setCoinsEarned(prev => prev + 5);
    } else {
      playSound('error');
      setMissedWords(prev => [...prev, currentItem]);
    }

    const updatedAnswers = [
      ...userAnswers,
      {
        prompt: promptText,
        userAns: option,
        correctAns: correctAnswer,
        isCorrect
      }
    ];
    setUserAnswers(updatedAnswers);

    setTimeout(() => {
      advanceNextQuestion(isCorrect, updatedAnswers);
    }, 700);
  };

  const handleTypedSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isAnswered || !typedInput.trim()) return;

    setIsAnswered(true);
    const evalRes = checkLatinOrGermanAnswer(typedInput.trim(), acceptedAnswers, isLatin);
    setIsCurrentCorrect(evalRes.isCorrect);

    if (evalRes.isCorrect) {
      playSound('correct');
      setScore(prev => prev + 1);
      setCoinsEarned(prev => prev + 5);
    } else {
      playSound('error');
      setMissedWords(prev => [...prev, currentItem]);
    }

    const updatedAnswers = [
      ...userAnswers,
      {
        prompt: promptText,
        userAns: typedInput.trim(),
        correctAns: acceptedAnswers.join(' / '),
        isCorrect: evalRes.isCorrect
      }
    ];
    setUserAnswers(updatedAnswers);
  };

  const advanceNextQuestion = (isCorrectCurrent: boolean, currentAnsLog: typeof userAnswers) => {
    if (currentIndex + 1 < deck.items.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      const finalScore = isCorrectCurrent ? score + 1 : score;
      const finalMissed = isCorrectCurrent ? missedWords : [...missedWords, currentItem];
      onFinishMC(finalScore, deck.items.length, currentAnsLog, finalMissed);
    }
  };

  const handlePromptClick = () => {
    if (onRightClickWord && promptLang !== 'en-GB' && promptLang !== 'en-US' && promptLang !== 'en') {
      onRightClickWord(promptText, promptLang);
    } else {
      speakNaturalText(promptText, promptLang);
    }
  };

  const optionLabels = ['A', 'B', 'C', 'D'];

  return (
    <div className="flex-1 max-w-2xl w-full mx-auto px-4 py-6 flex flex-col justify-center">
      <div className="bg-slate-900 border-2 border-amber-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 flex-wrap gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                Learn Mode
              </span>
              <span className="text-xs font-mono font-bold text-amber-300">
                +{coinsEarned} Coins
              </span>
            </div>
            <h2 className="text-xl font-black text-white mt-1">{deck.title}</h2>
          </div>

          <div className="flex items-center gap-2">
            {/* Format toggle: Multiple Choice vs Typing */}
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold">
              <button
                type="button"
                onClick={() => { playSound('click'); setQuestionFormat('mc'); }}
                className={`px-2.5 py-1 rounded-lg cursor-pointer transition-colors ${
                  questionFormat === 'mc' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400'
                }`}
              >
                Choices
              </button>
              <button
                type="button"
                onClick={() => { playSound('click'); setQuestionFormat('typing'); }}
                className={`px-2.5 py-1 rounded-lg cursor-pointer transition-colors ${
                  questionFormat === 'typing' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400'
                }`}
              >
                Typing
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 cursor-pointer transition-colors"
              title="Learn Mode Settings"
            >
              <Settings className="w-4 h-4 text-indigo-400" />
            </button>

            <div className="text-xs font-black bg-slate-950 text-slate-300 border border-slate-800 px-3 py-1 rounded-xl font-mono">
              {currentIndex + 1} / {deck.items.length}
            </div>
          </div>
        </div>

        {/* German Quick Accent Bar if German deck & typing */}
        {isGerman && questionFormat === 'typing' && (
          <GermanAccentBar onInsertChar={handleInsertChar} visible={true} />
        )}

        {/* Prompt Card */}
        <div className="bg-slate-950 border-2 border-indigo-500/40 rounded-2xl p-6 text-center space-y-2">
          <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider block">
            Translate this term
          </span>
          <div
            onClick={handlePromptClick}
            className="cursor-pointer group inline-flex items-center gap-2 px-3 py-1 rounded-xl hover:bg-slate-900 transition-colors"
            title="Click for pronunciation practice"
          >
            <h3 className="text-2xl sm:text-3xl font-black text-white group-hover:text-amber-300 transition-colors">
              {promptText}
            </h3>
            <Mic className="w-4 h-4 text-slate-500 group-hover:text-amber-400 opacity-60 group-hover:opacity-100 transition-opacity" />
          </div>
          <div>
            <button
              type="button"
              onClick={() => speakNaturalText(promptText, promptLang)}
              className="text-xs font-bold text-indigo-400 hover:text-amber-300 inline-flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Listen</span>
            </button>
          </div>
        </div>

        {/* QUESTION FORMAT 1: 4 CHOICES */}
        {questionFormat === 'mc' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {options.map((opt, idx) => {
              let btnClass = 'bg-slate-950 border-slate-800 hover:border-amber-400 text-slate-200';

              if (isAnswered) {
                if (opt.toLowerCase().trim() === correctAnswer.toLowerCase().trim()) {
                  btnClass = 'bg-emerald-950/60 border-emerald-500 text-emerald-300 shadow-md ring-1 ring-emerald-500';
                } else if (opt === selectedOption) {
                  btnClass = 'bg-rose-950/60 border-rose-500 text-rose-300';
                } else {
                  btnClass = 'bg-slate-950/40 border-slate-800 text-slate-500 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(opt)}
                  className={`p-4 rounded-2xl border-2 font-bold text-sm text-left transition-all cursor-pointer flex items-center gap-3.5 ${btnClass} active:scale-95`}
                >
                  <span className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center font-black text-xs text-amber-400 shrink-0 font-mono">
                    {optionLabels[idx]}
                  </span>
                  <span className="break-words flex-1 leading-snug">{opt}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* QUESTION FORMAT 2: TYPING WITH INSTANT FEEDBACK */}
        {questionFormat === 'typing' && (
          <form onSubmit={handleTypedSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">
                Type Your Answer
              </label>
              <input
                ref={inputRef}
                type="text"
                autoFocus
                disabled={isAnswered}
                value={typedInput}
                onChange={e => setTypedInput(e.target.value)}
                placeholder="Type translation..."
                className="w-full px-4 py-3 bg-slate-950 border-2 border-slate-800 focus:border-amber-400 rounded-xl text-amber-300 font-bold text-base outline-none transition-colors disabled:opacity-75"
              />
            </div>

            {!isAnswered ? (
              <button
                type="submit"
                disabled={!typedInput.trim()}
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-black text-xs rounded-xl shadow cursor-pointer transition-colors"
              >
                Check Answer
              </button>
            ) : (
              <div className="space-y-3">
                <div
                  className={`p-3.5 rounded-xl border flex items-center justify-between text-xs font-bold ${
                    isCurrentCorrect
                      ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                      : 'bg-rose-950/40 border-rose-500/50 text-rose-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {isCurrentCorrect ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400" />
                    )}
                    <span>
                      {isCurrentCorrect
                        ? 'Correct! +5 Coins awarded.'
                        : `Incorrect. Accepted: "${acceptedAnswers.join(' / ')}"`}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => advanceNextQuestion(isCurrentCorrect, userAnswers)}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs rounded-xl shadow flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </form>
        )}

        {/* Bottom Exit */}
        <div className="flex justify-between items-center pt-2">
          <button
            type="button"
            onClick={onExit}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Exit Session</span>
          </button>

          <span className="text-xs text-slate-500 font-mono">
            Score: <strong className="text-amber-400">{score}</strong> / {deck.items.length}
          </span>
        </div>
      </div>

      {/* IN-SESSION SETTINGS MODAL */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-indigo-500 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 text-left">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-indigo-400" />
                <h3 className="text-base font-black text-white">Learn Mode Settings</h3>
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

            {/* Auto-TTS */}
            {onToggleAutoTts && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                  Automatic Audio Pronunciation
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (autoTtsEnabled) onToggleAutoTts();
                    }}
                    className={`p-2.5 rounded-xl border text-xs font-bold cursor-pointer ${
                      !autoTtsEnabled
                        ? 'bg-indigo-600 text-white border-indigo-500'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    Off
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!autoTtsEnabled) onToggleAutoTts();
                    }}
                    className={`p-2.5 rounded-xl border text-xs font-bold cursor-pointer ${
                      autoTtsEnabled
                        ? 'bg-indigo-600 text-white border-indigo-500'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    On (Every Question)
                  </button>
                </div>
              </div>
            )}

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
