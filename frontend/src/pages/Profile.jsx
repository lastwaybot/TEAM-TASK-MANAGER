import { useAuth } from '../context/AuthContext';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { getColor, getInitials } from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { userProfile, user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const color = getColor(userProfile?.name || user?.email);

  return (
    <div className="page" id="profile-page">
      <div className="page-header">
        <div>
          <h1>My Profile</h1>
          <p className="page-subtitle">Manage your account settings</p>
        </div>
        <button className="btn btn-secondary" onClick={handleLogout} style={{ border: '1px solid var(--danger)', color: 'var(--danger)' }}>
          Log Out
        </button>
      </div>

      <div className="card" style={{ maxWidth: '600px', margin: '0 auto', marginTop: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '2rem 0' }}>
          <div style={{
            width: 100, height: 100, borderRadius: '50%', background: color,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: '2.5rem', fontWeight: 800, marginBottom: '1.5rem',
            boxShadow: `0 0 0 4px ${color}33`
          }}>
            {getInitials(userProfile?.name || user?.email)}
          </div>
          
          <h2 style={{ fontSize: '1.5rem', marginBottom: '.5rem', fontWeight: 800 }}>
            {userProfile?.name || 'Team Member'}
          </h2>
          
          <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
            <span style={{ color: 'var(--text-sec)', fontSize: '.9rem' }}>{user?.email}</span>
            <span className="badge badge-purple">{isAdmin ? 'Admin' : 'Member'}</span>
          </div>

          <div style={{ width: '100%', textAlign: 'left', background: 'var(--surface2)', padding: '1.5rem', borderRadius: 'var(--r)' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '.5rem' }}>Account Details</h3>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.8rem' }}>
              <span style={{ color: 'var(--text-sec)', fontSize: '.85rem' }}>Full Name</span>
              <span style={{ fontWeight: 600, fontSize: '.9rem' }}>{userProfile?.name || 'Not set'}</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.8rem' }}>
              <span style={{ color: 'var(--text-sec)', fontSize: '.85rem' }}>Email Address</span>
              <span style={{ fontWeight: 600, fontSize: '.9rem' }}>{user?.email}</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.8rem' }}>
              <span style={{ color: 'var(--text-sec)', fontSize: '.85rem' }}>Role Level</span>
              <span style={{ fontWeight: 600, fontSize: '.9rem' }}>{isAdmin ? 'Workspace Admin' : 'Workspace Member'}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-sec)', fontSize: '.85rem' }}>Account ID</span>
              <span style={{ fontWeight: 600, fontSize: '.85rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>{user?.uid}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
