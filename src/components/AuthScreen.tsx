import React, { useState } from 'react';
import { UserAccount } from '../types';
import { playSound } from '../utils/soundEffects';
import { Rocket, ShieldAlert } from 'lucide-react';

interface AuthScreenProps {
  onLogin: (user: UserAccount) => void;
  accounts: UserAccount[];
  availableInviteCodes: string[];
  onConsumeInviteCode: (code: string, username: string) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  onLogin,
  accounts,
  availableInviteCodes,
  onConsumeInviteCode
}) => {
  const [mode, setMode] = useState<'initial' | 'signin' | 'signup'>('initial');
  const [errorMsg, setErrorMsg] = useState('');

  // Sign in fields
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Sign up fields
  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regInviteCode, setRegInviteCode] = useState('');

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = loginUser.trim().toLowerCase();
    const cleanPass = loginPass.trim();

    // Match by username or realName
    const found = accounts.find(a => {
      const match =
        a.username.toLowerCase() === cleanUser ||
        a.realName.toLowerCase() === cleanUser ||
        (a.firstName && a.lastName && `${a.firstName} ${a.lastName}`.toLowerCase() === cleanUser) ||
        (a.isAdmin && (cleanUser === 'rufus_admin' || cleanUser === 'rufus admin' || cleanUser === 'admin'));

      return match && a.passwordHash === cleanPass;
    });

    if (!found) {
      playSound('error');
      setErrorMsg('Invalid username or password.');
      return;
    }

    playSound('correct');
    setErrorMsg('');
    if (rememberMe) {
      localStorage.setItem('quest_remembered_username', found.username);
    }
    onLogin(found);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    const firstName = regFirstName.trim();
    const lastName = regLastName.trim();
    const username = regUsername.trim();
    const password = regPass.trim();
    const inviteCode = regInviteCode.trim();

    if (!firstName || !lastName || !username || !password || !inviteCode) {
      playSound('error');
      setErrorMsg('All fields are required.');
      return;
    }

    if (!availableInviteCodes.includes(inviteCode)) {
      playSound('error');
      setErrorMsg('Invalid or already claimed single-use invite code.');
      return;
    }

    const fullName = `${firstName} ${lastName}`;

    if (accounts.some(a => a.username.toLowerCase() === username.toLowerCase())) {
      playSound('error');
      setErrorMsg('This username is already taken. Please choose another.');
      return;
    }

    if (accounts.some(a => a.realName.toLowerCase() === fullName.toLowerCase())) {
      playSound('error');
      setErrorMsg('An account with this name already exists. Please verify your name or contact your instructor.');
      return;
    }

    const newUser: UserAccount = {
      realName: fullName,
      firstName,
      lastName,
      username,
      passwordHash: password,
      isAdmin: false,
      customSets: [],
      xp: 0,
      coins: 0,
      streak: 1,
      lastQuestDate: new Date().toDateString(),
      trophies: ['first_quest'],
      equippedTitle: 'Student',
      equippedBackground: undefined,
      avatar: {
        base: 'scholar',
        skinColor: '#f5d0b5',
        outfit: 'none',
        hat: 'none',
        accessory: 'none'
      },
      inventory: [],
      streakFreezeCount: 0,
      commonErrors: [],
      completedDecks: [],
      joinedAt: Date.now(),
      usedInviteCode: inviteCode,
      sessionCount: 1,
      totalTimeSpentMinutes: 0,
      ipAddress: '192.168.1.' + Math.floor(10 + Math.random() * 89),
      hasSeenTutorial: false
    };

    onConsumeInviteCode(inviteCode, fullName);
    playSound('correct');
    setErrorMsg('');
    onLogin(newUser);
  };

  return (
    <div className="flex-1 max-w-xl w-full mx-auto px-4 py-8 flex flex-col justify-center">
      <div className="w-full bg-slate-900 border-2 border-indigo-500/40 rounded-3xl p-6 sm:p-10 shadow-[0_0_50px_rgba(99,102,241,0.2)] text-center relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Hero Badge with Rocket */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-600 border-2 border-amber-300/60 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-2xl shadow-indigo-500/40 text-white">
          <Rocket className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-white mb-2 tracking-tight">
          Quest Hub
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto mb-6 font-medium leading-relaxed">
          Sign in or register with your invite code to begin your study quests.
        </p>

        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-bold rounded-xl animate-shake">
            {errorMsg}
          </div>
        )}

        {/* Mode selector */}
        {mode === 'initial' && (
          <div className="space-y-4 max-w-xs mx-auto">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => { playSound('click'); setMode('signin'); setErrorMsg(''); }}
                className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs sm:text-sm rounded-xl shadow cursor-pointer transition-all active:scale-95"
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { playSound('click'); setMode('signup'); setErrorMsg(''); }}
                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-black text-xs sm:text-sm rounded-xl border border-slate-700 cursor-pointer transition-all active:scale-95"
              >
                Register
              </button>
            </div>
          </div>
        )}

        {/* SIGN IN FORM */}
        {mode === 'signin' && (
          <form onSubmit={handleSignIn} className="max-w-xs mx-auto space-y-4 text-left">
            <div>
              <label className="block text-[11px] font-bold text-amber-300 uppercase tracking-wider mb-1">
                Username
              </label>
              <input
                type="text"
                required
                value={loginUser}
                onChange={e => setLoginUser(e.target.value)}
                placeholder="Enter your username..."
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-bold text-xs outline-none focus:border-amber-400 transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-amber-300 uppercase tracking-wider mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={loginPass}
                onChange={e => setLoginPass(e.target.value)}
                placeholder="Enter your password..."
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-bold text-xs outline-none focus:border-amber-400 transition-colors"
              />
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-slate-300 font-bold cursor-pointer text-[11px]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="accent-indigo-500 rounded"
                />
                Remember Me
              </label>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => { playSound('click'); setMode('initial'); setErrorMsg(''); }}
                className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl cursor-pointer"
              >
                Back
              </button>
              {/* Allowed gradient hero button */}
              <button
                type="submit"
                className="flex-1 py-3 bg-gradient-to-r from-amber-400 via-rose-500 to-indigo-600 hover:from-amber-300 hover:to-indigo-500 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-xl transition-all cursor-pointer active:scale-95"
              >
                Sign In & Launch
              </button>
            </div>
          </form>
        )}

        {/* SIGN UP FORM */}
        {mode === 'signup' && (
          <form onSubmit={handleSignUp} className="max-w-xs mx-auto space-y-3.5 text-left">
            {/* Security Notice */}
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300 leading-relaxed flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                If you do not enter your name correctly, if you enter a fake name, we may have to delete your account for security. Please enter your real name or your account might be deleted for security.
              </span>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-amber-300 uppercase tracking-wider mb-1">
                First Name
              </label>
              <input
                type="text"
                required
                value={regFirstName}
                onChange={e => setRegFirstName(e.target.value)}
                placeholder="Enter your first name..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-bold text-xs outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-amber-300 uppercase tracking-wider mb-1">
                Last Name
              </label>
              <input
                type="text"
                required
                value={regLastName}
                onChange={e => setRegLastName(e.target.value)}
                placeholder="Enter your last name..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-bold text-xs outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-amber-300 uppercase tracking-wider mb-1">
                Username
              </label>
              <input
                type="text"
                required
                value={regUsername}
                onChange={e => setRegUsername(e.target.value)}
                placeholder="Choose your username..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-bold text-xs outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-amber-300 uppercase tracking-wider mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={regPass}
                onChange={e => setRegPass(e.target.value)}
                placeholder="Create password..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-bold text-xs outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-amber-300 uppercase tracking-wider mb-1">
                Invite Code
              </label>
              <input
                type="text"
                required
                value={regInviteCode}
                onChange={e => setRegInviteCode(e.target.value)}
                placeholder="Enter your single-use invite code..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-amber-300 font-mono text-xs outline-none focus:border-amber-400"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => { playSound('click'); setMode('initial'); setErrorMsg(''); }}
                className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl cursor-pointer"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs sm:text-sm rounded-xl shadow cursor-pointer transition-colors active:scale-95"
              >
                Register Account
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
