import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import axios from 'axios';
import { Send, ChevronLeft, ShieldAlert } from 'lucide-react';
import { useAuth, API } from '../context/AuthContext';

let socket;

export default function Chat() {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [matchInfo, setMatchInfo] = useState(null);
  const bottomRef = useRef(null);
  const typingTimeout = useRef(null);

  // Init socket + fetch history
  useEffect(() => {
    socket = io(API);
    socket.emit('joinRoom', matchId);

    socket.on('receiveMessage', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    socket.on('typing', () => {
      setIsTyping(true);
      clearTimeout(typingTimeout.current);
      typingTimeout.current = setTimeout(() => setIsTyping(false), 1500);
    });

    // Load history
    axios.get(`${API}/api/messages/${matchId}`)
      .then(({ data }) => setMessages(data))
      .catch(() => {});

    // Load match info
    axios.get(`${API}/api/matches`)
      .then(({ data }) => {
        const match = data.find(m => m._id === matchId);
        if (match) {
          const other = match.users.find(u => u._id !== user?.id && u._id !== user?._id);
          setMatchInfo({ match, other });
        }
      }).catch(() => {});

    return () => { socket.disconnect(); };
  }, [matchId, user]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = async () => {
    if (!text.trim()) return;
    setError('');
    try {
      await axios.post(`${API}/api/messages/${matchId}`, { text });
      socket.emit('sendMessage', { matchId, senderId: user?.id || user?._id, text });
      setText('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    socket.emit('typing', { matchId, userId: user?.id });
  };

  const myId = user?.id || user?._id;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--bg)', paddingTop: 65 }}>
      {/* Header */}
      <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', background: 'rgba(9,9,11,0.85)', backdropFilter: 'blur(16px)', display: 'flex', alignItems: 'center', gap: 16 }}>
        <button className="btn-ghost" style={{ padding: 8, borderRadius: '50%', display: 'flex' }} onClick={() => navigate('/matches')}>
          <ChevronLeft size={20} />
        </button>
        {matchInfo?.other && (
          <>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg,var(--accent),var(--accent2))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#fff', boxShadow: '0 2px 10px rgba(244,63,94,0.3)' }}>
              {matchInfo.other.name[0].toUpperCase()}
            </div>
            <div>
              <p style={{ fontWeight: 600, fontSize: '1.05rem' }}>{matchInfo.other.name}</p>
              <p style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>{matchInfo.other.branch} • {matchInfo.other.year && `Year ${matchInfo.other.year}`}</p>
            </div>
          </>
        )}
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: 16, position: 'relative' }}>
        
        {/* Background Mesh (subtle) */}
        <div style={{ position: 'fixed', inset: 0, zIndex: 0, opacity: 0.5, pointerEvents: 'none', background: 'radial-gradient(circle at 50% 50%, rgba(244,63,94,0.05), transparent 70%)' }} />

        <div style={{ zIndex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {messages.length === 0 && (
            <div className="card" style={{ alignSelf: 'center', textAlign: 'center', padding: '32px 24px', marginTop: 40, maxWidth: 340 }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: 16, borderRadius: '50%' }}>
                  <MessageCircle size={32} color="var(--muted)" />
                </div>
              </div>
              <p style={{ fontWeight: 600, marginBottom: 8 }}>Say Hello!</p>
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: 16 }}>Start the conversation with {matchInfo?.other?.name}.</p>
              
              {matchInfo?.match && !matchInfo.match.femaleInitiated && user?.gender !== 'female' && (
                <div style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)', padding: '12px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 8, textAlign: 'left' }}>
                  <ShieldAlert size={20} color="var(--accent)" flexShrink={0} />
                  <p style={{ color: 'var(--accent)', fontSize: '0.8rem', fontWeight: 500 }}>Women-first rule: Only she can send the first message in this match.</p>
                </div>
              )}
            </div>
          )}

          {messages.map((msg, i) => {
            const isMine = String(msg.senderId) === String(myId);
            return (
              <div key={msg._id} style={{ display: 'flex', justifyContent: isMine ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '75%', padding: '12px 18px', 
                  borderRadius: isMine ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                  background: isMine ? 'linear-gradient(135deg, var(--accent), var(--accent2))' : 'rgba(24, 24, 27, 0.8)',
                  border: isMine ? 'none' : '1px solid var(--border)',
                  color: isMine ? '#fff' : 'var(--text)',
                  fontSize: '0.95rem', lineHeight: 1.5,
                  boxShadow: isMine ? '0 4px 12px rgba(244,63,94,0.2)' : '0 4px 12px rgba(0,0,0,0.2)'
                }}>
                  {msg.text}
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div style={{ display: 'flex', gap: 6, padding: '12px 18px', background: 'rgba(24, 24, 27, 0.8)', border: '1px solid var(--border)', borderRadius: '20px 20px 20px 4px', width: 'fit-content', alignItems: 'center' }}>
              {[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--muted)', animation: `bounce 1s ${i * 0.2}s infinite` }} />)}
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>

      {/* Input */}
      <div style={{ padding: '20px 24px', borderTop: '1px solid var(--border)', background: 'rgba(9,9,11,0.85)', backdropFilter: 'blur(16px)', zIndex: 10 }}>
        {error && <p className="error-msg" style={{ marginBottom: 12 }}>{error}</p>}
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', maxWidth: 800, margin: '0 auto' }}>
          <input id="chat-input" value={text} onChange={e => setText(e.target.value)} onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            style={{
              flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)',
              borderRadius: 24, padding: '14px 20px', color: 'var(--text)', fontFamily: 'inherit',
              fontSize: '0.95rem', outline: 'none', transition: 'all 0.2s'
            }} 
            onFocus={e => { e.target.style.background='rgba(255,255,255,0.08)'; e.target.style.borderColor='var(--accent)'; }}
            onBlur={e => { e.target.style.background='rgba(255,255,255,0.05)'; e.target.style.borderColor='var(--border)'; }}
          />
          <button id="btn-send" className="btn-primary" onClick={sendMessage} 
            style={{ padding: '14px', borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}>
            <Send size={20} fill="currentColor" />
          </button>
        </div>
      </div>
    </div>
  );
}
