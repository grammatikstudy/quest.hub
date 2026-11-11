import React, { useState, useEffect, useCallback } from 'react';
import {
  DeckUnit,
  UserAccount,
  VocabItem,
  InviteCodeAudit,
  ShopItem,
  ThemeType,
  LayoutType,
  FontSize,
  ActiveScreen,
  UserAvatar
} from './types';
import {
  GERMAN_UNITS,
  LATIN_UNITS,
  INITIAL_INVITE_CODES,
  UNIVERSAL_COMMUNITY_DECKS,
  SHOP_CATALOG,
  DEFAULT_CUSTOM_SETS
} from './data/defaultVocab';
import { playSound } from './utils/soundEffects';

// Core Components
import { Header } from './components/Header';
import { AuthScreen } from './components/AuthScreen';
import { MissionControl } from './components/MissionControl';
import { StudyModeSelector } from './components/StudyModeSelector';
import { FlashcardScreen } from './components/FlashcardScreen';
import { MultipleChoiceScreen } from './components/MultipleChoiceScreen';
import { WrittenQuizScreen } from './components/WrittenQuizScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { MultiplayerArena } from './components/MultiplayerArena';
import { OralExamStudio } from './components/OralExamStudio';
import { UniversalCloudHub } from './components/UniversalCloudHub';
import { CommonErrorsVault } from './components/CommonErrorsVault';
import { LeaderboardScreen } from './components/LeaderboardScreen';
import { AdminPanel } from './components/AdminPanel';
import { OfflineHubScreen } from './components/OfflineHubScreen';

// Modals & Widgets
import { CoinShopModal } from './components/CoinShopModal';
import { AppearanceSettingsModal } from './components/AppearanceSettingsModal';
import { TrophyCabinetModal } from './components/TrophyCabinetModal';
import { SpotifyWidget } from './components/SpotifyWidget';
import { RightClickPronounceModal } from './components/RightClickPronounceModal';
import { SiteTourGuide } from './components/SiteTourGuide';
import { AiTutorChatModal } from './components/AiTutorChatModal';

