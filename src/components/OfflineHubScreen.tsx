import React, { useState } from 'react';
import { DeckUnit, VocabItem, FontSize } from '../types';
import { playSound, speakNaturalText } from '../utils/soundEffects';
import { checkLatinOrGermanAnswer } from '../utils/latinValidator';
import {
  WifiOff,
  ArrowLeft,
  Layers,
  PenTool,
  Volume2,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  BookOpen,
  Search,
  Type
} from 'lucide-react';

interface OfflineHubScreenProps {
  allDecks: DeckUnit[];
  onBackToLanding: () => void;
  fontSize: FontSize;
  onSelectFontSize: (size: FontSize) => void;
}

export const OfflineHubScreen: React.FC<OfflineHubScreenProps> = ({
  allDecks,
  onBackToLanding,
  fontSize,
  onSelectFontSize
}) => {
  const [selectedDeck, setSelectedDeck] = useState<DeckUnit>(allDecks[0] || null);
  const [activeMode, setActiveMode] = useState<'decks' | 'flashcards' | 'quiz'>('decks');
  const [searchFilter, setSearchFilter] = useState('');

  // Flashcards state
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Offline Quiz state
  const [quizInputs, setQuizInputs] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const filteredDecks = allDecks.filter(
    d =>
      d.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      d.badge.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const handleStartFlashcards = (deck: DeckUnit) => {
    setSelectedDeck(deck);
    setFlashcardIndex(0);
    setIsFlipped(false);
    setActiveMode('flashcards');
    playSound('click');
  };

  const handleStartQuiz = (deck: DeckUnit) => {
    setSelectedDeck(deck);
    setQuizInputs({});
    setQuizSubmitted(false);
    setQuizScore(0);
    setActiveMode('quiz');
    playSound('click');
  };

  const handleFlipCard = () => {
    setIsFlipped(!isFlipped);
    playSound('click');
  };

  const handleNextCard = () => {
    if (!selectedDeck) return;
    setIsFlipped(false);
    setFlashcardIndex(prev => (prev + 1) % selectedDeck.items.length);
    playSound('click');
  };

  const handlePrevCard = () => {
    if (!selectedDeck) return;
    setIsFlipped(false);
    setFlashcardIndex(prev => (prev - 1 + selectedDeck.items.length) % selectedDeck.items.length);
    playSound('click');
  };

  const handleQuizSubmit = () => {
    if (!selectedDeck) return;
    playSound('click');
    let correctCount = 0;
    const isLatin = selectedDeck.lang1 === 'la' || selectedDeck.lang2 === 'la';

    selectedDeck.items.forEach((item, idx) => {
      const input = (quizInputs[idx] || '').trim();
      const accepted = item.de;
      const res = checkLatinOrGermanAnswer(input, accepted, isLatin);
      if (res.isCorrect) correctCount++;
    });

    setQuizScore(correctCount);
    setQuizSubmitted(true);
    playSound(correctCount > 0 ? 'correct' : 'error');
  };

  return (
    <div className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 flex flex-col justify-center">
      <div className="bg-slate-900 border-2 border-cyan-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center font-bold">
              <WifiOff className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase text-cyan-400 tracking-wider">
                  Offline Station
                </span>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30 uppercase">
                  100% Client-Side Cached
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">Standalone Offline Practice Hub</h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Large Print Toggle */}
            <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-xl border border-slate-800">
              <Type className="w-3.5 h-3.5 text-slate-400" />
              <button
                type="button"
                onClick={() => onSelectFontSize('normal')}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold cursor-pointer ${
                  fontSize === 'normal' ? 'bg-cyan-600 text-white' : 'text-slate-400'
                }`}
              >
                A
              </button>
              <button
                type="button"
                onClick={() => onSelectFontSize('large')}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold cursor-pointer ${
                  fontSize === 'large' ? 'bg-cyan-600 text-white' : 'text-slate-400'
                }`}
              >
                A+
              </button>
              <button
                type="button"
                onClick={() => onSelectFontSize('xlarge')}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold cursor-pointer ${
                  fontSize === 'xlarge' ? 'bg-cyan-600 text-white' : 'text-slate-400'
                }`}
              >
                A++
              </button>
            </div>

            <button
              type="button"
              onClick={onBackToLanding}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Arena</span>
            </button>
          </div>
        </div>

        {/* VIEW 1: DECK BROWSER */}
        {activeMode === 'decks' && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row justify-between gap-3">
              <p className="text-xs text-slate-400">
                All vocabulary decks and your custom sets are fully stored in device cache. Study anywhere without an internet connection.
              </p>

              <div className="relative min-w-[240px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter cached decks..."
                  value={searchFilter}
                  onChange={e => setSearchFilter(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 font-bold outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 max-h-[60vh] overflow-y-auto pr-1">
              {filteredDecks.map(deck => (
                <div
                  key={deck.id}
                  className="p-4 bg-slate-950 border border-slate-800 hover:border-cyan-500/50 rounded-2xl flex flex-col justify-between space-y-3 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                        {deck.badge}
                      </span>
                      <span className="text-[11px] font-bold text-slate-500">
                        {deck.items.length} terms
                      </span>
                    </div>
                    <h3 className="text-sm font-black text-white">{deck.title}</h3>
                    <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                      {deck.items.slice(0, 3).map(i => i.prompt).join(', ')}...
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-900">
                    <button
                      type="button"
                      onClick={() => handleStartFlashcards(deck)}
                      className="py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-sm transition-colors"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>Flashcards</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStartQuiz(deck)}
                      className="py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-sm transition-colors"
                    >
                      <PenTool className="w-3.5 h-3.5" />
                      <span>Offline Quiz</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 2: OFFLINE FLASHCARDS */}
        {activeMode === 'flashcards' && selectedDeck && (
          <div className="space-y-5 max-w-xl mx-auto">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => { playSound('click'); setActiveMode('decks'); }}
                className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>All Offline Decks</span>
              </button>
              <span className="text-xs font-mono font-black text-cyan-300">
                {flashcardIndex + 1} / {selectedDeck.items.length}
              </span>
            </div>

            {/* Interactive Flashcard */}
            {(() => {
              const item = selectedDeck.items[flashcardIndex];
              const promptText = isFlipped ? item.de.join(' / ') : item.prompt;
              const promptLang = isFlipped ? selectedDeck.lang2 : selectedDeck.lang1;

              return (
                <div
                  onClick={handleFlipCard}
                  className="bg-slate-950 border-2 border-cyan-500/60 rounded-3xl p-8 sm:p-12 text-center min-h-[260px] flex flex-col justify-between cursor-pointer shadow-2xl hover:border-cyan-400 transition-all select-none"
                >
                  <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">
                    {isFlipped ? 'Translation / Definition' : 'Prompt Term (Click Card to Flip)'}
                  </span>

                  <h3 className="text-3xl sm:text-4xl font-black text-white break-words my-auto">
                    {promptText}
                  </h3>

                  <div className="flex justify-center items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        speakNaturalText(promptText, promptLang);
                      }}
                      className="text-xs font-bold text-cyan-400 hover:text-white inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>Audio</span>
                    </button>
                  </div>
                </div>
              );
            })()}

            {/* Controls */}
            <div className="flex justify-between items-center gap-3">
              <button
                type="button"
                onClick={handlePrevCard}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl cursor-pointer"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={handleFlipCard}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs rounded-xl cursor-pointer shadow"
              >
                Flip Card
              </button>
              <button
                type="button"
                onClick={handleNextCard}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* VIEW 3: OFFLINE QUIZ (SINGLE-PAGE TEST) */}
        {activeMode === 'quiz' && selectedDeck && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => { playSound('click'); setActiveMode('decks'); }}
                className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>All Offline Decks</span>
              </button>

              {quizSubmitted && (
                <div className="text-xs font-black bg-cyan-950 text-cyan-300 border border-cyan-800 px-3 py-1 rounded-xl">
                  Score: {quizScore} / {selectedDeck.items.length} ({Math.round((quizScore / selectedDeck.items.length) * 100)}%)
                </div>
              )}
            </div>

            {/* Single full-page question list */}
            <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
              {selectedDeck.items.map((item, idx) => {
                const userVal = quizInputs[idx] || '';
                const isLatin = selectedDeck.lang1 === 'la' || selectedDeck.lang2 === 'la';
                const checkRes = checkLatinOrGermanAnswer(userVal.trim(), item.de, isLatin);

                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border transition-all ${
                      quizSubmitted
                        ? checkRes.isCorrect
                          ? 'bg-emerald-950/20 border-emerald-500/50'
                          : 'bg-rose-950/20 border-rose-500/50'
                        : 'bg-slate-950 border-slate-800'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-black text-amber-300">
                        #{idx + 1} {item.prompt}
                      </span>
                      <button
                        type="button"
                        onClick={() => speakNaturalText(item.prompt, selectedDeck.lang1)}
                        className="text-slate-400 hover:text-cyan-300 text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>Listen</span>
                      </button>
                    </div>

                    <input
                      type="text"
                      disabled={quizSubmitted}
                      value={userVal}
                      onChange={e => setQuizInputs({ ...quizInputs, [idx]: e.target.value })}
                      placeholder="Type offline translation..."
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-bold outline-none focus:border-cyan-400 disabled:opacity-80"
                    />

                    {quizSubmitted && (
                      <div className="mt-2 text-xs font-bold flex items-center justify-between">
                        <span className={checkRes.isCorrect ? 'text-emerald-400' : 'text-rose-400'}>
                          {checkRes.isCorrect ? 'Correct' : `Incorrect: Accepted answer is "${item.de[0]}"`}
                        </span>
                        {checkRes.isCorrect ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-400" />
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {!quizSubmitted ? (
              <button
                type="button"
                onClick={handleQuizSubmit}
                className="w-full py-3.5 bg-cyan-600 hover:bg-cyan-500 text-white font-black text-sm rounded-2xl shadow-lg cursor-pointer transition-colors"
              >
                Submit Offline Exam
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setQuizInputs({});
                  setQuizSubmitted(false);
                  setQuizScore(0);
                }}
                className="w-full py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-black text-sm rounded-2xl cursor-pointer transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retake Quiz</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
