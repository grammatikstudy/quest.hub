import React, { useState } from 'react';
import {
  Music,
  Search,
  Play,
  Pause,
  Maximize2,
  Minimize2,
  X,
  Headphones,
  ExternalLink,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { playSound } from '../utils/soundEffects';

interface SpotifyWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CuratedItem {
  id: string;
  type: 'playlist' | 'track' | 'album';
  title: string;
  genre: string;
  desc: string;
}

const FEATURED_MUSIC: CuratedItem[] = [
  { id: '37i9dQZF1DWZeKCadgRdKQ', type: 'playlist', title: 'Peaceful Classical Piano', genre: 'Piano', desc: 'Gentle piano compositions for deep focus' },
  { id: '0vvXsWCC9xrXsKd4FyS8kM', type: 'playlist', title: 'Lofi Study Beats', genre: 'Lo-Fi', desc: 'Chill beats to relax and study to' },
  { id: '37i9dQZF1DXdLEN7aqioXM', type: 'playlist', title: 'Deep Focus Ambient', genre: 'Ambient', desc: 'Atmospheric soundscapes for concentration' },
  { id: '37i9dQZF1DX8Uebhn9wzrS', type: 'playlist', title: 'Chillhop Focus', genre: 'Chillhop', desc: 'Mellow rhythms and focus beats' },
  { id: '37i9dQZF1DWU0ScTcjJBdj', type: 'playlist', title: 'Game Soundtracks for Focus', genre: 'Gaming', desc: 'Instrumental video game themes' },
  { id: '37i9dQZF1DX4PP3DA4J0N8', type: 'playlist', title: 'Mozart Memory Boost', genre: 'Classical', desc: 'High-clarity classical symphonies' },
  { id: '37i9dQZF1DXbITWG1ZJKYt', type: 'playlist', title: 'Acoustic Coffeehouse Jazz', genre: 'Jazz', desc: 'Soft acoustic jazz for reading' },
  { id: '37i9dQZF1DXd9rSDyQguIk', type: 'playlist', title: 'Synthwave Study Drive', genre: 'Synthwave', desc: 'Analog synth rhythms' }
];

export const SpotifyWidget: React.FC<SpotifyWidgetProps> = ({ isOpen, onClose }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeEmbedUri, setActiveEmbedUri] = useState('playlist/37i9dQZF1DWZeKCadgRdKQ');
  const [currentTrackTitle, setCurrentTrackTitle] = useState('Peaceful Classical Piano');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeGenre, setActiveGenre] = useState('All');

  if (!isOpen) return null;

  const genres = ['All', 'Piano', 'Lo-Fi', 'Ambient', 'Classical', 'Gaming', 'Jazz', 'Synthwave'];

  const filteredCurated = FEATURED_MUSIC.filter(item => {
    const matchesGenre = activeGenre === 'All' || item.genre === activeGenre;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGenre && matchesSearch;
  });

  const handleSelectTrack = (item: CuratedItem) => {
    playSound('click');
    setActiveEmbedUri(`${item.type}/${item.id}`);
    setCurrentTrackTitle(item.title);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    playSound('click');
    // If user pasted a Spotify URL or URI
    if (query.includes('spotify.com/')) {
      const match = query.match(/(playlist|track|album|artist)\/([a-zA-Z0-9]+)/);
      if (match) {
        setActiveEmbedUri(`${match[1]}/${match[2]}`);
        setCurrentTrackTitle(`Custom: ${query.slice(0, 30)}...`);
        return;
      }
    }

    // Direct search matching against catalog
    const match = FEATURED_MUSIC.find(
      m => m.title.toLowerCase().includes(query.toLowerCase()) || m.genre.toLowerCase().includes(query.toLowerCase())
    );

    if (match) {
      setActiveEmbedUri(`${match.type}/${match.id}`);
      setCurrentTrackTitle(match.title);
    } else {
      // Default to Piano study or query search
      setActiveEmbedUri(`playlist/37i9dQZF1DWZeKCadgRdKQ`);
      setCurrentTrackTitle(`Search: ${query}`);
    }
  };

  return (
    <aside aria-label="Spotify Study Player" className="fixed bottom-4 right-4 z-50 transition-all duration-300">
      {isMinimized ? (
        /* MINIMIZED DOCKED PILL WIDGET */
        <div className="bg-slate-900/95 border-2 border-emerald-500/70 shadow-2xl rounded-2xl px-4 py-2.5 flex items-center gap-3 backdrop-blur-md">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold shrink-0">
            <Headphones className="w-4 h-4 animate-pulse" />
          </div>

          <div className="max-w-[200px] truncate">
            <span className="text-[10px] font-black uppercase text-emerald-400 block tracking-wider">
              Spotify Active
            </span>
            <span className="text-xs font-bold text-white truncate block">
              {currentTrackTitle}
            </span>
          </div>

          <div className="flex items-center gap-1 pl-2 border-l border-slate-800">
            <button
              type="button"
              onClick={() => { playSound('click'); setIsMinimized(false); }}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer transition-colors"
              title="Expand Spotify Player"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => { playSound('click'); onClose(); }}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg cursor-pointer transition-colors"
              title="Close Player"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* EXPANDED FULL FLOATING WIDGET */
        <div className="bg-slate-900 border-2 border-emerald-500/60 rounded-3xl p-4 sm:p-5 shadow-2xl space-y-3.5 w-[92vw] max-w-[440px] max-h-[85vh] overflow-y-auto backdrop-blur-md">
          {/* Top Bar with Controls */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold">
                <Headphones className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[9px] font-black uppercase text-emerald-400 tracking-wider block">
                  Spotify Study Lounge
                </span>
                <h4 className="text-sm font-black text-white truncate max-w-[240px]">
                  {currentTrackTitle}
                </h4>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => { playSound('click'); setIsMinimized(true); }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer transition-colors"
                title="Minimize Widget"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => { playSound('click'); onClose(); }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer transition-colors"
                title="Close Player"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Embedded Spotify IFrame (Height 352px for clean full controls) */}
          <div className="rounded-2xl overflow-hidden border border-emerald-500/40 bg-slate-950 shadow-inner">
            <iframe
              title="Spotify Embed Player"
              src={`https://open.spotify.com/embed/${activeEmbedUri}?utm_source=generator&theme=0`}
              width="100%"
              height="352"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="w-full"
            />
          </div>

          {/* Direct Search Bar */}
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search music, track, or artist..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 bg-slate-950 border border-slate-700 focus:border-emerald-400 rounded-xl text-xs text-white placeholder-slate-500 font-bold outline-none transition-colors"
              />
            </div>
            <button
              type="submit"
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl cursor-pointer shadow transition-colors flex items-center gap-1"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search</span>
            </button>
          </form>

          {/* Genre Chips */}
          <div className="flex gap-1.5 flex-wrap">
            {genres.map(genre => (
              <button
                key={genre}
                type="button"
                onClick={() => { playSound('click'); setActiveGenre(genre); }}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-colors ${
                  activeGenre === genre
                    ? 'bg-emerald-500 text-slate-950 font-black'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>

          {/* Curated Track Roster */}
          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
            {filteredCurated.map(item => {
              const isActive = activeEmbedUri === `${item.type}/${item.id}`;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectTrack(item)}
                  className={`w-full p-2 rounded-xl border text-left cursor-pointer transition-colors flex items-center justify-between ${
                    isActive
                      ? 'bg-emerald-950/60 border-emerald-400 text-white'
                      : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="truncate pr-2">
                    <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider block">
                      {item.genre}
                    </span>
                    <span className="text-xs font-black truncate block">{item.title}</span>
                  </div>
                  <Play className={`w-3 h-3 shrink-0 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </aside>
  );
};
