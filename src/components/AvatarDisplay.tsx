import React from 'react';
import { UserAvatar } from '../types';

interface AvatarDisplayProps {
  avatar?: UserAvatar;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  backdropUrl?: string;
  className?: string;
  showBackdrop?: boolean;
}

export const AvatarDisplay: React.FC<AvatarDisplayProps> = ({
  avatar,
  size = 'md',
  backdropUrl,
  className = '',
  showBackdrop = true
}) => {
  const currentAvatar: UserAvatar = avatar || {
    base: 'scholar',
    skinColor: '#f5d0b5',
    outfit: 'none',
    hat: 'none',
    accessory: 'none'
  };

  const skin = currentAvatar.skinColor || '#f5d0b5';

  const sizeDimensions = {
    sm: { box: 36, px: 'w-9 h-9' },
    md: { box: 54, px: 'w-14 h-14' },
    lg: { box: 84, px: 'w-21 h-21' },
    xl: { box: 140, px: 'w-36 h-36' }
  };

  const dim = sizeDimensions[size];

  return (
    <div
      className={`relative rounded-2xl overflow-hidden flex items-center justify-center shrink-0 border border-slate-700/80 shadow-md ${dim.px} ${className}`}
      style={{
        backgroundImage: showBackdrop && backdropUrl ? `url(${backdropUrl})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: showBackdrop && backdropUrl ? undefined : '#0f172a'
      }}
    >
      {/* SVG AVATAR CHARACTER */}
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-md overflow-visible"
      >
        <defs>
          <clipPath id="avatar-clip">
            <rect width="100" height="100" rx="16" />
          </clipPath>
          {/* Gradients for accessories & clothes */}
          <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#ca8a04" />
          </linearGradient>
          <linearGradient id="cyber-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
          <linearGradient id="armor-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#94a3b8" />
            <stop offset="50%" stopColor="#64748b" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>
        </defs>

        {/* 1. NECK & BODY BASE */}
        <rect x="42" y="60" width="16" height="16" rx="4" fill={skin} />

        {/* 2. CLOTHES / OUTFITS DRAWN ON TORSO */}
        {currentAvatar.outfit === 'outfit_cyber_jacket' ? (
          <g id="cyber-jacket">
            {/* Cyberpunk jacket body */}
            <path d="M 22 74 Q 50 68 78 74 L 84 100 L 16 100 Z" fill="#0f172a" stroke="url(#cyber-grad)" strokeWidth="2.5" />
            {/* Glowing neon collar lapels */}
            <path d="M 32 72 L 50 88 L 68 72 L 58 70 L 50 80 L 42 70 Z" fill="#06b6d4" />
            {/* Inner tech shirt */}
            <polygon points="44,72 56,72 50,84" fill="#ec4899" />
            {/* Neon shoulder telemetry */}
            <circle cx="28" cy="80" r="2" fill="#06b6d4" />
            <circle cx="72" cy="80" r="2" fill="#06b6d4" />
          </g>
        ) : currentAvatar.outfit === 'outfit_scholar_robe' ? (
          <g id="scholar-robe">
            {/* Roman Toga / Scholar Robe */}
            <path d="M 22 74 Q 50 68 78 74 L 84 100 L 16 100 Z" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
            {/* Roman Imperial Crimson Sash */}
            <path d="M 26 73 Q 50 82 76 96 L 70 100 Q 46 86 22 76 Z" fill="#991b1b" />
            {/* Gold Trim Brooch */}
            <circle cx="34" cy="76" r="3.5" fill="url(#gold-grad)" stroke="#ca8a04" strokeWidth="0.8" />
          </g>
        ) : currentAvatar.outfit === 'outfit_wizard_cloak' ? (
          <g id="wizard-cloak">
            {/* Deep purple velvet cloak */}
            <path d="M 20 72 Q 50 66 80 72 L 85 100 L 15 100 Z" fill="#3b0764" stroke="#7e22ce" strokeWidth="1.5" />
            {/* Golden Star Embroidery */}
            <path d="M 36 72 L 50 86 L 64 72 L 50 78 Z" fill="url(#gold-grad)" />
            <circle cx="32" cy="86" r="1.5" fill="#fef08a" />
            <circle cx="68" cy="86" r="1.5" fill="#fef08a" />
            <circle cx="50" cy="94" r="2" fill="#fef08a" />
          </g>
        ) : currentAvatar.outfit === 'outfit_space_suit' ? (
          <g id="space-suit">
            {/* White astronaut suit */}
            <path d="M 20 72 Q 50 68 80 72 L 84 100 L 16 100 Z" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="2" />
            {/* Utility collar band */}
            <rect x="36" y="68" width="28" height="6" rx="2" fill="#3b82f6" />
            {/* Chest telemetry badges */}
            <rect x="30" y="80" width="8" height="12" rx="2" fill="#ef4444" />
            <rect x="62" y="80" width="8" height="12" rx="2" fill="#10b981" />
            <circle cx="50" cy="86" r="4" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
          </g>
        ) : currentAvatar.outfit === 'outfit_knight_armor' ? (
          <g id="knight-armor">
            {/* Steel Plate Armor */}
            <path d="M 20 72 Q 50 68 80 72 L 85 100 L 15 100 Z" fill="url(#armor-grad)" stroke="#334155" strokeWidth="1.5" />
            {/* Gorget neck plate */}
            <path d="M 34 70 Q 50 80 66 70 L 62 82 Q 50 88 38 82 Z" fill="#cbd5e1" />
            {/* Embossed Lion Crest */}
            <circle cx="50" cy="88" r="5" fill="url(#gold-grad)" />
          </g>
        ) : currentAvatar.outfit === 'outfit_tuxedo' ? (
          <g id="tuxedo">
            {/* Black tuxedo jacket */}
            <path d="M 20 72 Q 50 68 80 72 L 84 100 L 16 100 Z" fill="#020617" />
            {/* White shirt triangle */}
            <polygon points="40,70 60,70 50,88" fill="#ffffff" />
            {/* Black bow tie */}
            <polygon points="44,72 50,75 44,78" fill="#000000" />
            <polygon points="56,72 50,75 56,78" fill="#000000" />
            <circle cx="50" cy="75" r="1.5" fill="#ca8a04" />
          </g>
        ) : currentAvatar.outfit === 'outfit_hoodie' ? (
          <g id="hoodie">
            <path d="M 20 72 Q 50 66 80 72 L 84 100 L 16 100 Z" fill="#1e293b" />
            <path d="M 34 68 Q 50 78 66 68" stroke="#334155" strokeWidth="3" fill="none" />
            {/* Drawstrings */}
            <line x1="46" y1="74" x2="46" y2="86" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="54" y1="74" x2="54" y2="86" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
          </g>
        ) : (
          /* Default clean crewneck shirt */
          <g id="default-shirt">
            <path d="M 24 74 Q 50 70 76 74 L 82 100 L 18 100 Z" fill="#334155" />
            <path d="M 38 72 Q 50 80 62 72" stroke="#475569" strokeWidth="2" fill="none" />
          </g>
        )}

        {/* 3. EARS */}
        <circle cx="27" cy="46" r="4.5" fill={skin} stroke="#000000" strokeWidth="0.5" strokeOpacity="0.2" />
        <circle cx="73" cy="46" r="4.5" fill={skin} stroke="#000000" strokeWidth="0.5" strokeOpacity="0.2" />

        {/* 4. HEAD / FACE */}
        <rect x="29" y="24" width="42" height="44" rx="18" fill={skin} stroke="#000000" strokeWidth="0.8" strokeOpacity="0.15" />

        {/* 5. HAIR */}
        {currentAvatar.base === 'wizard' ? (
          <g id="wizard-hair">
            <path d="M 28 36 Q 50 16 72 36 Q 78 60 74 68 Q 66 52 66 40 Q 50 26 34 40 Q 34 52 26 68 Z" fill="#e2e8f0" />
            {/* Long white wizard beard */}
            <path d="M 36 56 Q 50 56 64 56 Q 58 78 50 82 Q 42 78 36 56 Z" fill="#f8fafc" />
          </g>
        ) : currentAvatar.base === 'cyborg' ? (
          <g id="cyborg-hair">
            <path d="M 28 32 Q 50 18 72 32 L 74 38 Q 50 26 26 38 Z" fill="#06b6d4" />
            {/* Cybernetic ocular eye implant on right eye */}
            <circle cx="60" cy="46" r="6.5" fill="#0f172a" stroke="#06b6d4" strokeWidth="2" />
            <circle cx="60" cy="46" r="2.5" fill="#ec4899" />
          </g>
        ) : currentAvatar.base === 'ninja' ? (
          <g id="ninja-mask">
            {/* Ninja dark hair */}
            <path d="M 27 34 Q 50 16 73 34 L 73 40 Q 50 26 27 40 Z" fill="#0f172a" />
            {/* Ninja lower face cloth mask */}
            <path d="M 30 52 Q 50 56 70 52 L 68 68 Q 50 72 32 68 Z" fill="#1e293b" />
          </g>
        ) : currentAvatar.base === 'adventurer' ? (
          <g id="adventurer-hair">
            {/* Wavy styled adventurer hair */}
            <path d="M 26 36 Q 50 14 74 36 Q 74 24 64 20 Q 50 16 36 20 Q 28 24 26 36 Z" fill="#92400e" />
            <path d="M 27 34 Q 38 28 48 34" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
          </g>
        ) : currentAvatar.base === 'astronaut' ? (
          <g id="astronaut-hair">
            {/* Short cropped astronaut crew cut */}
            <path d="M 28 32 Q 50 20 72 32 L 73 38 Q 50 28 27 38 Z" fill="#334155" />
          </g>
        ) : (
          /* Scholar hair */
          <g id="scholar-hair">
            <path d="M 28 32 Q 50 18 72 32 Q 74 24 64 20 Q 50 16 36 20 Q 28 24 28 32 Z" fill="#451a03" />
            <path d="M 28 34 Q 40 30 52 35" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
          </g>
        )}

        {/* 6. EYES & NOSE & MOUTH (if not covered by cyborg or ninja) */}
        {currentAvatar.base !== 'cyborg' && (
          <g id="eyes">
            {/* Left Eye */}
            <ellipse cx="40" cy="46" rx="3.5" ry="4.5" fill="#0f172a" />
            <circle cx="39" cy="44.5" r="1.2" fill="#ffffff" />
            {/* Right Eye */}
            <ellipse cx="60" cy="46" rx="3.5" ry="4.5" fill="#0f172a" />
            <circle cx="59" cy="44.5" r="1.2" fill="#ffffff" />
          </g>
        )}
        {currentAvatar.base === 'cyborg' && (
          /* Left human eye for cyborg */
          <g id="left-eye-only">
            <ellipse cx="40" cy="46" rx="3.5" ry="4.5" fill="#0f172a" />
            <circle cx="39" cy="44.5" r="1.2" fill="#ffffff" />
          </g>
        )}

        {/* Eyebrows */}
        <path d="M 36 39 Q 40 37 44 39" stroke="#451a03" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        <path d="M 56 39 Q 60 37 64 39" stroke="#451a03" strokeWidth="1.8" strokeLinecap="round" fill="none" />

        {/* Nose */}
        <circle cx="50" cy="51" r="1.8" fill="#d97706" fillOpacity="0.4" />

        {/* Smile (if not ninja or bearded wizard) */}
        {currentAvatar.base !== 'ninja' && currentAvatar.base !== 'wizard' && (
          <path d="M 44 57 Q 50 63 56 57" stroke="#991b1b" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        )}

        {/* 7. ACCESSORIES DRAWN ON HEAD & FACE */}
        {currentAvatar.accessory === 'acc_sunglasses' ? (
          <g id="sunglasses">
            {/* Dark tinted polarized cyber shades */}
            <path d="M 32 42 L 48 42 L 46 51 L 34 51 Z" fill="#0f172a" stroke="#06b6d4" strokeWidth="1.5" />
            <path d="M 52 42 L 68 42 L 66 51 L 54 51 Z" fill="#0f172a" stroke="#06b6d4" strokeWidth="1.5" />
            <line x1="48" y1="44" x2="52" y2="44" stroke="#06b6d4" strokeWidth="2" />
            {/* Mirror Sheen */}
            <line x1="35" y1="44" x2="44" y2="49" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.8" />
            <line x1="55" y1="44" x2="64" y2="49" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.8" />
          </g>
        ) : currentAvatar.accessory === 'acc_monocle' ? (
          <g id="monocle">
            {/* Gold monocle on left eye */}
            <circle cx="40" cy="46" r="7" fill="#38bdf8" fillOpacity="0.25" stroke="url(#gold-grad)" strokeWidth="2" />
            {/* Dangling gold chain */}
            <path d="M 47 46 Q 52 56 46 68" stroke="url(#gold-grad)" strokeWidth="1.2" strokeDasharray="1.5,1.5" fill="none" />
          </g>
        ) : currentAvatar.accessory === 'acc_gold_chain' ? (
          <g id="gold-chain">
            {/* Solid gold chain link around neck */}
            <path d="M 36 66 Q 50 82 64 66" stroke="url(#gold-grad)" strokeWidth="3" strokeLinecap="round" fill="none" />
            <circle cx="50" cy="74" r="3.5" fill="url(#gold-grad)" stroke="#ca8a04" strokeWidth="1" />
          </g>
        ) : currentAvatar.accessory === 'acc_dragon_companion' ? (
          <g id="dragon-companion">
            {/* Mini cute green dragon perched on right shoulder */}
            <ellipse cx="80" cy="62" rx="7" ry="9" fill="#10b981" />
            <circle cx="80" cy="54" r="5" fill="#10b981" />
            <circle cx="78" cy="53" r="1.5" fill="#fef08a" />
            {/* Dragon wing & horn */}
            <polygon points="82,49 86,45 84,52" fill="#047857" />
            <path d="M 85 58 Q 96 52 90 66 Z" fill="#059669" />
          </g>
        ) : currentAvatar.accessory === 'acc_wand' ? (
          <g id="magic-wand">
            {/* Sorcerer wand held on left */}
            <line x1="14" y1="84" x2="24" y2="48" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
            <circle cx="24" cy="48" r="3" fill="#38bdf8" />
            <polygon points="24,42 26,48 30,50 25,52 24,56 22,51 18,48 23,47" fill="#fef08a" />
          </g>
        ) : null}

        {/* 8. HATS / HEADWEAR DRAWN ON TOP OF HEAD */}
        {currentAvatar.hat === 'hat_headset' ? (
          <g id="gamer-headset">
            {/* Headband spanning crown */}
            <path d="M 24 46 Q 50 14 76 46" stroke="#0f172a" strokeWidth="5" fill="none" />
            <path d="M 24 46 Q 50 16 76 46" stroke="#06b6d4" strokeWidth="2.5" fill="none" />
            {/* Over-ear neon earcups */}
            <rect x="20" y="40" width="8" height="14" rx="4" fill="#0f172a" stroke="#ec4899" strokeWidth="2" />
            <rect x="72" y="40" width="8" height="14" rx="4" fill="#0f172a" stroke="#ec4899" strokeWidth="2" />
            {/* Boom Mic */}
            <path d="M 26 50 Q 32 60 42 58" stroke="#0f172a" strokeWidth="2" fill="none" />
            <circle cx="43" cy="58" r="2" fill="#06b6d4" />
          </g>
        ) : currentAvatar.hat === 'hat_laurel' ? (
          <g id="golden-laurel">
            {/* Roman Caesar Laurel Wreath */}
            <path d="M 28 38 Q 50 26 72 38" stroke="url(#gold-grad)" strokeWidth="2" fill="none" />
            {/* Leaves */}
            <ellipse cx="32" cy="34" rx="3.5" ry="2" fill="#facc15" transform="rotate(-30 32 34)" />
            <ellipse cx="40" cy="28" rx="4" ry="2" fill="#facc15" transform="rotate(-15 40 28)" />
            <ellipse cx="50" cy="26" rx="4" ry="2" fill="#facc15" />
            <ellipse cx="60" cy="28" rx="4" ry="2" fill="#facc15" transform="rotate(15 60 28)" />
            <ellipse cx="68" cy="34" rx="3.5" ry="2" fill="#facc15" transform="rotate(30 68 34)" />
          </g>
        ) : currentAvatar.hat === 'hat_crown' ? (
          <g id="royal-crown">
            {/* Monarch Gold Crown with 5 peaks & jewels */}
            <path d="M 28 28 L 32 14 L 42 22 L 50 10 L 58 22 L 68 14 L 72 28 Z" fill="url(#gold-grad)" stroke="#ca8a04" strokeWidth="1.5" />
            <rect x="27" y="27" width="46" height="5" rx="1.5" fill="#ca8a04" />
            {/* Rubies & Emeralds */}
            <circle cx="50" cy="18" r="2.5" fill="#ef4444" />
            <circle cx="37" cy="24" r="2" fill="#3b82f6" />
            <circle cx="63" cy="24" r="2" fill="#10b981" />
          </g>
        ) : currentAvatar.hat === 'hat_wizard_hat' ? (
          <g id="wizard-hat">
            {/* Pointed Arcane Wizard Hat */}
            <ellipse cx="50" cy="26" rx="32" ry="7" fill="#3b0764" stroke="#7e22ce" strokeWidth="1.5" />
            <path d="M 28 26 Q 50 -10 68 26 Z" fill="#4c1d95" stroke="#7e22ce" strokeWidth="1.5" />
            {/* Golden Belt on Hat */}
            <path d="M 32 24 Q 50 20 64 24" stroke="url(#gold-grad)" strokeWidth="3" fill="none" />
            <rect x="47" y="19" width="6" height="6" rx="1" fill="url(#gold-grad)" />
          </g>
        ) : currentAvatar.hat === 'hat_beret' ? (
          <g id="polyglot-beret">
            {/* Parisian tilted wool beret */}
            <ellipse cx="52" cy="22" rx="26" ry="10" fill="#1e1b4b" transform="rotate(-10 52 22)" />
            <circle cx="50" cy="12" r="2" fill="#1e1b4b" />
          </g>
        ) : currentAvatar.hat === 'hat_ninja_headband' ? (
          <g id="ninja-headband">
            {/* Metal forehead protector */}
            <rect x="28" y="32" width="44" height="7" rx="1" fill="#0f172a" />
            <rect x="38" y="31" width="24" height="9" rx="2" fill="#cbd5e1" stroke="#475569" strokeWidth="1" />
            {/* Engraved insignia */}
            <circle cx="50" cy="35.5" r="2" fill="#334155" />
            {/* Flying ribbon ties on right */}
            <path d="M 72 35 Q 84 32 90 38 L 86 42 Q 80 37 72 38 Z" fill="#0f172a" />
          </g>
        ) : null}
      </svg>
    </div>
  );
};
