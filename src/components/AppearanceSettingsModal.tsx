import React, { useState } from 'react';
import { ThemeType, LayoutType, FontSize, UserAccount } from '../types';
import { playSound } from '../utils/soundEffects';
import {
  X,
  Moon,
  Sun,
  Clock,
  Type,
  Download,
  Bell,
  Sparkles,
  Volume2,
  ArrowLeftRight,
  Layout,
  Columns,
  Maximize2,
  Grid,
  Sidebar,
  FileText,
  AlertTriangle,
  RotateCcw,
  Trash2,
  HelpCircle
} from 'lucide-react';

interface AppearanceSettingsModalProps {
  isOpen: boolean;
  currentTheme: ThemeType;
  onSelectTheme: (theme: ThemeType) => void;
  currentLayout: LayoutType;
  onSelectLayout: (layout: LayoutType) => void;
  autoClockTheme: boolean;
  onToggleAutoClockTheme: () => void;
  darkModeStart: string;
  onSelectDarkModeStart: (time: string) => void;
  darkModeEnd: string;
  onSelectDarkModeEnd: (time: string) => void;
  fontFamily: string;
  onSelectFontFamily: (font: string) => void;
  fontSize: FontSize;
  onSelectFontSize: (size: FontSize) => void;
  isLanguageReversed: boolean;
  onToggleLanguageReversal: () => void;
  autoTtsEnabled: boolean;
  onToggleAutoTts: () => void;
  notificationsEnabled: boolean;
  onToggleNotifications: () => void;
  onBackupCustomSets: () => void;
  completedDeckIds?: string[];
  allDecksSummary?: { id: string; title: string }[];
  onUncompleteDeck?: (deckId: string) => void;
  onDeleteMyAccount?: () => void;
  onOpenTutorial?: () => void;
  onClose: () => void;
}

