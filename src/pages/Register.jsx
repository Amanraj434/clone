import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const BRANCHES = ['CSE','ISE','ECE','EEE','MECH','CIVIL','AIDS','AIML'];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name:'', email:'', password:'', gender:'', branch:'', year:'' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await register({ ...form, year: Number(form.year) });
      navigate('/profile-setup');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <style>{`
        .login-wrapper {
          min-height: 100vh;
          background-color: #000;
          color: #fff;
          font-family: 'Inter', sans-serif;
          display: flex;
          flex-direction: column;
          padding: 24px;
          box-sizing: border-box;
        }

        .login-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 16px 32px 16px;
        }

        .login-brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .login-logo {
          width: 48px;
          height: 48px;
          color: #fa58c6;
        }

        .login-brand-text {
          font-family: 'Fredoka', sans-serif;
          font-size: 2.5rem;
          font-weight: 700;
          color: #fa58c6;
          letter-spacing: -0.05em;
        }

        .login-nav-text {
          font-weight: 700;
          font-size: 1.1rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .login-content {
          display: flex;
          flex: 1;
          gap: 64px;
        }

        .login-hero-container {
          flex: 1;
          background: #d4f434 url('/login_hero.png') center/cover no-repeat;
          border-radius: 32px;
          min-height: 600px;
        }

        .login-form-side {
          width: 520px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding-right: 32px;
        }

        .btn-back {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #333333;
          color: #fff;
          border: none;
          padding: 10px 20px 10px 14px;
          border-radius: 30px;
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          width: fit-content;
          margin-bottom: 24px;
          transition: background 0.2s;
        }

        .btn-back:hover { background: #444; }

        .btn-back-icon-wrapper {
          background: #fa58c6;
          color: #000;
          border-radius: 50%;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .login-title {
          font-family: 'Paytone One', sans-serif;
          font-size: 4rem;
          line-height: 1.1;
          margin-bottom: 12px;
          letter-spacing: -0.02em;
        }

        .login-subtitle {
          font-size: 1.1rem;
          color: #fff;
          margin-bottom: 32px;
          font-weight: 500;
        }

        .login-link {
          color: #fa58c6;
          text-decoration: none;
          font-weight: 600;
        }
        .login-link:hover { text-decoration: underline; }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .login-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .login-label {
          color: #888;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .login-input {
          background: #1c1c1c;
          border: none;
          border-radius: 12px;
          padding: 18px 20px;
          color: #fff;
          font-family: 'Inter', sans-serif;
          font-size: 1rem;
          outline: none;
          transition: background 0.2s;
          width: 100%;
          box-sizing: border-box;
        }
        
        select.login-input {
          appearance: none;
        }

        .login-input::placeholder { color: #555; }
        .login-input:focus { background: #262626; box-shadow: 0 0 0 2px #fa58c644; }

        .btn-submit {
          background: #fa58c6;
          color: #000;
          border: none;
          border-radius: 30px;
          padding: 20px;
          font-family: 'Inter', sans-serif;
          font-size: 1.1rem;
          font-weight: 700;
          cursor: pointer;
          margin-top: 16px;
          transition: transform 0.1s, filter 0.2s;
        }
        .btn-submit:hover { filter: brightness(1.1); }
        .btn-submit:active { transform: scale(0.98); }

        .login-error {
          background: rgba(250, 88, 198, 0.1);
          color: #fa58c6;
          padding: 12px;
          border-radius: 8px;
          border: 1px solid rgba(250, 88, 198, 0.3);
          font-size: 0.9rem;
          text-align: center;
        }

        @media (max-width: 900px) {
          .login-content { flex-direction: column; }
          .login-hero-container { min-height: 250px; }
          .login-form-side { width: 100%; padding-right: 0; }
        }
      `}</style>

      {/* Header */}
      <header className="login-header">
        <div className="login-brand">
          <svg className="login-logo" viewBox="0 0 100 100" fill="currentColor">
            <path d="M50 0 C60 25, 75 40, 100 50 C75 60, 60 75, 50 100 C40 75, 25 60, 0 50 C25 40, 40 25, 50 0 Z" />
            <circle cx="50" cy="50" r="10" fill="#000" />
          </svg>
          <span className="login-brand-text">bmsit connect</span>
        </div>
        <div className="login-nav-text">SIGN UP</div>
      </header>

      {/* Main Layout */}
      <main className="login-content">
        
        {/* Left Side: Lime Green Hero Image */}
        <div className="login-hero-container" />

        {/* Right Side: Form */}
        <div className="login-form-side">
          <button className="btn-back" onClick={() => navigate('/login')}>
            <div className="btn-back-icon-wrapper">
              <ArrowLeft size={16} strokeWidth={3} />
            </div>
            BACK TO LOGIN
          </button>

          <h1 className="login-title">Sign up</h1>
          <p className="login-subtitle">
            Already have an account? <Link to="/login" className="login-link">Log in</Link>
          </p>

          <form className="login-form" onSubmit={handleSubmit}>
            
            <div className="form-grid">
              <div className="login-field">
                <label className="login-label">Full Name</label>
                <input type="text" name="name" className="login-input" placeholder="Your name" value={form.name} onChange={handleChange} required />
              </div>
              
              <div className="login-field">
                <label className="login-label">BMSIT Email</label>
                <input type="email" name="email" className="login-input" placeholder="you@bmsit.in" value={form.email} onChange={handleChange} required />
              </div>
            </div>

            <div className="login-field">
              <label className="login-label">Password</label>
              <input type="password" name="password" className="login-input" placeholder="Min 6 characters" value={form.password} onChange={handleChange} required minLength={6} />
            </div>
            
            <div className="form-grid">
              <div className="login-field">
                <label className="login-label">Gender</label>
                <select name="gender" className="login-input" value={form.gender} onChange={handleChange} required>
                  <option value="" disabled>Select gender</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="login-field">
                <label className="login-label">Year</label>
                <select name="year" className="login-input" value={form.year} onChange={handleChange} required>
                  <option value="" disabled>Select year</option>
                  {[1,2,3,4].map(y => <option key={y} value={y}>{y}{['st','nd','rd','th'][y-1]} Year</option>)}
                </select>
              </div>
            </div>

            <div className="login-field">
              <label className="login-label">Branch</label>
              <select name="branch" className="login-input" value={form.branch} onChange={handleChange} required>
                <option value="" disabled>Select branch</option>
                {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>

            {error && <div className="login-error">{error}</div>}

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
