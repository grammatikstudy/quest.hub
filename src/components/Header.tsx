import React from 'react';
import { UserAccount, ActiveScreen } from '../types';
import { SHOP_CATALOG } from '../data/defaultVocab';
import {
  setTrack,
  setVolume,
  startMusic,
  stopMusic,
  toggleSoundEffects,
  getSoundFxEnabled,
  getCurrentAudioTrack,
  getCurrentAudioVolume,
  isAudioPlaying
} from '../utils/soundEffects';
import { AvatarDisplay } from './AvatarDisplay';
import {
  Rocket,
  Volume2,
  VolumeX,
  Sparkles,
  Trophy,
  Settings,
  ShoppingBag,
  Shield,
  LogOut,
  Radio,
  Flame,
  Snowflake,
  Medal,
  Music,
  HelpCircle,
  WifiOff,
  Bot
} from 'lucide-react';

interface HeaderProps {
  currentUser: UserAccount | null;
  onNavigate: (screen: ActiveScreen) => void;
  onLogout: () => void;
  onOpenShop: () => void;
  onOpenSettings: () => void;
  onOpenTrophies: () => void;
  onOpenSpotify: () => void;
  onOpenTutorial?: () => void;
  onOpenAiTutor?: () => void;
  activeScreen: ActiveScreen;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onNavigate,
  onLogout,
  onOpenShop,
  onOpenSettings,
  onOpenTrophies,
  onOpenSpotify,
  onOpenTutorial,
  onOpenAiTutor,
  activeScreen
}) => {
  const [isPlayingMusic, setIsPlayingMusic] = React.useState(isAudioPlaying());
  const [selectedMusic, setSelectedMusic] = React.useState(getCurrentAudioTrack());
  const [volume, setVol] = React.useState(getCurrentAudioVolume());
  const [soundFx, setSoundFx] = React.useState(getSoundFxEnabled());

  const handleTrackChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedMusic(val);
    setTrack(val);
    setIsPlayingMusic(val !== 'off');
  };

  const handlePlayToggle = () => {
    if (isPlayingMusic) {
      stopMusic();
      setIsPlayingMusic(false);
    } else {
      if (selectedMusic === 'off') {
        setSelectedMusic('synthwave');
        setTrack('synthwave');
      } else {
        setTrack(selectedMusic);
        startMusic();
      }
      setIsPlayingMusic(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVol(v);
    setVolume(v);
  };

  const handleFxToggle = () => {
    const updated = toggleSoundEffects();
    setSoundFx(updated);
  };

  return (
    <header className="bg-slate-900/95 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40 transition-colors shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Brand / Logo with Rocket substitution */}
        <div 
          className="flex items-center space-x-3 cursor-pointer group select-none"
          onClick={() => currentUser && onNavigate('landing')}
        >
          <div className="w-10 h-10 bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-600 rounded-xl flex items-center justify-center font-black text-white shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
            <Rocket className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm sm:text-base text-slate-100 flex items-center gap-2">
              Quest Hub
              <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-500/30 uppercase tracking-wide">
                Arena
              </span>
            </h1>
            <p className="text-[10px] text-slate-400 font-medium">Cambridge Latin & German Module 2</p>
          </div>
        </div>

        {/* Global Controls & Music Player Bar */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Background Synthesizer Controls */}
          <div className="flex items-center gap-1.5 bg-slate-950/80 px-2.5 py-1.5 rounded-xl border border-slate-800 text-xs">
            <Radio className={`w-3.5 h-3.5 ${isPlayingMusic ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
            
            <select
              value={selectedMusic}
              onChange={handleTrackChange}
              className="bg-transparent text-slate-300 text-xs font-bold outline-none cursor-pointer"
              title="Select Procedural Synth Background Track"
            >
              <option value="off" className="bg-slate-900">Music: Muted</option>
              <option value="synthwave" className="bg-slate-900">Synthwave Beat</option>
              <option value="quest" className="bg-slate-900">Quest Synth</option>
              <option value="lofi" className="bg-slate-900">Lo-Fi Focus</option>
              <option value="chiptune" className="bg-slate-900">8-Bit Chiptune</option>
              <option value="study" className="bg-slate-900">Study Ambient</option>
              <option value="piano" className="bg-slate-900">Relaxing Piano</option>
              <option value="arcade" className="bg-slate-900">Retro Arcade</option>
            </select>

            <button
              type="button"
              onClick={handlePlayToggle}
              className="text-slate-400 hover:text-white px-1 font-bold text-[11px] cursor-pointer"
              title={isPlayingMusic ? 'Pause Music' : 'Play Music'}
            >
              {isPlayingMusic ? 'Pause' : 'Play'}
            </button>

            <input
              type="range"
              min="0"
              max="0.4"
              step="0.02"
              value={volume}
              onChange={handleVolumeChange}
              className="w-12 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              title="Music Volume"
            />
          </div>

          {/* Sound FX Toggle */}
          <button
            type="button"
            onClick={handleFxToggle}
            className={`p-2 rounded-xl text-xs font-bold border cursor-pointer transition-colors ${
              soundFx 
                ? 'bg-slate-950/80 border-slate-800 text-amber-300 hover:bg-slate-800' 
                : 'bg-slate-950/80 border-slate-800 text-slate-500'
            }`}
            title={soundFx ? 'Sound FX Enabled' : 'Sound FX Muted'}
          >
            {soundFx ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {/* Spotify Study Music Lounge */}
          <button
            type="button"
            onClick={onOpenSpotify}
            className="px-2.5 py-1.5 bg-emerald-950/40 hover:bg-emerald-900/40 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
            title="Toggle Spotify Player Widget"
          >
            <Music className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Spotify</span>
          </button>

          {/* Offline Practice Hub Quick Button */}
          <button
            type="button"
            onClick={() => onNavigate('offline-hub')}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border cursor-pointer transition-colors ${
              activeScreen === 'offline-hub'
                ? 'bg-cyan-600 text-white border-cyan-400 shadow'
                : 'bg-cyan-950/40 hover:bg-cyan-900/40 text-cyan-300 border-cyan-500/30'
            }`}
            title="Open Dedicated Offline Practice Hub"
          >
            <WifiOff className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Offline</span>
          </button>

          {/* AI Study Coach Drawer Trigger */}
          {onOpenAiTutor && (
            <button
              type="button"
              onClick={onOpenAiTutor}
              className="px-2.5 py-1.5 bg-indigo-950/40 hover:bg-indigo-900/40 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Ask Quest AI Tutor"
            >
              <Bot className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">AI Tutor</span>
            </button>
          )}
        </div>

        {/* User Status Bar & Hub Triggers */}
        {currentUser ? (
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {/* User Avatar & Name Banner */}
            {(() => {
              const equippedBackdrop = SHOP_CATALOG.find(i => i.id === currentUser.equippedBackground)?.photoUrl;
              const displayName = currentUser.firstName && currentUser.lastName
                ? `${currentUser.firstName} ${currentUser.lastName}`
                : (currentUser.realName || currentUser.username);
              return (
                <div
                  onClick={() => onNavigate('landing')}
                  className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-2.5 py-1 rounded-xl cursor-pointer hover:border-slate-700 transition-all"
                >
                  <AvatarDisplay avatar={currentUser.avatar} backdropUrl={equippedBackdrop} size="sm" />
                  <div className="text-left">
                    <span className="text-xs font-black text-white block leading-tight">
                      {displayName}
                    </span>
                    <span className="text-[10px] text-amber-400 font-bold block leading-none">
                      {currentUser.equippedTitle || 'Student'}
                    </span>
                  </div>
                </div>
              );
            })()}

            {/* Streak & Freeze Indicator */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-black text-amber-300">
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
              <span>{currentUser.streak || 0}d</span>
              {currentUser.streakFreezeCount && currentUser.streakFreezeCount > 0 ? (
                <span className="flex items-center gap-0.5 text-cyan-300 text-[10px] font-bold bg-cyan-950 px-1 py-0.5 rounded border border-cyan-800" title="Streak Freeze Shield Active">
                  <Snowflake className="w-2.5 h-2.5 text-cyan-400" />
                  <span>{currentUser.streakFreezeCount}</span>
                </span>
              ) : null}
            </div>

            {/* Coins Balance */}
            <button
              type="button"
              onClick={onOpenShop}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-950/40 border border-amber-500/40 text-xs font-black text-amber-300 cursor-pointer hover:bg-amber-900/40 transition-colors"
              title="Open Coin Shop & Avatar Wardrobe"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{currentUser.coins || 0}</span>
            </button>

            {/* Leaderboard Button */}
            <button
              type="button"
              onClick={() => onNavigate('leaderboard')}
              className={`p-2 rounded-xl text-xs font-bold border cursor-pointer transition-colors ${
                activeScreen === 'leaderboard'
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                  : 'bg-slate-950 text-indigo-300 border-indigo-900/60 hover:bg-slate-800'
              }`}
              title="Leaderboard Rankings"
            >
              <Medal className="w-3.5 h-3.5" />
            </button>

            {/* Trophy Cabinet Trigger */}
            <button
              type="button"
              onClick={onOpenTrophies}
              className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-amber-400 border border-slate-800 cursor-pointer transition-colors relative"
              title="View 16-Milestone Trophy Cabinet"
            >
              <Trophy className="w-3.5 h-3.5" />
              {(currentUser.trophies || []).length > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping"></span>
              )}
            </button>

            {/* Quick Tutorial Trigger */}
            {onOpenTutorial && (
              <button
                type="button"
                onClick={onOpenTutorial}
                className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-indigo-400 border border-slate-800 cursor-pointer transition-colors"
                title="Open Quest Hub Walkthrough Tutorial"
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Appearance Settings */}
            <button
              type="button"
              onClick={onOpenSettings}
              className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 cursor-pointer transition-colors"
              title="Themes, Layouts & Print Settings"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>

            {/* Admin Command Center (for Rufus_Admin) */}
            {currentUser.isAdmin && (
              <button
                type="button"
                onClick={() => onNavigate('admin')}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 border cursor-pointer transition-colors ${
                  activeScreen === 'admin'
                    ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-lg'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                }`}
                title="Master Admin Panel & Audit Logs"
              >
                <Shield className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Admin</span>
              </button>
            )}

            {/* Logout */}
            <button
              type="button"
              onClick={onLogout}
              className="p-2 rounded-xl bg-slate-950 hover:bg-rose-950/60 text-slate-400 hover:text-rose-300 border border-slate-800 hover:border-rose-900 cursor-pointer transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : null}
      </div>
    </header>
  );
};
