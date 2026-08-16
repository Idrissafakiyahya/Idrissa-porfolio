import React from 'react';
import { useFetch } from '../hooks/useFetch';
import { profileAPI } from '../services/api';
import '../styles/footer.css';

const Footer = () => {
  const { data: profile } = useFetch(() => profileAPI.getProfile());
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="#hero">Home</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#projects">Projects</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Connect</h3>
            <div className="social-links">
              {profile?.github_url && (
                <a href={profile.github_url} target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              )}
              {profile?.linkedin_url && (
                <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
              )}
              {profile?.twitter_url && (
                <a href={profile.twitter_url} target="_blank" rel="noopener noreferrer">
                  Twitter
                </a>
              )}
              {profile?.email && (
                <a href={`mailto:${profile.email}`}>
                  Email
                </a>
              )}
            </div>
          </div>

          <div className="footer-section">
            <h3>About</h3>
            <p>
              {profile?.title} with a passion for building beautiful and functional web experiences.
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {year} {profile?.full_name || 'Portfolio'}. All rights reserved.</p>
          <p className="footer-credit">
            Built with React + Vite | Django + DRF
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
