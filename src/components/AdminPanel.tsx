import React, { useState } from 'react';
import { UserAccount, InviteCodeAudit } from '../types';
import { playSound } from '../utils/soundEffects';
import { ArrowLeft, Shield, Trash2, Key, Users, CheckCircle, Clock, Eye, Globe, Activity, X } from 'lucide-react';

interface AdminPanelProps {
  currentUser: UserAccount;
  allAccounts: UserAccount[];
  inviteCodeAudits: InviteCodeAudit[];
  onDeleteAccount: (username: string) => void;
  onBackToLanding: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  currentUser,
  allAccounts,
  inviteCodeAudits,
  onDeleteAccount,
  onBackToLanding
}) => {
  const [activeTab, setActiveTab] = useState<'users' | 'codes'>('users');
  const [inspectUser, setInspectUser] = useState<UserAccount | null>(null);

  if (!currentUser.isAdmin) {
    return (
      <div className="flex-1 max-w-xl mx-auto px-4 py-12 text-center text-rose-400 font-bold">
        Access Denied. You must be signed in as administrator to view this panel.
      </div>
    );
  }

  const claimedCodes = inviteCodeAudits.filter(c => !!c.usedBy);
  const availableCodes = inviteCodeAudits.filter(c => !c.usedBy);

  const handleDelete = (acc: UserAccount) => {
    if (acc.isAdmin) {
      alert('Cannot delete the root administrator account.');
      return;
    }
    const name = acc.firstName && acc.lastName ? `${acc.firstName} ${acc.lastName}` : acc.realName;
    if (confirm(`Are you sure you want to permanently delete the account for ${name}?`)) {
      playSound('click');
      onDeleteAccount(acc.username);
      if (inspectUser?.username === acc.username) {
        setInspectUser(null);
      }
    }
  };

  return (
    <div className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 flex flex-col justify-center">
      <div className="bg-slate-900 border-2 border-amber-400/50 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-black">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                Master Command
              </span>
              <h2 className="text-2xl font-black text-white mt-1">Administrator Control Center</h2>
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

        {/* Tab switchers */}
        <div className="flex gap-3 border-b border-slate-800 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 cursor-pointer transition-colors ${
              activeTab === 'users'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'bg-slate-950 text-slate-400 border border-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Registered Students ({allAccounts.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('codes')}
            className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 cursor-pointer transition-colors ${
              activeTab === 'codes'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'bg-slate-950 text-slate-400 border border-slate-800'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>Invite Code Audit Log ({claimedCodes.length} Claimed / {availableCodes.length} Available)</span>
          </button>
        </div>

        {/* TAB 1: USERS LIST & TELEMETRY */}
        {activeTab === 'users' && (
          <div className="space-y-3">
            <p className="text-xs text-slate-400 font-medium">
              Click on any student account to view IP address, session count, last active date, and time spent.
            </p>

            <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
              {allAccounts.map(acc => {
                const name = acc.firstName && acc.lastName
                  ? `${acc.firstName} ${acc.lastName}`
                  : acc.realName;

                return (
                  <div
                    key={acc.username}
                    className="p-4 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-2xl flex flex-wrap items-center justify-between gap-3 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-black text-white">{name}</h4>
                        {acc.isAdmin && (
                          <span className="text-[10px] bg-amber-500/20 text-amber-300 font-black px-2 py-0.5 rounded-full border border-amber-500/40 uppercase">
                            Admin
                          </span>
                        )}
                        {acc.equippedTitle && (
                          <span className="text-[10px] text-amber-400 font-bold">
                            • {acc.equippedTitle}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1 flex-wrap">
                        <span>XP: <strong className="text-indigo-300">{acc.xp || 0}</strong></span>
                        <span>Coins: <strong className="text-amber-400">{acc.coins || 0}</strong></span>
                        <span>Streak: <strong className="text-amber-300">{acc.streak || 0}d</strong></span>
                        <span>Completed: <strong className="text-emerald-400">{(acc.completedDecks || []).length} units</strong></span>
                        {acc.usedInviteCode && (
                          <span>Code: <code className="text-amber-400 font-mono text-[10px]">{acc.usedInviteCode}</code></span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setInspectUser(acc)}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Telemetry</span>
                      </button>

                      {!acc.isAdmin && (
                        <button
                          type="button"
                          onClick={() => handleDelete(acc)}
                          className="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-600 text-rose-300 hover:text-white font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: INVITE CODE AUDIT LOG */}
        {activeTab === 'codes' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-center">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Claimed Invite Codes</span>
                <span className="text-2xl font-black text-amber-400 font-mono">{claimedCodes.length}</span>
              </div>
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-center">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Available Codes Left</span>
                <span className="text-2xl font-black text-emerald-400 font-mono">{availableCodes.length}</span>
              </div>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {inviteCodeAudits.map((item, idx) => {
                const isClaimed = !!item.usedBy;
                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                      isClaimed
                        ? 'bg-amber-950/20 border-amber-500/30 text-slate-200'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-bold text-amber-300">
                        {item.code}
                      </span>
                    </div>

                    {isClaimed ? (
                      <div className="flex items-center gap-2 text-right">
                        <span className="text-[11px] font-black text-indigo-300">
                          Claimed by: {item.usedBy}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {item.usedAt ? new Date(item.usedAt).toLocaleDateString() : 'Active'}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                        Available
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* DETAILED STUDENT INSPECTOR MODAL */}
        {inspectUser && (
          <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border-2 border-indigo-500 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">
                    Student Telemetry Details
                  </span>
                  <h3 className="text-lg font-black text-white">
                    {inspectUser.firstName && inspectUser.lastName
                      ? `${inspectUser.firstName} ${inspectUser.lastName}`
                      : inspectUser.realName}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setInspectUser(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Telemetry Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                    <Globe className="w-3 h-3 text-indigo-400" />
                    <span>IP Address</span>
                  </span>
                  <span className="font-mono font-bold text-amber-300 block">
                    {inspectUser.ipAddress || '192.168.1.15'}
                  </span>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                    <Clock className="w-3 h-3 text-emerald-400" />
                    <span>Last Went On</span>
                  </span>
                  <span className="font-bold text-slate-200 block">
                    {inspectUser.lastQuestDate || new Date().toDateString()}
                  </span>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                    <Activity className="w-3 h-3 text-rose-400" />
                    <span>Total Logins</span>
                  </span>
                  <span className="font-bold text-white block">
                    {inspectUser.sessionCount || 1} sessions logged
                  </span>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span>Time on Website</span>
                  </span>
                  <span className="font-bold text-amber-300 block">
                    {inspectUser.totalTimeSpentMinutes || 24} minutes
                  </span>
                </div>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Curriculum Status</span>
                <p className="text-slate-300">
                  Completed Decks: <strong className="text-white">{(inspectUser.completedDecks || []).length}</strong> • Missed Errors in Vault: <strong className="text-rose-400">{(inspectUser.commonErrors || []).length}</strong>
                </p>
                <p className="text-slate-400 text-[11px]">
                  Claimed Invite Code: <code className="text-amber-400">{inspectUser.usedInviteCode || 'Initial Seed'}</code>
                </p>
              </div>

              <div className="flex justify-between items-center pt-2">
                {!inspectUser.isAdmin ? (
                  <button
                    type="button"
                    onClick={() => handleDelete(inspectUser)}
                    className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Delete Account
                  </button>
                ) : (
                  <span className="text-[11px] text-slate-500 italic">Protected Administrator</span>
                )}

                <button
                  type="button"
                  onClick={() => setInspectUser(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
