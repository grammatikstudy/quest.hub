import React, { useState } from 'react';
import { DeckUnit, UserAccount, LayoutType, VocabItem } from '../types';
import { autoDetectLanguages, SHOP_CATALOG } from '../data/defaultVocab';
import { playSound } from '../utils/soundEffects';
import { AvatarDisplay } from './AvatarDisplay';
import {
  Rocket,
  Users,
  Mic,
  Cloud,
  AlertTriangle,
  Trophy,
  Plus,
  Download,
  Upload,
  Check,
  CheckCircle2,
  Trash2,
  Medal,
  Flame,
  Snowflake,
  ShoppingBag,
  ChevronRight,
  Sparkles,
  HelpCircle,
  FileCheck2,
  X,
  WifiOff
} from 'lucide-react';

interface MissionControlProps {
  currentUser: UserAccount;
  germanUnits: DeckUnit[];
  latinUnits: DeckUnit[];
  customUnits: DeckUnit[];
  layout?: LayoutType;
  onOpenDeck: (deck: DeckUnit) => void;
  onMarkDeckCompleted: (deckId: string, items: VocabItem[]) => void;
  onHideAssessmentConfirm?: () => void;
  onNavigateToMultiplayer: () => void;
  onNavigateToOralExam: () => void;
  onNavigateToUniversalHub: () => void;
  onNavigateToCommonErrors: () => void;
  onNavigateToLeaderboard: () => void;
  onNavigateToOfflineHub?: () => void;
  onOpenShop: () => void;
  onOpenTrophyCabinet: () => void;
  onSaveCustomSet: (newDeck: DeckUnit, isPublic?: boolean) => void;
  onDeleteCustomSet: (deckId: string) => void;
  onBackupAllSets: () => void;
  onLoadSetFromFile: (file: File) => void;
}

