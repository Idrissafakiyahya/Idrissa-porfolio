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
      <div className="container">
        <div className="hero-content animate-slide-up">
          <div className="hero-heading">
            <h1>{profile.full_name}</h1>
            <p
              className="hero-title"
              style={{ '--typed-title-width': `${titleWidth}ch` }}
            >
              {typewriterTitle}<span className="typing-cursor">|</span>
            </p>
          </div>

          <div className="hero-image-wrap">
            {profile.profile_photo && (
              <img src={profile.profile_photo} alt={profile.full_name} className="hero-image" />
            )}

            <div className="hero-stats" aria-label="Portfolio statistics">
              {stats.map((stat) => (
                <div key={stat.label} className="hero-stat">
                  <span className="hero-stat-icon">{stat.icon}</span>
                  <span className="hero-stat-value">{stat.value}</span>
                  <span className="hero-stat-label">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-details">
            <p className="hero-description">{profile.bio}</p>

            <div className="hero-actions">
              <a href={`mailto:${profile.email}`} className="button">
                Get in Touch
              </a>
              {profile.resume_file && (
                <a 
                  href={profile.resume_file} 
                  download="resume"
                  className="button secondary"
                >
                  Download Resume
                </a>
              )}
            </div>

            <div className="hero-social">
              {profile.github_url && (
                <a href={profile.github_url} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                  GitHub
                </a>
              )}
              {profile.linkedin_url && (
                <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  LinkedIn
                </a>
              )}
              {profile.twitter_url && (
                <a href={profile.twitter_url} target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                  Twitter
                </a>
              )}
              {profile.website_url && (
                <a href={profile.website_url} target="_blank" rel="noopener noreferrer" aria-label="Website">
                  Website
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
