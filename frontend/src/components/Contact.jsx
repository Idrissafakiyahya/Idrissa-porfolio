import React, { useState } from 'react';
import { contactAPI } from '../services/api';
import '../styles/contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [status, setStatus] = useState(null); // null, 'loading', 'success', 'error'
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const getErrorMessage = (error) => {
    const data = error?.response?.data;

    if (typeof data?.message === 'string' && data.message) return data.message;
    if (typeof data?.detail === 'string' && data.detail) return data.detail;

    if (data?.errors) {
      if (Array.isArray(data.errors)) return data.errors.join(' ');
      if (typeof data.errors === 'object') {
        const messages = Object.values(data.errors).flat();
        const firstMessage = messages.find((message) => typeof message === 'string' && message);
        if (firstMessage) return firstMessage;
      }
    }

    return error?.message || 'Failed to send message. Please try again.';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await contactAPI.submitMessage(formData);
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => setStatus(null), 5000);
    } catch (error) {
      setStatus('error');
      setErrorMessage(getErrorMessage(error));
      console.error('Contact form error:', error);
    }
  };

  return (
    <section id="contact" className="section">
      <div className="container">
        <div className="section-title">
          <h2>Get In Touch</h2>
          <p>Have a question or project idea? I'd love to hear from you!</p>
        </div>

        <div className="contact-content">
          <form className="contact-form animate-slide-up" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Your Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Bchwa Slim Juma"
                disabled={status === 'loading'}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Thunneiya@gmail.com"
                disabled={status === 'loading'}
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject *</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder="Project Inquiry"
                disabled={status === 'loading'}
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="6"
                placeholder="Tell me about your project or inquiry..."
                disabled={status === 'loading'}
              ></textarea>
            </div>

            <button
              type="submit"
              className="button"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Sending...' : 'Send Message'}
            </button>
          </form>

          {status === 'success' && (
            <div className="alert success">
              ✓ Message sent successfully! Thank you for reaching out. I'll get back to you soon.
            </div>
          )}

          {status === 'error' && (
            <div className="alert error">
              ✕ {errorMessage}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Contact;
