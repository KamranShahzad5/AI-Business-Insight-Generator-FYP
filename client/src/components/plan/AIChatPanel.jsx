import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, X, MessageSquare } from 'lucide-react';
import { generateAIReply } from '../../utils/aiEngine';
import clsx from 'clsx';

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-3 py-2">
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.15 }}
          className="w-1.5 h-1.5 rounded-full bg-brand-400"
        />
      ))}
    </div>
  );
}

function MessageContent({ text }) {
  // Simple markdown: **bold**
  const parts = text.split(/(\*\*[^*]+\*\*|\n)/g);
  return (
    <p className="text-xs leading-relaxed">
      {parts.map((part, i) => {
        if (part === '\n') return <br key={i} />;
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="font-semibold text-slate-100">{part.slice(2, -2)}</strong>;
        }
        return <span key={i}>{part}</span>;
      })}
    </p>
  );
}

const QUICK_PROMPTS = [
  'What are the main costs?',
  'Who is my target market?',
  'When will I break even?',
  'What are the biggest risks?',
];

export default function AIChatPanel({ plan, updatePlan }) {
  const [messages, setMessages] = useState(plan.chatHistory || []);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg || typing) return;
    setInput('');

    const userMsg = { id: Date.now(), role: 'user', text: msg, time: new Date().toISOString() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setTyping(true);

    // Simulate AI delay if using mock, real API handles its own delay
    if (!import.meta.env.VITE_GEMINI_API_KEY) {
      const delay = 800 + Math.random() * 1500;
      await new Promise(r => setTimeout(r, delay));
    }

    const reply = await generateAIReply(msg, plan);
    const aiMsg = { id: Date.now() + 1, role: 'ai', text: reply, time: new Date().toISOString() };
    const finalMessages = [...newMessages, aiMsg];
    setMessages(finalMessages);
    updatePlan(plan.id, { chatHistory: finalMessages });
    setTyping(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (collapsed) {
    return (
      <button
        onClick={() => setCollapsed(false)}
        className="flex-shrink-0 self-end mb-4 w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-600 to-accent-600 flex items-center justify-center text-white shadow-glow-md hover:shadow-glow-lg transition-all duration-200"
      >
        <MessageSquare size={20} />
      </button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-80 flex-shrink-0 flex flex-col glass rounded-2xl border border-white/10 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shadow-glow-sm">
            <Bot size={15} className="text-white" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-100">AI Advisor</p>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-slow" />
              <span className="text-[10px] text-emerald-400">Online</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => setCollapsed(true)}
          className="w-7 h-7 rounded-lg hover:bg-white/5 flex items-center justify-center text-slate-500 hover:text-slate-300 transition-all"
        >
          <X size={14} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {/* Welcome */}
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500/20 to-accent-500/20 border border-brand-500/20 flex items-center justify-center mx-auto mb-3">
              <Sparkles size={20} className="text-brand-400" />
            </div>
            <p className="text-xs font-semibold text-slate-200 mb-1">Your AI Business Advisor</p>
            <p className="text-[11px] text-slate-500 leading-relaxed mb-4">
              Ask me anything about costs, market, risks, or your business strategy.
            </p>
            <div className="space-y-2">
              {QUICK_PROMPTS.map((p, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(p)}
                  className="w-full text-left text-[11px] px-3 py-2 rounded-lg bg-white/5 border border-white/5 text-slate-400 hover:bg-brand-500/10 hover:text-brand-300 hover:border-brand-500/20 transition-all duration-200"
                >
                  {p}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Messages */}
        <AnimatePresence initial={false}>
          {messages.map(msg => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={clsx('flex gap-2', msg.role === 'user' ? 'flex-row-reverse' : 'flex-row')}
            >
              <div className={clsx(
                'w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5',
                msg.role === 'user'
                  ? 'bg-gradient-to-br from-brand-500 to-accent-500'
                  : 'bg-gradient-to-br from-slate-700 to-slate-800 border border-white/10'
              )}>
                {msg.role === 'user'
                  ? <User size={11} className="text-white" />
                  : <Bot size={11} className="text-brand-300" />
                }
              </div>
              <div className={clsx(
                'max-w-[85%] rounded-xl px-3 py-2.5',
                msg.role === 'user'
                  ? 'bg-brand-600/20 border border-brand-500/20 text-slate-200 rounded-tr-none'
                  : 'bg-white/5 border border-white/5 text-slate-300 rounded-tl-none'
              )}>
                <MessageContent text={msg.text} />
                <p className="text-[9px] text-slate-600 mt-1.5">
                  {new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing */}
        {typing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2">
            <div className="w-6 h-6 rounded-full flex-shrink-0 bg-slate-800 border border-white/10 flex items-center justify-center">
              <Bot size={11} className="text-brand-300" />
            </div>
            <div className="bg-white/5 border border-white/5 rounded-xl rounded-tl-none">
              <TypingDots />
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick prompts (after messages exist) */}
      {messages.length > 0 && messages.length < 4 && (
        <div className="px-4 pb-2 flex gap-1.5 flex-wrap">
          {QUICK_PROMPTS.slice(0, 2).map((p, i) => (
            <button
              key={i}
              onClick={() => sendMessage(p)}
              className="text-[10px] px-2.5 py-1 rounded-lg bg-brand-500/10 text-brand-400 border border-brand-500/20 hover:bg-brand-500/20 transition-all"
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="p-3 border-t border-white/5 flex-shrink-0">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything..."
            disabled={typing}
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-brand-500/40 focus:border-brand-500/40 transition-all disabled:opacity-50"
          />
          <motion.button
            onClick={() => sendMessage()}
            disabled={!input.trim() || typing}
            whileHover={input.trim() && !typing ? { scale: 1.05 } : {}}
            whileTap={input.trim() && !typing ? { scale: 0.95 } : {}}
            className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white disabled:opacity-40 disabled:cursor-not-allowed shadow-glow-sm hover:shadow-glow-md transition-all"
          >
            <Send size={14} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
