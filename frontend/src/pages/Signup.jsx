import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import api from '../api';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [role, setRole] = useState('member');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const strength = (() => { let s=0; if(password.length>=6)s++; if(password.length>=8)s++; if(/[A-Z]/.test(password))s++; if(/[0-9]/.test(password))s++; if(/[^A-Za-z0-9]/.test(password))s++; return s; })();
  const sLabel = ['','Weak','Fair','Good','Strong','Excellent'][strength];
  const sColor = ['','#ef4444','#f59e0b','#f59e0b','#10b981','#10b981'][strength];

  const handleSignup = async (e) => {
    e.preventDefault(); setError('');
    if (!name || !email || !password) { setError('Please fill in all fields'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      await api.post('/users/register', { name, role });
      navigate('/dashboard');
    } catch (err) {
      const msgs = { 'auth/email-already-in-use': 'Email already exists', 'auth/invalid-email': 'Invalid email', 'auth/weak-password': 'Password too weak' };
      setError(msgs[err.code] || err.response?.data?.error || 'Failed to create account');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-left-img"><img src="/images/auth-hero.png" alt="TeamFlow" /></div>
        <h2>TeamFlow makes teamwork flow.</h2>
        <p>Create, assign, and track tasks with your team.</p>
      </div>
      <div className="auth-right">
        <div className="auth-container" id="signup-container">
          <div className="auth-brand"><div><div className="auth-brand-name">TeamFlow</div><div className="auth-brand-sub">Create workspace</div></div></div>
          <h1>Sign up</h1>
          <form onSubmit={handleSignup} id="signup-form">
            {error && <div className="alert alert-error" id="signup-error">{error}</div>}
            <div className="form-group"><label>Full Name</label><input type="text" id="signup-name" placeholder="John Doe" value={name} onChange={e=>setName(e.target.value)} disabled={loading}/></div>
            <div className="form-group"><label>Email</label><input type="email" id="signup-email" placeholder="you@company.com" value={email} onChange={e=>setEmail(e.target.value)} disabled={loading}/></div>
            <div className="form-group">
              <label>Password</label>
              <div className="input-wrapper">
                <input type={showPass?'text':'password'} id="signup-password" placeholder="Min 6 characters" value={password} onChange={e=>setPassword(e.target.value)} disabled={loading} style={{paddingLeft:'.8rem'}}/>
                <button type="button" className="input-toggle" onClick={()=>setShowPass(!showPass)} tabIndex={-1}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
              </div>
              {password && <div className="password-strength"><div className="strength-bars">{[1,2,3,4,5].map(i=><div key={i} className="strength-bar" style={{background:i<=strength?sColor:'var(--border)'}}/>)}</div><span className="strength-label" style={{color:sColor}}>{sLabel}</span></div>}
            </div>
            <div className="form-group"><label>Role</label><select id="signup-role" value={role} onChange={e=>setRole(e.target.value)} disabled={loading}><option value="member">Member</option><option value="admin">Admin</option></select></div>
            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading} id="btn-signup">
              {loading ? <><span className="spinner-sm"></span>Creating...</> : 'Create Account'}
            </button>
          </form>
          <p className="auth-footer">Already have an account? <Link to="/login" id="link-login">Log in</Link></p>
        </div>
      </div>
    </div>
  );
}