export const AppearanceSettingsModal: React.FC<AppearanceSettingsModalProps> = ({
  isOpen,
  currentTheme,
  onSelectTheme,
  currentLayout,
  onSelectLayout,
  autoClockTheme,
  onToggleAutoClockTheme,
  darkModeStart,
  onSelectDarkModeStart,
  darkModeEnd,
  onSelectDarkModeEnd,
  fontFamily,
  onSelectFontFamily,
  fontSize,
  onSelectFontSize,
  isLanguageReversed,
  onToggleLanguageReversal,
  autoTtsEnabled,
  onToggleAutoTts,
  notificationsEnabled,
  onToggleNotifications,
  onBackupCustomSets,
  completedDeckIds = [],
  allDecksSummary = [],
  onUncompleteDeck,
  onDeleteMyAccount,
  onOpenTutorial,
  onClose
}) => {
  if (!isOpen) return null;

  // 6 COMPLETELY DISTINCT STRUCTURAL LAYOUTS
  const layoutsList: {
    id: LayoutType;
    title: string;
    subtitle: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'arena',
      title: 'Classic Study Arena',
      subtitle: 'Centralized deck cards with quick launch hubs and hero header',
      icon: <Layout className="w-5 h-5" />
    },
    {
      id: 'sidebar',
      title: 'Command Deck Sidebar',
      subtitle: 'Persistent vertical left sidebar navigation with wide curriculum canvas',
      icon: <Sidebar className="w-5 h-5" />
    },
    {
      id: 'workbench',
      title: 'Split-Pane Workbench',
      subtitle: 'Dual-column layout with deck tree on left and active study station on right',
      icon: <Columns className="w-5 h-5" />
    },
    {
      id: 'arcade',
      title: 'Retro Arcade Spotlight',
      subtitle: 'Single deck spotlight cabinet with carousel, marquee, and arcade styling',
      icon: <Maximize2 className="w-5 h-5" />
    },
    {
      id: 'bento',
      title: 'Modular Bento Grid',
      subtitle: 'Asymmetrical bento widgets for player card, streak, ranking, and decks',
      icon: <Grid className="w-5 h-5" />
    },
    {
      id: 'editorial',
      title: 'Clean Minimalist Web',
      subtitle: 'High-readability editorial layout with structured reading lists and clean typography',
      icon: <FileText className="w-5 h-5" />
    }
  ];

  // HARMONIOUS COLOR THEMES (with polished Zen Minimalist)
  const themesList: { id: ThemeType; title: string; subtitle: string; previewBg: string }[] = [
    { id: 'default', title: 'Deep Obsidian', subtitle: 'Slate dark palette with indigo and amber accents', previewBg: 'bg-slate-950 border-indigo-500' },
    { id: 'cyberpunk', title: 'Cyberpunk HUD', subtitle: 'Neon cyan and pink high-contrast sci-fi panels', previewBg: 'bg-[#030712] border-pink-500' },
    { id: 'zen', title: 'Zen Minimalist', subtitle: 'Warm paper white background with soft charcoal typography and serene slate borders', previewBg: 'bg-[#f8fafc] text-slate-900 border-slate-300' },
    { id: 'rpg', title: '8-Bit Retro RPG', subtitle: 'Pixel console palette with warm amber console text', previewBg: 'bg-slate-900 border-amber-400 font-mono' },
    { id: 'bento', title: 'Frosted Glass Indigo', subtitle: 'Deep indigo tones with subtle translucent container cards', previewBg: 'bg-slate-950 border-indigo-500/40' },
    { id: 'codex', title: 'Academic Codex', subtitle: 'Warm dark parchment styling with antique bronze accents', previewBg: 'bg-[#1a1614] border-amber-700' }
  ];

  const timeOptions = ['17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'];
  const morningTimeOptions = ['05:00', '06:00', '07:00', '08:00', '09:00', '10:00'];

  const completedDecksInfo = completedDeckIds
    .map(id => allDecksSummary.find(d => d.id === id))
    .filter((d): d is { id: string; title: string } => !!d);

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-5">
      <div className="bg-slate-900 border-2 border-slate-700 rounded-3xl p-5 sm:p-7 max-w-3xl w-full shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">
              System Settings
            </span>
            <h3 className="text-xl font-black text-white">Interface Layouts & Preferences</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer transition-colors"
            aria-label="Close settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Tutorial Trigger */}
        {onOpenTutorial && (
          <div className="p-3.5 bg-indigo-950/40 border border-indigo-500/40 rounded-2xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <HelpCircle className="w-4 h-4 text-indigo-400" />
              <div>
                <h4 className="text-xs font-bold text-white">Quest Hub Walkthrough</h4>
                <p className="text-[11px] text-slate-400">Need a refresher on how the arena, modes, and multiplayer work?</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenTutorial();
              }}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              Start Tutorial
            </button>
          </div>
        )}

        {/* 1. 6 COMPLETELY DISTINCT STRUCTURAL LAYOUTS */}
        <div>
          <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">
            1. Select Interface Structural Layout (6 Distinct Layouts)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {layoutsList.map(l => {
              const isSelected = currentLayout === l.id;
              return (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => { playSound('click'); onSelectLayout(l.id); }}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-indigo-400 bg-indigo-950/40 shadow-lg ring-1 ring-indigo-400/50'
                      : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                        {l.icon}
                      </div>
                      <span className="text-xs font-black text-white">{l.title}</span>
                    </div>
                    {isSelected && (
                      <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-indigo-500 text-white">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 leading-tight">{l.subtitle}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. THEME SELECTION */}
        <div>
          <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">
            2. Color Palette & Visual Themes
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {themesList.map(t => {
              const isSelected = currentTheme === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => { playSound('click'); onSelectTheme(t.id); }}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer text-left ${
                    isSelected
                      ? 'border-amber-400 bg-slate-800 shadow ring-1 ring-amber-400/50'
                      : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                  }`}
                >
                  <div className={`h-8 rounded-lg mb-2 flex items-center justify-center font-bold text-[11px] border ${t.previewBg}`}>
                    {t.title}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{t.title}</span>
                    {isSelected && (
                      <span className="text-[9px] font-black text-amber-400 uppercase">Selected</span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{t.subtitle}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. DARK MODE SCHEDULE */}
        <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-black uppercase tracking-wider text-white">
                Scheduled Dark Mode Activation
              </span>
            </div>
            <button
              type="button"
              onClick={onToggleAutoClockTheme}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                autoClockTheme ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {autoClockTheme ? 'Auto Scheduled' : 'Manual Mode'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-[10px] font-bold text-amber-300 uppercase mb-1">
                Dark Mode Activates At (Evening):
              </label>
              <select
                value={darkModeStart}
                onChange={e => onSelectDarkModeStart(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-bold outline-none cursor-pointer"
              >
                {timeOptions.map(t => (
                  <option key={t} value={t}>{t} (Evening)</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-amber-300 uppercase mb-1">
                Dark Mode Deactivates At (Morning):
              </label>
              <select
                value={darkModeEnd}
                onChange={e => onSelectDarkModeEnd(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-bold outline-none cursor-pointer"
              >
                {morningTimeOptions.map(t => (
                  <option key={t} value={t}>{t} (Morning)</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 4. LARGE PRINT MODE & FONT SIZE */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2">
            <label className="block text-[11px] font-bold text-amber-300 uppercase tracking-wider">
              Font Family
            </label>
            <select
              value={fontFamily}
              onChange={e => { playSound('click'); onSelectFontFamily(e.target.value); }}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-bold outline-none cursor-pointer"
            >
              <option value="'Plus Jakarta Sans', sans-serif">Plus Jakarta Sans</option>
              <option value="'Inter', sans-serif">Inter Clean</option>
              <option value="'JetBrains Mono', monospace">JetBrains Mono (Console)</option>
            </select>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2">
            <label className="block text-[11px] font-bold text-amber-300 uppercase tracking-wider">
              Large Print Mode
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => { playSound('click'); onSelectFontSize('normal'); }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                  fontSize === 'normal' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400'
                }`}
              >
                Standard
              </button>
              <button
                type="button"
                onClick={() => { playSound('click'); onSelectFontSize('large'); }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                  fontSize === 'large' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400'
                }`}
              >
                Large Print
              </button>
              <button
                type="button"
                onClick={() => { playSound('click'); onSelectFontSize('xlarge'); }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                  fontSize === 'xlarge' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400'
                }`}
              >
                Extra Large
              </button>
            </div>
          </div>
        </div>

        {/* 5. SERIOUS ZONE: ASSESSMENT UNCOMPLETION & ACCOUNT DELETION */}
        <div className="bg-slate-950 border-2 border-rose-950/70 p-4 rounded-2xl space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <h4 className="text-xs font-black uppercase text-rose-400 tracking-wider">
              Serious Zone
            </h4>
          </div>

          {/* Assessment Management */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-300 block">
              Assessment Management (Completed School Tests)
            </span>
            {completedDecksInfo.length === 0 ? (
              <p className="text-xs text-slate-500">No completed tests archived.</p>
            ) : (
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {completedDecksInfo.map(deck => (
                  <div
                    key={deck.id}
                    className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between text-xs"
                  >
                    <span className="text-slate-300 font-bold truncate">{deck.title}</span>
                    {onUncompleteDeck && (
                      <button
                        type="button"
                        onClick={() => {
                          playSound('click');
                          onUncompleteDeck(deck.id);
                        }}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 text-[11px] font-bold rounded-lg cursor-pointer flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Uncomplete</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Delete Account Button */}
          {onDeleteMyAccount && (
            <div className="pt-2 border-t border-slate-900 flex justify-between items-center">
              <div>
                <span className="text-xs font-bold text-rose-300 block">Delete Account</span>
                <span className="text-[10px] text-slate-500">Permanently remove your study profile and all data.</span>
              </div>
              <button
                type="button"
                onClick={onDeleteMyAccount}
                className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs rounded-xl cursor-pointer transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Account</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs rounded-xl shadow cursor-pointer transition-colors"
          >
            Save & Exit
          </button>
        </div>
      </div>
    </div>
  );
};
