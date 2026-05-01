import { useNavigate } from 'react-router-dom';
import { LogOut, Edit3, Mail, BookOpen, Clock, User as UserIcon, Settings2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const BRANCH_LABELS = { CSE:'Computer Science', ISE:'Information Science', ECE:'Electronics', EEE:'Electrical', MECH:'Mechanical', CIVIL:'Civil', AIDS:'AI & Data Science', AIML:'AI & ML' };

export default function Settings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingTop: 100, paddingBottom: 40, paddingInline: 24 }}>
      <div style={{ maxWidth: 500, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
          <Settings2 size={28} color="var(--accent)" />
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Settings</h1>
        </div>

        {user && (
          <div className="card" style={{ padding: '32px', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 32 }}>
              <div style={{ 
                width: 72, height: 72, borderRadius: '50%', 
                background: 'linear-gradient(135deg, var(--accent), var(--accent2))', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                fontSize: '2rem', fontWeight: 700, color: '#fff',
                boxShadow: '0 8px 24px rgba(244, 63, 94, 0.4)',
                border: '4px solid rgba(255,255,255,0.1)'
              }}>
                {user.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <p style={{ fontWeight: 800, fontSize: '1.4rem', letterSpacing: '-0.02em', marginBottom: 4 }}>{user.name}</p>
                <p style={{ color: 'var(--muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Mail size={14} /> {user.email}
                </p>
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                ['Branch', BRANCH_LABELS[user.branch] || user.branch, BookOpen],
                ['Year', user.year ? `Year ${user.year}` : '—', Clock],
                ['Gender', user.gender, UserIcon],
                ['Mode', user.mode, Settings2],
              ].map(([label, val, Icon]) => (
                <div key={label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: 16, padding: '16px' }}>
                  <p style={{ color: 'var(--muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Icon size={12} /> {label}
                  </p>
                  <p style={{ fontWeight: 600, fontSize: '1rem', textTransform: 'capitalize', color: 'var(--text)' }}>{val || '—'}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="card" style={{ padding: '8px', marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button id="btn-edit-profile" className="btn-ghost" style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', borderRadius: 12, border: 'none', background: 'transparent' }}
            onClick={() => navigate('/profile-setup')}>
            <Edit3 size={18} color="var(--accent)" /> 
            <span style={{ fontWeight: 500 }}>Edit Profile & Interests</span>
          </button>
        </div>

        <div className="card" style={{ padding: '8px' }}>
          <button id="btn-logout" className="btn-ghost" style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', borderRadius: 12, border: 'none', background: 'transparent', color: 'var(--red)' }} onClick={handleLogout}>
            <LogOut size={18} /> 
            <span style={{ fontWeight: 500 }}>Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
