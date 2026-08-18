import React from 'react';
import { useFetch } from '../hooks/useFetch';
import { profileAPI } from '../services/api';
import '../styles/about.css';

const About = () => {
  const { data: profile, loading } = useFetch(() => profileAPI.getProfile());

  if (loading) {
    return (
      <section id="about" className="section">
        <div className="container">
          <div className="about-skeleton"></div>
        </div>
      </section>
    );
  }

  if (!profile) return null;

  return (
    <section id="about" className="section">
      <div className="container">
        <div className="section-title">
          <h2>About Me</h2>
        </div>

        <div className="about-content">
          <div className="about-text animate-slide-in">
            <h3>Who I Am</h3>
            <p>{profile.about_bio}</p>
            
            <div className="about-info">
              <div className="info-item">
                <div className="info-header">
                  <svg className="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <h4>Location</h4>
                </div>
                <p>{profile.location || 'Not specified'}</p>
              </div>
              <div className="info-item">
                <div className="info-header">
                  <svg className="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                  </svg>
                  <h4>Email</h4>
                </div>
                <p><a href={`mailto:${profile.email}`}>{profile.email}</a></p>
              </div>
              {profile.phone && (
                <div className="info-item">
                  <div className="info-header">
                    <svg className="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                    <h4>Phone</h4>
                  </div>
                  <p><a href={`tel:${profile.phone}`}>{profile.phone}</a></p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
