import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [form, setForm]   = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Paytone+One&family=Fredoka:wght@700&family=Inter:wght@400;500;600;700&display=swap');

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

        /* ── Header ── */
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

        /* ── Layout ── */
        .login-content {
          display: flex;
          flex: 1;
          gap: 64px;
        }

        /* ── Left Side Image ── */
        .login-hero-container {
          flex: 1;
          background: #d4f434 url('/login_hero.png') center/cover no-repeat;
          border-radius: 32px;
          min-height: 600px;
        }

        /* ── Right Side Form ── */
        .login-form-side {
          width: 480px;
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
          margin-bottom: 40px;
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
          gap: 24px;
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

        .login-forgot {
          font-size: 0.95rem;
          color: #fff;
          font-weight: 500;
          margin-top: -8px;
        }

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
          .login-hero-container { min-height: 300px; }
          .login-form-side { width: 100%; padding-right: 0; }
        }
      `}</style>

      {/* Header */}
      <header className="login-header">
        <div className="login-brand">
          {/* Flower logo SVG */}
          <svg className="login-logo" viewBox="0 0 100 100" fill="currentColor">
            <path d="M50 0 C60 25, 75 40, 100 50 C75 60, 60 75, 50 100 C40 75, 25 60, 0 50 C25 40, 40 25, 50 0 Z" />
            <circle cx="50" cy="50" r="10" fill="#000" />
          </svg>
          <span className="login-brand-text">bmsit connect</span>
        </div>
        <div className="login-nav-text">LOG IN</div>
      </header>

      {/* Main Layout */}
      <main className="login-content">
        
        {/* Left Side: Lime Green Hero Image */}
        <div className="login-hero-container" />

        {/* Right Side: Form */}
        <div className="login-form-side">
          <button className="btn-back" onClick={() => navigate('/')}>
            <div className="btn-back-icon-wrapper">
              <ArrowLeft size={16} strokeWidth={3} />
            </div>
            BACK TO HOME
          </button>

          <h1 className="login-title">Log in</h1>
          <p className="login-subtitle">
            Don't have an account? <Link to="/register" className="login-link">Sign up</Link>
          </p>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-field">
              <label className="login-label">Email</label>
              <input 
                type="email" 
                name="email"
                className="login-input" 
                placeholder="Enter your e-mail address" 
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="login-field">
              <label className="login-label">Password</label>
              <input 
                type="password" 
                name="password"
                className="login-input" 
                placeholder="Enter your password" 
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <p className="login-forgot">
              Forgot your password? <a href="#" className="login-link">Reset it</a>
            </p>

            {error && <div className="login-error">{error}</div>}

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'LOGGING IN...' : 'LOGIN'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
