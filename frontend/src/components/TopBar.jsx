import { useAuth } from '../context/AuthContext';
import { getColor, getInitials } from './Sidebar';
import { Link } from 'react-router-dom';

export default function TopBar() {
  const { userProfile } = useAuth();
  return (
    <div className="topbar" id="topbar">
      <div className="topbar-search">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input type="text" placeholder="Search tasks, projects, people" id="search-input" />
      </div>
      <div className="topbar-right">
        <Link to="/profile" className="topbar-user" style={{ textDecoration: 'none' }}>
          <div className="topbar-user-avatar" style={{ background: getColor(userProfile?.name) }}>
            {getInitials(userProfile?.name)}
          </div>
          <span className="topbar-user-name">Hello, {userProfile?.name?.split(' ')[0] || 'User'}</span>
        </Link>
      </div>
    </div>
  );
}
