import React, { useState, useRef, useEffect } from 'react';
import { FaComments, FaTimes, FaPaperPlane, FaBolt, FaRobot, FaUser, FaSpinner } from 'react-icons/fa';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL   = 'llama-3.3-70b-versatile';

const SYSTEM_PROMPT = `You are Aria, the friendly and knowledgeable AI assistant for AI-Solutions — a Sunderland-based AI start-up that delivers intelligent software solutions to businesses globally.

Your role:
- Help visitors understand our AI services: virtual assistants, predictive analytics, document processing, quality control, recommendation engines, and cybersecurity AI
- Answer questions about our past work, events, articles, and gallery
- Encourage interested users to fill out our Contact Us form
- Be concise, professional, warm, and enthusiastic about AI

Key facts about AI-Solutions:
- Based in Sunderland, UK
- 100+ clients worldwide, 98% satisfaction rate, £50M+ in client savings
- 500+ projects delivered across 30+ countries
- Services: AI Virtual Assistant, Predictive Analytics, Automated Quality Control, Intelligent Document Processing, Smart Recommendation Engine, AI-Powered Cybersecurity
- Contact: info@ai-solutions.co.uk | +44 191 000 0000

Keep responses to 2-4 sentences unless a detailed explanation is clearly needed.`;

const WELCOME_MSG = {
  id: 'welcome',
  role: 'assistant',
  content: "👋 Hi! I'm **Aria**, your AI assistant from AI-Solutions. I can answer questions about our services, past work, events, and more. How can I help you today?",
  time: new Date(),
};

const SUGGESTIONS = [
  'What services do you offer?',
  'Tell me about your past projects',
  'How do I contact your team?',
  'What is predictive analytics?',
];

