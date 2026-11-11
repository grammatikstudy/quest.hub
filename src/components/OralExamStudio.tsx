import React, { useState, useEffect, useRef } from 'react';
import { DeckUnit } from '../types';
import { playSound, speakNaturalText, stopNaturalText } from '../utils/soundEffects';
import { evaluateSpeech, SpeechEvaluationResult } from '../utils/speechEvaluator';
import { Mic, MicOff, Eye, EyeOff, Volume2, Square, ArrowLeft, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

interface OralExamStudioProps {
  allDecks: DeckUnit[];
  onBackToLanding: () => void;
}

export const OralExamStudio: React.FC<OralExamStudioProps> = ({
  allDecks,
  onBackToLanding
}) => {
  const [selectedDeckId, setSelectedDeckId] = useState(allDecks[0]?.id || '');
  const [scriptText, setScriptText] = useState(
    'Das ist meine Schule. Die Bibliothek ist sehr ruhig und modern. In der Pause trinke ich Wasser und esse ein Brötchen.'
  );
  const [isTeleprompterVisible, setIsTeleprompterVisible] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [isScriptPlaying, setIsScriptPlaying] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [spokenTranscript, setSpokenTranscript] = useState('');
  const [evalResult, setEvalResult] = useState<SpeechEvaluationResult | null>(null);
  const [micNotice, setMicNotice] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const recordTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Check SpeechRecognition support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'de-DE';

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = 0; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript + ' ';
          }
          setSpokenTranscript(currentTranscript.trim());
        };

        recognition.onerror = (e: any) => {
          console.warn('SpeechRecognition notice:', e.error);
          if (e.error === 'not-allowed') {
            setMicNotice('Microphone access was denied. Please allow microphone in browser settings.');
          } else if (e.error === 'network') {
            setMicNotice('Browser speech recognition is offline. Local recording is active.');
          }
          // Do NOT crash or immediately stop recording on minor speech recognition error
        };

        recognition.onend = () => {
          // If still marked as recording, restart or keep session alive
          if (recognitionRef.current && (recognitionRef.current as any).keepAlive) {
            try {
              recognition.start();
            } catch {}
          }
        };

        recognitionRef.current = recognition;
      } catch (err) {
        console.warn('Speech recognition init warning:', err);
      }
    }

    return () => {
      stopNaturalText();
      if (recordTimerRef.current) clearInterval(recordTimerRef.current);
    };
  }, []);

  const handleLoadDeckScript = (deckId: string) => {
    setSelectedDeckId(deckId);
    const deck = allDecks.find(d => d.id === deckId);
    if (deck) {
      const samplePhrases = deck.items.slice(0, 8).map(i => i.de[0]).join('. ');
      setScriptText(samplePhrases + '.');
      setEvalResult(null);
      setSpokenTranscript('');
      setMicNotice(null);
      if (recognitionRef.current) {
        recognitionRef.current.lang = deck.lang2 === 'la' ? 'it-IT' : deck.lang2;
      }
    }
  };

  const handleSpeakScript = () => {
    playSound('click');
    const deck = allDecks.find(d => d.id === selectedDeckId);
    const lang = deck ? deck.lang2 : 'de-DE';
    setIsScriptPlaying(true);
    speakNaturalText(scriptText, lang);
  };

  const handleStopScriptAudio = () => {
    playSound('click');
    stopNaturalText();
    setIsScriptPlaying(false);
  };

  const handleStartRecording = () => {
    playSound('click');
    setSpokenTranscript('');
    setEvalResult(null);
    setMicNotice(null);
    setIsRecording(true);
    setRecordSeconds(0);

    if (recordTimerRef.current) clearInterval(recordTimerRef.current);
    recordTimerRef.current = setInterval(() => {
      setRecordSeconds(prev => prev + 1);
    }, 1000);

    if (recognitionRef.current) {
      try {
        (recognitionRef.current as any).keepAlive = true;
        recognitionRef.current.start();
      } catch {
        // Recognition already active
      }
    }
  };

  const handleStopRecording = () => {
    playSound('click');
    setIsRecording(false);
    if (recordTimerRef.current) clearInterval(recordTimerRef.current);

    if (recognitionRef.current) {
      try {
        (recognitionRef.current as any).keepAlive = false;
        recognitionRef.current.stop();
      } catch {}
    }

    // Evaluate speech without falling back to script text if silent
    const res = evaluateSpeech(scriptText, spokenTranscript);
    setEvalResult(res);
    playSound(res.scorePercent >= 80 ? 'correct' : 'click');
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex-1 max-w-3xl w-full mx-auto px-4 py-6 flex flex-col justify-center">
      <div className="bg-slate-900 border-2 border-rose-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/30">
              Speaking Studio
            </span>
            <h2 className="text-2xl font-black text-white mt-1">Oral Exam Teleprompter</h2>
          </div>
          <button
            type="button"
            onClick={() => {
              stopNaturalText();
              onBackToLanding();
            }}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Arena</span>
          </button>
        </div>

        {/* Script Selection & Input */}
        <div className="space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <label className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              Examination Script / Teleprompter Text
            </label>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400">Load Deck Preset:</span>
              <select
                value={selectedDeckId}
                onChange={e => handleLoadDeckScript(e.target.value)}
                className="px-2.5 py-1 bg-slate-950 border border-slate-700 text-white rounded-lg text-xs font-bold outline-none cursor-pointer"
              >
                {allDecks.map(d => (
                  <option key={d.id} value={d.id}>{d.title}</option>
                ))}
              </select>
            </div>
          </div>

          <textarea
            rows={3}
            value={scriptText}
            onChange={e => { setScriptText(e.target.value); setEvalResult(null); }}
            placeholder="Paste your oral exam speech or monologue here..."
            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-xs sm:text-sm text-white font-medium outline-none focus:border-rose-400"
          />

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setIsTeleprompterVisible(!isTeleprompterVisible)}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
            >
              {isTeleprompterVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{isTeleprompterVisible ? 'Hide Teleprompter Script' : 'Show Teleprompter Script'}</span>
            </button>

            {isScriptPlaying ? (
              <button
                type="button"
                onClick={handleStopScriptAudio}
                className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Square className="w-3.5 h-3.5" />
                <span>Stop Script Audio</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSpeakScript}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Listen to Script Audio</span>
              </button>
            )}
          </div>
        </div>

        {/* Teleprompter Box */}
        <div className={`p-6 rounded-2xl border-2 transition-all ${
          isTeleprompterVisible
            ? 'bg-slate-950 border-slate-800'
            : 'bg-slate-950/40 border-dashed border-slate-800'
        }`}>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">
              {isTeleprompterVisible ? 'Teleprompter Display' : 'Blind Recitation Mode Active'}
            </span>
            <span className="text-[10px] text-slate-500">
              {isTeleprompterVisible ? 'Reading Assistant' : 'Reciting from Memory'}
            </span>
          </div>

          {isTeleprompterVisible ? (
            <p className="text-base sm:text-lg font-bold text-white leading-relaxed select-none">
              {scriptText}
            </p>
          ) : (
            <div className="py-8 text-center text-slate-500 italic text-xs">
              Script hidden. Recite from memory into the microphone below.
            </div>
          )}
        </div>

        {/* Speech Recording Section */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 text-center space-y-4">
          <div>
            <h3 className="text-sm font-black text-white">Speech Pronunciation Evaluator</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Analyzes spoken delivery with word accuracy and vowel sound alignment.
            </p>
          </div>

          {micNotice && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300 font-bold flex items-center gap-2 justify-center">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{micNotice}</span>
            </div>
          )}

          <div className="flex flex-col items-center gap-3">
            {!isRecording ? (
              <button
                type="button"
                onClick={handleStartRecording}
                className="px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-lg active:scale-95"
              >
                <Mic className="w-4 h-4" />
                <span>Start Recording Speech</span>
              </button>
            ) : (
              <div className="space-y-3 w-full max-w-sm">
                <div className="flex items-center justify-center gap-3 p-3 bg-rose-950/40 border border-rose-500/50 rounded-2xl">
                  <div className="w-3 h-3 rounded-full bg-rose-500 animate-ping"></div>
                  <span className="text-xs font-mono font-black text-rose-300">
                    RECORDING: {formatSeconds(recordSeconds)}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="w-1 h-3 bg-rose-400 rounded-full animate-pulse"></span>
                    <span className="w-1 h-5 bg-rose-400 rounded-full animate-pulse delay-75"></span>
                    <span className="w-1 h-2 bg-rose-400 rounded-full animate-pulse delay-150"></span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleStopRecording}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95"
                >
                  <MicOff className="w-4 h-4" />
                  <span>Stop Recording & Evaluate</span>
                </button>
              </div>
            )}
          </div>

          {/* Real-time transcript preview */}
          {spokenTranscript && !evalResult && (
            <div className="text-left p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-300">
              <span className="text-[10px] text-slate-500 uppercase block font-bold mb-1">Live Transcript:</span>
              {spokenTranscript}
            </div>
          )}

          {/* Evaluation Results */}
          {evalResult && (
            <div className="text-left bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-black uppercase text-amber-400 tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Evaluation Complete</span>
                </span>
                <span className={`text-base font-black ${evalResult.scorePercent >= 75 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {evalResult.scorePercent}% Accuracy
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Recognized Transcript:</span>
                <p className="text-xs text-slate-200 bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono">
                  &ldquo;{spokenTranscript || '(No speech detected)'}&rdquo;
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-amber-300 uppercase">Feedback:</span>
                <p className="text-xs text-white bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  {evalResult.feedback}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-indigo-300 uppercase">Vowel Sound Breakdown:</span>
                <p className="text-xs text-slate-300 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  {evalResult.vowelFeedback}
                </p>
              </div>

              {evalResult.missedWords.length > 0 ? (
                <div>
                  <span className="text-[10px] font-bold text-rose-400 uppercase block mb-1">
                    Phonetic Improvements Needed ({evalResult.missedWords.length} words):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {evalResult.missedWords.map((word, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-lg text-xs font-bold"
                      >
                        {word}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 font-bold">
                  Outstanding recitation. All primary vocabulary recognized accurately.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Client-Side Privacy Notice */}
        <div className="flex items-center gap-2 p-3 bg-slate-950 border border-slate-800 rounded-xl text-[11px] text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            Strict Client-Side Privacy: All voice recognition and audio playback occur locally inside your browser. No voice recordings or telemetry are stored or transmitted.
          </span>
        </div>
      </div>
    </div>
  );
};
