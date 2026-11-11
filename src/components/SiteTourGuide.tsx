import React, { useState } from 'react';
import { ActiveScreen } from '../types';
import { playSound } from '../utils/soundEffects';
import {
  Compass,
  ArrowRight,
  ArrowLeft,
  X,
  Sparkles,
  ExternalLink,
  BookOpen,
  Layers,
  Users,
  ShoppingBag,
  WifiOff,
  HelpCircle
} from 'lucide-react';

interface SiteTourGuideProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (screen: ActiveScreen) => void;
  onOpenShop: () => void;
  onOpenSpotify: () => void;
}

interface TourStep {
  id: string;
  badge: string;
  title: string;
  targetScreen?: ActiveScreen;
  actionText?: string;
  icon: React.ReactNode;
  content: string;
  proTip: string;
}

export const SiteTourGuide: React.FC<SiteTourGuideProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenShop,
  onOpenSpotify
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (!isOpen) return null;

  const tourSteps: TourStep[] = [
    {
      id: 'welcome',
      badge: 'Step 1 of 7',
      title: 'Welcome to Quest Hub Arena',
      icon: <Compass className="w-5 h-5 text-indigo-400" />,
      content:
        'Quest Hub is an interactive language learning arena designed specifically for Cambridge Latin Book 1 and German Module 2. Every quest awards coins and maintains your daily streak.',
      proTip: 'Look at the top bar for your real-time streak shield, coins balance, and audio controls.'
    },
    {
      id: 'curriculum',
      badge: 'Step 2 of 7',
      title: 'Curriculum & School Test Decks',
      targetScreen: 'landing',
      actionText: 'View Curriculum Decks',
      icon: <BookOpen className="w-5 h-5 text-amber-400" />,
      content:
        'Browse German Module 2 units (Schule, Freizeit, Haus) and Cambridge Latin Stages 1–12. When you finish your official test in school, click "Completed test" to archive the unit and clear words from your Common Errors vault.',
      proTip: 'Latin verbs require exactly one pronoun (he, she, or it)—for example, "he works".'
    },
    {
      id: 'study-modes',
      badge: 'Step 3 of 7',
      title: 'Three Distinct Study Stations',
      targetScreen: 'landing',
      icon: <Layers className="w-5 h-5 text-emerald-400" />,
      content:
        'Each deck offers 3 tailored modes: Flashcards (flip with native audio), Learn Mode (step-by-step interactive practice with choice between multiple-choice or typing), and Test Mode (a single full-page school exam paper).',
      proTip: 'Inside each mode, click the gear icon to toggle reverse direction, auto-audio, and large print.'
    },
    {
      id: 'custom-hub',
      badge: 'Step 4 of 7',
      title: 'Custom Hub: Two-Box Deck Creator',
      targetScreen: 'landing',
      icon: <BookOpen className="w-5 h-5 text-purple-400" />,
      content:
        'In the Custom Hub, create custom vocabulary decks with side-by-side boxes: enter the foreign words on the left (e.g. "Buch") and English translations on the right (e.g. "book"). You can publish them to the Universal Cloud Hub for other students!',
      proTip: 'Export and backup all your custom decks to a single JSON file anytime in Settings.'
    },
    {
      id: 'multiplayer',
      badge: 'Step 5 of 7',
      title: 'Live 6-Digit Multiplayer Arena',
      targetScreen: 'multiplayer',
      actionText: 'Open Multiplayer Arena',
      icon: <Users className="w-5 h-5 text-rose-400" />,
      content:
        'Challenge classmates in real time using 6-digit room PINs. Host settings allow you to choose Multiple Choice vs Written typing, set question timers, or enable Speed-Protected untimed mode. Your real full name and avatar picture appear on the live scoreboard!',
      proTip: 'Survival Sprint resets your score to zero on a single wrong answer—first to 10 wins!'
    },
    {
      id: 'offline',
      badge: 'Step 6 of 7',
      title: 'Dedicated Offline Practice Hub',
      targetScreen: 'offline-hub',
      actionText: 'Jump to Offline Hub',
      icon: <WifiOff className="w-5 h-5 text-cyan-400" />,
      content:
        'No internet? No problem! The Offline Hub lets you study all 31+ decks completely offline in device cache, with flashcards and offline quizzes that preserve your audio and typography settings without resetting.',
      proTip: 'Accessible instantly from the top header or Mission Control.'
    },
    {
      id: 'shop-wardrobe',
      badge: 'Step 7 of 7',
      title: 'Avatar Wardrobe & Scenic Backdrops',
      actionText: 'Open Wardrobe & Shop',
      icon: <ShoppingBag className="w-5 h-5 text-amber-400" />,
      content:
        'Spend your hard-earned coins on outfits, hats, accessories, and real scenic photography backdrops. You start with 0 items and earn coins strictly by answering questions correctly. Admin Rufus has 1,000 coins to test all wardrobe gear!',
      proTip: 'Equipped backdrops display behind your name across the header and multiplayer cards.'
    }
  ];

  const currentStep = tourSteps[currentStepIndex];

  const handleNext = () => {
    playSound('click');
    if (currentStepIndex + 1 < tourSteps.length) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    playSound('click');
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleJumpToScreen = () => {
    playSound('click');
    if (currentStep.id === 'shop-wardrobe') {
      onClose();
      onOpenShop();
    } else if (currentStep.targetScreen) {
      onNavigate(currentStep.targetScreen);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-5 select-none">
      <div className="bg-slate-900 border-2 border-indigo-500 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 relative">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800">
              {currentStep.badge}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer transition-colors"
            aria-label="Close guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Content */}
        <div className="space-y-3.5 text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center">
              {currentStep.icon}
            </div>
            <h3 className="text-xl font-black text-white">{currentStep.title}</h3>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-2xl border border-slate-800">
            {currentStep.content}
          </p>

          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-[11px] text-amber-300 font-medium">
            <strong className="block text-amber-400 uppercase font-black text-[9px] mb-0.5">
              Pro Tip:
            </strong>
            {currentStep.proTip}
          </div>

          {currentStep.actionText && (
            <button
              type="button"
              onClick={handleJumpToScreen}
              className="w-full py-2.5 bg-indigo-950/60 hover:bg-indigo-900/60 text-indigo-300 border border-indigo-500/40 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <span>{currentStep.actionText}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Step Progress Dots */}
        <div className="flex justify-center gap-1.5 pt-1">
          {tourSteps.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all ${
                idx === currentStepIndex ? 'w-6 bg-indigo-500' : 'w-2 bg-slate-800'
              }`}
            />
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center gap-3 pt-2 border-t border-slate-800">
          <button
            type="button"
            disabled={currentStepIndex === 0}
            onClick={handlePrev}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 font-bold text-xs rounded-xl cursor-pointer flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs rounded-xl shadow cursor-pointer flex items-center gap-1.5 transition-colors"
          >
            <span>{currentStepIndex + 1 === tourSteps.length ? 'Finish Tour' : 'Next Step'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
