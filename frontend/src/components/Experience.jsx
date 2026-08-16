import React, { useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import { experienceAPI } from '../services/api';
import '../styles/experience.css';

const Experience = () => {
  const [selectedCategory, setSelectedCategory] = useState('field_training');
  const { data: experiences, loading } = useFetch(
    () => experienceAPI.getExperience(selectedCategory),
    [selectedCategory]
  );

  const categories = [
    { value: 'volunteer', label: 'Volunteer' },
    { value: 'employed', label: 'Employed' },
    { value: 'field_training', label: 'Field Training' },
  ];

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  const ExperienceSkeleton = () => (
    <div className="experience-card skeleton-loader" style={{ height: '150px' }}></div>
  );

  return (
    <section id="experience" className="section">
      <div className="container">
        <div className="section-title">
          <h2>Work Experience</h2>
        </div>

        <div className="experience-category-filter">
          {categories.map((cat) => (
            <button
              key={cat.value}
              className={`experience-category-btn ${selectedCategory === cat.value ? 'active' : ''}`}
              onClick={() => setSelectedCategory(selectedCategory === cat.value ? null : cat.value)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="experience-timeline">
          {loading
            ? Array(3).fill(0).map((_, i) => <ExperienceSkeleton key={i} />)
            : experiences?.map((exp, idx) => (
                <div key={exp.id} className="experience-card animate-slide-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                  {exp.company_logo && (
                    <div className="company-logo">
                      <img src={exp.company_logo} alt={exp.company} />
                    </div>
                  )}
                  
                  <div className="experience-content">
                    <div className="experience-header">
                      <div>
                        <h3>{exp.role}</h3>
                        <p className="company-name">{exp.company}</p>
                      </div>
                      <div className="experience-meta">
                        <span className="experience-category-tag">{exp.category_display}</span>
                        <span className={`status ${exp.is_current ? 'current' : ''}`}>
                          {exp.is_current ? 'Current' : ''}
                        </span>
                      </div>
                    </div>

                    <p className="date-location">
                      {formatDate(exp.start_date)} – {exp.is_current ? 'Present' : formatDate(exp.end_date)}
                      {exp.location && ` • ${exp.location}`}
                    </p>

                    <p className="description">{exp.description}</p>
                  </div>
                </div>
              ))}
        </div>

        {!loading && experiences?.length === 0 && (
          <div className="empty-state">
            <p>No experience entries found.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Experience;
