import React, { useState } from 'react';
import { UserAccount, ShopItem, ShopCategory, UserAvatar } from '../types';
import { playSound } from '../utils/soundEffects';
import { AvatarDisplay } from './AvatarDisplay';
import {
  X,
  Sparkles,
  Coins,
  Check,
  Shield,
  Shirt,
  Crown,
  Palette,
  Flame,
  Snowflake,
  Image,
  User,
  BookOpen,
  Compass,
  Cpu,
  Rocket
} from 'lucide-react';

interface CoinShopModalProps {
  currentUser: UserAccount;
  catalog: ShopItem[];
  isOpen: boolean;
  onBuyItem: (item: ShopItem) => void;
  onEquipBackground: (bgId: string | undefined) => void;
  onUpdateAvatar: (avatar: UserAvatar) => void;
  onClose: () => void;
}

export const CoinShopModal: React.FC<CoinShopModalProps> = ({
  isOpen,
  currentUser,
  catalog,
  onBuyItem,
  onEquipBackground,
  onUpdateAvatar,
  onClose
}) => {
  const [activeCategory, setActiveCategory] = useState<ShopCategory | 'wardrobe'>('wardrobe');

  if (!isOpen) return null;

  const currentCoins = currentUser.coins || 0;
  const userInventory = currentUser.inventory || [];
  const userAvatar: UserAvatar = currentUser.avatar || {
    base: 'scholar',
    skinColor: '#f5d0b5',
    outfit: 'none',
    hat: 'none',
    accessory: 'none'
  };

  const currentBgId = currentUser.equippedBackground;
  const currentBackdropItem = catalog.find(i => i.id === currentBgId);
  const currentBackdropUrl = currentBackdropItem?.photoUrl;

  // Skin tones presets
  const skinTones = ['#f5d0b5', '#fed7aa', '#fcd34d', '#e0a96d', '#b07246', '#6b4423', '#38bdf8', '#c084fc'];
  const baseCharacters: { id: UserAvatar['base']; label: string; icon: React.ReactNode }[] = [
    { id: 'scholar', label: 'Scholar', icon: <span className="text-2xl">🧑‍🏫</span> },
    { id: 'adventurer', label: 'Adventurer', icon: <span className="text-2xl">🧑‍🎤</span> },
    { id: 'cyborg', label: 'Cyborg', icon: <span className="text-2xl">🤖</span> },
    { id: 'wizard', label: 'Wizard', icon: <span className="text-2xl">🧙</span> },
    { id: 'ninja', label: 'Ninja', icon: <span className="text-2xl">🥷</span> },
    { id: 'astronaut', label: 'Astronaut', icon: <span className="text-2xl">🧑‍🚀</span> }
  ];

  const handleEquipItem = (item: ShopItem) => {
    playSound('click');
    if (item.category === 'backdrop') {
      onEquipBackground(currentBgId === item.id ? undefined : item.id);
    } else if (item.category === 'outfit') {
      onUpdateAvatar({ ...userAvatar, outfit: userAvatar.outfit === item.id ? 'none' : item.id });
    } else if (item.category === 'hat') {
      onUpdateAvatar({ ...userAvatar, hat: userAvatar.hat === item.id ? 'none' : item.id });
    } else if (item.category === 'accessory') {
      onUpdateAvatar({ ...userAvatar, accessory: userAvatar.accessory === item.id ? 'none' : item.id });
    }
  };

  const filteredItems = catalog.filter(i => i.category === activeCategory);

  const displayName = currentUser.firstName && currentUser.lastName
    ? `${currentUser.firstName} ${currentUser.lastName}`
    : (currentUser.realName || currentUser.username);

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-5">
      <div className="bg-slate-900 border-2 border-amber-400/50 rounded-3xl p-5 sm:p-7 max-w-4xl w-full shadow-2xl space-y-5 max-h-[95vh] overflow-y-auto">
        {/* Header with Live Coins Balance */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">
                Avatar Dressing Room & Shop
              </span>
              <h3 className="text-xl font-black text-white">Avatar Wardrobe & Photo Backdrops</h3>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3.5 py-1.5 bg-amber-950/40 border border-amber-500/40 rounded-xl">
              <Coins className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-black text-amber-300 font-mono">{currentCoins}</span>
              <span className="text-[10px] font-bold text-amber-400/80 uppercase">Coins</span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer transition-colors"
              aria-label="Close shop"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live Dressing Room Avatar Showcase */}
        <div className="p-5 rounded-3xl border bg-slate-950 border-slate-800 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Avatar on Display */}
          <div className="flex items-center gap-5">
            <AvatarDisplay
              avatar={userAvatar}
              size="xl"
              backdropUrl={currentBackdropUrl}
              className="ring-4 ring-amber-400/40 shadow-2xl"
            />
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                Current Equipped Look
              </span>
              <h4 className="text-base font-black text-white mt-0.5">{displayName}</h4>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-1 flex-wrap">
                <span className="text-amber-300 font-bold">{currentUser.equippedTitle || 'Student'}</span>
                <span>•</span>
                <span>Backdrop: <strong className="text-slate-300">{currentBackdropItem ? currentBackdropItem.name : 'None (Default)'}</strong></span>
              </div>

              {/* Quick unequip backdrop */}
              {currentBgId && (
                <button
                  type="button"
                  onClick={() => onEquipBackground(undefined)}
                  className="mt-2 text-[11px] text-rose-400 hover:text-rose-300 font-bold underline cursor-pointer"
                >
                  Remove Backdrop Photo
                </button>
              )}
            </div>
          </div>

          <div className="text-right text-xs text-slate-400 max-w-xs space-y-1">
            <p className="font-bold text-slate-300">Avatar Studio</p>
            <p>Customize your character with unlocked clothes, headwear, and scenic photo backdrops.</p>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 border-b border-slate-800 pb-3 flex-wrap">
          <button
            type="button"
            onClick={() => setActiveCategory('wardrobe')}
            className={`px-3.5 py-2 rounded-xl text-xs font-black cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeCategory === 'wardrobe' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-950 text-indigo-300 border border-indigo-800'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Dressing Room & Character</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('backdrop')}
            className={`px-3.5 py-2 rounded-xl text-xs font-black cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeCategory === 'backdrop' ? 'bg-amber-400 text-slate-950 shadow-md' : 'bg-slate-950 text-slate-300 border border-slate-800'
            }`}
          >
            <Image className="w-3.5 h-3.5" />
            <span>Photo Backdrops</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('outfit')}
            className={`px-3.5 py-2 rounded-xl text-xs font-black cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeCategory === 'outfit' ? 'bg-amber-400 text-slate-950 shadow-md' : 'bg-slate-950 text-slate-300 border border-slate-800'
            }`}
          >
            <Shirt className="w-3.5 h-3.5" />
            <span>Clothes & Outfits</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('hat')}
            className={`px-3.5 py-2 rounded-xl text-xs font-black cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeCategory === 'hat' ? 'bg-amber-400 text-slate-950 shadow-md' : 'bg-slate-950 text-slate-300 border border-slate-800'
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            <span>Hats & Headwear</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('accessory')}
            className={`px-3.5 py-2 rounded-xl text-xs font-black cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeCategory === 'accessory' ? 'bg-amber-400 text-slate-950 shadow-md' : 'bg-slate-950 text-slate-300 border border-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Accessories</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('powerup')}
            className={`px-3.5 py-2 rounded-xl text-xs font-black cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeCategory === 'powerup' ? 'bg-cyan-400 text-slate-950 shadow-md' : 'bg-slate-950 text-cyan-300 border border-cyan-800'
            }`}
          >
            <Snowflake className="w-3.5 h-3.5" />
            <span>Streak Freezes</span>
          </button>
        </div>

        {/* WARDROBE / DRESSING ROOM TAB */}
        {activeCategory === 'wardrobe' ? (
          <div className="space-y-5 bg-slate-950 border border-slate-800 rounded-2xl p-5">
            {/* Character Base Selector */}
            <div>
              <span className="text-[11px] text-amber-300 uppercase font-black tracking-wider block mb-2">
                1. Select Base Character:
              </span>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {baseCharacters.map(char => (
                  <button
                    key={char.id}
                    type="button"
                    onClick={() => { playSound('click'); onUpdateAvatar({ ...userAvatar, base: char.id }); }}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      userAvatar.base === char.id
                        ? 'border-indigo-400 bg-indigo-950/60 ring-1 ring-indigo-400'
                        : 'border-slate-800 bg-slate-900 hover:border-slate-700'
                    }`}
                  >
                    <div className="h-8 flex items-center justify-center mb-1">{char.icon}</div>
                    <span className="text-[11px] font-bold text-white block">{char.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Complexion Selector */}
            <div>
              <span className="text-[11px] text-amber-300 uppercase font-black tracking-wider block mb-2">
                2. Select Skin Complexion:
              </span>
              <div className="flex gap-2.5 flex-wrap">
                {skinTones.map(tone => (
                  <button
                    key={tone}
                    type="button"
                    onClick={() => { playSound('click'); onUpdateAvatar({ ...userAvatar, skinColor: tone }); }}
                    className={`w-9 h-9 rounded-xl border-2 transition-transform cursor-pointer ${
                      userAvatar.skinColor === tone ? 'scale-110 border-white shadow-lg' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: tone }}
                    title={`Skin tone ${tone}`}
                  />
                ))}
              </div>
            </div>

            {/* Equipped Items Quick Summary */}
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
              <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider block">
                Wardrobe Inventory Status:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Outfit</span>
                  <strong className="text-white truncate block">{userAvatar.outfit || 'None'}</strong>
                </div>
                <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Hat</span>
                  <strong className="text-white truncate block">{userAvatar.hat || 'None'}</strong>
                </div>
                <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Accessory</span>
                  <strong className="text-white truncate block">{userAvatar.accessory || 'None'}</strong>
                </div>
                <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Backdrop Photo</span>
                  <strong className="text-white truncate block">{currentBackdropItem ? currentBackdropItem.name : 'None'}</strong>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* SHOP ITEMS GRID */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            {filteredItems.map(item => {
              const isOwned = userInventory.includes(item.id);
              const isEquipped =
                (item.category === 'backdrop' && currentBgId === item.id) ||
                (item.category === 'outfit' && userAvatar.outfit === item.id) ||
                (item.category === 'hat' && userAvatar.hat === item.id) ||
                (item.category === 'accessory' && userAvatar.accessory === item.id);

              const canAfford = currentCoins >= item.price;

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                    isEquipped
                      ? 'bg-slate-950 border-amber-400 ring-1 ring-amber-400/50'
                      : isOwned
                      ? 'bg-slate-950 border-slate-700'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xs font-black text-white">{item.name}</h4>
                      {isEquipped ? (
                        <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 flex items-center gap-1">
                          <Check className="w-2.5 h-2.5" /> Equipped
                        </span>
                      ) : isOwned && item.category !== 'powerup' ? (
                        <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-800 text-emerald-400">
                          Owned
                        </span>
                      ) : null}
                    </div>

                    {/* Preview Box - Real Scenic Photo for Backdrops */}
                    {item.category === 'backdrop' && item.photoUrl ? (
                      <div className="my-2.5 h-28 rounded-xl overflow-hidden border border-slate-800 relative group">
                        <img
                          src={item.photoUrl}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent flex items-end p-2">
                          <span className="text-[10px] font-black text-white">{item.preview}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="my-2.5 p-3 rounded-xl bg-slate-900 border border-slate-800 text-center flex items-center justify-center min-h-[48px]">
                        <span className="text-sm font-bold text-white">{item.preview}</span>
                      </div>
                    )}

                    <p className="text-[11px] text-slate-400 leading-snug">{item.description}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-mono text-xs font-black text-amber-400">
                      <Coins className="w-3.5 h-3.5" />
                      <span>{item.price}</span>
                    </div>

                    {isEquipped ? (
                      <button
                        type="button"
                        onClick={() => handleEquipItem(item)}
                        className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs rounded-xl cursor-pointer"
                      >
                        Unequip
                      </button>
                    ) : isOwned && item.category !== 'powerup' ? (
                      <button
                        type="button"
                        onClick={() => handleEquipItem(item)}
                        className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl cursor-pointer"
                      >
                        Equip
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={!canAfford}
                        onClick={() => onBuyItem(item)}
                        className={`px-3.5 py-1.5 rounded-xl font-black text-xs cursor-pointer transition-colors ${
                          canAfford
                            ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        Buy for {item.price}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-between items-center pt-2 border-t border-slate-800">
          <span className="text-xs text-slate-500">
            Start with 0 items; buy photos to put behind your avatar and clothes to wear.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl cursor-pointer"
          >
            Close Dressing Room
          </button>
        </div>
      </div>
    </div>
  );
};
