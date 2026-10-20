import React from 'react';
import { useFetch } from '../hooks/useFetch';
import { profileAPI } from '../services/api';
import '../styles/about.css';

const About = () => {
  const { data: profile, loading } = useFetch(() => profileAPI.getProfile());

  const socialLinks = [
    { key: 'github_url', label: 'GitHub', icon: (<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 .5a12 12 0 0 0-3.79 23.38c.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.6-4.04-1.6-.55-1.4-1.34-1.77-1.34-1.77-1.09-.75.08-.74.08-.74 1.2.08 1.83 1.23 1.83 1.23 1.07 1.83 2.8 1.3 3.48.99.11-.78.42-1.3.76-1.6-2.66-.3-5.46-1.33-5.46-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.4 11.4 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.66 1.65.24 2.87.12 3.17.77.84 1.24 1.91 1.24 3.22 0 4.61-2.8 5.62-5.47 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.21.7.82.58A12 12 0 0 0 12 .5z"/></svg>) },
    { key: 'linkedin_url', label: 'LinkedIn', icon: (<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.98 3.5A2.5 2.5 0 1 0 5 8.5a2.5 2.5 0 0 0-.02-5zm.02 5H2V21h3V8.5zM9 8.5H6v12h3v-6.7c0-1.97 2.5-2.13 2.5 0V21H15V13c0-4.42-5-4.25-6-2.5V8.5z"/></svg>) },
    { key: 'instagram_url', label: 'Instagram', icon: (<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>) },
    { key: 'whatsapp_url', label: 'WhatsApp', icon: (<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 11.5a8.38 8.38 0 0 1-1.9 5.4L21 21l-4.1-1.7A8.38 8.38 0 1 1 21 11.5z"/><path d="M17.5 14.5c-.4 0-2.3-1-2.6-1.1-.3-.1-.5-.1-.8.1-.3.2-1 1.1-1.2 1.3-.2.2-.4.2-.8.1-.4-.1-1.6-.6-3-2.1-1.1-1.1-1.8-2.5-1.9-2.9-.1-.4 0-.6.1-.8.1-.3.4-.8.6-1 .2-.2.4-.3.7-.3.2 0 .5 0 .8 0 .2 0 .5-.1.7-.1.2 0 .4 0 .6.2.2.1.6.4 1 .8.3.3.6.6.8.8.3.4.6.6 1 .7.4.1.8 0 1.1-.1.4-.1 1.2-.5 1.4-.6.3-.1.5-.2.8 0 .3.2 1 .9 1.1 1.2.1.3 0 .7-.1 1-.1.3-.4.6-.5.7-.2.1-.5.2-.8.2z"/></svg>) }
  ];

  if (loading) {
    return (
      <section id="about" className="section about-section">
        <div className="container">
          <div className="about-skeleton"></div>
        </div>
      </section>
    );
  }

  if (!profile) return null;

  return (
    <section id="about" className="section about-section">
      <div className="container">
        <div className="section-title">
          <h2>About Me</h2>
        </div>

        <div className="about-layout">
          <div className="about-visual">
            <div className="about-photo-card">
              <div className="about-photo-glow" aria-hidden="true" />
              {profile.profile_photo && (
                <img src={profile.profile_photo} alt={profile.full_name} className="about-photo" />
              )}
            </div>

            <div className="about-social-row" aria-label="Social links">
              {socialLinks.map(({ key, label, icon }) =>
                profile[key] ? (
                  <a key={key} href={profile[key]} target="_blank" rel="noopener noreferrer" className="about-social-link" aria-label={label}>
                    {icon}
                  </a>
                ) : null
              )}
            </div>
          </div>

          <div className="about-panel">
            <div className="about-panel-inner">
              <h3>{profile.full_name}</h3>
              <p className="about-intro">{profile.about_bio || 'I build thoughtful digital experiences that connect creativity, technology, and user value.'}</p>

              <div className="about-meta-grid">
                <div className="meta-row meta-row-top">
                  <div className="meta-item meta-item-left">
                    <div className="meta-icon">
                      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    </div>
                    <div>
                      <span className="meta-label">Location</span>
                      <strong>{profile.location || 'Available worldwide'}</strong>
                    </div>
                  </div>

                  {profile.phone && (
                    <div className="meta-item meta-item-right">
                      <div className="meta-icon">
                        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                      </div>
                      <div>
                        <span className="meta-label">Phone</span>
                        <strong><a href={`tel:${profile.phone}`}>{profile.phone}</a></strong>
                      </div>
                    </div>
                  )}
                </div>

                <div className="meta-item meta-item-full">
                  <div className="meta-icon">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  </div>
                  <div>
                    <span className="meta-label">Email</span>
                    <strong><a href={`mailto:${profile.email}`}>{profile.email}</a></strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
