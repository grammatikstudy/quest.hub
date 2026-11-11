let audioCtx: AudioContext | null = null;
let musicStepTimer: NodeJS.Timeout | null = null;
let currentStep = 0;

// Read persisted settings from localStorage if available (defaults to OFF unless user chose a track)
function getInitialSettings() {
  if (typeof window === 'undefined') {
    return { track: 'off', volume: 0.15, soundFx: false, playing: false };
  }
  try {
    const savedTrack = localStorage.getItem('questhub_audio_track') || 'off';
    const savedVol = localStorage.getItem('questhub_audio_volume');
    const savedFx = localStorage.getItem('questhub_soundfx_enabled');
    const savedPlaying = localStorage.getItem('questhub_music_playing');

    return {
      track: savedTrack,
      volume: savedVol !== null ? parseFloat(savedVol) : 0.15,
      soundFx: savedFx !== null ? savedFx === 'true' : false,
      playing: savedPlaying === 'true' && savedTrack !== 'off'
    };
  } catch {
    return { track: 'off', volume: 0.15, soundFx: false, playing: false };
  }
}

const initial = getInitialSettings();
let isMusicPlaying = false; // Safe start: waits for user interaction or un-mute
let currentTrack = initial.track;
let musicVolume = initial.volume;
let soundFxEnabled = initial.soundFx;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function playSound(type: 'click' | 'correct' | 'error' | 'fanfare') {
  if (!soundFxEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    if (type === 'click') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.08);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'correct') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    } else if (type === 'error') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.setValueAtTime(160, now + 0.1);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    } else if (type === 'fanfare') {
      const notes = [440, 554.37, 659.25, 880];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(freq, now + idx * 0.09);
        gain.gain.setValueAtTime(0.06, now + idx * 0.09);
        gain.gain.linearRampToValueAtTime(0.001, now + idx * 0.09 + 0.25);
        osc.start(now + idx * 0.09);
        osc.stop(now + idx * 0.09 + 0.26);
      });
    }
  } catch {}
}

/**
 * Rich, long, multi-voice ambient procedural music generator.
 * Uses 16-step harmonic chord progressions with soft attacks and long reverberant decays.
 */
function advanceProceduralMusicStep() {
  const ctx = getAudioContext();
  if (!ctx || !isMusicPlaying || currentTrack === 'off') return;

  const now = ctx.currentTime;
  currentStep = (currentStep + 1) % 32;

  try {
    if (currentTrack === 'piano' || currentTrack === 'study') {
      // 4-chord progression: Cmaj9 -> Am9 -> Fmaj7 -> Gsus4
      const chordRoots = [
        [261.63, 329.63, 392.00, 493.88, 587.33], // Cmaj9
        [220.00, 261.63, 329.63, 392.00, 493.88], // Am9
        [174.61, 261.63, 329.63, 349.23, 440.00], // Fmaj7
        [196.00, 261.63, 293.66, 392.00, 523.25]  // Gsus4
      ];
      const chordIndex = Math.floor(currentStep / 8);
      const chord = chordRoots[chordIndex];

      // On chord downbeat (every 8 steps), play warm sustained pad chord
      if (currentStep % 8 === 0) {
        chord.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now);
          gain.gain.setValueAtTime(0.001, now);
          gain.gain.linearRampToValueAtTime(musicVolume * 0.06, now + 0.3);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 3.2);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 3.3);
        });
      }

      // Gentle arpeggio bell note on intermediate steps
      if (currentStep % 2 === 0) {
        const arpHigher = chord[currentStep % chord.length] * 2;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(arpHigher, now);
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(musicVolume * 0.04, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 1.25);
      }
    } else if (currentTrack === 'lofi') {
      // Warm Rhodes 7th Chords with filter
      const chords = [
        [220.00, 261.63, 329.63, 392.00], // Am7
        [174.61, 220.00, 261.63, 329.63], // Fmaj7
        [196.00, 246.94, 293.66, 349.23], // G7
        [164.81, 196.00, 246.94, 293.66]  // Em7
      ];
      const chord = chords[Math.floor(currentStep / 8)];

      if (currentStep % 8 === 0) {
        chord.forEach(freq => {
          const osc = ctx.createOscillator();
          const filter = ctx.createBiquadFilter();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(750, now);

          osc.frequency.setValueAtTime(freq, now);
          gain.gain.setValueAtTime(0.001, now);
          gain.gain.linearRampToValueAtTime(musicVolume * 0.07, now + 0.2);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 2.8);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 2.9);
        });
      }
    } else if (currentTrack === 'synthwave') {
      // Driving 80s synth bass & pulse
      const bassNotes = [110, 110, 130.81, 146.83, 164.81, 130.81, 98, 110];
      const bass = bassNotes[currentStep % bassNotes.length];

      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800 + Math.sin(now * 2) * 200, now);
      osc.frequency.setValueAtTime(bass, now);

      gain.gain.setValueAtTime(musicVolume * 0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.36);
    } else if (currentTrack === 'chiptune' || currentTrack === 'arcade') {
      // 8-bit retro arcade melody
      const arcadeMelody = [261.63, 329.63, 392.00, 523.25, 440.00, 349.23, 392.00, 329.63];
      const note = arcadeMelody[currentStep % arcadeMelody.length];

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(note, now);
      gain.gain.setValueAtTime(musicVolume * 0.08, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.19);
    }
  } catch {}
}

