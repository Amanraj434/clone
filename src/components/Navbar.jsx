import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Flame, Heart, Settings as SettingsIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user } = useAuth();
  const { pathname } = useLocation();

  if (!user) return null;

  const links = [
    { to: '/',        label: 'Discover', icon: Flame },
    { to: '/matches', label: 'Matches',  icon: Heart },
    { to: '/settings',label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <nav className="navbar">
      <span className="navbar-brand">BMSIT Connect</span>
      <div className="navbar-links">
        {links.map(({ to, label, icon: Icon }) => {
          const isActive = pathname === to;
          return (
            <Link key={to} to={to} className={`nav-link${isActive ? ' active' : ''}`}>
              <Icon size={18} color={isActive ? "var(--accent)" : "currentColor"} />
              <span style={{ display: 'none', '@media (min-width: 640px)': { display: 'inline' } }}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
