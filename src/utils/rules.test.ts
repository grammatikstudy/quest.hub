import test from 'node:test';
import assert from 'node:assert/strict';
import { checkLatinOrGermanAnswer } from './latinValidator.ts';
import { generateMultipleChoiceOptions } from './distractorGenerator.ts';
import { evaluateSpeech } from './speechEvaluator.ts';
import { VocabItem } from '../types/index.ts';

test('Latin verb validator requires either he, she, or it, and rejects bare verbs or ungrammatical forms', () => {
  const accepted = ['he works', 'she works', 'it works'];

  // 1. Exactly one pronoun + correctly conjugated verb: PASS
  assert.equal(checkLatinOrGermanAnswer('he works', accepted, true).isCorrect, true);
  assert.equal(checkLatinOrGermanAnswer('she works', accepted, true).isCorrect, true);
  assert.equal(checkLatinOrGermanAnswer('it works', accepted, true).isCorrect, true);

  // 2. Bare verb without pronoun: REJECT (user: "works wouldn't be accepted")
  assert.equal(checkLatinOrGermanAnswer('works', accepted, true).isCorrect, false);

  // 3. Ungrammatical verb form: REJECT (user: "He work wouldn't be accepted")
  assert.equal(checkLatinOrGermanAnswer('he work', accepted, true).isCorrect, false);

  // 4. All three pronouns entered: REJECT (user: "not the three and not neither of them. It needs one of them")
  assert.equal(checkLatinOrGermanAnswer('he she it works', accepted, true).isCorrect, false);
  assert.equal(checkLatinOrGermanAnswer('he, she, it works', accepted, true).isCorrect, false);

  // 5. Continuous with one pronoun: PASS
  assert.equal(checkLatinOrGermanAnswer('he is working', accepted, true).isCorrect, true);

  // 6. Latin nouns/non-verbs: PASS standard matching
  const nounAccepted = ['dog'];
  assert.equal(checkLatinOrGermanAnswer('dog', nounAccepted, true).isCorrect, true);
});

test('German validator accepts exact match and slash variants', () => {
  const accepted = ['die Bibliothek'];
  assert.equal(checkLatinOrGermanAnswer('die bibliothek', accepted, false).isCorrect, true);
  assert.equal(checkLatinOrGermanAnswer('der computerraum', accepted, false).isCorrect, false);

  const slashAccepted = ['die Schüler / die Schülerinnen'];
  assert.equal(checkLatinOrGermanAnswer('die schüler', slashAccepted, false).isCorrect, true);
  assert.equal(checkLatinOrGermanAnswer('die schülerinnen', slashAccepted, false).isCorrect, true);
});

test('Distractor generator creates 4 distinct options with correct answer', () => {
  const q: VocabItem = { prompt: 'canis', de: ['dog'] };
  const pool: VocabItem[] = [
    { prompt: 'coquus', de: ['cook'] },
    { prompt: 'filius', de: ['son'] },
    { prompt: 'hortus', de: ['garden'] },
    { prompt: 'mater', de: ['mother'] }
  ];

  const options = generateMultipleChoiceOptions(q, pool);
  assert.equal(options.length, 4);
  assert.equal(options.includes('dog'), true);
  const unique = new Set(options);
  assert.equal(unique.size, 4);
});

test('Speech evaluator scores forgivingly and flags missed tokens', () => {
  const script = 'Salvé magister noster';
  const spoken = 'salve magister noster';

  const res = evaluateSpeech(script, spoken);
  assert.equal(res.scorePercent >= 90, true);
  assert.equal(res.missedWords.length, 0);

  const script2 = 'In der Pause trinke ich Wasser';
  const spoken2 = 'In der Pause trinke ich Saft';
  const res2 = evaluateSpeech(script2, spoken2);
  assert.equal(res2.missedWords.includes('wasser'), true);
});
