import React, { useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import { skillsAPI } from '../services/api';
import '../styles/skills.css';

const Skills = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { data: skills, loading } = useFetch(() => skillsAPI.getSkills());

  const categories = [
    { value: 'all', label: 'All Skills' },
    { value: 'data_science', label: 'Data Science' },
    { value: 'ml_ai', label: 'Machine Learning & AI' },
    { value: 'web_development', label: 'Web Development' },
    { value: 'databases', label: 'Databases' },
    { value: 'tools_platforms', label: 'Tools & Platforms' },
    { value: 'cloud', label: 'Cloud' },
    { value: 'social', label: 'Social' },
  ];

  // `skills` may be null, an array, or an array of objects with different fields.
  // Normalize to an array of simple skill objects.
  const normalized = Array.isArray(skills) ? skills : (skills || []);

  const filteredSkills = selectedCategory === 'all'
    ? normalized
    : normalized.filter(skill => (skill.category || '').toString() === selectedCategory);

  const SkillSkeleton = () => (
    <div className="skill-card skeleton-loader" style={{ height: '120px' }}></div>
  );

  return (
    <section id="skills" className="section">
      <div className="container">
        <div className="section-title">
          <h2>Skills & Technologies</h2>
        </div>

        <div className="skills-filters">
          {categories.map(cat => (
            <button
              key={cat.value}
              className={`filter-btn ${selectedCategory === cat.value ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.value)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="skills-grid">
          {loading
            ? Array(8).fill(0).map((_, i) => <SkillSkeleton key={i} />)
            : filteredSkills?.map((skill, idx) => (
                <div key={skill.id || skill.name || idx} className="skill-card animate-slide-up">
                  {skill.icon && (
                    <img src={skill.icon} alt={skill.name} className="skill-icon" />
                  )}
                  <h4>{skill.name || skill.title || 'Untitled'}</h4>
                  <p className="skill-category">{skill.category_display || skill.category || ''}</p>
                  {/* Optional fields: if backend doesn't provide proficiency, skip bar */}
                  {typeof skill.proficiency === 'number' && (
                    <div className="skill-proficiency">
                      <div className="proficiency-bar">
                        <div
                          className="proficiency-fill"
                          style={{ width: `${(skill.proficiency / 4) * 100}%` }}
                        ></div>
                      </div>
                      <span className="proficiency-level">{skill.proficiency_display || ''}</span>
                    </div>
                  )}
                </div>
              ))}
        </div>

        {!loading && filteredSkills?.length === 0 && (
          <div className="empty-state">
            <p>No skills found in this category.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Skills;
