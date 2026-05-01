import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Target, Users, Briefcase, Heart, Tag, ArrowRight } from 'lucide-react';
import { useAuth, API } from '../context/AuthContext';

const INTERESTS = ['Music','Movies','Gaming','Travel','Fitness','Reading','Coding','Food','Art','Sports','Memes','Photography', 'Fashion', 'Anime', 'Tech'];

export default function ProfileSetup() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ interests: [], mode: 'dating', bio: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleInterest = (tag) => {
    setForm(f => ({
      ...f,
      interests: f.interests.includes(tag)
        ? f.interests.filter(i => i !== tag)
        : [...f.interests, tag]
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await axios.put(`${API}/api/users/profile`, form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page" style={{ padding: '40px 24px' }}>
      <div className="card" style={{ width: '100%', maxWidth: 520, padding: '48px 40px', position: 'relative', overflow: 'hidden' }}>
        
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
             <div style={{ background: 'rgba(255,255,255,0.05)', padding: 12, borderRadius: 16, border: '1px solid var(--border)' }}>
               <Target size={28} color="var(--accent)" />
             </div>
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, marginBottom: 8, background: 'linear-gradient(135deg, var(--text), var(--muted))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Set Up Your Profile
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>Welcome, <span style={{ color: 'var(--text)', fontWeight: 600 }}>{user?.name}</span>! Tell people about yourself.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 32, position: 'relative', zIndex: 1 }}>
          
          {/* Mode Selection */}
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}><Users size={14}/> What are you looking for?</label>
            <div style={{ display: 'flex', gap: 12 }}>
              {[
                { id: 'dating', label: 'Dating', icon: Heart },
                { id: 'bff',    label: 'BFF',    icon: Users },
                { id: 'bizz',   label: 'Bizz',   icon: Briefcase }
              ].map(m => {
                const isActive = form.mode === m.id;
                return (
                  <button key={m.id} type="button"
                    onClick={() => setForm(f => ({ ...f, mode: m.id }))}
                    style={{
                      flex: 1, padding: '16px 12px', borderRadius: 16,
                      background: isActive ? 'linear-gradient(135deg, var(--accent), var(--accent2))' : 'rgba(255,255,255,0.03)',
                      border: isActive ? '1px solid transparent' : '1px solid var(--border)',
                      color: isActive ? '#fff' : 'var(--muted)',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                      cursor: 'pointer', transition: 'all 0.2s',
                      boxShadow: isActive ? '0 8px 24px rgba(244, 63, 94, 0.3)' : 'none'
                    }}
                    onMouseEnter={e => !isActive && (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
                    onMouseLeave={e => !isActive && (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                  >
                    <m.icon size={24} />
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{m.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Interests */}
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}><Tag size={14}/> Interests</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {INTERESTS.map(tag => {
                const isActive = form.interests.includes(tag);
                return (
                  <button key={tag} type="button"
                    onClick={() => toggleInterest(tag)}
                    style={{
                      padding: '8px 16px', borderRadius: 20, fontSize: '0.85rem', fontWeight: 500,
                      cursor: 'pointer', border: '1px solid',
                      background: isActive ? 'rgba(244, 63, 94, 0.15)' : 'rgba(255,255,255,0.03)',
                      borderColor: isActive ? 'var(--accent)' : 'var(--border)',
                      color: isActive ? 'var(--accent)' : 'var(--muted)',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => !isActive && (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
                    onMouseLeave={e => !isActive && (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                  >
                    {tag}
                  </button>
                )
              })}
            </div>
          </div>

          {error && <div className="error-msg" style={{ background: 'rgba(239, 68, 68, 0.1)', padding: 12, borderRadius: 12, border: '1px solid rgba(239, 68, 68, 0.2)', display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
             {error}
          </div>}

          <button className="btn btn-primary" type="submit" disabled={loading} style={{ padding: '16px', marginTop: 16, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
            {loading ? 'Saving...' : <>Save & Continue <ArrowRight size={18} /></>}
          </button>
        </form>
      </div>
    </div>
  );
}
