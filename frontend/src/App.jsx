import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
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
    <div className="app">
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
    </div>
  );
}

export default App;
