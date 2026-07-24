import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Home,
  Compass,
  Bell,
  Bookmark,
  User,
  LogOut,
  Sun,
  Moon,
  Share2,
  PlusSquare,
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ onOpenCreateModal }) => {
  const { user, logout, unreadNotifications } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand" onClick={() => navigate('/')}>
        <div className="sidebar-logo">
          <Share2 size={24} color="#ffffff" />
        </div>
        <span className="sidebar-title">ConnectHub</span>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Home size={20} />
          <span>Home</span>
        </NavLink>

        <NavLink to="/explore" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Compass size={20} />
          <span>Explore</span>
        </NavLink>

        <NavLink to="/notifications" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <div className="nav-icon-wrapper">
            <Bell size={20} />
            {unreadNotifications > 0 && (
              <span className="badge-count">{unreadNotifications > 99 ? '99+' : unreadNotifications}</span>
            )}
          </div>
          <span>Notifications</span>
        </NavLink>

        <NavLink to="/bookmarks" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Bookmark size={20} />
          <span>Bookmarks</span>
        </NavLink>

        {user && (
          <NavLink
            to={`/profile/${user.username}`}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <User size={20} />
            <span>Profile</span>
          </NavLink>
        )}
      </nav>

      {onOpenCreateModal && (
        <button className="btn btn-primary sidebar-post-btn" onClick={onOpenCreateModal}>
          <PlusSquare size={18} />
          <span>New Post</span>
        </button>
      )}

      <div className="sidebar-footer">
        <button
          className="theme-switch-btn"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
        </button>

        {user && (
          <div className="user-profile-widget">
            <img
              src={user.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=4F46E5&color=fff`}
              alt={user.name}
              className="user-avatar"
            />
            <div className="user-info">
              <span className="user-name">{user.name}</span>
              <span className="user-username">@{user.username}</span>
            </div>
            <button className="logout-btn" onClick={handleLogout} title="Logout">
              <LogOut size={18} />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
