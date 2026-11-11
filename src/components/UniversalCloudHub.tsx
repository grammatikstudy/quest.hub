import React, { useState } from 'react';
import { DeckUnit } from '../types';
import { playSound } from '../utils/soundEffects';
import { ArrowLeft, Cloud, Download, Plus, Search, Check, Sparkles } from 'lucide-react';

interface UniversalCloudHubProps {
  universalDecks: DeckUnit[];
  userCustomDecks: DeckUnit[];
  onSaveToAccount: (deck: DeckUnit) => void;
  onPublishToCloud: (deck: DeckUnit) => void;
  onBackToLanding: () => void;
}

export const UniversalCloudHub: React.FC<UniversalCloudHubProps> = ({
  universalDecks,
  userCustomDecks,
  onSaveToAccount,
  onPublishToCloud,
  onBackToLanding
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [savedDeckIds, setSavedDeckIds] = useState<string[]>([]);
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [selectedDeckToPublish, setSelectedDeckToPublish] = useState(userCustomDecks[0]?.id || '');

  const filteredDecks = universalDecks.filter(d =>
    d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (d.author && d.author.toLowerCase().includes(searchQuery.toLowerCase())) ||
    d.items.some(i => i.prompt.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSave = (deck: DeckUnit) => {
    playSound('correct');
    onSaveToAccount(deck);
    setSavedDeckIds(prev => [...prev, deck.id]);
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    const deck = userCustomDecks.find(d => d.id === selectedDeckToPublish);
    if (deck) {
      playSound('correct');
      onPublishToCloud(deck);
      setPublishModalOpen(false);
    }
  };

  return (
    <div className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 flex flex-col justify-center">
      <div className="bg-slate-900 border-2 border-amber-400/50 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/30">
              Community Gallery
            </span>
            <h2 className="text-2xl font-black text-white mt-1">Universal Cloud Decks</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Browse public sets created by students and teachers. Click "Save to Account" with zero codes needed.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {userCustomDecks.length > 0 && (
              <button
                type="button"
                onClick={() => setPublishModalOpen(true)}
                className="px-3.5 py-2 bg-gradient-to-r from-amber-400 to-rose-500 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Publish My Deck</span>
              </button>
            )}
            <button
              type="button"
              onClick={onBackToLanding}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Arena</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search community decks by topic, language, or author..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 font-medium outline-none focus:border-amber-400"
          />
        </div>

        {/* Decks Grid or Empty State */}
        {filteredDecks.length === 0 ? (
          <div className="p-12 text-center bg-slate-950/60 rounded-3xl border border-slate-800 space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-amber-400">
              <Cloud className="w-7 h-7 text-amber-400" />
            </div>
            <h3 className="text-base font-black text-white">Cloud Hub Empty</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              No custom decks have been published to the cloud yet. Create custom decks in the Custom Hub and click &ldquo;Publish My Deck&rdquo; to share them here!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredDecks.map(deck => {
              const isSaved = savedDeckIds.includes(deck.id);
              return (
                <div
                  key={deck.id}
                  className="p-5 bg-slate-950 border-2 border-slate-800 hover:border-amber-400/60 rounded-2xl flex flex-col justify-between transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">
                        Author: @{deck.author || 'User'}
                      </span>
                      <span className="text-[10px] bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-800 font-bold">
                        {deck.items.length} terms
                      </span>
                    </div>
                    <h3 className="text-base font-extrabold text-white mb-2">{deck.title}</h3>

                    {/* Sample items preview */}
                    <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800/80 mb-4 space-y-1">
                      <span className="text-[9px] font-bold uppercase text-slate-500 block">Preview items:</span>
                      {deck.items.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="flex justify-between text-[11px] text-slate-300 truncate">
                          <span className="font-semibold text-slate-200">{item.prompt}</span>
                          <span className="text-amber-400 font-medium">{item.de[0]}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={isSaved}
                    onClick={() => handleSave(deck)}
                    className={`w-full py-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isSaved
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md active:scale-95'
                    }`}
                  >
                    {isSaved ? <Check className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
                    <span>{isSaved ? 'Saved to Account' : 'Save to My Account'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Publish Modal */}
        {publishModalOpen && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <form onSubmit={handlePublish} className="bg-slate-900 border-2 border-amber-400 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
              <h3 className="text-lg font-black text-white">Publish Deck to Universal Cloud</h3>
              <p className="text-xs text-slate-400">
                Share one of your custom study decks with classmates and the global community.
              </p>

              <div>
                <label className="block text-[11px] font-bold text-amber-300 uppercase mb-1">
                  Select Custom Deck to Share:
                </label>
                <select
                  value={selectedDeckToPublish}
                  onChange={e => setSelectedDeckToPublish(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white font-bold outline-none"
                >
                  {userCustomDecks.map(d => (
                    <option key={d.id} value={d.id}>{d.title} ({d.items.length} terms)</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPublishModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl cursor-pointer shadow-md"
                >
                  Publish Publicly
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
