import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Share2 } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <div className="brand-icon">
            <Share2 size={22} color="#ffffff" />
          </div>
          <span className="brand-title">ConnectHub</span>
          <span className="brand-badge">v1.0</span>
        </div>

        <div className="navbar-actions">
          <button 
            className="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label="Toggle Dark/Light Mode"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
