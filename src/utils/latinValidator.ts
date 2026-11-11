/**
 * Normalizes user answer and checks if it matches accepted answers.
 * Latin Verb Rule:
 * For 3rd-person singular Latin verbs (e.g. laborat), the student must provide
 * exactly one of the three pronouns in front: "he works", "she works", or "it works".
 * - "works" alone is NOT accepted.
 * - "he work" is NOT accepted (must be grammatically conjugated).
 * - "he, she, it works" or multiple pronouns are NOT accepted.
 * Latin nouns, adjectives, and non-3rd-person verbs match standard vocabulary rules.
 */
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?"']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Common Cambridge Latin 3rd-person verb definitions in English
const COMMON_LATIN_3RD_VERB_STEMS = new Set([
  'works', 'walks', 'sleeps', 'enters', 'shouts', 'hears', 'praises',
  'watches', 'lives', 'runs', 'leads', 'carries', 'calls', 'hurries',
  'drinks', 'cooks', 'sits', 'stands', 'looks', 'looks at', 'replies',
  'answers', 'says', 'tells', 'loves', 'likes', 'greets', 'salutes',
  'sees', 'fears', 'holds', 'has', 'eats', 'writes', 'reads', 'sends',
  'gives', 'comes', 'arrives', 'departs', 'leaves', 'finds', 'takes',
  'makes', 'does', 'wants', 'is', 'was', 'are', 'were'
]);

export function isLatinThirdPersonVerb(acceptedAnswers: string[]): { isVerb: boolean; verbStem: string } {
  const pronounRegex = /^(he|she|it)\s+(.+)$/i;
  for (const acc of acceptedAnswers) {
    const norm = normalizeText(acc);
    const m = norm.match(pronounRegex);
    if (m) {
      return { isVerb: true, verbStem: m[2].trim() };
    }
    // Also check if the definition itself is a common 3rd person singular verb ending in 's'
    if (COMMON_LATIN_3RD_VERB_STEMS.has(norm)) {
      return { isVerb: true, verbStem: norm };
    }
  }
  return { isVerb: false, verbStem: '' };
}

export function checkLatinOrGermanAnswer(
  userInput: string,
  acceptedAnswers: string[],
  isLatin: boolean = false
): { isCorrect: boolean; matchedAnswer?: string } {
  const normUser = normalizeText(userInput);
  if (!normUser) return { isCorrect: false };

  if (isLatin) {
    const { isVerb, verbStem } = isLatinThirdPersonVerb(acceptedAnswers);

    if (isVerb && verbStem) {
      // 1. User must NOT supply multiple pronouns ("he she it", "he, she, it")
      const words = normUser.split(' ');
      const pronounCount = words.filter(w => w === 'he' || w === 'she' || w === 'it').length;
      if (pronounCount !== 1) {
        // Did not supply exactly one pronoun (either supplied 0, or multiple)
        return { isCorrect: false };
      }

      // 2. User MUST start with "he ", "she ", or "it "
      const userPronounMatch = normUser.match(/^(he|she|it)\s+(.+)$/i);
      if (!userPronounMatch) {
        return { isCorrect: false };
      }

      const userVerb = userPronounMatch[2].trim();

      // Check if userVerb matches the expected 3rd person singular form
      // e.g. "works" matches "works", but "work" does NOT match "works"
      if (userVerb === verbStem) {
        return { isCorrect: true, matchedAnswer: `${userPronounMatch[1]} ${verbStem}` };
      }

      // Also accept continuous present: e.g. "he is working"
      if (verbStem.endsWith('s')) {
        const continuousBase = verbStem.endsWith('es') ? verbStem.slice(0, -2) : verbStem.slice(0, -1);
        if (userVerb === `is ${continuousBase}ing` || userVerb === `is ${verbStem.slice(0, -1)}ing`) {
          return { isCorrect: true, matchedAnswer: `${userPronounMatch[1]} is ${continuousBase}ing` };
        }
      }

      // If user typed "he work" when verbStem is "works", reject!
      return { isCorrect: false };
    }
  }

  // General vocabulary matching (German, Latin nouns/adjectives/phrases)
  for (const accepted of acceptedAnswers) {
    const normAccepted = normalizeText(accepted);

    // Exact direct match
    if (normUser === normAccepted) {
      return { isCorrect: true, matchedAnswer: accepted };
    }

    // German alternate articles / slashes e.g. "die schüler / die schülerinnen"
    if (accepted.includes('/')) {
      const parts = accepted.split('/').map(p => normalizeText(p));
      for (const part of parts) {
        if (normUser === part) {
          return { isCorrect: true, matchedAnswer: accepted };
        }
      }
    }
  }

  return { isCorrect: false };
}
