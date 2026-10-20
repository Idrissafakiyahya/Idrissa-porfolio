import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from './Navbar';
import { projectsAPI } from '../services/api';
import '../styles/project-detail.css';

const ProjectDetail = ({ isDarkMode, toggleTheme }) => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const handleBack = () => {
    navigate('/', { state: { scrollToProjects: true } });
  };

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await projectsAPI.getProjectBySlug(slug);
        setProject(response.data || response);
      } catch (error) {
        setProject(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [slug]);

  useEffect(() => {
    if (!project || !Array.isArray(project.gallery_images) || project.gallery_images.length <= 1) {
      return undefined;
    }

    const intervalId = setInterval(() => {
      setActiveImageIndex((prevIndex) => (prevIndex + 1) % project.gallery_images.length);
    }, 6000);

    return () => clearInterval(intervalId);
  }, [project]);

  if (loading) {
    return (
      <>
        <Navbar onThemeToggle={toggleTheme} isDarkMode={isDarkMode} />
        <section className="project-detail-page section">
          <div className="container">
            <div className="project-detail-skeleton" />
          </div>
        </section>
      </>
    );
  }

  if (!project) {
    return (
      <>
        <Navbar onThemeToggle={toggleTheme} isDarkMode={isDarkMode} />
        <section className="project-detail-page section">
          <div className="container">
            <div className="project-detail-empty">
              <h2>Project not found</h2>
              <button type="button" className="button primary" onClick={handleBack}>Back</button>
            </div>
          </div>
        </section>
      </>
    );
  }

  const gallery = Array.isArray(project.gallery_images) ? project.gallery_images : [];
  const activeImage = gallery[activeImageIndex] || null;
  const displayImage = activeImage?.image || project.cover_image;
  const displayCaption = activeImage?.caption || project.title;
  const displayDescription = activeImage?.short_description || project.short_description;

  return (
    <>
      <Navbar onThemeToggle={toggleTheme} isDarkMode={isDarkMode} />
      <section className="project-detail-page section">
        <div className="container">
          <div className="project-detail-header">
            <button type="button" className="project-back-link" onClick={handleBack}>← Back</button>
          </div>

          <article className="project-detail-card">
            <div className="project-detail-image-wrap">
              {displayImage ? (
                <>
                  <div className="project-slideshow-frame">
                    <img src={displayImage} alt={displayCaption} className="project-detail-cover" />
                    <div className="project-slide-caption">{displayCaption}</div>
                  </div>
                  <div className="project-slide-description">
                    <p>{displayDescription}</p>
                  </div>
                  {gallery.length > 1 && (
                    <div className="project-slide-dots" aria-label="Gallery image navigation">
                      {gallery.map((_, index) => (
                        <button
                          key={`${project.slug}-dot-${index}`}
                          type="button"
                          className={index === activeImageIndex ? 'active' : ''}
                          onClick={() => setActiveImageIndex(index)}
                          aria-label={`View image ${index + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="project-detail-cover placeholder">No cover image</div>
              )}
            </div>

            <div className="project-detail-content">
              <div className="project-detail-meta">
                <span className="project-detail-type">{project.project_type_display || project.project_type || 'Project'}</span>
                <span className="project-detail-category">{project.category_display || project.category}</span>
              </div>

              <h1>{project.title}</h1>
              <p className="project-detail-short">{project.short_description}</p>

              <div className="project-detail-tags">
                {(project.tech_stack_list || []).map((tech, index) => (
                  <span key={`${tech}-${index}`} className="project-detail-tag">{tech}</span>
                ))}
              </div>

              <div className="project-detail-actions">
                {project.live_url && (
                  <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="button primary">
                    Live Demo
                  </a>
                )}
                {project.github_url && (
                  <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="button secondary">
                    GitHub
                  </a>
                )}
                {project.research_paper_url && (
                  <a href={project.research_paper_url} target="_blank" rel="noopener noreferrer" className="button accent">
                    Research Paper
                  </a>
                )}
              </div>
            </div>
          </article>

          <div className="project-detail-body-panel">
            <div className="project-detail-body-header">
              <span className="project-detail-body-kicker">Overview</span>
              <h3>Project Description</h3>
            </div>
            <div dangerouslySetInnerHTML={{ __html: project.description || project.short_description }} />
          </div>
        </div>
      </section>
    </>
  );
};

export default ProjectDetail;
