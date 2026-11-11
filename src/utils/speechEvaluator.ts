/**
 * Speech evaluation with phonetic and vowel sound analysis.
 */

export interface SpeechEvaluationResult {
  scorePercent: number;
  totalWords: number;
  matchedWords: string[];
  missedWords: string[];
  spokenWords: string[];
  vowelScorePercent: number;
  vowelFeedback: string;
  feedback: string;
}

// Simple Levenshtein distance
function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const d: number[][] = [];

  for (let i = 0; i <= m; i++) d[i] = [i];
  for (let j = 0; j <= n; j++) d[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(
        d[i - 1][j] + 1,
        d[i][j - 1] + 1,
        d[i - 1][j - 1] + cost
      );
    }
  }
  return d[m][n];
}

// Extract vowel sounds and diphthongs with accent normalization
export function extractVowels(text: string): string[] {
  const normalized = text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, (match, offset, string) => {
      // Keep umlauts (ä, ö, ü) distinct for German, but normalize acute/grave accents
      const prevChar = string[offset - 1];
      return '';
    });
  // Also handle common umlauts explicitly
  const withUmlauts = text.toLowerCase()
    .replace(/[éèê]/g, 'e')
    .replace(/[áàâ]/g, 'a')
    .replace(/[íìî]/g, 'i')
    .replace(/[óòô]/g, 'o')
    .replace(/[úùû]/g, 'u');
  const vowelMatches = withUmlauts.match(/(äu|eu|ei|ie|au|oo|ee|aa|ää|öö|üü|ä|ö|ü|a|e|i|o|u)/g);
  return vowelMatches || [];
}

// Clean and tokenize script or transcript
export function tokenizeWords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?"'«»]/g, '')
    .split(/\s+/)
    .filter(w => w.trim().length > 0);
}

export function evaluateSpeech(targetScript: string, spokenTranscript: string): SpeechEvaluationResult {
  const targetTokens = tokenizeWords(targetScript);
  const cleanSpoken = spokenTranscript ? spokenTranscript.trim() : '';

  // If nothing was spoken or audio was inaudible
  if (!cleanSpoken) {
    return {
      scorePercent: 0,
      totalWords: targetTokens.length,
      matchedWords: [],
      missedWords: targetTokens,
      spokenWords: [],
      vowelScorePercent: 0,
      vowelFeedback: 'No speech detected.',
      feedback: 'Could not hear you. Please speak clearly into your microphone.'
    };
  }

  const spokenTokens = tokenizeWords(cleanSpoken);

  if (targetTokens.length === 0) {
    return {
      scorePercent: 100,
      totalWords: 0,
      matchedWords: [],
      missedWords: [],
      spokenWords: spokenTokens,
      vowelScorePercent: 100,
      vowelFeedback: 'No target script.',
      feedback: 'Target text is empty.'
    };
  }

  const matchedWords: string[] = [];
  const missedWords: string[] = [];
  const usedSpokenIndices = new Set<number>();

  for (let i = 0; i < targetTokens.length; i++) {
    const target = targetTokens[i];
    let foundMatch = false;

    for (let j = 0; j < spokenTokens.length; j++) {
      if (usedSpokenIndices.has(j)) continue;
      const spoken = spokenTokens[j];

      // Exact match
      if (target === spoken) {
        foundMatch = true;
        usedSpokenIndices.add(j);
        break;
      }

      // Allow distance 1 for words length >= 4, distance 2 for words length >= 7
      const dist = levenshtein(target, spoken);
      const allowedDist = target.length >= 7 ? 2 : target.length >= 4 ? 1 : 0;

      if (dist <= allowedDist) {
        foundMatch = true;
        usedSpokenIndices.add(j);
        break;
      }
    }

    if (foundMatch) {
      matchedWords.push(target);
    } else {
      missedWords.push(target);
    }
  }

  // Vowel sound analysis
  const targetVowels = extractVowels(targetScript);
  const spokenVowels = extractVowels(cleanSpoken);

  let matchedVowelCount = 0;
  const vowelErrors: string[] = [];

  for (let k = 0; k < targetVowels.length; k++) {
    const tv = targetVowels[k];
    if (k < spokenVowels.length && spokenVowels[k] === tv) {
      matchedVowelCount++;
    } else if (k < spokenVowels.length) {
      if (!vowelErrors.includes(`Expected '${tv}', heard '${spokenVowels[k]}'`)) {
        vowelErrors.push(`Expected '${tv}', heard '${spokenVowels[k]}'`);
      }
    } else {
      if (!vowelErrors.includes(`Missing vowel sound '${tv}'`)) {
        vowelErrors.push(`Missing vowel sound '${tv}'`);
      }
    }
  }

  const vowelScorePercent = targetVowels.length > 0
    ? Math.round((matchedVowelCount / targetVowels.length) * 100)
    : 100;

  let vowelFeedback = 'Vowel sounds aligned.';
  if (vowelErrors.length > 0) {
    vowelFeedback = `Vowel discrepancies: ${vowelErrors.slice(0, 3).join('; ')}.`;
  }

  const wordScorePercent = Math.round((matchedWords.length / targetTokens.length) * 100);
  const scorePercent = Math.round((wordScorePercent * 0.7) + (vowelScorePercent * 0.3));

  let feedback = 'Pronunciation matched target text.';
  if (scorePercent < 50) {
    feedback = 'Several words and vowel sounds differed. Speak at a steady pace.';
  } else if (scorePercent < 80) {
    feedback = 'Most terms recognized. Practice specific highlighted vowel sounds.';
  }

  return {
    scorePercent,
    totalWords: targetTokens.length,
    matchedWords,
    missedWords,
    spokenWords: spokenTokens,
    vowelScorePercent,
    vowelFeedback,
    feedback
  };
}

