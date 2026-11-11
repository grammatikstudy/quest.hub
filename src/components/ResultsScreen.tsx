import React, { useEffect, useState } from 'react';
import { DeckUnit, VocabItem } from '../types';
import { playSound } from '../utils/soundEffects';
import confetti from 'canvas-confetti';
import { CheckCircle2, XCircle, RotateCcw, Check, Sparkles, Bot, Loader2, ChevronDown, ChevronUp } from 'lucide-react';

interface ResultsScreenProps {
  score: number;
  total: number;
  answersLog: { prompt: string; userAns: string; correctAns: string; isCorrect: boolean }[];
  missedItems: VocabItem[];
  deck: DeckUnit;
  onReviewMissed: (items: VocabItem[]) => void;
  onMarkDeckCompleted: (deckId: string, clearedItems: VocabItem[]) => void;
  onReturnToLanding: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  score,
  total,
  answersLog,
  missedItems,
  deck,
  onReviewMissed,
  onMarkDeckCompleted,
  onReturnToLanding
}) => {
  const percent = total > 0 ? Math.round((score / total) * 100) : 0;
  const coinsEarned = score * 5;

  // AI explanations map by item index
  const [aiExplanations, setAiExplanations] = useState<Record<number, string>>({});
  const [loadingAiIndex, setLoadingAiIndex] = useState<number | null>(null);

  useEffect(() => {
    if (percent >= 80) {
      playSound('fanfare');
      confetti({ particleCount: 160, spread: 90, origin: { y: 0.6 } });
    } else {
      playSound('correct');
    }
  }, [percent]);

  const handleRequestAiExplanation = async (idx: number, prompt: string, userAns: string, correctAns: string) => {
    if (loadingAiIndex !== null || aiExplanations[idx]) return;

    playSound('click');
    setLoadingAiIndex(idx);

    try {
      const response = await fetch('/api/ai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          userAns,
          correctAns,
          deckTitle: deck.title
        })
      });

      if (!response.ok) throw new Error('AI explanation failed');
      const data = await response.json();
      setAiExplanations(prev => ({
        ...prev,
        [idx]: data.explanation || 'Review the accepted answer and compare verb endings and noun cases.'
      }));
      playSound('correct');
    } catch {
      setAiExplanations(prev => ({
        ...prev,
        [idx]: `The accepted translation is "${correctAns}". For Latin 3rd person verbs, remember to include either he, she, or it (e.g. "he works"). For German, check noun genders (der, die, das) and case endings.`
      }));
    } finally {
      setLoadingAiIndex(null);
    }
  };

  let rank = 'LANGUAGE LEGEND';
  let rankColor = 'text-amber-400 bg-amber-500/20 border-amber-500/40';
  if (percent < 50) {
    rank = 'ROOKIE ADVENTURER';
    rankColor = 'text-slate-300 bg-slate-800 border-slate-700';
  } else if (percent < 80) {
    rank = 'PRO ARENA SKILLER';
    rankColor = 'text-indigo-300 bg-indigo-950 border-indigo-800';
  }

  const handleCompletedTestClick = () => {
    playSound('correct');
    onMarkDeckCompleted(deck.id, deck.items);
  };

  return (
    <div className="flex-1 max-w-3xl w-full mx-auto px-4 py-6 flex flex-col justify-center">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Banner */}
        <div className="bg-gradient-to-r from-indigo-950 via-purple-950 to-slate-950 border-2 border-amber-400/50 p-6 sm:p-8 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="text-center sm:text-left z-10">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase mb-2 border ${rankColor}`}>
              {rank}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">Challenge Completed!</h2>
            <p className="text-slate-300 text-xs sm:text-sm font-medium mt-1">
              You tested {deck.title} in the arena.
            </p>
          </div>

          <div className="bg-slate-950/90 border-2 border-amber-400 p-5 rounded-2xl text-center min-w-[150px] shadow-2xl z-10">
            <div className="text-4xl font-black text-amber-400 font-mono">{percent}%</div>
            <div className="text-xs font-extrabold text-indigo-300 mt-1 uppercase">
              {score} / {total} Marks
            </div>
            <div className="mt-1 text-xs font-bold text-amber-300 flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>+{coinsEarned} Coins</span>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <h3 className="text-base font-black text-white">Assessment Review & AI Explanations</h3>

          <div className="flex gap-2">
            {missedItems.length > 0 && (
              <button
                type="button"
                onClick={() => onReviewMissed(missedItems)}
                className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Review Missed Words ({missedItems.length})</span>
              </button>
            )}

            {/* Completed Test & Gray Out Button */}
            <button
              type="button"
              onClick={handleCompletedTestClick}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
              title="Mark this deck as completed, grey it out, and clear words from common errors"
            >
              <Check className="w-4 h-4" />
              <span>Completed Test</span>
            </button>
          </div>
        </div>

        {/* Answers List Breakdown with AI Explanations */}
        <div className="space-y-3.5 max-h-80 overflow-y-auto pr-1">
          {answersLog.map((ans, idx) => {
            const hasExplanation = !!aiExplanations[idx];
            const isLoadingThis = loadingAiIndex === idx;

            return (
              <div
                key={idx}
                className={`p-4 rounded-2xl border-2 transition-all ${
                  ans.isCorrect
                    ? 'bg-emerald-950/20 border-emerald-500/40'
                    : 'bg-rose-950/20 border-rose-500/40'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <span className="text-xs font-bold text-slate-300">
                    Question #{idx + 1}: <strong className="text-amber-300">{ans.prompt}</strong>
                  </span>
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                    ans.isCorrect
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  }`}>
                    {ans.isCorrect ? 'Correct +5 Coins' : 'Incorrect'}
                  </span>
                </div>

                <div className="text-xs font-bold">
                  <span className="text-slate-500 text-[11px] uppercase">Your Answer:</span>
                  <span className={`ml-1.5 ${ans.isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {ans.userAns}
                  </span>
                </div>

                {!ans.isCorrect && (
                  <div className="text-xs font-bold mt-1">
                    <span className="text-slate-500 text-[11px] uppercase">Accepted Correct Answer:</span>
                    <span className="text-amber-300 ml-1.5">{ans.correctAns}</span>
                  </div>
                )}

                {/* AI Explanation Button for Failed Questions */}
                {!ans.isCorrect && (
                  <div className="mt-3 pt-2.5 border-t border-slate-800/80">
                    {!hasExplanation ? (
                      <button
                        type="button"
                        disabled={isLoadingThis}
                        onClick={() => handleRequestAiExplanation(idx, ans.prompt, ans.userAns, ans.correctAns)}
                        className="px-3 py-1.5 bg-indigo-950/70 hover:bg-indigo-900/70 text-indigo-300 border border-indigo-500/40 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        {isLoadingThis ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                            <span>Explaining grammar...</span>
                          </>
                        ) : (
                          <>
                            <Bot className="w-3.5 h-3.5 text-indigo-400" />
                            <span>Explain with AI Tutor</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <div className="bg-slate-950 border border-indigo-500/30 rounded-xl p-3 text-xs space-y-1">
                        <div className="flex items-center gap-1.5 text-indigo-300 font-black text-[11px] uppercase">
                          <Bot className="w-3.5 h-3.5" />
                          <span>AI Tutor Explanation:</span>
                        </div>
                        <p className="text-slate-200 leading-relaxed">
                          {aiExplanations[idx]}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Actions */}
        <div className="flex justify-center gap-4 pt-2">
          <button
            type="button"
            onClick={onReturnToLanding}
            className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm rounded-2xl shadow-xl transition-all active:scale-95 cursor-pointer"
          >
            Choose Next Quest
          </button>
        </div>
      </div>
    </div>
  );
};
