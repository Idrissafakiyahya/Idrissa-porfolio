import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { projectsAPI } from '../services/api';
import '../styles/projects.css';

const Projects = () => {
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate();

  const { data: projects, loading } = useFetch(
    () => projectsAPI.getProjects(showFeaturedOnly, selectedCategory),
    [showFeaturedOnly, selectedCategory]
  );

  const safeProjects = Array.isArray(projects)
    ? projects
    : Array.isArray(projects?.results)
      ? projects.results
      : [];

  const categories = [
    { value: 'data_analysis', label: 'Data Analysis' },
    { value: 'machine_learning', label: 'Machine Learning' },
    { value: 'deep_learning', label: 'Deep Learning' },
    { value: 'ai_agent', label: 'AI Agent' },
    { value: 'web_development', label: 'Web Development' },
    { value: 'competitions', label: 'Competitions & Hackathons' },
    { value: 'environmental', label: 'Environmental' },
    { value: 'research', label: 'Research' },
  ];

  const isMarqueeMode = !selectedCategory;
  const marqueeProjects = isMarqueeMode && safeProjects.length > 0 ? [...safeProjects, ...safeProjects] : safeProjects;

  const handleCategoryClick = (categoryValue) => {
    setSelectedCategory((current) => (current === categoryValue ? null : categoryValue));
  };

  const handleCardClick = (slug) => {
    navigate(`/projects/${slug}`);
  };

  const ProjectSkeleton = () => (
    <div className="project-card skeleton-loader" style={{ height: '350px' }}></div>
  );

  const renderProjectCard = (project, idx, options = {}) => {
    const { marquee = false } = options;

    return (
      <div
        key={marquee ? `${project.id}-${idx}` : project.id}
        className={`project-card ${marquee ? 'marquee-project-card' : 'animate-slide-up'}`}
        style={marquee ? undefined : { animationDelay: `${idx * 0.1}s` }}
        onClick={() => handleCardClick(project.slug)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleCardClick(project.slug);
          }
        }}
        role="button"
        tabIndex={0}
      >
        {project.cover_image && (
          <div className="project-image">
            <img src={project.cover_image} alt={project.title} />
            <div className="project-badges">
              {project.featured && <span className="featured-badge">Featured</span>}
              <span className="category-badge">{project.category_display}</span>
              {project.category === 'competitions' && project.competition_provider_display && (
                <span className="provider-badge">{project.competition_provider_display}</span>
              )}
            </div>
          </div>
        )}

        {!project.cover_image && (
          <div className="project-image no-image">
            <div className="project-badges">
              {project.featured && <span className="featured-badge">Featured</span>}
              <span className="category-badge">{project.category_display}</span>
              {project.category === 'competitions' && project.competition_provider_display && (
                <span className="provider-badge">{project.competition_provider_display}</span>
              )}
            </div>
          </div>
        )}

        <div className="project-content">
          <h3>{project.title}</h3>

          {project.tech_stack_list && (
            <div className="tech-stack">
              {project.tech_stack_list.map((tech, i) => (
                <span key={i} className="tech-tag">{tech}</span>
              ))}
            </div>
          )}

          <div className="project-links">
            <a
              href={`/projects/${project.slug}`}
              className="button secondary small"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              View Details
            </a>
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="button small"
                onClick={(e) => e.stopPropagation()}
              >
                View Live
              </a>
            )}
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="button secondary small"
                onClick={(e) => e.stopPropagation()}
              >
                GitHub
              </a>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <section id="projects" className="section">
      <div className="container">
        <div className="section-title">
          <h2>Featured Projects</h2>
        </div>

        <div className="projects-filter">
          <label className="filter-checkbox">
            <input
              type="checkbox"
              checked={showFeaturedOnly}
              onChange={(e) => setShowFeaturedOnly(e.target.checked)}
            />
            <span>Show Featured Only</span>
          </label>
        </div>

        <div className="category-filter">
          {categories.map((cat) => (
            <button
              key={cat.value}
              className={`category-btn ${selectedCategory === cat.value ? 'active' : ''}`}
              onClick={() => handleCategoryClick(cat.value)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="projects-grid">
            {Array(6).fill(0).map((_, i) => <ProjectSkeleton key={i} />)}
          </div>
        ) : isMarqueeMode ? (
          <div className="projects-marquee" aria-label="Project carousel">
            <div className="projects-track">
              {marqueeProjects.map((project, idx) => renderProjectCard(project, idx, { marquee: true }))}
            </div>
          </div>
        ) : (
          <div className="projects-grid">
            {safeProjects?.map((project, idx) => renderProjectCard(project, idx))}
          </div>
        )}

        {!loading && safeProjects?.length === 0 && (
          <div className="empty-state">
            <p>No projects found.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;
