import React from 'react';

interface GermanAccentBarProps {
  onInsertChar: (char: string) => void;
  visible?: boolean;
}

export const GermanAccentBar: React.FC<GermanAccentBarProps> = ({ onInsertChar, visible = true }) => {
  if (!visible) return null;

  const characters = ['ß', 'ä', 'ö', 'ü', 'Ä', 'Ö', 'Ü'];

  return (
    <div className="bg-slate-950/95 border-b border-slate-800/80 px-4 py-2 flex items-center justify-center gap-1.5 flex-wrap text-xs shadow-inner">
      <span className="text-amber-400 font-extrabold uppercase tracking-wider text-[10px] mr-1">
        German Accents:
      </span>
      {characters.map((char) => (
        <button
          key={char}
          type="button"
          onClick={() => onInsertChar(char)}
          className="px-2.5 py-1 bg-slate-850 hover:bg-indigo-600 bg-slate-800 text-amber-300 hover:text-white font-extrabold rounded-lg border border-slate-700 transition-colors shadow-sm cursor-pointer active:scale-95 text-xs"
        >
          {char}
        </button>
      ))}
    </div>
  );
};
