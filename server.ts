import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize GoogleGenAI
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  try {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  } catch (err) {
    console.error('Error initializing GoogleGenAI:', err);
  }
}

// 1. AI Explain Endpoint (for missed written answers)
app.post('/api/ai/explain', async (req, res) => {
  try {
    const { prompt, userAns, correctAns, language } = req.body;

    if (!prompt || !correctAns) {
      return res.status(400).json({ error: 'Prompt and correct answer are required.' });
    }

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-flash-latest',
          contents: `You are an encouraging and expert Latin and German vocabulary tutor for school students.
A student was asked to translate the term "${prompt}" (${language || 'Latin / German'}).
The student answered: "${userAns || '(Blank)'}".
The correct translation is: "${correctAns}".

Please provide a concise, friendly explanation (2-3 sentences max) that:
1. Explains why "${correctAns}" is the correct form (e.g. verb person/tense/case or grammatical nuance).
2. Point out what was missing in "${userAns || '(Blank)'}" in a kind, helpful way.
3. Give an easy memory tip or root connection.
Do not use harsh words. Keep it clear, student-friendly, and concise.`,
        });

        const text = response.text || '';
        return res.json({ explanation: text.trim() });
      } catch (genAiError: any) {
        console.error('Gemini generateContent error:', genAiError);
        // Fallback to pedagogical rule-based explanation if API error
      }
    }

    // High quality offline / fallback pedagogical rule generator
    let fallbackExplanation = `The term "${prompt}" translates to "${correctAns}". `;
    if (userAns && userAns !== '(Blank)') {
      fallbackExplanation += `Your answer "${userAns}" was close, but make sure to check pronoun agreement (he/she/it) and verb conjugation. `;
    } else {
      fallbackExplanation += `Remember that in Cambridge Latin and German, attention to subject pronouns and endings helps lock in the exact meaning. `;
    }
    fallbackExplanation += `Tip: Review the root "${prompt.slice(0, 4)}" to recognize this word faster next time!`;

    return res.json({ explanation: fallbackExplanation });
  } catch (error: any) {
    console.error('Server error in /api/ai/explain:', error);
    res.status(500).json({ error: 'Could not generate explanation.' });
  }
});

// 2. AI Chat Tutor Endpoint ("Ask Quest Tutor")
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    if (ai) {
      try {
        const chat = ai.chats.create({
          model: 'gemini-flash-latest',
          config: {
            systemInstruction: `You are Quest Tutor, a warm, supportive, and brilliant language coach for school students studying Cambridge Latin Book 1 and German Module 2.
You help students understand:
- Latin declensions (nominative, accusative, etc.), 1st/2nd/3rd conjugation verbs, pronouns (he, she, it), and Pompeian cultural context (Caecilius, Metella, Grumio, Clemens).
- German cases, genders (der, die, das), modal verbs (möchte, kann, muss), and sentence word order (verb in second position, time-manner-place).
Keep responses clear, concise, well-formatted, and encouraging. Never be condescending. Use bullet points for grammar comparisons.`,
          }
        });

        const response = await chat.sendMessage({ message });
        const reply = response.text || '';
        return res.json({ reply: reply.trim() });
      } catch (genAiError: any) {
        console.error('Gemini chat error:', genAiError);
      }
    }

    // Fallback response if API key is not configured
    const lower = message.toLowerCase();
    let reply = "Hello! I am your Quest Hub Study Tutor. ";
    if (lower.includes('latin') || lower.includes('verb') || lower.includes('laborat') || lower.includes('he') || lower.includes('she') || lower.includes('it')) {
      reply += "In Latin verbs like 'laborat', the '-t' ending indicates 3rd person singular ('he works', 'she works', or 'it works'). Be sure to include one of these pronouns in your English translation!";
    } else if (lower.includes('german') || lower.includes('noun') || lower.includes('gender') || lower.includes('der') || lower.includes('die') || lower.includes('das')) {
      reply += "In German, all nouns are capitalized and have genders: 'der' (masculine), 'die' (feminine), and 'das' (neuter). In the accusative case (direct object), 'der' changes to 'den', while 'die' and 'das' remain the same!";
    } else {
      reply += "I'm here to help you master your German Module 2 and Cambridge Latin vocabulary and grammar. What specific word, tense, or unit would you like help with?";
    }

    return res.json({ reply });
  } catch (error: any) {
    console.error('Server error in /api/ai/chat:', error);
    res.status(500).json({ error: 'Could not process chat message.' });
  }
});

// Production vs Development serving
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
} else {
  // Mount Vite middlewares in development
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
}

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`Quest Hub server listening on port ${PORT}`);
});
