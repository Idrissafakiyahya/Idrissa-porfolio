import React from 'react';
import { useFetch } from '../hooks/useFetch';
import { testimonialsAPI } from '../services/api';
import '../styles/testimonials.css';

const Testimonials = () => {
  const { data: testimonials, loading } = useFetch(() => testimonialsAPI.getTestimonials());

  const safeTestimonials = Array.isArray(testimonials)
    ? testimonials
    : Array.isArray(testimonials?.results)
      ? testimonials.results
      : [];

  const TestimonialSkeleton = () => (
    <div className="testimonial-card skeleton-loader" style={{ height: '200px' }}></div>
  );

  const renderStars = (rating) => {
    if (!rating) return null;
    return (
      <div className="stars">
        {Array(rating).fill(0).map((_, i) => (
          <span key={i}>⭐</span>
        ))}
      </div>
    );
  };

  return (
    <section id="testimonials" className="section">
      <div className="container">
        <div className="section-title">
          <h2>Testimonials</h2>
        </div>

        <div className="testimonials-grid">
          {loading
            ? Array(3).fill(0).map((_, i) => <TestimonialSkeleton key={i} />)
            : safeTestimonials?.map((testimonial, idx) => (
                <div key={testimonial.id} className="testimonial-card animate-slide-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                  {testimonial.photo && (
                    <img src={testimonial.photo} alt={testimonial.name} className="testimonial-photo" />
                  )}
                  
                  <div className="testimonial-content">
                    {renderStars(testimonial.rating)}
                    <p className="message">"{testimonial.message}"</p>
                    
                    <div className="testimonial-author">
                      <h4>{testimonial.name}</h4>
                      <p className="role">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
        </div>

        {!loading && safeTestimonials?.length === 0 && (
          <div className="empty-state">
            <p>No testimonials yet.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;
