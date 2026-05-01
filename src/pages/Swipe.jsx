import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Heart, X, Sparkles, MessageCircle } from 'lucide-react';
import { useAuth, API } from '../context/AuthContext';

const CARD_COLORS = ['#f43f5e', '#8b5cf6', '#3b82f6', '#f59e0b', '#10b981'];
const SWIPE_THRESHOLD = 100; // px needed to trigger swipe

export default function Swipe() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [topIdx, setTopIdx] = useState(0);
  const [matchedUser, setMatchedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [gone, setGone] = useState({}); // tracks swiped card ids

  // Drag state
  const dragging = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const [drag, setDrag] = useState({ x: 0, y: 0 }); // live drag offset
  const cardRef = useRef(null);

  useEffect(() => {
    axios.get(`${API}/api/users`)
      .then(({ data }) => { setProfiles(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const current = profiles[topIdx];

  // ── Send like to backend ────────────────────────────────────────
  const doLike = useCallback(async (likedUser) => {
    try {
      const { data } = await axios.post(`${API}/api/matches`, { toUserId: likedUser._id });
      if (data.matched) setMatchedUser(likedUser);
    } catch {}
  }, []);

  // ── Advance to next card ────────────────────────────────────────
  const advance = useCallback((direction, profile) => {
    if (direction === 'right') doLike(profile);
    setGone(g => ({ ...g, [profile._id]: direction }));
    setTimeout(() => {
      setTopIdx(i => i + 1);
      setGone({});
      setDrag({ x: 0, y: 0 });
    }, 350);
  }, [doLike]);

  // ── Button swipe ────────────────────────────────────────────────
  const swipe = (direction) => {
    if (!current) return;
    advance(direction, current);
  };

  // ── Pointer drag handlers ───────────────────────────────────────
  const onPointerDown = (e) => {
    dragging.current = true;
    startX.current = e.clientX ?? e.touches?.[0]?.clientX;
    startY.current = e.clientY ?? e.touches?.[0]?.clientY;
    cardRef.current?.setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!dragging.current) return;
    const x = (e.clientX ?? e.touches?.[0]?.clientX) - startX.current;
    const y = (e.clientY ?? e.touches?.[0]?.clientY) - startY.current;
    setDrag({ x, y });
  };

  const onPointerUp = () => {
    if (!dragging.current) return;
    dragging.current = false;
    if (Math.abs(drag.x) >= SWIPE_THRESHOLD) {
      advance(drag.x > 0 ? 'right' : 'left', current);
    } else {
      // snap back
      setDrag({ x: 0, y: 0 });
    }
  };

  // ── Card transform ──────────────────────────────────────────────
  const getCardStyle = (profile) => {
    const dir = gone[profile._id];
    if (dir) {
      // flying off screen
      return {
        transform: `translate(${dir === 'right' ? '150vw' : '-150vw'}, -30px) rotate(${dir === 'right' ? 30 : -30}deg)`,
        transition: 'transform 0.35s cubic-bezier(0.22,1,0.36,1)',
        opacity: 0,
      };
    }
    if (profile._id === current?._id) {
      const rotate = drag.x * 0.08;
      return {
        transform: `translate(${drag.x}px, ${drag.y * 0.4}px) rotate(${rotate}deg)`,
        transition: dragging.current ? 'none' : 'transform 0.35s cubic-bezier(0.22,1,0.36,1)',
        cursor: dragging.current ? 'grabbing' : 'grab',
        zIndex: 10,
      };
    }
    return { cursor: 'default', zIndex: 5 };
  };

  // ── Overlay indicators ─────────────────────────────────────────
  const likeOpacity = Math.min(drag.x / SWIPE_THRESHOLD, 1);
  const nopeOpacity = Math.min(-drag.x / SWIPE_THRESHOLD, 1);

  if (loading) {
    return (
      <div className="page" style={{ flexDirection: 'column', gap: 16 }}>
        <Sparkles size={32} color="var(--accent)" />
        <p style={{ color: 'var(--muted)' }}>Finding people near you...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', paddingTop: 80, userSelect: 'none', overflow: 'hidden' }}>

      {/* ── Match Popup ── */}
      {matchedUser && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(9,9,11,0.85)', backdropFilter: 'blur(12px)' }}>
          <div className="card" style={{ padding: '48px', textAlign: 'center', maxWidth: 380, width: '90%' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
              <Sparkles color="var(--accent)" size={56} />
            </div>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: 8, background: 'linear-gradient(135deg,var(--accent),var(--accent2))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              It's a Match!
            </h2>
            <p style={{ color: 'var(--muted)', marginBottom: 32, fontSize: '1rem' }}>
              You and <strong style={{ color: 'var(--text)' }}>{matchedUser.name}</strong> liked each other!
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button className="btn btn-primary" onClick={() => { setMatchedUser(null); navigate('/matches'); }}>
                <MessageCircle size={18} style={{ display: 'inline', marginRight: 8, verticalAlign: 'middle' }} />
                Say Hello
              </button>
              <button className="btn btn-ghost" onClick={() => setMatchedUser(null)}>Keep Swiping</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Card Stack ── */}
      <div style={{ position: 'relative', width: 340, height: 520 }}>
        {!current ? (
          <div className="card" style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 32 }}>
            <Sparkles size={40} color="var(--muted)" style={{ marginBottom: 16 }} />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 8 }}>You're all caught up!</h2>
            <p style={{ color: 'var(--muted)', lineHeight: 1.6 }}>Check back later for new profiles.</p>
          </div>
        ) : (
          <>
            {/* Next card peek (behind) */}
            {profiles[topIdx + 1] && (
              <div style={{
                position: 'absolute', inset: 0,
                borderRadius: 28,
                background: (() => {
                  const p = profiles[topIdx + 1];
                  return p.photos?.length > 0 ? `url(${p.photos[0]}) center/cover no-repeat` : `linear-gradient(160deg, ${CARD_COLORS[(topIdx + 1) % CARD_COLORS.length]}33, var(--bg2))`;
                })(),
                border: '1px solid var(--border)',
                transform: 'scale(0.94) translateY(16px)',
                zIndex: 4,
                boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
              }} />
            )}

            {/* Top card */}
            <div
              ref={cardRef}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              style={{
                position: 'absolute', inset: 0,
                borderRadius: 28,
                overflow: 'hidden',
                border: '1px solid var(--border)',
                boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
                touchAction: 'none',
                ...getCardStyle(current),
                background: current.photos?.length > 0
                  ? `url(${current.photos[0]}) center/cover no-repeat`
                  : `linear-gradient(160deg, ${CARD_COLORS[topIdx % CARD_COLORS.length]}44, var(--bg2))`,
              }}
            >
              {/* LIKE stamp */}
              <div style={{ position: 'absolute', top: 28, left: 24, padding: '8px 20px', border: '3px solid #10b981', borderRadius: 8, color: '#10b981', fontWeight: 800, fontSize: '1.4rem', letterSpacing: '0.08em', transform: 'rotate(-20deg)', opacity: likeOpacity, transition: 'opacity 0.1s', textShadow: '0 0 12px #10b98177', pointerEvents: 'none' }}>
                LIKE ♥
              </div>

              {/* NOPE stamp */}
              <div style={{ position: 'absolute', top: 28, right: 24, padding: '8px 20px', border: '3px solid var(--accent)', borderRadius: 8, color: 'var(--accent)', fontWeight: 800, fontSize: '1.4rem', letterSpacing: '0.08em', transform: 'rotate(20deg)', opacity: nopeOpacity, transition: 'opacity 0.1s', textShadow: '0 0 12px rgba(244,63,94,0.5)', pointerEvents: 'none' }}>
                NOPE ✕
              </div>

              {/* Fallback avatar (no photo) */}
              {(!current.photos || current.photos.length === 0) && (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: 140, height: 140, borderRadius: '50%', background: CARD_COLORS[topIdx % CARD_COLORS.length], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem', fontWeight: 700, color: '#fff', boxShadow: `0 0 40px ${CARD_COLORS[topIdx % CARD_COLORS.length]}66` }}>
                    {current.name[0].toUpperCase()}
                  </div>
                </div>
              )}

              {/* Gradient overlay + info */}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(9,9,11,0.95) 50%, transparent)', padding: '80px 24px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em' }}>{current.name}</h2>
                  <span style={{ color: 'var(--accent)', fontSize: '0.9rem', fontWeight: 600 }}>{current.year && `Year ${current.year}`}</span>
                </div>
                <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: 12 }}>
                  <span style={{ background: 'rgba(255,255,255,0.12)', padding: '2px 8px', borderRadius: 6, color: 'var(--text)' }}>{current.branch}</span>
                  &nbsp;• <span style={{ textTransform: 'capitalize' }}>{current.mode}</span>
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {(current.interests || []).slice(0, 4).map(tag => (
                    <span key={tag} style={{ padding: '4px 10px', borderRadius: 20, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', fontSize: '0.78rem', color: 'var(--muted)' }}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── Action Buttons ── */}
      <div style={{ display: 'flex', gap: 28, marginTop: 36 }}>
        <button
          id="btn-pass"
          onClick={() => swipe('left')}
          disabled={!current}
          style={{
            width: 68, height: 68, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(239,68,68,0.1)', border: '2px solid rgba(239,68,68,0.35)',
            cursor: current ? 'pointer' : 'not-allowed', opacity: current ? 1 : 0.4,
            transition: 'all 0.2s cubic-bezier(0.34,1.56,0.64,1)',
            fontSize: '1rem',
          }}
          onMouseEnter={e => { if (current) { e.currentTarget.style.transform='scale(1.12)'; e.currentTarget.style.background='rgba(239,68,68,0.2)'; e.currentTarget.style.boxShadow='0 0 24px rgba(239,68,68,0.3)'; }}}
          onMouseLeave={e => { e.currentTarget.style.transform='scale(1)'; e.currentTarget.style.background='rgba(239,68,68,0.1)'; e.currentTarget.style.boxShadow='none'; }}
        >
          <X size={30} color="#ef4444" strokeWidth={3} />
        </button>

        <button
          id="btn-like"
          onClick={() => swipe('right')}
          disabled={!current}
          style={{
            width: 76, height: 76, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
            border: 'none',
            cursor: current ? 'pointer' : 'not-allowed', opacity: current ? 1 : 0.4,
            transition: 'all 0.2s cubic-bezier(0.34,1.56,0.64,1)',
            boxShadow: '0 8px 30px rgba(244,63,94,0.4)',
          }}
          onMouseEnter={e => { if (current) { e.currentTarget.style.transform='scale(1.12)'; e.currentTarget.style.boxShadow='0 12px 40px rgba(244,63,94,0.5)'; }}}
          onMouseLeave={e => { e.currentTarget.style.transform='scale(1)'; e.currentTarget.style.boxShadow='0 8px 30px rgba(244,63,94,0.4)'; }}
        >
          <Heart size={32} color="white" fill="white" />
        </button>
      </div>

    </div>
  );
}
