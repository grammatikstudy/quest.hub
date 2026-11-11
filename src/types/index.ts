export interface VocabItem {
  prompt: string;
  de: string[];
}

export interface DeckUnit {
  id: string;
  badge: string;
  title: string;
  lang1: string; // e.g. "en-GB" or "la"
  lang2: string; // e.g. "de-DE" or "en-GB"
  items: VocabItem[];
  isCustom?: boolean;
  author?: string;
  isReversed?: boolean;
}

export interface UserAvatar {
  base: 'adventurer' | 'scholar' | 'cyborg' | 'wizard' | 'ninja' | 'astronaut';
  skinColor: string; // hex color
  outfit: string; // 'casual' | 'cyber_jacket' | 'scholar_robe' | 'wizard_cloak' | 'space_suit' | 'tuxedo' | 'knight_armor' | 'hoodie'
  hat: string; // 'none' | 'headset' | 'crown' | 'wizard_hat' | 'beret' | 'cap' | 'laurel' | 'ninja_headband'
  accessory: string; // 'none' | 'glasses' | 'sunglasses' | 'monocle' | 'gold_chain' | 'wand' | 'dragon_companion'
}

export interface UserAccount {
  realName: string;
  firstName?: string;
  lastName?: string;
  username: string;
  passwordHash: string;
  isAdmin: boolean;
  customSets: DeckUnit[];
  xp: number;
  coins: number;
  streak: number;
  lastQuestDate: string | null;
  trophies: string[];
  equippedTitle: string;
  equippedBackground?: string; // ID of background behind username banner
  avatar?: UserAvatar;
  inventory?: string[]; // IDs of owned backgrounds, clothes, accessories, etc.
  streakFreezeCount?: number; // Number of streak freeze shields owned
  commonErrors: { prompt: string; de: string[]; addedAt: number; missedCount?: number; mastered?: boolean }[];
  completedDecks: string[]; // ids of decks that were marked completed
  notificationShown?: boolean;
  joinedAt?: number;
  usedInviteCode?: string;
  lastLoginAt?: number;
  sessionCount?: number;
  totalTimeSpentMinutes?: number;
  ipAddress?: string;
  hasSeenTutorial?: boolean;
  hideAssessmentConfirm?: boolean;
}

export interface InviteCodeAudit {
  code: string;
  usedBy?: string;
  usedAt?: number;
}

export interface Trophy {
  id: string;
  title: string;
  desc: string;
  icon: string;
  rarity: 'Bronze' | 'Silver' | 'Gold' | 'Legendary';
  coinReward: number;
}

export type ShopCategory = 'backdrop' | 'outfit' | 'hat' | 'accessory' | 'powerup';

export interface ShopItem {
  id: string;
  name: string;
  category: ShopCategory;
  price: number;
  description: string;
  preview: string;
  previewClass?: string;
  photoUrl?: string;
}

export type ThemeType = 'default' | 'cyberpunk' | 'zen' | 'rpg' | 'bento' | 'codex';
export type LayoutType = 'arena' | 'sidebar' | 'workbench' | 'arcade' | 'bento' | 'editorial';
export type FontSize = 'normal' | 'large' | 'xlarge';

export type MultiplayerMode = 'battle' | 'survival';

export type ActiveScreen = 
  | 'auth' 
  | 'landing' 
  | 'mode-select' 
  | 'flashcards' 
  | 'learn-mc' 
  | 'quiz-test' 
  | 'results' 
  | 'multiplayer' 
  | 'oral-exam' 
  | 'universal-hub' 
  | 'common-errors' 
  | 'leaderboard'
  | 'admin'
  | 'offline-hub';