export const MissionControl: React.FC<MissionControlProps> = ({
  currentUser,
  germanUnits,
  latinUnits,
  customUnits,
  layout = 'arena',
  onOpenDeck,
  onMarkDeckCompleted,
  onHideAssessmentConfirm,
  onNavigateToMultiplayer,
  onNavigateToOralExam,
  onNavigateToUniversalHub,
  onNavigateToCommonErrors,
  onNavigateToLeaderboard,
  onNavigateToOfflineHub,
  onOpenShop,
  onOpenTrophyCabinet,
  onSaveCustomSet,
  onDeleteCustomSet,
  onBackupAllSets,
  onLoadSetFromFile
}) => {
  const [activeTab, setActiveTab] = useState<'german' | 'latin' | 'custom'>('german');

  // Custom Hub 2-Box System state (expandable multiline textareas, line 1 left matches line 1 right)
  const [customDeckTitle, setCustomDeckTitle] = useState('');
  const [leftMultilineText, setLeftMultilineText] = useState('Buch\nHaus');
  const [rightMultilineText, setRightMultilineText] = useState('book\nhouse');
  const [isPublicCloudSet, setIsPublicCloudSet] = useState(false);
  const [customError, setCustomError] = useState('');
  const [useSpaceSeparator, setUseSpaceSeparator] = useState(false);

  // Single word entry inputs
  const [singleLeftWord, setSingleLeftWord] = useState('');
  const [singleRightWord, setSingleRightWord] = useState('');

  // Assessment Confirmation Modal State
  const [pendingCompletedDeck, setPendingCompletedDeck] = useState<DeckUnit | null>(null);
  const [dontAskAgainAssessment, setDontAskAgainAssessment] = useState(false);

  // Workbench layout
  const [selectedWorkbenchDeck, setSelectedWorkbenchDeck] = useState<DeckUnit>(germanUnits[0]);

  // Arcade layout
  const [arcadeIndex, setArcadeIndex] = useState(0);

  const activeDeckList =
    activeTab === 'german' ? germanUnits :
    activeTab === 'latin' ? latinUnits : customUnits;

  const completedDeckIds = currentUser.completedDecks || [];
  const equippedBackdrop = SHOP_CATALOG.find(i => i.id === currentUser.equippedBackground)?.photoUrl;

  const displayName = currentUser.firstName && currentUser.lastName
    ? `${currentUser.firstName} ${currentUser.lastName}`
    : (currentUser.realName || currentUser.username);

  // Parse draft words from 2-box multiline textareas
  const computeDraftWords = (): { prompt: string; de: string[] }[] => {
    if (useSpaceSeparator) {
      // Space separator mode in left box: "Buch book"
      const lines = leftMultilineText.split('\n');
      const res: { prompt: string; de: string[] }[] = [];
      lines.forEach(l => {
        const parts = l.trim().split(/\s+/);
        if (parts.length >= 2) {
          res.push({ prompt: parts[0], de: [parts.slice(1).join(' ')] });
        }
      });
      return res;
    }

    const leftLines = leftMultilineText.split('\n');
    const rightLines = rightMultilineText.split('\n');
    const count = Math.max(leftLines.length, rightLines.length);
    const res: { prompt: string; de: string[] }[] = [];

    for (let i = 0; i < count; i++) {
      const left = (leftLines[i] || '').trim();
      const right = (rightLines[i] || '').trim();
      if (left && right) {
        res.push({ prompt: left, de: [right] });
      }
    }
    return res;
  };

  const draftWords = computeDraftWords();

  const handleAddSinglePair = (e: React.FormEvent) => {
    e.preventDefault();
    const l = singleLeftWord.trim();
    const r = singleRightWord.trim();
    if (!l || !r) {
      setCustomError('Please enter both the word and translation.');
      return;
    }
    const newLeft = leftMultilineText ? `${leftMultilineText}\n${l}` : l;
    const newRight = rightMultilineText ? `${rightMultilineText}\n${r}` : r;
    setLeftMultilineText(newLeft);
    setRightMultilineText(newRight);
    setSingleLeftWord('');
    setSingleRightWord('');
    setCustomError('');
    playSound('click');
  };

  const handleRemoveWordAtIndex = (index: number) => {
    const leftLines = leftMultilineText.split('\n');
    const rightLines = rightMultilineText.split('\n');
    leftLines.splice(index, 1);
    rightLines.splice(index, 1);
    setLeftMultilineText(leftLines.join('\n'));
    setRightMultilineText(rightLines.join('\n'));
    playSound('click');
  };

  const handleSaveCustomDeck = (e: React.FormEvent) => {
    e.preventDefault();
    const title = customDeckTitle.trim();
    if (!title) {
      setCustomError('Please enter a title for your custom deck.');
      return;
    }
    if (draftWords.length === 0) {
      setCustomError('Please enter at least one word pair in the boxes below.');
      return;
    }

    const detected = autoDetectLanguages(draftWords.map(w => `${w.prompt} - ${w.de[0]}`).join('\n'));
    const newDeck: DeckUnit = {
      id: `custom-${Date.now()}`,
      badge: 'Custom Set',
      title,
      lang1: detected.lang1,
      lang2: detected.lang2,
      items: draftWords,
      isCustom: true,
      author: displayName
    };

    onSaveCustomSet(newDeck, isPublicCloudSet);
    playSound('correct');
    setCustomDeckTitle('');
    setLeftMultilineText('');
    setRightMultilineText('');
    setCustomError('');
  };

  // Assessment completion click handler
  const handleInitiateAssessmentComplete = (e: React.MouseEvent, unit: DeckUnit) => {
    e.stopPropagation();
    if (currentUser.hideAssessmentConfirm) {
      onMarkDeckCompleted(unit.id, unit.items);
      playSound('correct');
    } else {
      setPendingCompletedDeck(unit);
    }
  };

  const handleConfirmAssessmentComplete = () => {
    if (!pendingCompletedDeck) return;
    if (dontAskAgainAssessment && onHideAssessmentConfirm) {
      onHideAssessmentConfirm();
    }
    onMarkDeckCompleted(pendingCompletedDeck.id, pendingCompletedDeck.items);
    playSound('correct');
    setPendingCompletedDeck(null);
  };

  // Helper renderer for standard deck card
  const renderDeckCard = (unit: DeckUnit) => {
    const isCompleted = completedDeckIds.includes(unit.id);
    return (
      <div
        key={unit.id}
        onClick={() => onOpenDeck(unit)}
        className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group ${
          isCompleted
            ? 'bg-slate-950/40 border-slate-800/60 opacity-60 hover:opacity-100 hover:border-slate-700'
            : 'bg-slate-950 border-slate-800 hover:border-indigo-500/80 hover:shadow-xl hover:-translate-y-0.5'
        }`}
      >
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
              isCompleted 
                ? 'bg-slate-800 text-slate-400' 
                : 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20'
            }`}>
              {unit.badge}
            </span>
            {isCompleted ? (
              <span className="flex items-center gap-1 text-[10px] font-black text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800">
                <Check className="w-2.5 h-2.5" /> Completed
              </span>
            ) : (
              <span className="text-[10px] font-mono font-bold text-slate-500">
                {unit.items.length} words
              </span>
            )}
          </div>

          <h4 className="text-sm font-black text-white group-hover:text-amber-300 transition-colors">
            {unit.title}
          </h4>
        </div>

        {/* Action Row: Study + Completed Test Text Button */}
        <div className="mt-4 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
          {!isCompleted ? (
            <button
              type="button"
              onClick={(e) => handleInitiateAssessmentComplete(e, unit)}
              className="text-[11px] font-bold text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer flex items-center gap-1"
              title="Mark that you have taken the school test for this unit"
            >
              <FileCheck2 className="w-3 h-3 text-slate-500 group-hover:text-emerald-400" />
              <span>Completed test</span>
            </button>
          ) : (
            <span className="text-[10px] font-bold text-slate-500">Archived Unit</span>
          )}

          <span className="text-indigo-400 font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
            <span>Study</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    );
  };

  /* =========================================================================
     LAYOUT 2: SIDEBAR COMMAND DECK
     ========================================================================= */
  if (layout === 'sidebar') {
    return (
      <div className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-6 flex flex-col md:flex-row gap-6">
        {/* Left Persistent Navigation Sidebar */}
        <aside className="w-full md:w-64 bg-slate-900 border border-slate-800 rounded-3xl p-5 flex flex-col justify-between shrink-0 space-y-5">
          <div className="space-y-4">
            {/* User Profile Card */}
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl flex items-center gap-3">
              <AvatarDisplay avatar={currentUser.avatar} backdropUrl={equippedBackdrop} size="md" />
              <div className="min-w-0">
                <h3 className="text-sm font-black text-white truncate">{displayName}</h3>
                <span className="text-[10px] text-amber-400 font-bold block">{currentUser.equippedTitle || 'Student'}</span>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-2 bg-slate-950 border border-slate-800 rounded-xl">
                <span className="text-[9px] uppercase font-bold text-slate-500 block">Streak</span>
                <span className="text-sm font-black text-amber-300 font-mono">{currentUser.streak}d</span>
              </div>
              <div className="p-2 bg-slate-950 border border-slate-800 rounded-xl">
                <span className="text-[9px] uppercase font-bold text-slate-500 block">Coins</span>
                <span className="text-sm font-black text-amber-400 font-mono">{currentUser.coins}</span>
              </div>
            </div>

            {/* Navigation links */}
            <nav className="space-y-1.5 pt-2">
              <button
                type="button"
                onClick={onNavigateToMultiplayer}
                className="w-full px-3 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-amber-400/50 rounded-xl text-xs font-bold text-slate-200 flex items-center gap-2.5 cursor-pointer transition-colors"
              >
                <Users className="w-4 h-4 text-amber-400" />
                <span>Multiplayer Battle</span>
              </button>
              <button
                type="button"
                onClick={onNavigateToOralExam}
                className="w-full px-3 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-rose-400/50 rounded-xl text-xs font-bold text-slate-200 flex items-center gap-2.5 cursor-pointer transition-colors"
              >
                <Mic className="w-4 h-4 text-rose-400" />
                <span>Speaking Studio</span>
              </button>
              <button
                type="button"
                onClick={onNavigateToLeaderboard}
                className="w-full px-3 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-indigo-400/50 rounded-xl text-xs font-bold text-slate-200 flex items-center gap-2.5 cursor-pointer transition-colors"
              >
                <Medal className="w-4 h-4 text-indigo-400" />
                <span>Leaderboard</span>
              </button>
              <button
                type="button"
                onClick={onNavigateToCommonErrors}
                className="w-full px-3 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-amber-400/50 rounded-xl text-xs font-bold text-slate-200 flex items-center gap-2.5 cursor-pointer transition-colors"
              >
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Common Errors ({(currentUser.commonErrors || []).length})</span>
              </button>
              <button
                type="button"
                onClick={onNavigateToUniversalHub}
                className="w-full px-3 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-emerald-400/50 rounded-xl text-xs font-bold text-slate-200 flex items-center gap-2.5 cursor-pointer transition-colors"
              >
                <Cloud className="w-4 h-4 text-emerald-400" />
                <span>Universal Cloud Hub</span>
              </button>
              <button
                type="button"
                onClick={onOpenShop}
                className="w-full px-3 py-2 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 rounded-xl text-xs font-bold text-amber-300 flex items-center gap-2.5 cursor-pointer transition-colors"
              >
                <ShoppingBag className="w-4 h-4 text-amber-400" />
                <span>Coin Marketplace</span>
              </button>
            </nav>
          </div>

          <div className="pt-4 border-t border-slate-800 text-[10px] text-slate-500 text-center">
            Sidebar Command Mode Active
          </div>
        </aside>

        {/* Right Expanded Curriculum Canvas */}
        <main className="flex-1 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3 border-b border-slate-800 pb-4">
            <div>
              <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">
                Curriculum Station
              </span>
              <h2 className="text-2xl font-black text-white">Select Study Module</h2>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('german')}
                className={`px-4 py-2 rounded-xl text-xs font-black cursor-pointer ${
                  activeTab === 'german' ? 'bg-indigo-600 text-white' : 'bg-slate-950 text-slate-400 border border-slate-800'
                }`}
              >
                German Module 2
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('latin')}
                className={`px-4 py-2 rounded-xl text-xs font-black cursor-pointer ${
                  activeTab === 'latin' ? 'bg-indigo-600 text-white' : 'bg-slate-950 text-slate-400 border border-slate-800'
                }`}
              >
                Cambridge Latin
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('custom')}
                className={`px-4 py-2 rounded-xl text-xs font-black cursor-pointer ${
                  activeTab === 'custom' ? 'bg-amber-500 text-slate-950' : 'bg-slate-950 text-slate-400 border border-slate-800'
                }`}
              >
                Custom Sets ({customUnits.length})
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            {activeDeckList.map(unit => renderDeckCard(unit))}
          </div>
        </main>
      </div>
    );
  }

  /* =========================================================================
     LAYOUT 3: SPLIT-PANE WORKBENCH
     ========================================================================= */
  if (layout === 'workbench') {
    return (
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 flex flex-col md:flex-row gap-6">
        {/* Left Explorer Pane */}
        <div className="w-full md:w-80 bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shrink-0">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-black uppercase text-amber-400">Deck Explorer</span>
            <span className="text-[10px] text-slate-400">{germanUnits.length + latinUnits.length + customUnits.length} Decks</span>
          </div>

          <div className="flex gap-1.5 border-b border-slate-800 pb-3">
            <button
              type="button"
              onClick={() => setActiveTab('german')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                activeTab === 'german' ? 'bg-indigo-600 text-white' : 'bg-slate-950 text-slate-400'
              }`}
            >
              German
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('latin')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                activeTab === 'latin' ? 'bg-indigo-600 text-white' : 'bg-slate-950 text-slate-400'
              }`}
            >
              Latin
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('custom')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                activeTab === 'custom' ? 'bg-amber-500 text-slate-950' : 'bg-slate-950 text-slate-400'
              }`}
            >
              Custom
            </button>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {activeDeckList.map(unit => {
              const isSelected = selectedWorkbenchDeck.id === unit.id;
              const isCompleted = completedDeckIds.includes(unit.id);
              return (
                <div
                  key={unit.id}
                  onClick={() => setSelectedWorkbenchDeck(unit)}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-indigo-950/60 border-indigo-400 ring-1 ring-indigo-400 text-white'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-amber-400">{unit.badge}</span>
                    {isCompleted && <span className="text-[9px] text-emerald-400 font-bold">Completed</span>}
                  </div>
                  <h4 className="text-xs font-black truncate mt-1">{unit.title}</h4>
                  <span className="text-[10px] text-slate-400">{unit.items.length} words</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Active Workbench Station */}
        <div className="flex-1 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="text-[10px] font-black uppercase text-indigo-400 tracking-wider">
                Active Deck Workbench
              </span>
              <h2 className="text-2xl font-black text-white mt-1">{selectedWorkbenchDeck.title}</h2>
              <p className="text-xs text-slate-400 mt-1">
                {selectedWorkbenchDeck.items.length} Vocabulary Items Ready
              </p>
            </div>

            {/* Launch Study Session Button (gradient explicitly permitted) */}
            <button
              type="button"
              onClick={() => onOpenDeck(selectedWorkbenchDeck)}
              className="px-6 py-3 bg-gradient-to-r from-amber-400 to-indigo-600 hover:from-amber-300 hover:to-indigo-500 text-slate-950 font-black text-xs rounded-xl shadow-lg cursor-pointer active:scale-95"
            >
              Launch Study Session
            </button>
          </div>

          {/* Quick terms preview table */}
          <div>
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">
              Vocabulary Roster Preview
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-96 overflow-y-auto pr-1">
              {selectedWorkbenchDeck.items.map((item, idx) => (
                <div key={idx} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                  <span className="font-bold text-white">{item.prompt}</span>
                  <span className="text-amber-300 font-medium">{item.de.join(', ')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================================
     LAYOUT 4: RETRO ARCADE SPOTLIGHT
     ========================================================================= */
  if (layout === 'arcade') {
    const currentArcadeDeck = activeDeckList[arcadeIndex] || activeDeckList[0];
    return (
      <div className="flex-1 max-w-3xl w-full mx-auto px-4 py-6 flex flex-col justify-center space-y-6">
        <div className="bg-slate-900 border-4 border-amber-400 rounded-3xl p-6 sm:p-8 shadow-[0_0_30px_rgba(251,191,36,0.2)] text-center space-y-6 font-mono">
          {/* Arcade Marquee Header */}
          <div className="bg-slate-950 border-2 border-amber-500 p-4 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Rocket className="w-6 h-6 text-amber-400" />
              <span className="text-base font-black text-amber-400 tracking-widest uppercase">QUEST CONSOLE</span>
            </div>
            <div className="text-xs font-black text-emerald-400">
              COINS: {currentUser.coins} | STREAK: {currentUser.streak}
            </div>
          </div>

          {/* Hub shortcuts inside Arcade console */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-[10px]">
            <button
              type="button"
              onClick={onNavigateToMultiplayer}
              className="p-2 bg-slate-950 border border-amber-500/40 rounded-xl text-amber-300 font-bold hover:bg-slate-800"
            >
              Multiplayer
            </button>
            <button
              type="button"
              onClick={onNavigateToOralExam}
              className="p-2 bg-slate-950 border border-rose-500/40 rounded-xl text-rose-300 font-bold hover:bg-slate-800"
            >
              Speaking
            </button>
            <button
              type="button"
              onClick={onNavigateToLeaderboard}
              className="p-2 bg-slate-950 border border-indigo-500/40 rounded-xl text-indigo-300 font-bold hover:bg-slate-800"
            >
              Rankings
            </button>
            <button
              type="button"
              onClick={onNavigateToCommonErrors}
              className="p-2 bg-slate-950 border border-amber-500/40 rounded-xl text-amber-300 font-bold hover:bg-slate-800"
            >
              Errors
            </button>
            <button
              type="button"
              onClick={onNavigateToUniversalHub}
              className="p-2 bg-slate-950 border border-emerald-500/40 rounded-xl text-emerald-300 font-bold hover:bg-slate-800"
            >
              Cloud Hub
            </button>
            <button
              type="button"
              onClick={onOpenShop}
              className="p-2 bg-slate-950 border border-cyan-500/40 rounded-xl text-cyan-300 font-bold hover:bg-slate-800"
            >
              Shop
            </button>
          </div>

          {/* Language Switcher */}
          <div className="flex justify-center gap-2">
            <button
              type="button"
              onClick={() => { setActiveTab('german'); setArcadeIndex(0); }}
              className={`px-3 py-1.5 text-xs font-bold border-2 rounded ${
                activeTab === 'german' ? 'border-amber-400 bg-amber-400 text-slate-950' : 'border-slate-700 text-slate-400'
              }`}
            >
              GERMAN
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('latin'); setArcadeIndex(0); }}
              className={`px-3 py-1.5 text-xs font-bold border-2 rounded ${
                activeTab === 'latin' ? 'border-amber-400 bg-amber-400 text-slate-950' : 'border-slate-700 text-slate-400'
              }`}
            >
              LATIN
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('custom'); setArcadeIndex(0); }}
              className={`px-3 py-1.5 text-xs font-bold border-2 rounded ${
                activeTab === 'custom' ? 'border-amber-400 bg-amber-400 text-slate-950' : 'border-slate-700 text-slate-400'
              }`}
            >
              CUSTOM
            </button>
          </div>

          {/* Spotlight Deck Showcase */}
          <div className="p-8 bg-slate-950 border-2 border-indigo-500 rounded-3xl space-y-4">
            <span className="text-xs font-black text-indigo-400 uppercase">
              CARTRIDGE {arcadeIndex + 1} OF {activeDeckList.length}
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white">{currentArcadeDeck.title}</h3>
            <p className="text-xs text-amber-300">
              {currentArcadeDeck.items.length} WORDS READY FOR COMBAT
            </p>

            <button
              type="button"
              onClick={() => onOpenDeck(currentArcadeDeck)}
              className="w-full py-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm uppercase rounded-2xl shadow-xl transition-all cursor-pointer active:scale-95"
            >
              SELECT CARTRIDGE TO STUDY
            </button>
          </div>

          {/* Next / Previous Cartridge */}
          <div className="flex justify-between gap-4">
            <button
              type="button"
              onClick={() => setArcadeIndex(prev => (prev - 1 + activeDeckList.length) % activeDeckList.length)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 text-xs font-bold rounded-xl"
            >
              PREVIOUS
            </button>
            <button
              type="button"
              onClick={() => setArcadeIndex(prev => (prev + 1) % activeDeckList.length)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 text-xs font-bold rounded-xl"
            >
              NEXT
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================================
     LAYOUT 5: MODULAR BENTO GRID
     ========================================================================= */
  if (layout === 'bento') {
    return (
      <div className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 space-y-4">
        {/* Bento Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Tile 1: Profile & Avatar Showcase */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 flex items-center gap-4 col-span-1 md:col-span-2">
            <AvatarDisplay avatar={currentUser.avatar} backdropUrl={equippedBackdrop} size="lg" />
            <div>
              <span className="text-[10px] font-black uppercase text-amber-400">Player Profile</span>
              <h3 className="text-base font-black text-white">{displayName}</h3>
              <span className="text-xs text-slate-400 font-bold">{currentUser.equippedTitle || 'Student'}</span>
              <div className="flex items-center gap-2 mt-2">
                <button
                  type="button"
                  onClick={onOpenShop}
                  className="px-3 py-1 bg-amber-400/20 text-amber-300 border border-amber-400/30 rounded-lg text-[10px] font-black"
                >
                  Wardrobe & Shop
                </button>
                <button
                  type="button"
                  onClick={onNavigateToCommonErrors}
                  className="px-3 py-1 bg-slate-800 text-slate-300 rounded-lg text-[10px] font-bold"
                >
                  Errors ({(currentUser.commonErrors || []).length})
                </button>
              </div>
            </div>
          </div>

          {/* Tile 2: Streak & Power-Up Freeze */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-amber-400">Streak Shield</span>
              <Flame className="w-5 h-5 text-amber-400" />
            </div>
            <div className="my-2">
              <div className="text-3xl font-black text-white">{currentUser.streak} Days</div>
              <p className="text-[11px] text-slate-400">Protect daily progress</p>
            </div>
            {currentUser.streakFreezeCount && currentUser.streakFreezeCount > 0 ? (
              <span className="text-[10px] font-bold text-cyan-300 bg-cyan-950/60 p-1.5 rounded-lg border border-cyan-800 flex items-center gap-1">
                <Snowflake className="w-3 h-3 text-cyan-400" />
                <span>{currentUser.streakFreezeCount} Freezes</span>
              </span>
            ) : (
              <button
                type="button"
                onClick={onOpenShop}
                className="text-[10px] text-indigo-400 hover:underline font-bold"
              >
                Buy Streak Freeze
              </button>
            )}
          </div>

          {/* Tile 3: Multiplayer & Rank */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-indigo-400">Multiplayer & Rank</span>
              <Medal className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="my-2">
              <div className="text-3xl font-black text-indigo-300">{currentUser.xp} XP</div>
              <p className="text-[11px] text-slate-400">Arena battles & sprints</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onNavigateToMultiplayer}
                className="flex-1 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl"
              >
                Multiplayer
              </button>
              <button
                type="button"
                onClick={onNavigateToLeaderboard}
                className="px-3 py-1.5 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl"
              >
                Rank
              </button>
            </div>
          </div>
        </div>

        {/* Bento Main Curriculum Box */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onNavigateToOralExam}
                className="px-3 py-1.5 bg-rose-950/40 border border-rose-500/30 text-rose-300 rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <Mic className="w-3.5 h-3.5" />
                <span>Oral Studio</span>
              </button>
              <button
                type="button"
                onClick={onNavigateToUniversalHub}
                className="px-3 py-1.5 bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <Cloud className="w-3.5 h-3.5" />
                <span>Universal Hub</span>
              </button>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('german')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold ${activeTab === 'german' ? 'bg-indigo-600 text-white' : 'bg-slate-950 text-slate-400'}`}
              >
                German Module 2
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('latin')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold ${activeTab === 'latin' ? 'bg-indigo-600 text-white' : 'bg-slate-950 text-slate-400'}`}
              >
                Cambridge Latin
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('custom')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold ${activeTab === 'custom' ? 'bg-amber-500 text-slate-950' : 'bg-slate-950 text-slate-400'}`}
              >
                Custom Sets
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {activeDeckList.map(unit => renderDeckCard(unit))}
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================================
     LAYOUT 6: CLEAN MINIMALIST WEB (EDITORIAL)
     ========================================================================= */
  if (layout === 'editorial') {
    return (
      <div className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 space-y-8">
        {/* Editorial Top Bar */}
        <div className="border-b border-slate-800 pb-6 flex items-center justify-between flex-wrap gap-4">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400">
              Quest Hub Academic Edition
            </span>
            <h2 className="text-3xl font-serif font-bold text-white mt-1">
              {displayName}
            </h2>
            <div className="flex items-center gap-3 text-xs text-slate-400 mt-2">
              <span>Streak: <strong className="text-amber-400">{currentUser.streak} days</strong></span>
              <span>•</span>
              <span>Coins: <strong className="text-amber-400">{currentUser.coins}</strong></span>
              <span>•</span>
              <span>XP: <strong className="text-indigo-400">{currentUser.xp}</strong></span>
            </div>
          </div>

          {/* Quick Clean Actions */}
          <div className="flex flex-wrap gap-2 text-xs">
            <button
              type="button"
              onClick={onNavigateToMultiplayer}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl font-medium text-slate-200"
            >
              Multiplayer
            </button>
            <button
              type="button"
              onClick={onNavigateToOralExam}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl font-medium text-slate-200"
            >
              Speaking
            </button>
            <button
              type="button"
              onClick={onNavigateToLeaderboard}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl font-medium text-slate-200"
            >
              Leaderboard
            </button>
            <button
              type="button"
              onClick={onNavigateToCommonErrors}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl font-medium text-slate-200"
            >
              Errors
            </button>
            <button
              type="button"
              onClick={onNavigateToUniversalHub}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl font-medium text-slate-200"
            >
              Cloud Hub
            </button>
            <button
              type="button"
              onClick={onOpenShop}
              className="px-3.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 rounded-xl font-medium"
            >
              Wardrobe
            </button>
          </div>
        </div>

        {/* Module Switcher */}
        <div className="flex gap-4 border-b border-slate-800 pb-3 text-sm">
          <button
            type="button"
            onClick={() => setActiveTab('german')}
            className={`pb-2 font-bold transition-colors border-b-2 -mb-3.5 cursor-pointer ${
              activeTab === 'german' ? 'border-indigo-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            German Module 2 ({germanUnits.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('latin')}
            className={`pb-2 font-bold transition-colors border-b-2 -mb-3.5 cursor-pointer ${
              activeTab === 'latin' ? 'border-indigo-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            Cambridge Latin ({latinUnits.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('custom')}
            className={`pb-2 font-bold transition-colors border-b-2 -mb-3.5 cursor-pointer ${
              activeTab === 'custom' ? 'border-amber-400 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            Custom Vocabulary ({customUnits.length})
          </button>
        </div>

        {/* Structured Reading List */}
        <div className="divide-y divide-slate-800 border border-slate-800 rounded-2xl bg-slate-900/40 overflow-hidden">
          {activeDeckList.map(unit => {
            const isCompleted = completedDeckIds.includes(unit.id);
            return (
              <div
                key={unit.id}
                onClick={() => onOpenDeck(unit)}
                className={`p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-900/90 transition-colors cursor-pointer ${
                  isCompleted ? 'opacity-50' : ''
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                      {unit.badge}
                    </span>
                    {isCompleted && (
                      <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Completed Assessment
                      </span>
                    )}
                  </div>
                  <h4 className="text-base font-bold text-white">{unit.title}</h4>
                  <span className="text-xs text-slate-400">{unit.items.length} terms</span>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {!isCompleted && (
                    <button
                      type="button"
                      onClick={(e) => handleInitiateAssessmentComplete(e, unit)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg cursor-pointer"
                    >
                      Completed test
                    </button>
                  )}
                  <span className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg inline-flex items-center gap-1">
                    <span>Study</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  /* =========================================================================
     LAYOUT 1: DEFAULT ARENA
     ========================================================================= */
  return (
    <div className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 flex flex-col justify-center space-y-6">
      {/* Mission Control Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Welcome Header */}
        <div className="text-center space-y-1">
          <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest bg-amber-500/10 px-3 py-0.5 rounded-full border border-amber-500/30">
            Mission Control
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Welcome back, {displayName}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-medium">
            Select a curriculum unit to practice flashcards, learn via multiple choice, or test your mastery.
          </p>
        </div>

        {/* Quick Hub Launch Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-2.5">
          <button
            type="button"
            onClick={onNavigateToMultiplayer}
            className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-amber-400/50 rounded-2xl flex flex-col items-center justify-center gap-1.5 text-center cursor-pointer transition-all group"
          >
            <Users className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-slate-200">Multiplayer</span>
          </button>

          <button
            type="button"
            onClick={onNavigateToOralExam}
            className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-rose-400/50 rounded-2xl flex flex-col items-center justify-center gap-1.5 text-center cursor-pointer transition-all group"
          >
            <Mic className="w-5 h-5 text-rose-400 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-slate-200">Oral Studio</span>
          </button>

          <button
            type="button"
            onClick={onNavigateToLeaderboard}
            className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-indigo-400/50 rounded-2xl flex flex-col items-center justify-center gap-1.5 text-center cursor-pointer transition-all group"
          >
            <Medal className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-slate-200">Leaderboard</span>
          </button>

          <button
            type="button"
            onClick={onNavigateToCommonErrors}
            className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-amber-400/50 rounded-2xl flex flex-col items-center justify-center gap-1.5 text-center cursor-pointer transition-all group"
          >
            <AlertTriangle className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-slate-200">Error Vault</span>
          </button>

          <button
            type="button"
            onClick={onNavigateToUniversalHub}
            className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-emerald-400/50 rounded-2xl flex flex-col items-center justify-center gap-1.5 text-center cursor-pointer transition-all group"
          >
            <Cloud className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-slate-200">Cloud Hub</span>
          </button>

          {onNavigateToOfflineHub && (
            <button
              type="button"
              onClick={onNavigateToOfflineHub}
              className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-cyan-400/50 rounded-2xl flex flex-col items-center justify-center gap-1.5 text-center cursor-pointer transition-all group"
            >
              <WifiOff className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-slate-200">Offline Hub</span>
            </button>
          )}
        </div>

        {/* Language Tabs */}
        <div className="flex justify-center gap-2 sm:gap-3 flex-wrap border-b border-slate-800 pb-4">
          <button
            type="button"
            onClick={() => { playSound('click'); setActiveTab('german'); }}
            className={`px-5 py-2.5 font-black text-xs sm:text-sm rounded-2xl transition-all cursor-pointer ${
              activeTab === 'german'
                ? 'bg-indigo-600 text-white shadow-lg border-2 border-indigo-400'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            German Module 2
          </button>
          <button
            type="button"
            onClick={() => { playSound('click'); setActiveTab('latin'); }}
            className={`px-5 py-2.5 font-black text-xs sm:text-sm rounded-2xl transition-all cursor-pointer ${
              activeTab === 'latin'
                ? 'bg-indigo-600 text-white shadow-lg border-2 border-indigo-400'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Cambridge Latin Book 1
          </button>
          <button
            type="button"
            onClick={() => { playSound('click'); setActiveTab('custom'); }}
            className={`px-5 py-2.5 font-black text-xs sm:text-sm rounded-2xl transition-all cursor-pointer ${
              activeTab === 'custom'
                ? 'bg-amber-500 text-slate-950 shadow-lg border-2 border-amber-300'
                : 'bg-slate-800 text-amber-300 hover:bg-slate-700'
            }`}
          >
            Custom Sets & Hub ({customUnits.length})
          </button>
        </div>

        {/* Unit Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {activeDeckList.map(unit => renderDeckCard(unit))}
        </div>

        {/* Custom Hub 2-Box System (shown on custom tab) */}
        {activeTab === 'custom' && (
          <div className="mt-6 pt-6 border-t border-slate-800 space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h4 className="text-xs font-black text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Custom Hub • Side-by-Side Word Creator</span>
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Type foreign words on the left and translations on the right. Line 1 matches Line 1.
                </p>
              </div>

              {/* Backup & Load Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onBackupAllSets}
                  className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                  title="Backup all custom decks to a JSON file"
                >
                  <Download className="w-3 h-3 text-indigo-400" />
                  <span>Backup JSON</span>
                </button>
                <label className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors">
                  <Upload className="w-3 h-3 text-emerald-400" />
                  <span>Load JSON</span>
                  <input
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={e => e.target.files?.[0] && onLoadSetFromFile(e.target.files[0])}
                  />
                </label>
              </div>
            </div>

            {/* Deck Title Input & Public Tickbox */}
            <div className="space-y-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                <div className="sm:col-span-2">
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Deck Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Cambridge Latin Stage 15 Essentials"
                    value={customDeckTitle}
                    onChange={e => setCustomDeckTitle(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 font-bold outline-none focus:border-amber-400"
                  />
                </div>

                <div className="flex items-center gap-2 pb-2">
                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isPublicCloudSet}
                      onChange={e => setIsPublicCloudSet(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-700 text-indigo-600 focus:ring-0 cursor-pointer"
                    />
                    <span>Publish to Universal Hub</span>
                  </label>
                </div>
              </div>

              {/* The Two Expandable Side-by-Side Multiline Boxes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-amber-300 block">
                      Foreign Words (One per line)
                    </label>
                    <span className="text-[10px] text-slate-500">
                      {leftMultilineText.split('\n').filter(l => !!l.trim()).length} lines
                    </span>
                  </div>
                  <textarea
                    rows={6}
                    value={leftMultilineText}
                    onChange={e => setLeftMultilineText(e.target.value)}
                    placeholder={`Buch\nHaus\nHund`}
                    className="w-full px-3 py-2.5 bg-slate-900 border border-amber-500/40 rounded-xl text-xs text-white font-mono placeholder-slate-600 outline-none focus:border-amber-400 resize-y"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-indigo-300 block">
                      Translations (One per line)
                    </label>
                    <span className="text-[10px] text-slate-500">
                      {rightMultilineText.split('\n').filter(l => !!l.trim()).length} lines
                    </span>
                  </div>
                  <textarea
                    rows={6}
                    value={rightMultilineText}
                    onChange={e => setRightMultilineText(e.target.value)}
                    placeholder={`book\nhouse\ndog`}
                    className="w-full px-3 py-2.5 bg-slate-900 border border-indigo-500/40 rounded-xl text-xs text-white font-mono placeholder-slate-600 outline-none focus:border-indigo-400 resize-y"
                  />
                </div>
              </div>

              {/* Single pair quick entry */}
              <div className="pt-2 border-t border-slate-800/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Or Add Individual Word Pair:
                </span>
                <form onSubmit={handleAddSinglePair} className="flex flex-wrap gap-2">
                  <input
                    type="text"
                    placeholder="Foreign word (e.g. Buch)"
                    value={singleLeftWord}
                    onChange={e => setSingleLeftWord(e.target.value)}
                    className="flex-1 min-w-[130px] px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500"
                  />
                  <input
                    type="text"
                    placeholder="Translation (e.g. book)"
                    value={singleRightWord}
                    onChange={e => setSingleRightWord(e.target.value)}
                    className="flex-1 min-w-[130px] px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl cursor-pointer"
                  >
                    + Add Pair
                  </button>
                </form>
              </div>

              {customError && (
                <div className="text-xs text-rose-400 font-bold">{customError}</div>
              )}
            </div>

            {/* Bottom: Interactive Words List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-slate-300">
                  Vocabulary Words Added ({draftWords.length})
                </span>
                {draftWords.length > 0 && (
                  <button
                    type="button"
                    onClick={() => { setLeftMultilineText(''); setRightMultilineText(''); }}
                    className="text-[11px] text-rose-400 hover:text-rose-300 font-bold cursor-pointer"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {draftWords.length === 0 ? (
                <div className="p-6 bg-slate-950/40 rounded-2xl border border-slate-800/60 text-center text-xs text-slate-500">
                  No words added yet. Use the two boxes above to add foreign words and translations.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
                  {draftWords.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl flex items-center justify-between gap-2 group transition-all"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-5 h-5 rounded-full bg-slate-900 text-slate-500 text-[10px] font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <div className="min-w-0">
                          <span className="font-bold text-xs text-amber-300 block truncate">
                            {item.prompt}
                          </span>
                          <span className="text-[11px] text-slate-400 block truncate">
                            {item.de.join(', ')}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveWordAtIndex(idx)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 opacity-70 group-hover:opacity-100 transition-opacity cursor-pointer shrink-0"
                        title="Delete word"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Save Custom Deck Button (Solid button, zero gradients) */}
              <div className="pt-3 flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveCustomDeck}
                  disabled={draftWords.length === 0}
                  className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 disabled:opacity-40 text-slate-950 font-black text-xs rounded-xl shadow-md cursor-pointer transition-all active:scale-95 flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-slate-950" />
                  <span>Save Custom Deck ({draftWords.length} words)</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ASSESSMENT COMPLETION CONFIRMATION MODAL */}
      {pendingCompletedDeck && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-amber-400 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-black text-white">School Assessment Completion</h3>
              </div>
              <button
                type="button"
                onClick={() => setPendingCompletedDeck(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to mark <strong>{pendingCompletedDeck.title}</strong> as completed?
              This marks that you have taken the test at school and archives the unit from active lessons.
            </p>

            <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer pt-1 select-none">
              <input
                type="checkbox"
                checked={dontAskAgainAssessment}
                onChange={e => setDontAskAgainAssessment(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 text-indigo-600 focus:ring-0 cursor-pointer"
              />
              <span>Don't ask me again</span>
            </label>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setPendingCompletedDeck(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAssessmentComplete}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl cursor-pointer"
              >
                Confirm & Archive
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 px-2">
        <span className="font-medium">
          Quest Hub Learning Arena • All vocabulary and curriculum preserved
        </span>
        <div className="flex items-center gap-3">
          <span className="text-amber-400 font-bold">
            31 Invite Codes Tracking
          </span>
        </div>
      </div>
    </div>
  );
};
