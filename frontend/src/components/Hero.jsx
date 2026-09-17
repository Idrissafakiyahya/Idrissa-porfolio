import React from 'react';
import { useFetch } from '../hooks/useFetch';
import { useTypeScript } from '../hooks/useTypeScript';
import { profileAPI, skillsAPI, projectsAPI, experienceAPI, educationAPI } from '../services/api';
import '../styles/hero.css';

const statIcons = {
  Projects: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5v9A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5v-9Z" />
      <path d="M8 5v14M16 5v14M4 10h16M4 14h16" />
    </svg>
  ),
  Skills: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2 3 7l9 5 9-5-9-5Zm-9 8 9 5 9-5M3 12l9 5 9-5" />
    </svg>
  ),
  Experience: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 20V8.5A2.5 2.5 0 0 1 8.5 6H15.5A2.5 2.5 0 0 1 18 8.5V20M6 10h12M9 3h6" />
    </svg>
  ),
  Education: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 9.5 12 5l9 4.5-9 4.5-9-4.5Zm0 0V15l9 4.5 9-4.5v-5.5" />
    </svg>
  ),
};

const Hero = () => {
  const { data: profile, loading: profileLoading } = useFetch(() => profileAPI.getProfile());
  const { data: skillsData } = useFetch(() => skillsAPI.getSkills());
  const { data: projectsData } = useFetch(() => projectsAPI.getProjects());
  const { data: experiencesData } = useFetch(() => experienceAPI.getExperience());
  const { data: educationsData } = useFetch(() => educationAPI.getEducation());

  const heroTitle = profile?.title || 'TypeScript';
  const titleWidth = Math.max(heroTitle.length + 18, 40);
  const { displayedText: typewriterTitle } = useTypeScript(heroTitle, 90, 45, 1400);

  const skills = Array.isArray(skillsData) ? skillsData : [];
  const projects = Array.isArray(projectsData) ? projectsData : [];
  const experiences = Array.isArray(experiencesData) ? experiencesData : [];
  const educations = Array.isArray(educationsData) ? educationsData : [];

  const stats = [
    { label: 'Projects', value: projects.length || 0, icon: statIcons.Projects },
    { label: 'Skills', value: skills.length || 0, icon: statIcons.Skills },
    { label: 'Experience', value: experiences.length || 0, icon: statIcons.Experience },
    { label: 'Education', value: educations.length || 0, icon: statIcons.Education },
  ];

  if (profileLoading) {
    return (
      <section id="hero" className="hero">
        <div className="container">
          <div className="hero-skeleton"></div>
        </div>
      </section>
    );
  }

  if (!profile) return null;

  return (
    <section id="hero" className="hero">
      <div className="hero-stars" aria-hidden="true"></div>
      <div className="container">
        <div className="hero-content animate-slide-up">
          <div className="hero-left">
            <div className="hero-heading">
              <h1>{profile.full_name}</h1>
              <p
                className="hero-title"
                style={{ '--typed-title-width': `${titleWidth}ch` }}
              >
                {typewriterTitle}<span className="typing-cursor">|</span>
              </p>
            </div>

            <p className="hero-description">{profile.hero_bio}</p>

            <div className="hero-actions">
              <a href={`mailto:${profile.email}`} className="button primary">
                Get in Touch
              </a>
              {profile.resume_file && (
                <a 
                  href={profile.resume_file} 
                  download="resume"
                  className="button outline"
                >
                  Download Resume
                </a>
              )}
            </div>

            <div className="hero-social-row" aria-label="Social links">
              {[
                { key: 'github_url', label: 'GitHub', icon: (
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 .5a12 12 0 0 0-3.79 23.38c.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.6-4.04-1.6-.55-1.4-1.34-1.77-1.34-1.77-1.09-.75.08-.74.08-.74 1.2.08 1.83 1.23 1.83 1.23 1.07 1.83 2.8 1.3 3.48.99.11-.78.42-1.3.76-1.6-2.66-.3-5.46-1.33-5.46-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.4 11.4 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.66 1.65.24 2.87.12 3.17.77.84 1.24 1.91 1.24 3.22 0 4.61-2.8 5.62-5.47 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.21.7.82.58A12 12 0 0 0 12 .5z"/></svg>
                )},
                { key: 'linkedin_url', label: 'LinkedIn', icon: (
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.98 3.5A2.5 2.5 0 1 0 5 8.5a2.5 2.5 0 0 0-.02-5zm.02 5H2V21h3V8.5zM9 8.5H6v12h3v-6.7c0-1.97 2.5-2.13 2.5 0V21H15V13c0-4.42-5-4.25-6-2.5V8.5z"/></svg>
                )},
                { key: 'instagram_url', label: 'Instagram', icon: (
                  <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                )},
                { key: 'whatsapp_url', label: 'WhatsApp', icon: (
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 11.5a8.38 8.38 0 0 1-1.9 5.4L21 21l-4.1-1.7A8.38 8.38 0 1 1 21 11.5z"/><path d="M17.5 14.5c-.4 0-2.3-1-2.6-1.1-.3-.1-.5-.1-.8.1-.3.2-1 1.1-1.2 1.3-.2.2-.4.2-.8.1-.4-.1-1.6-.6-3-2.1-1.1-1.1-1.8-2.5-1.9-2.9-.1-.4 0-.6.1-.8.1-.3.4-.8.6-1 .2-.2.4-.3.7-.3.2 0 .5 0 .8 0 .2 0 .5-.1.7-.1.2 0 .4 0 .6.2.2.1.6.4 1 .8.3.3.6.6.8.8.3.4.6.6 1 .7.4.1.8 0 1.1-.1.4-.1 1.2-.5 1.4-.6.3-.1.5-.2.8 0 .3.2 1 .9 1.1 1.2.1.3 0 .7-.1 1-.1.3-.4.6-.5.7-.2.1-.5.2-.8.2z"/></svg>
                )},
              ].map(s => profile[s.key] ? (
                <a key={s.key} href={profile[s.key]} target="_blank" rel="noopener noreferrer" className="social-btn" aria-label={s.label}>
                  {s.icon}
                </a>
              ) : null)}
            </div>
          </div>

          <div className="hero-right">
            <div className="portrait-frame" aria-hidden="false">
              <div className="portrait-shape" aria-hidden="true"></div>
              {profile.profile_photo && (
                <img src={profile.profile_photo} alt={profile.full_name} className="portrait-image" />
              )}
            </div>
          </div>
        </div>

        <div className="hero-stats-strip" aria-label="Portfolio statistics">
          {stats.map((stat, i) => (
            <div className="stat-item" key={stat.label}>
              <div className="stat-number">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
              {i < stats.length - 1 && <div className="stat-sep" aria-hidden="true" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