export default function App() {
  // Accounts & Persistence
  const [accounts, setAccounts] = useState<UserAccount[]>(() => {
    try {
      const saved = localStorage.getItem('questhub_accounts_v6');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((acc: UserAccount) => {
            if (acc.username === 'Rufus_Admin') {
              return {
                ...acc,
                firstName: acc.firstName || 'Rufus',
                lastName: acc.lastName || 'Admin',
                realName: 'Rufus Admin',
                coins: Math.max(acc.coins || 0, 1000), // Admin given 1000 coins for testing
                customSets: (!acc.customSets || acc.customSets.length === 0) ? DEFAULT_CUSTOM_SETS : acc.customSets
              };
            }
            return {
              ...acc,
              customSets: (!acc.customSets || acc.customSets.length === 0) ? DEFAULT_CUSTOM_SETS : acc.customSets
            };
          });
        }
      }
    } catch {}

    // Seed Rufus_Admin with 1,000 coins, 0 streak freezes, and default custom sets
    return [
      {
        firstName: 'Rufus',
        lastName: 'Admin',
        realName: 'Rufus Admin',
        username: 'Rufus_Admin',
        passwordHash: 'quest.admin',
        isAdmin: true,
        customSets: DEFAULT_CUSTOM_SETS,
        xp: 150,
        coins: 1000,
        streak: 5,
        lastQuestDate: new Date().toDateString(),
        trophies: ['first_quest', 'vocab_master', 'streak_3'],
        equippedTitle: 'Root Admin',
        equippedBackground: undefined,
        avatar: {
          base: 'scholar',
          skinColor: '#fed7aa',
          outfit: 'none',
          hat: 'none',
          accessory: 'none'
        },
        inventory: [],
        streakFreezeCount: 0,
        commonErrors: [],
        completedDecks: [],
        hasSeenTutorial: false,
        joinedAt: Date.now()
      }
    ];
  });

  // 31 Invite Codes with Audit
  const [inviteCodeAudits, setInviteCodeAudits] = useState<InviteCodeAudit[]>(() => {
    try {
      const saved = localStorage.getItem('questhub_invite_audits_v5');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_INVITE_CODES.map(code => ({ code }));
  });

  // Current logged in user
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const remembered = localStorage.getItem('quest_remembered_username');
      if (remembered) {
        const saved = localStorage.getItem('questhub_accounts_v6');
        if (saved) {
          const accs: UserAccount[] = JSON.parse(saved);
          const found = accs.find(a => a.username.toLowerCase() === remembered.toLowerCase());
          if (found) {
            if (found.username === 'Rufus_Admin') {
              found.coins = Math.max(found.coins || 0, 1000);
            }
            if (!found.customSets || found.customSets.length === 0) {
              found.customSets = DEFAULT_CUSTOM_SETS;
            }
            return found;
          }
        }
      }
    } catch {}
    return null;
  });

  // Active Screen / Hash Router
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>(currentUser ? 'landing' : 'auth');

  // Decks State
  const [germanUnits] = useState<DeckUnit[]>(GERMAN_UNITS);
  const [latinUnits] = useState<DeckUnit[]>(LATIN_UNITS);
  const [universalDecks, setUniversalDecks] = useState<DeckUnit[]>(UNIVERSAL_COMMUNITY_DECKS);

  const [activeDeck, setActiveDeck] = useState<DeckUnit>(GERMAN_UNITS[0]);
  const [flashcardCustomItems, setFlashcardCustomItems] = useState<VocabItem[] | null>(null);

  // Appearance & Themes & Layouts
  const [currentLayout, setCurrentLayout] = useState<LayoutType>(() => {
    try {
      return (localStorage.getItem('questhub_layout') as LayoutType) || 'arena';
    } catch {
      return 'arena';
    }
  });

  const [currentTheme, setCurrentTheme] = useState<ThemeType>('default');
  const [autoClockTheme, setAutoClockTheme] = useState(false);
  const [darkModeStart, setDarkModeStart] = useState('20:00');
  const [darkModeEnd, setDarkModeEnd] = useState('06:00');
  const [fontFamily, setFontFamily] = useState("'Plus Jakarta Sans', sans-serif");
  const [fontSize, setFontSize] = useState<FontSize>('normal');
  const [isLanguageReversed, setIsLanguageReversed] = useState(false);
  const [autoTtsEnabled, setAutoTtsEnabled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Results state
  const [quizResults, setQuizResults] = useState<{
    score: number;
    total: number;
    answersLog: { prompt: string; userAns: string; correctAns: string; isCorrect: boolean }[];
    missedItems: VocabItem[];
  }>({
    score: 0,
    total: 0,
    answersLog: [],
    missedItems: []
  });

  // Modals
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTrophiesOpen, setIsTrophiesOpen] = useState(false);
  const [isSpotifyOpen, setIsSpotifyOpen] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [isAiTutorOpen, setIsAiTutorOpen] = useState(false);
  const [rightClickWordModal, setRightClickWordModal] = useState<{ word: string; lang: string } | null>(null);

  // Sync accounts to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('questhub_accounts_v6', JSON.stringify(accounts));
    } catch {}
  }, [accounts]);

  // Sync invite code audits to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('questhub_invite_audits_v5', JSON.stringify(inviteCodeAudits));
    } catch {}
  }, [inviteCodeAudits]);

  // Sync layout
  useEffect(() => {
    try {
      localStorage.setItem('questhub_layout', currentLayout);
    } catch {}
  }, [currentLayout]);

  // Clock-based Auto Dark Mode evaluated against custom user schedule
  useEffect(() => {
    if (autoClockTheme) {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const [startH, startM] = darkModeStart.split(':').map(Number);
      const [endH, endM] = darkModeEnd.split(':').map(Number);
      const startMinutes = (startH || 20) * 60 + (startM || 0);
      const endMinutes = (endH || 6) * 60 + (endM || 0);

      let isNight = false;
      if (startMinutes > endMinutes) {
        isNight = currentMinutes >= startMinutes || currentMinutes < endMinutes;
      } else {
        isNight = currentMinutes >= startMinutes && currentMinutes < endMinutes;
      }

      if (isNight) {
        setCurrentTheme('cyberpunk');
      } else {
        setCurrentTheme('default');
      }
    }
  }, [autoClockTheme, darkModeStart, darkModeEnd]);

  // Daily Streak Notifications check
  useEffect(() => {
    if (notificationsEnabled && typeof window !== 'undefined' && 'Notification' in window) {
      const checkAndSendNotification = () => {
        const hour = new Date().getHours();
        const todayKey = new Date().toDateString();
        const notifiedKey = localStorage.getItem('questhub_notified_date');

        if (Notification.permission === 'granted' && notifiedKey !== todayKey) {
          if (hour === 9) {
            new Notification('Quest Hub Practice Reminder', {
              body: 'Time for your daily Quest Hub practice.'
            });
            localStorage.setItem('questhub_notified_date', todayKey);
          } else if (hour >= 18 && (!currentUser?.lastQuestDate || currentUser.lastQuestDate !== todayKey)) {
            new Notification('Quest Hub Streak Protection', {
              body: 'Your streak is about to break. Practise now to save your progress.'
            });
            localStorage.setItem('questhub_notified_date', todayKey);
          }
        }
      };

      const timer = setInterval(checkAndSendNotification, 60000);
      return () => clearInterval(timer);
    }
  }, [notificationsEnabled, currentUser]);

  // Hash Navigation Sync
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && currentUser) {
        if (hash === 'dashboard') setActiveScreen('landing');
        else if (hash === 'multiplayer') setActiveScreen('multiplayer');
        else if (hash === 'oral-exam') setActiveScreen('oral-exam');
        else if (hash === 'universal-hub') setActiveScreen('universal-hub');
        else if (hash === 'common-errors') setActiveScreen('common-errors');
        else if (hash === 'leaderboard') setActiveScreen('leaderboard');
        else if (hash === 'offline-hub') setActiveScreen('offline-hub');
        else if (hash === 'admin' && currentUser.isAdmin) setActiveScreen('admin');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [currentUser]);

  const navigateTo = (screen: ActiveScreen) => {
    setActiveScreen(screen);
    window.location.hash = screen === 'landing' ? 'dashboard' : screen;
  };

  // Login handler
  const handleLogin = (user: UserAccount) => {
    if (!user.customSets || user.customSets.length === 0) {
      user.customSets = DEFAULT_CUSTOM_SETS;
    }
    if (user.username === 'Rufus_Admin') {
      user.coins = Math.max(user.coins || 0, 1000);
    }
    setCurrentUser(user);
    setAccounts(prev => {
      if (prev.some(a => a.username === user.username)) {
        return prev.map(a => a.username === user.username ? user : a);
      }
      return [...prev, user];
    });

    if (user.hasSeenTutorial === false) {
      setIsTutorialOpen(true);
    }

    navigateTo('landing');
  };

  // Consume an invite code upon registration
  const handleConsumeInviteCode = (code: string, username: string) => {
    setInviteCodeAudits(prev =>
      prev.map(item => item.code === code ? { ...item, usedBy: username, usedAt: Date.now() } : item)
    );
  };

  // Logout handler
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('quest_remembered_username');
    setActiveScreen('auth');
    window.location.hash = '';
  };

  // Update current user helper
  const updateUser = useCallback((updater: (prev: UserAccount) => UserAccount) => {
    setCurrentUser(prev => {
      if (!prev) return null;
      const updated = updater(prev);
      setAccounts(accs => accs.map(a => a.username === updated.username ? updated : a));
      return updated;
    });
  }, []);

  // Award XP, Coins, and evaluate achievements
  const registerCompletionRewards = (earnedScore: number) => {
    if (!currentUser) return;
    const gainedXP = earnedScore * 10;
    const gainedCoins = Math.max(5, Math.round(earnedScore * 5));

    updateUser(u => {
      const today = new Date().toDateString();
      let newStreak = u.streak;
      if (u.lastQuestDate !== today) {
        newStreak = (u.streak || 0) + 1;
      }

      const newXP = (u.xp || 0) + gainedXP;
      const newCoins = (u.coins || 0) + gainedCoins;

      const newTrophies = [...(u.trophies || [])];
      if (!newTrophies.includes('first_quest')) newTrophies.push('first_quest');
      if (newXP >= 100 && !newTrophies.includes('vocab_master')) newTrophies.push('vocab_master');
      if (newXP >= 500 && !newTrophies.includes('xp_500')) newTrophies.push('xp_500');
      if (newXP >= 1000 && !newTrophies.includes('xp_1000')) newTrophies.push('xp_1000');
      if (newStreak >= 3 && !newTrophies.includes('streak_3')) newTrophies.push('streak_3');
      if (newStreak >= 7 && !newTrophies.includes('streak_7')) newTrophies.push('streak_7');

      return {
        ...u,
        xp: newXP,
        coins: newCoins,
        streak: newStreak,
        lastQuestDate: today,
        trophies: newTrophies
      };
    });
  };

  // Open deck to mode selector
  const handleOpenDeck = (deck: DeckUnit) => {
    setActiveDeck(deck);
    setFlashcardCustomItems(null);
    navigateTo('mode-select');
  };

  // Start study modes
  const handleSelectStudyMode = (mode: 'flashcards' | 'mc' | 'quiz') => {
    if (mode === 'flashcards') navigateTo('flashcards');
    else if (mode === 'mc') navigateTo('learn-mc');
    else if (mode === 'quiz') navigateTo('quiz-test');
  };

  // Multiple Choice Finished
  const handleFinishMC = (
    score: number,
    total: number,
    userAnswers: { prompt: string; userAns: string; correctAns: string; isCorrect: boolean }[],
    missedWords: VocabItem[]
  ) => {
    registerCompletionRewards(score);
    if (missedWords.length > 0) {
      updateUser(u => {
        const existingErrors = u.commonErrors || [];
        const toAdd = missedWords.filter(m => !existingErrors.some(e => e.prompt === m.prompt));
        return {
          ...u,
          commonErrors: [...existingErrors, ...toAdd.map(m => ({ prompt: m.prompt, de: m.de, addedAt: Date.now() }))]
        };
      });
    }
    setQuizResults({
      score,
      total,
      answersLog: userAnswers,
      missedItems: missedWords
    });
    navigateTo('results');
  };

  // Written Quiz Finished
  const handleFinishWrittenQuiz = (
    score: number,
    total: number,
    answersLog: { prompt: string; userAns: string; correctAns: string; isCorrect: boolean }[],
    missedItems: VocabItem[]
  ) => {
    registerCompletionRewards(score);
    if (missedItems.length > 0) {
      updateUser(u => {
        const existingErrors = u.commonErrors || [];
        const toAdd = missedItems.filter(m => !existingErrors.some(e => e.prompt === m.prompt));
        return {
          ...u,
          commonErrors: [...existingErrors, ...toAdd.map(m => ({ prompt: m.prompt, de: m.de, addedAt: Date.now() }))]
        };
      });
    }
    setQuizResults({
      score,
      total,
      answersLog,
      missedItems
    });
    navigateTo('results');
  };

  // "Completed Test" Workflow: grays out deck and permanently clears mastered words from Common Errors
  const handleMarkDeckCompleted = (deckId: string, clearedItems: VocabItem[]) => {
    updateUser(u => {
      const completedDecks = u.completedDecks || [];
      const updatedDecks = completedDecks.includes(deckId) ? completedDecks : [...completedDecks, deckId];
      const clearedPrompts = new Set(clearedItems.map(i => i.prompt));
      const remainingErrors = (u.commonErrors || []).filter(e => !clearedPrompts.has(e.prompt));
      const newTrophies = [...(u.trophies || [])];
      if (!newTrophies.includes('error_slayer')) newTrophies.push('error_slayer');

      return {
        ...u,
        completedDecks: updatedDecks,
        commonErrors: remainingErrors,
        trophies: newTrophies
      };
    });
    navigateTo('landing');
  };

  // Uncomplete deck from Serious Zone
  const handleUncompleteDeck = (deckId: string) => {
    updateUser(u => ({
      ...u,
      completedDecks: (u.completedDecks || []).filter(id => id !== deckId)
    }));
  };

  // Hide assessment confirm permanently for user
  const handleHideAssessmentConfirm = () => {
    updateUser(u => ({ ...u, hideAssessmentConfirm: true }));
  };

  // Delete own account
  const handleDeleteMyAccount = () => {
    if (confirm('Are you sure you want to delete your account? All progress will be removed.')) {
      if (currentUser) {
        setAccounts(prev => prev.filter(a => a.username !== currentUser.username));
        handleLogout();
      }
    }
  };

  // Launch review session on missed words
  const handleStartReviewPractice = (items: VocabItem[]) => {
    setFlashcardCustomItems(items);
    navigateTo('flashcards');
  };

  // Custom sets handling
  const handleSaveCustomSet = (newDeck: DeckUnit, isPublic?: boolean) => {
    updateUser(u => ({
      ...u,
      customSets: [...(u.customSets || []), newDeck]
    }));

    if (isPublic) {
      setUniversalDecks(prev => [
        ...prev,
        { ...newDeck, id: `cloud-${Date.now()}`, author: currentUser?.realName || currentUser?.username || 'Creator' }
      ]);
    }
  };

  const handleDeleteCustomSet = (deckId: string) => {
    if (confirm('Delete this custom set?')) {
      playSound('click');
      updateUser(u => ({
        ...u,
        customSets: (u.customSets || []).filter(d => d.id !== deckId)
      }));
    }
  };

  // Universal Hub Deck Save
  const handleSaveUniversalDeck = (deck: DeckUnit) => {
    updateUser(u => {
      const customSets = u.customSets || [];
      if (customSets.some(d => d.title === deck.title)) return u;
      return {
        ...u,
        customSets: [...customSets, { ...deck, id: `saved-${Date.now()}`, isCustom: true }]
      };
    });
  };

  // Publish user deck to community
  const handlePublishToCloud = (deck: DeckUnit) => {
    setUniversalDecks(prev => [
      ...prev,
      { ...deck, id: `cloud-${Date.now()}`, author: currentUser?.realName || currentUser?.username || 'Creator' }
    ]);
  };

  // Buy item in shop
  const handleBuyShopItem = (item: ShopItem) => {
    if (!currentUser || currentUser.coins < item.price) return;
    playSound('correct');
    updateUser(u => {
      const newTrophies = [...(u.trophies || [])];
      if (!newTrophies.includes('shopaholic')) newTrophies.push('shopaholic');
      const newInventory = Array.from(new Set([...(u.inventory || []), item.id]));

      if (item.category === 'powerup') {
        return {
          ...u,
          coins: u.coins - item.price,
          streakFreezeCount: (u.streakFreezeCount || 0) + 1,
          inventory: newInventory,
          trophies: newTrophies
        };
      }

      if (item.category === 'backdrop') {
        return {
          ...u,
          coins: u.coins - item.price,
          equippedBackground: item.id,
          inventory: newInventory,
          trophies: newTrophies
        };
      }

      const currentAvatar: UserAvatar = u.avatar || {
        base: 'scholar',
        skinColor: '#f5d0b5',
        outfit: 'none',
        hat: 'none',
        accessory: 'none'
      };

      const updatedAvatar = { ...currentAvatar };
      if (item.category === 'outfit') updatedAvatar.outfit = item.id;
      if (item.category === 'hat') updatedAvatar.hat = item.id;
      if (item.category === 'accessory') updatedAvatar.accessory = item.id;

      return {
        ...u,
        coins: u.coins - item.price,
        avatar: updatedAvatar,
        inventory: newInventory,
        trophies: newTrophies
      };
    });
  };

  const handleEquipBackground = (bgId: string | undefined) => {
    updateUser(u => ({ ...u, equippedBackground: bgId }));
  };

  const handleUpdateAvatar = (avatar: UserAvatar) => {
    updateUser(u => ({ ...u, avatar }));
  };

  // Backup all sets
  const handleBackupAllSets = () => {
    if (!currentUser) return;
    const backupData = {
      user: currentUser.username,
      exportedAt: new Date().toISOString(),
      customSets: currentUser.customSets || [],
      completedDecks: currentUser.completedDecks || [],
      trophies: currentUser.trophies || []
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const dl = document.createElement('a');
    dl.setAttribute('href', dataStr);
    dl.setAttribute('download', `Quest_Hub_Backup_${currentUser.username}.json`);
    document.body.appendChild(dl);
    dl.click();
    dl.remove();
  };

  // Load set from file
  const handleLoadSetFromFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string);
        if (parsed.customSets && Array.isArray(parsed.customSets)) {
          updateUser(u => ({ ...u, customSets: [...(u.customSets || []), ...parsed.customSets] }));
        } else if (parsed.title && parsed.items) {
          updateUser(u => ({ ...u, customSets: [...(u.customSets || []), parsed] }));
        }
        playSound('correct');
        alert('Custom set(s) imported successfully!');
      } catch {
        alert('Could not parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  // Admin delete account
  const handleDeleteAccountByAdmin = (username: string) => {
    setAccounts(prev => prev.filter(a => a.username !== username));
  };

  // Global pool of items for distractor generation
  const allPoolItems: VocabItem[] = [
    ...germanUnits.flatMap(u => u.items),
    ...latinUnits.flatMap(u => u.items),
    ...(currentUser?.customSets || []).flatMap(u => u.items)
  ];

  // Apply layout theme and font styles to body
  const themeClassMap: Record<ThemeType, string> = {
    default: 'bg-slate-950 text-slate-100',
    cyberpunk: 'bg-[#030712] text-slate-100 theme-cyberpunk',
    zen: 'bg-slate-50 text-slate-900 theme-zen',
    rpg: 'bg-slate-900 text-amber-300 font-mono theme-rpg',
    bento: 'bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 text-white theme-bento',
    codex: 'bg-[#1a1614] text-stone-200 theme-codex'
  };

  // Real Large Print typography scaling
  const fontSizeClassMap: Record<FontSize, string> = {
    normal: 'font-scale-normal text-base',
    large: 'font-scale-large text-lg',
    xlarge: 'font-scale-xlarge text-xl'
  };

  const displayName = currentUser?.firstName && currentUser?.lastName
    ? `${currentUser.firstName} ${currentUser.lastName}`
    : (currentUser?.realName || currentUser?.username || '');

  return (
    <div
      className={`min-h-screen flex flex-col justify-between transition-colors duration-200 ${themeClassMap[currentTheme]} ${fontSizeClassMap[fontSize]}`}
      style={{ fontFamily }}
    >
      {/* Top Header */}
      <Header
        currentUser={currentUser}
        onNavigate={navigateTo}
        onLogout={handleLogout}
        onOpenShop={() => setIsShopOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenTrophies={() => setIsTrophiesOpen(true)}
        onOpenSpotify={() => setIsSpotifyOpen(prev => !prev)}
        onOpenTutorial={() => setIsTutorialOpen(true)}
        onOpenAiTutor={() => setIsAiTutorOpen(true)}
        activeScreen={activeScreen}
      />

      {/* Main View Area */}
      <main className="flex-1 flex flex-col justify-center">
        {/* Screen 1: Auth Screen */}
        {activeScreen === 'auth' && (
          <AuthScreen
            accounts={accounts}
            availableInviteCodes={inviteCodeAudits.filter(a => !a.usedBy).map(a => a.code)}
            onLogin={handleLogin}
            onConsumeInviteCode={handleConsumeInviteCode}
          />
        )}

        {/* Screen 2: Mission Control with 6 distinct layouts */}
        {activeScreen === 'landing' && currentUser && (
          <MissionControl
            currentUser={currentUser}
            germanUnits={germanUnits}
            latinUnits={latinUnits}
            customUnits={currentUser.customSets || []}
            layout={currentLayout}
            onOpenDeck={handleOpenDeck}
            onMarkDeckCompleted={handleMarkDeckCompleted}
            onHideAssessmentConfirm={handleHideAssessmentConfirm}
            onNavigateToMultiplayer={() => navigateTo('multiplayer')}
            onNavigateToOralExam={() => navigateTo('oral-exam')}
            onNavigateToUniversalHub={() => navigateTo('universal-hub')}
            onNavigateToCommonErrors={() => navigateTo('common-errors')}
            onNavigateToLeaderboard={() => navigateTo('leaderboard')}
            onNavigateToOfflineHub={() => navigateTo('offline-hub')}
            onOpenShop={() => setIsShopOpen(true)}
            onOpenTrophyCabinet={() => setIsTrophiesOpen(true)}
            onSaveCustomSet={handleSaveCustomSet}
            onDeleteCustomSet={handleDeleteCustomSet}
            onBackupAllSets={handleBackupAllSets}
            onLoadSetFromFile={handleLoadSetFromFile}
          />
        )}

        {/* Screen 3: Study Mode Selector */}
        {activeScreen === 'mode-select' && (
          <StudyModeSelector
            deck={activeDeck}
            isLanguageReversed={isLanguageReversed}
            onToggleLanguageReversal={() => setIsLanguageReversed(!isLanguageReversed)}
            autoTtsEnabled={autoTtsEnabled}
            onToggleAutoTts={() => setAutoTtsEnabled(!autoTtsEnabled)}
            onSelectMode={handleSelectStudyMode}
            onBackToLanding={() => navigateTo('landing')}
          />
        )}

        {/* Screen 4: Flashcards */}
        {activeScreen === 'flashcards' && (
          <FlashcardScreen
            deck={activeDeck}
            customItems={flashcardCustomItems || undefined}
            isLanguageReversed={isLanguageReversed}
            onToggleLanguageReversal={() => setIsLanguageReversed(!isLanguageReversed)}
            autoTtsEnabled={autoTtsEnabled}
            onToggleAutoTts={() => setAutoTtsEnabled(!autoTtsEnabled)}
            onTakeQuiz={() => navigateTo('quiz-test')}
            onExit={() => navigateTo('landing')}
            onRightClickWord={(word, lang) => setRightClickWordModal({ word, lang })}
            fontSize={fontSize}
            onSelectFontSize={setFontSize}
          />
        )}

        {/* Screen 5: Multiple Choice (Learn) */}
        {activeScreen === 'learn-mc' && (
          <MultipleChoiceScreen
            deck={activeDeck}
            globalPool={allPoolItems}
            isLanguageReversed={isLanguageReversed}
            onToggleLanguageReversal={() => setIsLanguageReversed(!isLanguageReversed)}
            autoTtsEnabled={autoTtsEnabled}
            onToggleAutoTts={() => setAutoTtsEnabled(!autoTtsEnabled)}
            onFinishMC={handleFinishMC}
            onExit={() => navigateTo('landing')}
            onRightClickWord={(word, lang) => setRightClickWordModal({ word, lang })}
            fontSize={fontSize}
            onSelectFontSize={setFontSize}
          />
        )}

        {/* Screen 6: Written Quiz (Test) */}
        {activeScreen === 'quiz-test' && (
          <WrittenQuizScreen
            deck={activeDeck}
            isLanguageReversed={isLanguageReversed}
            onToggleLanguageReversal={() => setIsLanguageReversed(!isLanguageReversed)}
            onSubmitQuiz={handleFinishWrittenQuiz}
            onExit={() => navigateTo('landing')}
            onRightClickWord={(word, lang) => setRightClickWordModal({ word, lang })}
            fontSize={fontSize}
            onSelectFontSize={setFontSize}
          />
        )}

        {/* Screen 7: Results */}
        {activeScreen === 'results' && (
          <ResultsScreen
            score={quizResults.score}
            total={quizResults.total}
            answersLog={quizResults.answersLog}
            missedItems={quizResults.missedItems}
            deck={activeDeck}
            onReviewMissed={handleStartReviewPractice}
            onMarkDeckCompleted={handleMarkDeckCompleted}
            onReturnToLanding={() => navigateTo('landing')}
          />
        )}

        {/* Screen 8: 6-Digit Multiplayer Arena */}
        {activeScreen === 'multiplayer' && currentUser && (
          <MultiplayerArena
            currentUser={currentUser}
            allDecks={[...germanUnits, ...latinUnits, ...(currentUser.customSets || [])]}
            onBackToLanding={() => navigateTo('landing')}
          />
        )}

        {/* Screen 9: Oral Exam Speaking Studio */}
        {activeScreen === 'oral-exam' && (
          <OralExamStudio
            allDecks={[...germanUnits, ...latinUnits, ...(currentUser?.customSets || [])]}
            onBackToLanding={() => navigateTo('landing')}
          />
        )}

        {/* Screen 10: Universal Cloud Hub */}
        {activeScreen === 'universal-hub' && (
          <UniversalCloudHub
            universalDecks={universalDecks}
            userCustomDecks={currentUser?.customSets || []}
            onSaveToAccount={handleSaveUniversalDeck}
            onPublishToCloud={handlePublishToCloud}
            onBackToLanding={() => navigateTo('landing')}
          />
        )}

        {/* Screen 11: Common Errors Vault */}
        {activeScreen === 'common-errors' && currentUser && (
          <CommonErrorsVault
            currentUser={currentUser}
            onClearErrors={() => updateUser(u => ({ ...u, commonErrors: [] }))}
            onStartReviewPractice={handleStartReviewPractice}
            onBackToLanding={() => navigateTo('landing')}
          />
        )}

        {/* Screen 12: Leaderboard */}
        {activeScreen === 'leaderboard' && currentUser && (
          <LeaderboardScreen
            currentUser={currentUser}
            allAccounts={accounts}
            onBackToLanding={() => navigateTo('landing')}
          />
        )}

        {/* Screen 13: Admin Command Center (Rufus_Admin) */}
        {activeScreen === 'admin' && currentUser && (
          <AdminPanel
            currentUser={currentUser}
            allAccounts={accounts}
            inviteCodeAudits={inviteCodeAudits}
            onDeleteAccount={handleDeleteAccountByAdmin}
            onBackToLanding={() => navigateTo('landing')}
          />
        )}

        {/* Screen 14: Dedicated Standalone Offline Practice Hub */}
        {activeScreen === 'offline-hub' && (
          <OfflineHubScreen
            allDecks={[...germanUnits, ...latinUnits, ...(currentUser?.customSets || [])]}
            onBackToLanding={() => navigateTo('landing')}
            fontSize={fontSize}
            onSelectFontSize={setFontSize}
          />
        )}
      </main>

      {/* Footer without @ symbol */}
      <footer className="py-4 text-center text-xs text-slate-500 font-medium border-t border-slate-900/80 max-w-4xl mx-auto px-4 w-full flex flex-wrap justify-between items-center gap-2">
        <span>Quest Hub • Interactive Learning Arena</span>
        <span>
          {currentUser ? `Signed in as ${displayName}` : 'Not Signed In'}
        </span>
      </footer>

      {/* Global Modals & Persistent Widgets */}
      {currentUser && (
        <CoinShopModal
          isOpen={isShopOpen}
          currentUser={currentUser}
          catalog={SHOP_CATALOG}
          onBuyItem={handleBuyShopItem}
          onEquipBackground={handleEquipBackground}
          onUpdateAvatar={handleUpdateAvatar}
          onClose={() => setIsShopOpen(false)}
        />
      )}

      <AppearanceSettingsModal
        isOpen={isSettingsOpen}
        currentTheme={currentTheme}
        onSelectTheme={setCurrentTheme}
        currentLayout={currentLayout}
        onSelectLayout={setCurrentLayout}
        autoClockTheme={autoClockTheme}
        onToggleAutoClockTheme={() => setAutoClockTheme(!autoClockTheme)}
        darkModeStart={darkModeStart}
        onSelectDarkModeStart={setDarkModeStart}
        darkModeEnd={darkModeEnd}
        onSelectDarkModeEnd={setDarkModeEnd}
        fontFamily={fontFamily}
        onSelectFontFamily={setFontFamily}
        fontSize={fontSize}
        onSelectFontSize={setFontSize}
        isLanguageReversed={isLanguageReversed}
        onToggleLanguageReversal={() => setIsLanguageReversed(!isLanguageReversed)}
        autoTtsEnabled={autoTtsEnabled}
        onToggleAutoTts={() => setAutoTtsEnabled(!autoTtsEnabled)}
        notificationsEnabled={notificationsEnabled}
        onToggleNotifications={() => setNotificationsEnabled(!notificationsEnabled)}
        onBackupCustomSets={handleBackupAllSets}
        completedDeckIds={currentUser?.completedDecks || []}
        allDecksSummary={[...germanUnits, ...latinUnits, ...(currentUser?.customSets || [])].map(d => ({ id: d.id, title: d.title }))}
        onUncompleteDeck={handleUncompleteDeck}
        onDeleteMyAccount={handleDeleteMyAccount}
        onOpenTutorial={() => setIsTutorialOpen(true)}
        onClose={() => setIsSettingsOpen(false)}
      />

      {currentUser && (
        <TrophyCabinetModal
          isOpen={isTrophiesOpen}
          currentUser={currentUser}
          onClose={() => setIsTrophiesOpen(false)}
        />
      )}

      {/* Persistent Spotify Study Player Widget */}
      <SpotifyWidget
        isOpen={isSpotifyOpen}
        onClose={() => setIsSpotifyOpen(false)}
      />

      {/* Speech Pronunciation Training Modal */}
      <RightClickPronounceModal
        targetWord={rightClickWordModal?.word || null}
        langCode={rightClickWordModal?.lang || 'de-DE'}
        onClose={() => setRightClickWordModal(null)}
      />

      {/* Interactive Website Walkthrough Tour */}
      <SiteTourGuide
        isOpen={isTutorialOpen}
        onClose={() => {
          setIsTutorialOpen(false);
          updateUser(u => ({ ...u, hasSeenTutorial: true }));
        }}
        onNavigate={navigateTo}
        onOpenShop={() => setIsShopOpen(true)}
        onOpenSpotify={() => setIsSpotifyOpen(true)}
      />

      {/* AI Study Coach Drawer */}
      <AiTutorChatModal
        isOpen={isAiTutorOpen}
        onClose={() => setIsAiTutorOpen(false)}
      />
    </div>
  );
}
