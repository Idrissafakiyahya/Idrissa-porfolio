import React, { useState, useEffect } from 'react';
import { useFetch } from '../hooks/useFetch';
import { profileAPI } from '../services/api';
import '../styles/navbar.css';

const navItems = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'testimonials', label: 'Testimonials' },
  { id: 'contact', label: 'Contact' },
];

const SunIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="5" />
    <g>
      <path d="M12 2v2.5M12 19.5V22M4.93 4.93l1.77 1.77M17.3 17.3l1.77 1.77M2 12h2.5M19.5 12H22M4.93 19.07l1.77-1.77M17.3 6.7l1.77-1.77" />
    </g>
  </svg>
);

const MoonIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z" />
  </svg>
);

const Navbar = ({ onThemeToggle, isDarkMode }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('about');
  const { data: profile } = useFetch(() => profileAPI.getProfile());

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY + 160;
      let current = 'about';

      for (const item of navItems) {
        const section = document.getElementById(item.id);
        if (section && offset >= section.offsetTop) {
          current = item.id;
        }
      }

      setActiveSection(current);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(id);
      setMobileMenuOpen(false);
    }
  };

  const profileImage = profile?.profile_photo || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80';

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <a href="#hero" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>
            <img
              src={profileImage}
              alt={profile?.full_name || 'Idrissa'}
              className="logo-avatar"
            />
            <span className="logo-name">Idrissa</span>
          </a>
        </div>

        <ul className={`nav-menu ${mobileMenuOpen ? 'active' : ''}`}>
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => scrollToSection(item.id)}
                className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        <button
          className="theme-toggle"
          onClick={onThemeToggle}
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? <MoonIcon /> : <SunIcon />}
        </button>

        <button
          className={`hamburger ${mobileMenuOpen ? 'active' : ''}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
