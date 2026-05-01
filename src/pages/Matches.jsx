import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MessageCircle, Heart, Clock } from 'lucide-react';
import { useAuth, API } from '../context/AuthContext';

export default function Matches() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/api/matches`).then(({ data }) => {
      setMatches(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const getOtherUser = (match) =>
    match.users.find(u => u._id !== user?.id && u._id !== user?._id);

  if (loading) return <div className="page"><p style={{ color: 'var(--muted)' }}>Loading matches...</p></div>;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingTop: 100, paddingBottom: 40, paddingInline: 24 }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <Heart size={28} color="var(--accent)" fill="var(--accent)" />
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Your Matches</h1>
        </div>
        <p style={{ color: 'var(--muted)', marginBottom: 32, fontSize: '0.95rem' }}>
          {matches.length === 0 ? 'No matches yet — keep swiping!' : `You have ${matches.length} connection${matches.length > 1 ? 's' : ''}`}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {matches.map(match => {
            const other = getOtherUser(match);
            if (!other) return null;
            return (
              <div key={match._id} id={`match-${match._id}`}
                onClick={() => navigate(`/chat/${match._id}`)}
                className="card"
                style={{ 
                  display: 'flex', alignItems: 'center', gap: 16, padding: '20px', 
                  cursor: 'pointer', transition: 'all 0.2s',
                  background: 'rgba(24, 24, 27, 0.4)'
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor='var(--accent)'; e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.background='rgba(24, 24, 27, 0.8)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.transform='none'; e.currentTarget.style.background='rgba(24, 24, 27, 0.4)'; }}>
                
                <div style={{ 
                  width: 56, height: 56, borderRadius: '50%', 
                  background: 'linear-gradient(135deg, var(--accent), var(--accent2))', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  fontSize: '1.4rem', fontWeight: 700, color: '#fff', flexShrink: 0,
                  boxShadow: '0 4px 12px rgba(244, 63, 94, 0.3)'
                }}>
                  {other.name[0].toUpperCase()}
                </div>
                
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 600, fontSize: '1.05rem', marginBottom: 4 }}>{other.name}</p>
                  <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{other.branch} • {other.year && `Year ${other.year}`}</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                  {!match.femaleInitiated && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(244, 63, 94, 0.1)', padding: '4px 8px', borderRadius: 12, border: '1px solid rgba(244, 63, 94, 0.2)' }}>
                      <Clock size={12} color="var(--accent)" />
                      <span style={{ fontSize: '0.7rem', color: 'var(--accent)', fontWeight: 500 }}>Waiting</span>
                    </div>
                  )}
                  <MessageCircle size={20} color="var(--muted)" style={{ opacity: 0.5 }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
