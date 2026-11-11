import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, Sparkles, BookOpen, Loader2, RefreshCw } from 'lucide-react';
import { playSound } from '../utils/soundEffects';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AiTutorChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SUGGESTED_QUERIES = [
  'Why do Latin verbs need he, she, or it in translations?',
  'How do German accusative prepositions work in Module 2?',
  'Give me a clever memory trick for "per aspera ad astra"',
  'Explain the 1st conjugation verb endings in Cambridge Latin',
  'What are the key vocabulary patterns in German Schule & Haus?'
];

export const AiTutorChatModal: React.FC<AiTutorChatModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        'Salve! Hallo! I am your Quest Hub AI Study Coach. Ask me any questions about Cambridge Latin Book 1, German Module 2, grammar rules, cases, verb conjugations, or memory tricks!'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query || isLoading) return;

    playSound('click');
    setInputValue('');

    const newMessages: Message[] = [...messages, { role: 'user', content: query }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: newMessages.slice(-6).map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }]
          }))
        })
      });

      if (!response.ok) {
        throw new Error('AI Coach service error');
      }

      const data = await response.json();
      const reply = data.reply || 'I am ready to help with your Latin and German studies. Please ask another question!';

      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
      playSound('correct');
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content:
            'I could not reach the AI tutor engine at this moment. You can still practice all offline decks, or try again in a few moments!'
        }
      ]);
      playSound('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-5">
      <div className="bg-slate-900 border-2 border-indigo-500/60 rounded-3xl p-5 sm:p-6 max-w-2xl w-full shadow-2xl flex flex-col h-[85vh] max-h-[700px]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 flex items-center justify-center font-bold">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase text-indigo-400 tracking-wider">
                  AI Study Coach
                </span>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30 uppercase">
                  Gemini Flash 2.5
                </span>
              </div>
              <h3 className="text-lg font-black text-white">Quest Hub Language Tutor</h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 cursor-pointer transition-colors"
            aria-label="Close AI Tutor"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3.5 pr-1">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white font-medium shadow-md'
                    : 'bg-slate-950 border border-slate-800 text-slate-200 shadow-inner'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-2.5 justify-start">
              <div className="w-7 h-7 rounded-lg bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-slate-400 flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                <span>Formulating grammar explanation...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Queries Chips */}
        {messages.length <= 3 && !isLoading && (
          <div className="py-2 flex gap-1.5 overflow-x-auto no-scrollbar">
            {SUGGESTED_QUERIES.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(q)}
                className="whitespace-nowrap px-3 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-indigo-400/50 rounded-xl text-[11px] font-bold text-slate-300 transition-colors cursor-pointer shrink-0"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="pt-2 border-t border-slate-800 flex gap-2"
        >
          <input
            type="text"
            placeholder="Ask about Latin verbs, German cases, mnemonics..."
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            disabled={isLoading}
            className="flex-1 px-4 py-3 bg-slate-950 border border-slate-800 focus:border-indigo-400 rounded-2xl text-xs text-white placeholder-slate-500 font-bold outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-black text-xs rounded-2xl cursor-pointer shadow-lg transition-colors flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
