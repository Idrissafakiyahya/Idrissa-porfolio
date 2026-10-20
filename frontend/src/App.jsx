import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import ProjectDetail from './components/ProjectDetail';
import Experience from './components/Experience';
import Education from './components/Education';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import './styles/globals.css';

const getInitialDarkMode = () => {
  if (typeof window === 'undefined') return false;

  try {
    const saved = window.localStorage.getItem('darkMode');
    if (saved !== null) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.warn('Unable to read dark mode preference:', error);
  }

  if (typeof window.matchMedia === 'function') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  return false;
};

function HomePage({ isDarkMode, toggleTheme }) {
  const location = useLocation();

  useEffect(() => {
    const scrollTarget = location.state?.scrollToProjects || location.state?.scrollToSection;
    if (scrollTarget) {
      setTimeout(() => {
        const section = document.getElementById(scrollTarget);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 120);
    }
  }, [location.state, location.pathname]);

  return (
    <>
      <Navbar onThemeToggle={toggleTheme} isDarkMode={isDarkMode} />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Education />
      <Testimonials />
      <Contact />
      <Footer />
    </>
  );
}

function App() {
  const [isDarkMode, setIsDarkMode] = useState(getInitialDarkMode);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }

    try {
      window.localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    } catch (error) {
      console.warn('Unable to save dark mode preference:', error);
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<HomePage isDarkMode={isDarkMode} toggleTheme={toggleTheme} />} />
          <Route path="/projects/:slug" element={<ProjectDetail isDarkMode={isDarkMode} toggleTheme={toggleTheme} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