export function analyzeSingleWord(targetWord: string, spokenText: string): {
  isMatch: boolean;
  scorePercent: number;
  vowelFeedback: string;
  feedback: string;
} {
  const cleanSpoken = spokenText ? spokenText.trim().toLowerCase() : '';
  const cleanTarget = targetWord.trim().toLowerCase();

  if (!cleanSpoken) {
    return {
      isMatch: false,
      scorePercent: 0,
      vowelFeedback: 'No speech detected.',
      feedback: 'Could not hear you. Please speak clearly into your microphone.'
    };
  }

  const dist = levenshtein(cleanTarget, cleanSpoken);
  const allowed = cleanTarget.length >= 7 ? 2 : cleanTarget.length >= 4 ? 1 : 0;
  const isMatch = dist <= allowed;

  const targetVowels = extractVowels(cleanTarget);
  const spokenVowels = extractVowels(cleanSpoken);

  let matchedVowels = 0;
  const diffs: string[] = [];
  for (let i = 0; i < targetVowels.length; i++) {
    const tv = targetVowels[i];
    if (i < spokenVowels.length && spokenVowels[i] === tv) {
      matchedVowels++;
    } else if (i < spokenVowels.length) {
      diffs.push(`vowel '${tv}' sounded like '${spokenVowels[i]}'`);
    } else {
      diffs.push(`missing '${tv}'`);
    }
  }

  const vowelPct = targetVowels.length > 0 ? Math.round((matchedVowels / targetVowels.length) * 100) : 100;
  const wordPct = isMatch ? 100 : Math.max(0, 100 - (dist * 25));
  const combined = Math.round((wordPct * 0.6) + (vowelPct * 0.4));

  return {
    isMatch,
    scorePercent: combined,
    vowelFeedback: diffs.length > 0 ? diffs.join(', ') : 'All vowel sounds matched.',
    feedback: isMatch ? 'Accurate pronunciation.' : `Detected: "${cleanSpoken}". Review vowel sounds.`
  };
}
