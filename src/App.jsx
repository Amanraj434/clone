import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar       from './components/Navbar';
import Login        from './pages/Login';
import Register     from './pages/Register';
import ProfileSetup from './pages/ProfileSetup';
import Swipe        from './pages/Swipe';
import Matches      from './pages/Matches';
import Chat         from './pages/Chat';
import Settings     from './pages/Settings';

// Protected route wrapper
function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',color:'var(--muted)' }}>Loading...</div>;
  return user ? children : <Navigate to="/login" replace />;
}

// Public route (redirect if already logged in)
function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/" replace /> : children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Public */}
          <Route path="/login"    element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

          {/* Protected */}
          <Route path="/profile-setup" element={<PrivateRoute><ProfileSetup /></PrivateRoute>} />
          <Route path="/"              element={<PrivateRoute><Swipe /></PrivateRoute>} />
          <Route path="/matches"       element={<PrivateRoute><Matches /></PrivateRoute>} />
          <Route path="/chat/:matchId" element={<PrivateRoute><Chat /></PrivateRoute>} />
          <Route path="/settings"      element={<PrivateRoute><Settings /></PrivateRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
