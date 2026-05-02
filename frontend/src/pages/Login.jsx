import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all fields'); return; }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err) {
      const msgs = { 'auth/user-not-found': 'No account found', 'auth/wrong-password': 'Incorrect password', 'auth/invalid-email': 'Invalid email', 'auth/invalid-credential': 'Invalid email or password' };
      setError(msgs[err.code] || 'Login failed. Try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-left-img">
          <img src="/images/auth-hero.png" alt="TeamFlow" />
        </div>
        <h2>TeamFlow makes teamwork flow.</h2>
        <p>SSO, invite links, and workspace access in one place.</p>
      </div>
      <div className="auth-right">
        <div className="auth-container" id="login-container">
          <div className="auth-brand">
            <div>
              <div className="auth-brand-name">TeamFlow</div>
              <div className="auth-brand-sub">Workspace sign in</div>
            </div>
          </div>
          <h1>Log in</h1>
          <form onSubmit={handleLogin} id="login-form">
            {error && <div className="alert alert-error" id="login-error">{error}</div>}
            <div className="form-group">
              <label>Email address</label>
              <input type="email" id="login-email" placeholder="team@company.com" value={email} onChange={e => setEmail(e.target.value)} disabled={loading} autoComplete="email" />
            </div>
            <div className="form-group">
              <label>Password</label>
              <div className="input-wrapper">
                <input type={showPass ? 'text' : 'password'} id="login-password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} disabled={loading} autoComplete="current-password" style={{paddingLeft:'.8rem'}} />
                <button type="button" className="input-toggle" onClick={() => setShowPass(!showPass)} tabIndex={-1}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading} id="btn-login">
              {loading ? <><span className="spinner-sm"></span>Logging in...</> : 'Log in'}
            </button>
          </form>
          <p className="auth-footer">Forgot your password? <Link to="/signup" id="link-signup">Create account</Link></p>
        </div>
      </div>
    </div>
  );
}
