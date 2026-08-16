import React, { useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import { projectsAPI } from '../services/api';
import '../styles/projects.css';

const Projects = () => {
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('data_analysis');
  
  const { data: projects, loading } = useFetch(
    () => projectsAPI.getProjects(showFeaturedOnly, selectedCategory),
    [showFeaturedOnly, selectedCategory]
  );

  const categories = [
    { value: 'data_analysis', label: 'Data Analysis' },
    { value: 'machine_learning', label: 'Machine Learning' },
    { value: 'deep_learning', label: 'Deep Learning' },
    { value: 'ai_agent', label: 'AI Agent' },
    { value: 'web_development', label: 'Web Development' },
    { value: 'environmental', label: 'Environmental' },
  ];

  const ProjectSkeleton = () => (
    <div className="project-card skeleton-loader" style={{ height: '350px' }}></div>
  );

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
              onClick={() => setSelectedCategory(selectedCategory === cat.value ? null : cat.value)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="projects-grid">
          {loading
            ? Array(6).fill(0).map((_, i) => <ProjectSkeleton key={i} />)
            : projects?.map((project, idx) => (
                <div key={project.id} className="project-card animate-slide-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                  {project.cover_image && (
                    <div className="project-image">
                      <img src={project.cover_image} alt={project.title} />
                      <div className="project-badges">
                        {project.featured && <span className="featured-badge">Featured</span>}
                        <span className="category-badge">{project.category_display}</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="project-content">
                    <h3>{project.title}</h3>
                    <p className="project-description">{project.short_description}</p>
                    
                    {project.tech_stack_list && (
                      <div className="tech-stack">
                        {project.tech_stack_list.map((tech, i) => (
                          <span key={i} className="tech-tag">{tech}</span>
                        ))}
                      </div>
                    )}

                    <div className="project-links">
                      {project.live_url && (
                        <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="button small">
                          View Live
                        </a>
                      )}
                      {project.github_url && (
                        <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="button secondary small">
                          GitHub
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
        </div>

        {!loading && projects?.length === 0 && (
          <div className="empty-state">
            <p>No projects found.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;
