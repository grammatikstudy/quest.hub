import React, { useState } from 'react';
import { UserAccount } from '../types';
import { SHOP_CATALOG } from '../data/defaultVocab';
import { AvatarDisplay } from './AvatarDisplay';
import { playSound } from '../utils/soundEffects';
import { ArrowLeft, Trophy, Flame, Brain, Shield, Medal, Search, Snowflake } from 'lucide-react';

interface LeaderboardScreenProps {
  currentUser: UserAccount;
  allAccounts: UserAccount[];
  onBackToLanding: () => void;
}

export const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({
  currentUser,
  allAccounts,
  onBackToLanding
}) => {
  const [sortBy, setSortBy] = useState<'xp' | 'streak' | 'mastered'>('xp');
  const [searchQuery, setSearchQuery] = useState('');

  // Include accounts so the board is not empty
  const sortedAccounts = [...allAccounts].sort((a, b) => {
    if (sortBy === 'xp') return (b.xp || 0) - (a.xp || 0);
    if (sortBy === 'streak') return (b.streak || 0) - (a.streak || 0);
    if (sortBy === 'mastered') return (b.completedDecks || []).length - (a.completedDecks || []).length;
    return 0;
  });

  const filteredAccounts = sortedAccounts.filter(a => {
    const name = a.realName || a.username;
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <span className="font-mono font-black text-xs text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800">1st</span>;
    if (rank === 2) return <span className="font-mono font-black text-xs text-slate-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">2nd</span>;
    if (rank === 3) return <span className="font-mono font-black text-xs text-amber-600 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-900">3rd</span>;
    return <span className="font-mono font-bold text-xs text-slate-500">#{rank}</span>;
  };

  return (
    <div className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 flex flex-col justify-center">
      <div className="bg-slate-900 border-2 border-indigo-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">
                Arena Rankings
              </span>
              <h2 className="text-2xl font-black text-white">Polyglot Champions Leaderboard</h2>
            </div>
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

        {/* Filter bar and Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => { playSound('click'); setSortBy('xp'); }}
              className={`px-3.5 py-2 rounded-xl text-xs font-black cursor-pointer transition-colors flex items-center gap-1.5 ${
                sortBy === 'xp' ? 'bg-indigo-600 text-white shadow' : 'bg-slate-950 text-slate-400 border border-slate-800'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Highest XP</span>
            </button>
            <button
              type="button"
              onClick={() => { playSound('click'); setSortBy('streak'); }}
              className={`px-3.5 py-2 rounded-xl text-xs font-black cursor-pointer transition-colors flex items-center gap-1.5 ${
                sortBy === 'streak' ? 'bg-amber-500 text-slate-950 shadow' : 'bg-slate-950 text-slate-400 border border-slate-800'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Longest Streak</span>
            </button>
            <button
              type="button"
              onClick={() => { playSound('click'); setSortBy('mastered'); }}
              className={`px-3.5 py-2 rounded-xl text-xs font-black cursor-pointer transition-colors flex items-center gap-1.5 ${
                sortBy === 'mastered' ? 'bg-emerald-600 text-white shadow' : 'bg-slate-950 text-slate-400 border border-slate-800'
              }`}
            >
              <Brain className="w-3.5 h-3.5" />
              <span>Completed Decks</span>
            </button>
          </div>

          {/* Search */}
          <div className="w-full sm:w-64">
            <input
              type="text"
              placeholder="Search student name..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 font-medium outline-none focus:border-indigo-400"
            />
          </div>
        </div>

        {/* Players List */}
        <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
          {filteredAccounts.map((player, idx) => {
            const isCurrent = player.username === currentUser.username;
            const rank = idx + 1;
            const playerBackdrop = SHOP_CATALOG.find(i => i.id === player.equippedBackground)?.photoUrl;
            const nameToDisplay = player.firstName && player.lastName
              ? `${player.firstName} ${player.lastName}`
              : player.realName || player.username;

            return (
              <div
                key={player.username}
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  isCurrent
                    ? 'bg-indigo-950/40 border-indigo-400 ring-1 ring-indigo-400/50 shadow'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Left: Rank & Avatar & User Info */}
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <div className="w-8 flex items-center justify-center text-center">
                    {getRankBadge(rank)}
                  </div>

                  <AvatarDisplay avatar={player.avatar} backdropUrl={playerBackdrop} size="md" />

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-black text-white truncate">{nameToDisplay}</h4>
                      {isCurrent && (
                        <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-indigo-600 text-white">
                          You
                        </span>
                      )}
                      {player.equippedTitle && (
                        <span className="text-[10px] text-amber-400 font-bold">
                          • {player.equippedTitle}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Flame className="w-3 h-3 text-amber-400" />
                        <strong className="text-amber-300">{player.streak || 0}d streak</strong>
                      </span>
                      {player.streakFreezeCount && player.streakFreezeCount > 0 ? (
                        <span className="flex items-center gap-1 text-cyan-300 font-bold text-[10px] bg-cyan-950/70 px-1.5 py-0.5 rounded border border-cyan-800">
                          <Snowflake className="w-2.5 h-2.5 text-cyan-400" />
                          <span>Shielded</span>
                        </span>
                      ) : null}
                      <span>Decks: <strong className="text-slate-300">{(player.completedDecks || []).length} completed</strong></span>
                    </div>
                  </div>
                </div>

                {/* Right: XP / Coins */}
                <div className="text-right shrink-0">
                  <div className="text-base sm:text-lg font-black text-indigo-300 font-mono">
                    {player.xp || 0} XP
                  </div>
                  <span className="text-[10px] text-amber-400 font-mono font-bold">
                    {player.coins || 0} coins
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