export function startMusic() {
  getAudioContext();
  if (musicStepTimer) clearInterval(musicStepTimer);
  isMusicPlaying = true;
  currentStep = 0;
  // Step every 380ms for relaxed tempo
  musicStepTimer = setInterval(advanceProceduralMusicStep, 380);
  try {
    localStorage.setItem('questhub_music_playing', 'true');
  } catch {}
}

export function stopMusic() {
  isMusicPlaying = false;
  if (musicStepTimer) clearInterval(musicStepTimer);
  try {
    localStorage.setItem('questhub_music_playing', 'false');
  } catch {}
}

export function setTrack(track: string) {
  currentTrack = track;
  try {
    localStorage.setItem('questhub_audio_track', track);
  } catch {}

  if (track === 'off') {
    stopMusic();
  } else {
    startMusic();
  }
}

export function setVolume(vol: number) {
  musicVolume = vol;
  try {
    localStorage.setItem('questhub_audio_volume', vol.toString());
  } catch {}
}

export function toggleSoundEffects(): boolean {
  soundFxEnabled = !soundFxEnabled;
  try {
    localStorage.setItem('questhub_soundfx_enabled', soundFxEnabled ? 'true' : 'false');
  } catch {}
  return soundFxEnabled;
}

export function getSoundFxEnabled(): boolean {
  return soundFxEnabled;
}

export function getCurrentAudioTrack(): string {
  return currentTrack;
}

export function getCurrentAudioVolume(): number {
  return musicVolume;
}

export function isAudioPlaying(): boolean {
  return isMusicPlaying;
}

/**
 * Natural TTS Voice Player
 */
export function speakNaturalText(text: string, langCode: string = 'en-US') {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  try {
    window.speechSynthesis.cancel();
  } catch {}

  setTimeout(() => {
    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = langCode;

      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        const naturalVoice =
          voices.find(v => {
            const matchLang = v.lang.toLowerCase().startsWith(langCode.substring(0, 2).toLowerCase());
            const isNatural = /natural|google|neural|premium|samantha|victoria|karen|oliver|anna/i.test(v.name);
            const isNotRobotic = !/daniel|zarvox|trinoids|bad news|cellos/i.test(v.name);
            return matchLang && isNatural && isNotRobotic;
          }) || voices.find(v => v.lang.toLowerCase().startsWith(langCode.substring(0, 2).toLowerCase()));

        if (naturalVoice) {
          utterance.voice = naturalVoice;
        }
      }

      utterance.onerror = e => {
        console.warn('SpeechSynthesis notice:', e);
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Speech synthesis playback error:', err);
    }
  }, 30);
}

export function stopNaturalText() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {}
  }
}