function formatTime(date) {
  return new Date(date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

function MessageBubble({ msg }) {
  const isUser = msg.role === 'user';
  const formatted = msg.content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>');

  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', flexDirection: isUser ? 'row-reverse' : 'row', marginBottom: 16 }}>
      <div style={{
        width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
        background: isUser ? 'rgba(0,184,148,0.15)' : '#00b894',
        border: isUser ? '1px solid rgba(0,184,148,0.3)' : 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 13, color: isUser ? '#00b894' : '#fff',
      }}>
        {isUser ? <FaUser /> : <FaRobot />}
      </div>
      <div style={{ maxWidth: '78%' }}>
        <div style={{
          background: isUser ? '#00b894' : '#f0fdf9',
          border: isUser ? 'none' : '1px solid rgba(0,184,148,0.15)',
          borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
          padding: '10px 14px',
          color: isUser ? '#fff' : '#0d1f1a',
          fontSize: '0.88rem', lineHeight: 1.65,
          boxShadow: isUser ? '0 4px 16px rgba(0,184,148,0.25)' : '0 2px 8px rgba(0,0,0,0.05)',
        }} dangerouslySetInnerHTML={{ __html: formatted }} />
        <div style={{ fontSize: '0.68rem', color: '#8fa89f', marginTop: 4, textAlign: isUser ? 'right' : 'left', paddingLeft: isUser ? 0 : 4 }}>
          {formatTime(msg.time)}
        </div>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', marginBottom: 16 }}>
      <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#00b894', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: '#fff', flexShrink: 0 }}>
        <FaRobot />
      </div>
      <div style={{ background: '#f0fdf9', border: '1px solid rgba(0,184,148,0.15)', borderRadius: '18px 18px 18px 4px', padding: '12px 16px', display: 'flex', gap: 5, alignItems: 'center' }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: '#00b894', animation: `typingDot 1.2s ${i * 0.2}s infinite ease-in-out` }} />
        ))}
      </div>
    </div>
  );
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME_MSG]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 200);
  }, [open]);

  const sendMessage = async (text) => {
    const userText = (text || input).trim();
    if (!userText || loading) return;
    setInput('');

    const userMsg = { id: Date.now(), role: 'user', content: userText, time: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const history = messages
        .filter(m => m.id !== 'welcome')
        .map(m => ({ role: m.role, content: m.content }));

      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...history,
            { role: 'user', content: userText },
          ],
          max_tokens: 300,
          temperature: 0.7,
          stream: false,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData?.error?.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content;
      if (!reply) throw new Error('Empty response from API');

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'assistant',
        content: reply,
        time: new Date(),
      }]);
    } catch (err) {
      console.error('Groq API error:', err.message);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'assistant',
        content: `Sorry, I hit an error: **${err.message}**. Please try again or email us at info@ai-solutions.co.uk`,
        time: new Date(),
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Open chat"
        style={{
          position: 'fixed', bottom: 28, right: 28, zIndex: 9998,
          width: 58, height: 58, borderRadius: '50%',
          background: '#00b894',
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22, color: '#fff',
          boxShadow: '0 6px 28px rgba(0,184,148,0.45)',
          transition: 'all 0.3s ease',
          transform: open ? 'rotate(45deg) scale(0.9)' : 'scale(1)',
        }}
        onMouseEnter={e => { if (!open) e.currentTarget.style.transform = 'scale(1.1)'; }}
        onMouseLeave={e => { if (!open) e.currentTarget.style.transform = open ? 'rotate(45deg) scale(0.9)' : 'scale(1)'; }}
      >
        {open ? <FaTimes /> : <FaComments />}
      </button>

      {/* Green online dot */}
      {!open && (
        <div style={{ position: 'fixed', bottom: 78, right: 26, zIndex: 9999, width: 12, height: 12, borderRadius: '50%', background: '#00b894', border: '2px solid #fff', animation: 'pulse 2s infinite' }} />
      )}

      {/* Chat window */}
      <div style={{
        position: 'fixed', bottom: 100, right: 28, zIndex: 9997,
        width: 380, height: 560,
        background: '#ffffff',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(0,184,148,0.18)',
        borderRadius: 22,
        display: 'flex', flexDirection: 'column',
        boxShadow: '0 20px 70px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,184,148,0.08)',
        overflow: 'hidden',
        transformOrigin: 'bottom right',
        transition: 'all 0.35s cubic-bezier(0.175,0.885,0.32,1.275)',
        transform: open ? 'scale(1) translateY(0)' : 'scale(0.85) translateY(20px)',
        opacity: open ? 1 : 0,
        pointerEvents: open ? 'all' : 'none',
      }}>

        {/* Header */}
        <div style={{
          background: '#0d1f1a',
          padding: '16px 20px',
          display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0,
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: '50%',
            background: 'rgba(0,184,148,0.15)',
            border: '2px solid #00b894',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, color: '#00b894',
          }}>
            <FaBolt />
          </div>
          <div style={{ flexGrow: 1 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1rem', color: '#fff' }}>Aria</div>
            <div style={{ fontSize: '0.74rem', color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: 5 }}>
              AI-Solutions Assistant
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00b894', display: 'inline-block' }} />
                <span style={{ color: '#00b894' }}>Online</span>
              </span>
            </div>
          </div>
          <button onClick={() => setOpen(false)} style={{
            background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 8,
            width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: 13,
            transition: 'all 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
          >
            <FaTimes />
          </button>
        </div>

        {/* Messages */}
        <div style={{
          flexGrow: 1, overflowY: 'auto', padding: '16px 16px 8px',
          background: '#fff',
          scrollbarWidth: 'thin', scrollbarColor: 'rgba(0,184,148,0.2) transparent',
        }}>
          {messages.map(msg => <MessageBubble key={msg.id} msg={msg} />)}
          {loading && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>

        {/* Suggestions */}
        {messages.length <= 1 && !loading && (
          <div style={{ padding: '0 14px 10px', display: 'flex', gap: 6, flexWrap: 'wrap', background: '#fff' }}>
            {SUGGESTIONS.map(s => (
              <button key={s} onClick={() => sendMessage(s)} style={{
                background: '#f0fdf9',
                border: '1px solid rgba(0,184,148,0.25)',
                borderRadius: 999, padding: '5px 12px',
                color: '#007a62',
                fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.72rem',
                cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = '#00b894'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#f0fdf9'; e.currentTarget.style.color = '#007a62'; }}
              >{s}</button>
            ))}
          </div>
        )}

        {/* Input */}
        <div style={{
          padding: '10px 14px 14px',
          borderTop: '1px solid rgba(0,184,148,0.1)',
          background: '#fff',
          flexShrink: 0, display: 'flex', gap: 10, alignItems: 'flex-end',
        }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask me anything about AI-Solutions..."
            rows={1}
            style={{
              flexGrow: 1,
              background: '#f7faf9',
              border: '1.5px solid rgba(0,184,148,0.2)',
              borderRadius: 12, padding: '10px 14px',
              color: '#0d1f1a', fontFamily: 'var(--font-body)',
              fontSize: '0.88rem', resize: 'none', outline: 'none',
              lineHeight: 1.5, maxHeight: 100, overflowY: 'auto',
              transition: 'border-color 0.2s',
            }}
            onFocus={e => e.target.style.borderColor = '#00b894'}
            onBlur={e => e.target.style.borderColor = 'rgba(0,184,148,0.2)'}
            onInput={e => {
              e.target.style.height = 'auto';
              e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px';
            }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            style={{
              width: 42, height: 42, borderRadius: 12, flexShrink: 0,
              background: input.trim() && !loading ? '#00b894' : '#f0fdf9',
              border: '1px solid rgba(0,184,148,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: input.trim() && !loading ? '#fff' : '#8fa89f',
              cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
              fontSize: 15, transition: 'all 0.2s',
              boxShadow: input.trim() && !loading ? '0 4px 16px rgba(0,184,148,0.35)' : 'none',
            }}
          >
            {loading ? <FaSpinner style={{ animation: 'spin 0.8s linear infinite' }} /> : <FaPaperPlane />}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.15);opacity:0.8} }
        @keyframes typingDot { 0%,80%,100%{transform:scale(0.7);opacity:0.5} 40%{transform:scale(1);opacity:1} }
        @media(max-width:480px){
          div[style*="width: 380px"]{width:calc(100vw - 32px)!important;right:16px!important;bottom:90px!important;}
          button[aria-label="Open chat"]{right:16px!important;}
        }
      `}</style>
    </>
  );
}