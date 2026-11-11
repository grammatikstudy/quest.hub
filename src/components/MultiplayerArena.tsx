import React, { useState, useEffect, useRef } from 'react';
import { DeckUnit, UserAccount, MultiplayerMode, UserAvatar } from '../types';
import { playSound } from '../utils/soundEffects';
import { checkLatinOrGermanAnswer } from '../utils/latinValidator';
import { generateMultipleChoiceOptions } from '../utils/distractorGenerator';
import { SHOP_CATALOG } from '../data/defaultVocab';
import { AvatarDisplay } from './AvatarDisplay';
import { Users, Play, Crown, ArrowLeft, Check, X, Flame, ShieldAlert, Award, Clock, Settings, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MultiplayerArenaProps {
  currentUser: UserAccount;
  allDecks: DeckUnit[];
  onBackToLanding: () => void;
}

interface PlayerState {
  name: string;
  score: number;
  streak: number;
  isHost: boolean;
  avatar?: UserAvatar;
  backdropId?: string;
  finished?: boolean;
}

export const MultiplayerArena: React.FC<MultiplayerArenaProps> = ({
  currentUser,
  allDecks,
  onBackToLanding
}) => {
  const [viewState, setViewState] = useState<'lobby' | 'waiting' | 'playing' | 'gameover'>('lobby');
  const [gameMode, setGameMode] = useState<MultiplayerMode>('battle');
  const [roomPin, setRoomPin] = useState('');
  const [joinPinInput, setJoinPinInput] = useState('');
  const [isHost, setIsHost] = useState(false);
  const [selectedDeckId, setSelectedDeckId] = useState(allDecks[0]?.id || '');
  const [activeDeck, setActiveDeck] = useState<DeckUnit>(allDecks[0]);
  const [players, setPlayers] = useState<PlayerState[]>([]);

  // Host Game Settings
  const [questionFormat, setQuestionFormat] = useState<'mc' | 'typing'>('mc');
  const [timerSetting, setTimerSetting] = useState<number | 'untimed'>(15); // 10, 15, 30, or 'untimed' (speed protected)
  const [questionCountSetting, setQuestionCountSetting] = useState<number | 'all'>(10);

  // In-game state
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [myScore, setMyScore] = useState(0);
  const [myStreak, setMyStreak] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [typedInput, setTypedInput] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [currentOptions, setCurrentOptions] = useState<string[]>([]);
  const [timerSeconds, setTimerSeconds] = useState(15);

  const channelRef = useRef<BroadcastChannel | null>(null);
  const questionTimerRef = useRef<NodeJS.Timeout | null>(null);

  const displayName = currentUser.firstName && currentUser.lastName
    ? `${currentUser.firstName} ${currentUser.lastName}`
    : currentUser.realName || currentUser.username;

  const equippedBackdrop = SHOP_CATALOG.find(i => i.id === currentUser.equippedBackground)?.photoUrl;

  const globalPool = allDecks.flatMap(d => d.items);

  // BroadcastChannel setup for multiplayer communication
  useEffect(() => {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const channel = new BroadcastChannel('questhub_multiplayer_arena_channel');
      channelRef.current = channel;

      channel.onmessage = (event) => {
        const msg = event.data;
        if (!msg || msg.roomPin !== roomPin) return;

        if (msg.type === 'PLAYER_JOINED') {
          setPlayers(prev => {
            if (prev.some(p => p.name === msg.name)) return prev;
            return [
              ...prev,
              {
                name: msg.name,
                score: 0,
                streak: 0,
                isHost: false,
                avatar: msg.avatar,
                backdropId: msg.backdropId
              }
            ];
          });
        } else if (msg.type === 'GAME_STARTED') {
          setActiveDeck(msg.deck);
          setGameMode(msg.mode || 'battle');
          setQuestionFormat(msg.questionFormat || 'mc');
          setTimerSetting(msg.timerSetting ?? 15);
          setViewState('playing');
          setCurrentQIndex(0);
          setMyScore(0);
          setMyStreak(0);
          setPlayers(msg.players);
          setCurrentOptions(generateMultipleChoiceOptions(msg.deck.items[0], msg.deck.items, globalPool));
          setTimerSeconds(typeof msg.timerSetting === 'number' ? msg.timerSetting : 15);
        } else if (msg.type === 'SCORE_UPDATE') {
          setPlayers(prev =>
            prev.map(p =>
              p.name === msg.name
                ? { ...p, score: msg.score, streak: msg.streak, finished: msg.finished }
                : p
            )
          );
          if (msg.mode === 'survival' && msg.finished) {
            setViewState('gameover');
          }
        }
      };

      return () => {
        channel.close();
      };
    }
  }, [roomPin]);

  // Timer countdown
  useEffect(() => {
    if (viewState === 'playing' && timerSetting !== 'untimed' && !isAnswered) {
      questionTimerRef.current = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev <= 1) {
            clearInterval(questionTimerRef.current!);
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        if (questionTimerRef.current) clearInterval(questionTimerRef.current);
      };
    }
  }, [viewState, currentQIndex, isAnswered, timerSetting]);

  const handleTimeUp = () => {
    if (isAnswered) return;
    setIsAnswered(true);
    playSound('error');
    setMyStreak(0);

    setTimeout(() => {
      advanceNextQuestion(myScore, 0);
    }, 1200);
  };

  // Host creates game
  const handleHostGame = () => {
    const pin = Math.floor(100000 + Math.random() * 900000).toString();
    setRoomPin(pin);
    setIsHost(true);
    const deck = allDecks.find(d => d.id === selectedDeckId) || allDecks[0];
    setActiveDeck(deck);
    setPlayers([
      {
        name: displayName,
        score: 0,
        streak: 0,
        isHost: true,
        avatar: currentUser.avatar,
        backdropId: currentUser.equippedBackground
      }
    ]);
    setViewState('waiting');
    playSound('click');
  };

  // Join game
  const handleJoinGame = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = joinPinInput.trim();
    if (cleanPin.length !== 6) {
      alert('Please enter a 6-digit room PIN code.');
      return;
    }
    setRoomPin(cleanPin);
    setIsHost(false);
    setViewState('waiting');
    playSound('click');

    if (channelRef.current) {
      channelRef.current.postMessage({
        type: 'PLAYER_JOINED',
        roomPin: cleanPin,
        name: displayName,
        avatar: currentUser.avatar,
        backdropId: currentUser.equippedBackground
      });
    }

    setPlayers(prev => {
      if (prev.some(p => p.name === displayName)) return prev;
      return [
        ...prev,
        {
          name: displayName,
          score: 0,
          streak: 0,
          isHost: false,
          avatar: currentUser.avatar,
          backdropId: currentUser.equippedBackground
        }
      ];
    });
  };

  // Host launches game
  const handleStartMatch = () => {
    if (!isHost) return;
    setViewState('playing');
    setCurrentQIndex(0);
    setMyScore(0);
    setMyStreak(0);
    setCurrentOptions(generateMultipleChoiceOptions(activeDeck.items[0], activeDeck.items, globalPool));
    setTimerSeconds(typeof timerSetting === 'number' ? timerSetting : 15);
    playSound('correct');

    if (channelRef.current) {
      channelRef.current.postMessage({
        type: 'GAME_STARTED',
        roomPin,
        deck: activeDeck,
        mode: gameMode,
        questionFormat,
        timerSetting,
        players
      });
    }
  };

  // Advance question or finish
  const advanceNextQuestion = (updatedScore: number, updatedStreak: number) => {
    setIsAnswered(false);
    setSelectedOption(null);
    setTypedInput('');
    setTimerSeconds(typeof timerSetting === 'number' ? timerSetting : 15);

    const maxQuestions =
      questionCountSetting === 'all'
        ? activeDeck.items.length
        : Math.min(questionCountSetting, activeDeck.items.length);

    const isSurvivalWin = gameMode === 'survival' && updatedScore >= 10;
    const isBattleEnd = gameMode === 'battle' && currentQIndex + 1 >= maxQuestions;

    if (isSurvivalWin || isBattleEnd) {
      setViewState('gameover');
      confetti({ particleCount: 150, spread: 80 });

      if (channelRef.current) {
        channelRef.current.postMessage({
          type: 'SCORE_UPDATE',
          roomPin,
          name: displayName,
          score: updatedScore,
          streak: updatedStreak,
          finished: true,
          mode: gameMode
        });
      }
    } else {
      const nextIdx = (currentQIndex + 1) % activeDeck.items.length;
      setCurrentQIndex(nextIdx);
      setCurrentOptions(generateMultipleChoiceOptions(activeDeck.items[nextIdx], activeDeck.items, globalPool));
    }
  };

  // Handle choice selection
  const handleEvaluateAnswer = (answerString: string) => {
    if (isAnswered) return;
    if (questionTimerRef.current) clearInterval(questionTimerRef.current);

    setIsAnswered(true);

    const currentItem = activeDeck.items[currentQIndex];
    const isLatin = activeDeck.lang1 === 'la' || activeDeck.lang2 === 'la';
    const evalRes = checkLatinOrGermanAnswer(answerString.trim(), currentItem.de, isLatin);
    const isCorrect = evalRes.isCorrect;

    let nextScore = myScore;
    let nextStreak = myStreak;

    if (isCorrect) {
      playSound('correct');
      nextStreak = myStreak + 1;
      setMyStreak(nextStreak);

      if (gameMode === 'battle') {
        // Speed bonus if timed, accuracy points if untimed
        const speedBonus = timerSetting !== 'untimed' ? timerSeconds * 10 : 50;
        const streakBonus = Math.min(nextStreak * 20, 100);
        nextScore = myScore + 100 + speedBonus + streakBonus;
      } else {
        nextScore = myScore + 1;
      }
      setMyScore(nextScore);
    } else {
      playSound('error');
      nextStreak = 0;
      setMyStreak(0);

      if (gameMode === 'survival') {
        nextScore = 0;
        setMyScore(0);
      }
    }

    if (channelRef.current) {
      channelRef.current.postMessage({
        type: 'SCORE_UPDATE',
        roomPin,
        name: displayName,
        score: nextScore,
        streak: nextStreak,
        finished: gameMode === 'survival' && nextScore >= 10,
        mode: gameMode
      });
    }

    setPlayers(prev =>
      prev.map(p =>
        p.name === displayName ? { ...p, score: nextScore, streak: nextStreak } : p
      )
    );

    setTimeout(() => {
      advanceNextQuestion(nextScore, nextStreak);
    }, 1100);
  };

  return (
    <div className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 flex flex-col justify-center">
      <div className="bg-slate-900 border-2 border-indigo-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl relative space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/30">
              Multiplayer Room
            </span>
            <h2 className="text-2xl font-black text-white mt-1">Multiplayer Live Arena</h2>
          </div>
          <button
            type="button"
            onClick={onBackToLanding}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Arena</span>
          </button>
        </div>

        {/* VIEW 1: LOBBY */}
        {viewState === 'lobby' && (
          <div className="space-y-6">
            <p className="text-xs text-slate-400 font-medium">
              Join or host a multiplayer study session in real time. Your real full name and avatar picture will be shown to everyone in the room.
            </p>

            {/* Mode selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                onClick={() => setGameMode('battle')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  gameMode === 'battle'
                    ? 'bg-indigo-950/50 border-indigo-400 ring-1 ring-indigo-400'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-black text-white">Arena Battle</span>
                  <Award className="w-4 h-4 text-indigo-400" />
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Points awarded for accuracy, speed, and streaks. All players compete through the questions together.
                </p>
              </div>

              <div
                onClick={() => setGameMode('survival')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  gameMode === 'survival'
                    ? 'bg-rose-950/50 border-rose-400 ring-1 ring-rose-400'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-black text-white">Survival Sprint</span>
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  First to reach 10 points wins! One wrong answer resets your score to zero back at the start.
                </p>
              </div>
            </div>

            {/* Host or Join Boxes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Host Box with Match Settings */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <h3 className="text-base font-black text-white">Host a Game</h3>

                  {/* Deck Selection */}
                  <div>
                    <label className="block text-[10px] font-bold text-amber-300 uppercase mb-1">
                      Vocabulary Deck:
                    </label>
                    <select
                      value={selectedDeckId}
                      onChange={e => setSelectedDeckId(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-bold outline-none focus:border-indigo-400"
                    >
                      {allDecks.map(d => (
                        <option key={d.id} value={d.id}>
                          {d.title} ({d.items.length} items)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Question Format Setting */}
                  <div>
                    <label className="block text-[10px] font-bold text-amber-300 uppercase mb-1">
                      Question Format:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setQuestionFormat('mc')}
                        className={`py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                          questionFormat === 'mc' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 border border-slate-800'
                        }`}
                      >
                        Multiple Choice
                      </button>
                      <button
                        type="button"
                        onClick={() => setQuestionFormat('typing')}
                        className={`py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                          questionFormat === 'typing' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 border border-slate-800'
                        }`}
                      >
                        Written Typing
                      </button>
                    </div>
                  </div>

                  {/* Timer & Speed Protection Setting */}
                  <div>
                    <label className="block text-[10px] font-bold text-amber-300 uppercase mb-1">
                      Timer & Speed Protection:
                    </label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[10, 15, 30].map(sec => (
                        <button
                          key={sec}
                          type="button"
                          onClick={() => setTimerSetting(sec)}
                          className={`py-1 rounded-lg text-xs font-bold cursor-pointer ${
                            timerSetting === sec ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 border border-slate-800'
                          }`}
                        >
                          {sec}s
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => setTimerSetting('untimed')}
                        className={`py-1 rounded-lg text-[10px] font-bold cursor-pointer ${
                          timerSetting === 'untimed' ? 'bg-emerald-600 text-white font-black' : 'bg-slate-900 text-slate-400 border border-slate-800'
                        }`}
                        title="Speed-Protected: untimed, focus purely on accuracy"
                      >
                        Untimed
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleHostGame}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs rounded-xl cursor-pointer shadow active:scale-95 transition-colors"
                >
                  Create 6-Digit Room
                </button>
              </div>

              {/* Join Box */}
              <form onSubmit={handleJoinGame} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-base font-black text-white mb-1">Join Game</h3>
                  <p className="text-xs text-slate-400 mb-3">Enter the 6-digit room PIN from the host:</p>
                  <input
                    type="text"
                    maxLength={6}
                    value={joinPinInput}
                    onChange={e => setJoinPinInput(e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g. 748291"
                    className="w-full text-center px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-amber-300 font-mono font-black text-xl outline-none focus:border-amber-400"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl cursor-pointer shadow active:scale-95 transition-colors"
                >
                  Join Waiting Room
                </button>
              </form>
            </div>
          </div>
        )}

        {/* VIEW 2: WAITING ROOM */}
        {viewState === 'waiting' && (
          <div className="space-y-6">
            <div className="bg-slate-950 border-2 border-indigo-500/40 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Room PIN Code</span>
                <div className="text-3xl sm:text-4xl font-mono font-black text-amber-400 tracking-widest mt-0.5">
                  {roomPin}
                </div>
                <p className="text-xs text-indigo-300 font-bold mt-1">
                  Mode: {gameMode === 'battle' ? 'Arena Battle' : 'Survival Sprint'} • Format: {questionFormat === 'mc' ? 'Multiple Choice' : 'Written Typing'} • Deck: {activeDeck.title}
                </p>
              </div>
              <div className="text-center sm:text-right">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Lobby</span>
                <div className="text-xl font-black text-white">{players.length} Players Connected</div>
              </div>
            </div>

            {/* Connected Player Cards with Avatar Pictures and Scenic Backdrops */}
            <div>
              <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">Connected Players</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {players.map((p, idx) => {
                  const pBackdrop = SHOP_CATALOG.find(i => i.id === p.backdropId)?.photoUrl;
                  return (
                    <div
                      key={idx}
                      className="p-3 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between gap-3 shadow-sm relative overflow-hidden"
                    >
                      <div className="flex items-center gap-2.5 z-10">
                        <AvatarDisplay avatar={p.avatar} backdropUrl={pBackdrop} size="sm" />
                        <div>
                          <span className="text-xs font-black text-white block truncate max-w-[140px]">
                            {p.name}
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold block">
                            Player #{idx + 1}
                          </span>
                        </div>
                      </div>

                      {p.isHost && (
                        <span className="text-[10px] font-black text-amber-400 uppercase bg-amber-500/20 px-2 py-0.5 rounded-lg border border-amber-500/40 z-10">
                          Host
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {isHost ? (
              <button
                type="button"
                onClick={handleStartMatch}
                className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm rounded-xl cursor-pointer shadow-lg active:scale-95 transition-colors"
              >
                Start Match
              </button>
            ) : (
              <div className="text-center py-4 bg-slate-950/80 border border-slate-800 rounded-xl">
                <p className="text-xs text-amber-300 font-bold animate-pulse">
                  Waiting for host to start the match...
                </p>
              </div>
            )}
          </div>
        )}

        {/* VIEW 3: LIVE PLAY */}
        {viewState === 'playing' && activeDeck.items[currentQIndex] && (
          <div className="space-y-5">
            {/* Top Bar */}
            <div className="flex justify-between items-center text-xs">
              <span className="font-extrabold text-slate-300">
                {gameMode === 'battle'
                  ? `Question ${currentQIndex + 1} of ${activeDeck.items.length}`
                  : `Survival Sprint (First to 10)`}
              </span>
              <div className="flex items-center gap-3">
                {timerSetting !== 'untimed' ? (
                  <span className="flex items-center gap-1 font-mono font-black text-amber-400 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{timerSeconds}s</span>
                  </span>
                ) : (
                  <span className="text-emerald-400 font-black text-[11px] bg-emerald-950/40 px-2 py-1 rounded-lg border border-emerald-800">
                    Speed Protected
                  </span>
                )}
                {myStreak > 1 && (
                  <span className="flex items-center gap-1 font-black text-rose-400 bg-rose-950/60 px-2 py-1 rounded-lg border border-rose-800 text-[11px]">
                    <Flame className="w-3 h-3" />
                    <span>{myStreak}x Streak</span>
                  </span>
                )}
                <span className="font-black text-indigo-300 font-mono text-sm">
                  {myScore} {gameMode === 'battle' ? 'PTS' : '/ 10'}
                </span>
              </div>
            </div>

            {/* Question Card */}
            <div className="p-8 bg-slate-950 border-2 border-indigo-500/40 rounded-2xl text-center space-y-2">
              <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest block">
                Translate this term
              </span>
              <h3 className="text-3xl font-black text-white tracking-tight">
                {activeDeck.items[currentQIndex].prompt}
              </h3>
            </div>

            {/* Multiple Choice Format */}
            {questionFormat === 'mc' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentOptions.map((optText, idx) => {
                  const isSelected = selectedOption === optText;
                  const isCorrect = activeDeck.items[currentQIndex].de.some(
                    a => a.toLowerCase().trim() === optText.toLowerCase().trim()
                  );

                  let btnStyle = 'bg-slate-950 border-slate-800 hover:border-indigo-400/60 text-white';
                  if (isAnswered) {
                    if (isCorrect) {
                      btnStyle = 'bg-emerald-950 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500';
                    } else if (isSelected) {
                      btnStyle = 'bg-rose-950 border-rose-500 text-rose-300 ring-2 ring-rose-500';
                    } else {
                      btnStyle = 'bg-slate-950 border-slate-800/40 text-slate-500 opacity-50';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={isAnswered}
                      onClick={() => {
                        setSelectedOption(optText);
                        handleEvaluateAnswer(optText);
                      }}
                      className={`p-4 rounded-xl border-2 text-left font-bold text-sm transition-all cursor-pointer flex items-center justify-between min-h-[58px] ${btnStyle}`}
                    >
                      <span>{optText}</span>
                      {isAnswered && isCorrect && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                      {isAnswered && isSelected && !isCorrect && <X className="w-4 h-4 text-rose-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Written Typing Format */}
            {questionFormat === 'typing' && (
              <form
                onSubmit={e => {
                  e.preventDefault();
                  if (typedInput.trim()) handleEvaluateAnswer(typedInput.trim());
                }}
                className="space-y-3"
              >
                <input
                  type="text"
                  autoFocus
                  disabled={isAnswered}
                  value={typedInput}
                  onChange={e => setTypedInput(e.target.value)}
                  placeholder="Type translation and press Enter..."
                  className="w-full px-4 py-3 bg-slate-950 border-2 border-slate-800 focus:border-amber-400 rounded-xl text-amber-300 font-bold text-base outline-none"
                />
                {!isAnswered && (
                  <button
                    type="submit"
                    disabled={!typedInput.trim()}
                    className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl cursor-pointer"
                  >
                    Submit Answer
                  </button>
                )}
              </form>
            )}

            {/* Live Standings Bar with Avatar Pictures */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
              <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider block mb-2">
                Live Standings:
              </span>
              <div className="space-y-2">
                {[...players].sort((a, b) => b.score - a.score).map((p, idx) => {
                  const pBackdrop = SHOP_CATALOG.find(i => i.id === p.backdropId)?.photoUrl;
                  return (
                    <div key={idx} className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2">
                        <AvatarDisplay avatar={p.avatar} backdropUrl={pBackdrop} size="sm" />
                        <span className="font-bold text-slate-300">
                          {idx + 1}. {p.name} {p.name === displayName ? '(You)' : ''}
                        </span>
                      </div>
                      <span className="font-mono font-black text-amber-400">
                        {p.score} {gameMode === 'battle' ? 'PTS' : '/ 10'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 4: GAME OVER */}
        {viewState === 'gameover' && (
          <div className="text-center space-y-6 py-4">
            <div className="w-16 h-16 bg-amber-500/20 border-2 border-amber-400 rounded-2xl flex items-center justify-center mx-auto text-amber-400">
              <Crown className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-3xl font-black text-white">Match Concluded</h3>
              <p className="text-xs text-slate-400 mt-1">Final Standings for Room #{roomPin}</p>
            </div>

            <div className="max-w-md mx-auto space-y-2">
              {[...players].sort((a, b) => b.score - a.score).map((p, idx) => {
                const pBackdrop = SHOP_CATALOG.find(i => i.id === p.backdropId)?.photoUrl;
                return (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                      idx === 0
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-black'
                        : 'bg-slate-950 border-slate-800 text-white font-bold'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-sm font-black w-6 text-center">#{idx + 1}</span>
                      <AvatarDisplay avatar={p.avatar} backdropUrl={pBackdrop} size="sm" />
                      <span>{p.name}</span>
                    </div>
                    <span className="font-mono text-sm">{p.score} {gameMode === 'battle' ? 'PTS' : '/ 10'}</span>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => { setViewState('lobby'); setRoomPin(''); setPlayers([]); }}
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs rounded-xl shadow cursor-pointer transition-colors"
            >
              Play Another Match
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
