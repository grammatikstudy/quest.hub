import { VocabItem } from '../types';

/**
 * Checks if a string looks like a 3rd person verb phrase (e.g. "he works", "she sleeps", "it is")
 */
function isThirdPersonVerb(text: string): boolean {
  return /^(he|she|it)\s+[a-z]+/i.test(text.trim());
}

/**
 * Checks if a string has a German article (der, die, das, ein, eine)
 */
function hasGermanArticle(text: string): boolean {
  return /^(der|die|das|ein|eine|einen|einem|einer)\s+[a-zäöüß]+/i.test(text.trim());
}

/**
 * Checks if a string looks like a German infinitive verb (ends in -en, -eln, -ern)
 */
function isGermanInfinitive(text: string): boolean {
  const clean = text.trim().toLowerCase();
  return (clean.endsWith('en') || clean.endsWith('eln') || clean.endsWith('ern')) && !clean.includes(' ');
}

// Sensible fallbacks when deck has < 4 items
const LOGICAL_FALLBACKS = {
  latinVerb: ['he works', 'she calls', 'he prepares', 'it remains', 'she hurries', 'he enters', 'she writes'],
  germanNoun: ['das Buch', 'die Schule', 'das Zimmer', 'der Tisch', 'die Stadt', 'das Haus', 'der Freund'],
  germanVerb: ['arbeiten', 'schreiben', 'lesen', 'spielen', 'lernen', 'wohnen', 'hören'],
  general: ['often', 'quickly', 'with great joy', 'in the morning', 'at home', 'together']
};

/**
 * Generates 4 strictly logical, category-matched choices for Multiple Choice / Learn mode.
 */
export function generateMultipleChoiceOptions(
  currentQuestion: VocabItem,
  deckPool: VocabItem[],
  globalPool: VocabItem[] = []
): string[] {
  const correctAnswer = currentQuestion.de[0];
  const uniqueDistractors = new Set<string>();

  const isLatinV = isThirdPersonVerb(correctAnswer);
  const isGermanN = hasGermanArticle(correctAnswer);
  const isGermanV = isGermanInfinitive(correctAnswer);

  const isCategoryMatch = (candidate: string) => {
    if (isLatinV) return isThirdPersonVerb(candidate);
    if (isGermanN) return hasGermanArticle(candidate);
    if (isGermanV) return isGermanInfinitive(candidate);
    return true; // if general vocab, any matches
  };

  const addCandidates = (items: VocabItem[], strictCategory: boolean) => {
    const shuffled = [...items].sort(() => 0.5 - Math.random());
    for (const item of shuffled) {
      if (item.prompt.toLowerCase() !== currentQuestion.prompt.toLowerCase()) {
        for (const ans of item.de) {
          const clean = ans.trim();
          if (
            clean.toLowerCase() !== correctAnswer.toLowerCase() &&
            !uniqueDistractors.has(clean)
          ) {
            if (!strictCategory || isCategoryMatch(clean)) {
              uniqueDistractors.add(clean);
              if (uniqueDistractors.size >= 3) return;
            }
          }
        }
      }
    }
  };

  // Phase 1: Try matching strictly same grammatical category from active deck
  addCandidates(deckPool, true);

  // Phase 2: If still needed, try matching strictly same grammatical category from global pool
  if (uniqueDistractors.size < 3 && globalPool.length > 0) {
    addCandidates(globalPool, true);
  }

  // Phase 3: If still needed, relax category filter within active deck
  if (uniqueDistractors.size < 3) {
    addCandidates(deckPool, false);
  }

  // Phase 4: Relax category filter in global pool
  if (uniqueDistractors.size < 3 && globalPool.length > 0) {
    addCandidates(globalPool, false);
  }

  // Phase 5: High-quality grammatical fallbacks (never "Alternative translation A")
  let fallbackPool = LOGICAL_FALLBACKS.general;
  if (isLatinV) fallbackPool = LOGICAL_FALLBACKS.latinVerb;
  else if (isGermanN) fallbackPool = LOGICAL_FALLBACKS.germanNoun;
  else if (isGermanV) fallbackPool = LOGICAL_FALLBACKS.germanVerb;

  for (const fb of fallbackPool) {
    if (uniqueDistractors.size >= 3) break;
    if (fb.toLowerCase() !== correctAnswer.toLowerCase() && !uniqueDistractors.has(fb)) {
      uniqueDistractors.add(fb);
    }
  }

  const selectedDistractors = Array.from(uniqueDistractors).slice(0, 3);
  const options = [correctAnswer, ...selectedDistractors];

  // Shuffle options
  return options.sort(() => 0.5 - Math.random());
}
