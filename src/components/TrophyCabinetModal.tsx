import React from 'react';
import { UserAccount } from '../types';
import { ALL_TROPHIES } from '../data/defaultVocab';
import { X, Trophy as TrophyIcon, Lock, CheckCircle, Sparkles } from 'lucide-react';

interface TrophyCabinetModalProps {
  isOpen: boolean;
  currentUser: UserAccount;
  onClose: () => void;
}

export const TrophyCabinetModal: React.FC<TrophyCabinetModalProps> = ({
  isOpen,
  currentUser,
  onClose
}) => {
  if (!isOpen) return null;

  const unlockedIds = currentUser.trophies || [];
  const unlockedCount = unlockedIds.length;
  const totalCount = ALL_TROPHIES.length;
  const progressPct = Math.round((unlockedCount / totalCount) * 100);

  const getRarityBadge = (rarity: string) => {
    switch (rarity) {
      case 'Legendary':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/50';
      case 'Gold':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50';
      case 'Silver':
        return 'bg-slate-300/20 text-slate-200 border-slate-400/50';
      default:
        return 'bg-amber-800/20 text-amber-400 border-amber-700/50';
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border-2 border-amber-400/60 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-black">
              <TrophyIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Grand Trophy Cabinet Vault</h3>
              <p className="text-[11px] text-slate-400">16 Master Milestones across German, Latin, and Multiplayer battles</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer"
            aria-label="Close trophy cabinet"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-extrabold text-amber-400 uppercase tracking-wider">
              Cabinet Vault Progress
            </span>
            <span className="font-mono font-black text-indigo-300">
              {unlockedCount} / {totalCount} Unlocked ({progressPct}%)
            </span>
          </div>
          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-400 via-rose-500 to-indigo-500 h-full transition-all duration-500 rounded-full"
              style={{ width: `${progressPct}%` }}
            ></div>
          </div>
        </div>

        {/* Trophies Grid (16 Trophies) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ALL_TROPHIES.map(trophy => {
            const isUnlocked = unlockedIds.includes(trophy.id);
            return (
              <div
                key={trophy.id}
                className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3 ${
                  isUnlocked
                    ? 'bg-slate-950 border-amber-400/40 shadow-sm'
                    : 'bg-slate-950/40 border-slate-800/80 opacity-60'
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 border ${
                  isUnlocked
                    ? 'bg-indigo-950/60 border-amber-400/60 text-amber-300 shadow-inner'
                    : 'bg-slate-900 border-slate-800 text-slate-600'
                }`}>
                  {isUnlocked ? trophy.icon : <Lock className="w-5 h-5 text-slate-600" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <h4 className={`text-xs font-black truncate ${isUnlocked ? 'text-white' : 'text-slate-400'}`}>
                      {trophy.title}
                    </h4>
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${getRarityBadge(trophy.rarity)}`}>
                      {trophy.rarity}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-snug line-clamp-2">
                    {trophy.desc}
                  </p>
                  <div className="flex items-center justify-between text-[10px] mt-1.5 font-bold">
                    <span className="text-amber-400">+{trophy.coinReward} Coins</span>
                    {isUnlocked ? (
                      <span className="text-emerald-400 font-extrabold flex items-center gap-0.5">
                        <CheckCircle className="w-3 h-3" /> Unlocked
                      </span>
                    ) : (
                      <span className="text-slate-500 font-medium">Locked</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl cursor-pointer"
          >
            Close Vault
          </button>
        </div>
      </div>
    </div>
  );
};
