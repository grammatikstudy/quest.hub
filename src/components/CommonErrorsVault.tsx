import React, { useState } from 'react';
import { UserAccount, VocabItem } from '../types';
import { playSound, speakNaturalText } from '../utils/soundEffects';
import { ArrowLeft, CheckCircle2, RotateCcw, Trash2, CheckSquare, Square, Volume2, BarChart2, BookOpen, HelpCircle, ChevronLeft, ChevronRight } from 'lucide-react';

interface CommonErrorsVaultProps {
  currentUser: UserAccount;
  onClearErrors: () => void;
  onStartReviewPractice: (items: VocabItem[]) => void;
  onBackToLanding: () => void;
}

export const CommonErrorsVault: React.FC<CommonErrorsVaultProps> = ({
  currentUser,
  onClearErrors,
  onStartReviewPractice,
  onBackToLanding
}) => {
  const [activeTab, setActiveTab] = useState<'individual' | 'quiz' | 'chart'>('individual');
  const [individualIndex, setIndividualIndex] = useState(0);
  const [isIndividualFlipped, setIsIndividualFlipped] = useState(false);
  const [masteredIndices, setMasteredIndices] = useState<number[]>([]);

  // Local errors list
  const errors = currentUser.commonErrors || [];

  // Group and rank errors by frequency / missed count
  const rankedErrors = [...errors].map(err => ({
    ...err,
    missedCount: err.missedCount || 1
  })).sort((a, b) => (b.missedCount || 1) - (a.missedCount || 1));

  const maxMissedCount = Math.max(...rankedErrors.map(e => e.missedCount || 1), 1);

  const toggleMastered = (idx: number) => {
    playSound('click');
    setMasteredIndices(prev =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const handleLaunchQuiz = () => {
    if (errors.length === 0) return;
    playSound('click');
    const items: VocabItem[] = errors.map(e => ({
      prompt: e.prompt,
      de: e.de
    }));
    onStartReviewPractice(items);
  };

  const currentIndividualItem = errors[individualIndex];

  return (
    <div className="flex-1 max-w-3xl w-full mx-auto px-4 py-6 flex flex-col justify-center">
      <div className="bg-slate-900 border-2 border-indigo-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/30">
              Spaced Repetition
            </span>
            <h2 className="text-2xl font-black text-white mt-1">Common Errors Vault</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Review and clear terms where mistakes were logged during quizzes and study modes.
            </p>
          </div>
          <button
            type="button"
            onClick={onBackToLanding}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Arena</span>
          </button>
        </div>

        {/* 3 Tabs: Individual, Quiz Generator, Most Missed Chart */}
        <div className="flex gap-2 border-b border-slate-800 pb-3">
          <button
            type="button"
            onClick={() => { playSound('click'); setActiveTab('individual'); }}
            className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer transition-colors ${
              activeTab === 'individual'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-950 text-slate-400 border border-slate-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Individual Cards ({errors.length})</span>
          </button>

          <button
            type="button"
            onClick={() => { playSound('click'); setActiveTab('quiz'); }}
            className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer transition-colors ${
              activeTab === 'quiz'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-950 text-slate-400 border border-slate-800'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Generate Quiz</span>
          </button>

          <button
            type="button"
            onClick={() => { playSound('click'); setActiveTab('chart'); }}
            className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer transition-colors ${
              activeTab === 'chart'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-950 text-slate-400 border border-slate-800'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Most Missed Chart</span>
          </button>
        </div>

        {/* Empty State */}
        {errors.length === 0 ? (
          <div className="p-10 text-center bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h3 className="text-base font-black text-white">No Errors Logged</h3>
            <p className="text-xs text-slate-400">You currently have no missed terms in the vault. Outstanding accuracy!</p>
          </div>
        ) : (
          <>
            {/* TAB 1: INDIVIDUAL FLASHCARDS */}
            {activeTab === 'individual' && currentIndividualItem && (
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span>Card {individualIndex + 1} of {errors.length}</span>
                  <button
                    type="button"
                    onClick={() => toggleMastered(individualIndex)}
                    className="flex items-center gap-1.5 text-amber-300 font-bold hover:underline cursor-pointer"
                  >
                    {masteredIndices.includes(individualIndex) ? (
                      <>
                        <CheckSquare className="w-4 h-4 text-emerald-400" />
                        <span>Marked as Mastered</span>
                      </>
                    ) : (
                      <>
                        <Square className="w-4 h-4 text-slate-500" />
                        <span>Mark Mastered</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Flip Card */}
                <div
                  onClick={() => setIsIndividualFlipped(!isIndividualFlipped)}
                  className="p-10 bg-slate-950 border-2 border-indigo-500/50 hover:border-indigo-400 rounded-3xl min-h-[200px] flex flex-col justify-center items-center text-center cursor-pointer transition-all shadow-lg"
                >
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">
                    {isIndividualFlipped ? 'Definition' : 'Term (Click to flip)'}
                  </span>
                  <h3 className="text-3xl font-black text-white">
                    {isIndividualFlipped
                      ? currentIndividualItem.de.join(', ')
                      : currentIndividualItem.prompt}
                  </h3>
                </div>

                {/* Navigation and Audio */}
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      setIsIndividualFlipped(false);
                      setIndividualIndex(prev => (prev - 1 + errors.length) % errors.length);
                      playSound('click');
                    }}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => speakNaturalText(currentIndividualItem.prompt, 'de-DE')}
                    className="p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-indigo-300 rounded-xl cursor-pointer"
                    title="Pronounce term"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsIndividualFlipped(false);
                      setIndividualIndex(prev => (prev + 1) % errors.length);
                      playSound('click');
                    }}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: QUIZ GENERATOR */}
            {activeTab === 'quiz' && (
              <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl text-center space-y-4">
                <HelpCircle className="w-10 h-10 text-amber-400 mx-auto" />
                <div>
                  <h3 className="text-base font-black text-white">Targeted Errors Quiz</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                    Generate an interactive quiz covering all {errors.length} missed terms to convert them to permanent mastery.
                  </p>
                </div>

                <div className="flex justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleLaunchQuiz}
                    className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow cursor-pointer transition-colors flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Launch Error Practice Quiz</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      playSound('correct');
                      onClearErrors();
                    }}
                    className="px-4 py-3 bg-slate-800 hover:bg-rose-950 hover:text-rose-300 text-slate-300 font-bold text-xs rounded-xl cursor-pointer transition-colors"
                  >
                    Clear All Errors
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: MOST MISSED CHART */}
            {activeTab === 'chart' && (
              <div className="space-y-3">
                <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider block">
                  Missed Frequency Ranking:
                </span>
                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {rankedErrors.map((err, idx) => {
                    const count = err.missedCount || 1;
                    const pct = Math.min(100, Math.round((count / maxMissedCount) * 100));

                    return (
                      <div
                        key={idx}
                        className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5"
                      >
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-white">
                            {idx + 1}. {err.prompt}
                          </span>
                          <span className="text-[11px] text-amber-300 font-mono font-bold">
                            Missed {count}x ({err.de.join(', ')})
                          </span>
                        </div>
                        {/* Visual Frequency Bar */}
                        <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                          <div
                            className="bg-rose-500 h-full rounded-full transition-all duration-300"
                            style={{ width: `${pct}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
