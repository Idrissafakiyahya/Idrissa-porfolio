import React, { useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import { educationAPI } from '../services/api';
import '../styles/education.css';

const Education = () => {
  const [selectedCategory, setSelectedCategory] = useState('education');
  const { data: educations, loading } = useFetch(
    () => educationAPI.getEducation(selectedCategory),
    [selectedCategory]
  );

  const categories = [
    { value: 'education', label: 'Education' },
    { value: 'certificates', label: 'Certificates' },
    { value: 'event', label: 'Events' },
  ];

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  const EducationSkeleton = () => (
    <div className="education-card skeleton-loader" style={{ height: '120px' }}></div>
  );

  return (
    <section id="education" className="section">
      <div className="container">
        <div className="section-title">
          <h2>Education</h2>
        </div>

        <div className="education-category-filter">
          {categories.map((cat) => (
            <button
              key={cat.value}
              className={`education-category-btn ${selectedCategory === cat.value ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.value)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="education-grid">
          {loading
            ? Array(3).fill(0).map((_, i) => <EducationSkeleton key={i} />)
            : educations?.map((edu, idx) => (
                <div key={edu.id} className="education-card animate-slide-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                  <div className="education-content">
                    <div className="education-header">
                      <div>
                        <h3>{edu.degree}</h3>
                        <p className="institution">{edu.institution}</p>
                        <p className="field">{edu.field}</p>
                      </div>
                      <span className="education-category-tag">{edu.category_display}</span>
                    </div>

                    <p className="date">
                      {formatDate(edu.start_date)} – {formatDate(edu.end_date)}
                    </p>
                    
                    {edu.description && (
                      <p className="description">{edu.description}</p>
                    )}
                  </div>
                </div>
              ))}
        </div>

        {!loading && educations?.length === 0 && (
          <div className="empty-state">
            <p>No education entries found.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Education;
