import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
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

    if (typeof error?.text === 'string' && error.text) {
      return error.text;
    }

    if (typeof error?.message === 'string' && error.message) {
      return error.message;
    }

    if (typeof error?.status === 'number') {
      return `Request failed with status ${error.status}. Please verify the EmailJS or backend configuration.`;
    }

    return 'Failed to send message. Please check your EmailJS or backend settings and try again.';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    let emailSent = false;
    let backendSaved = false;
    let lastError = null;

    try {
      const promises = [];

      if (serviceId && templateId && publicKey) {
        promises.push(
          emailjs.send(
            serviceId,
            templateId,
            {
              from_name: formData.name,
              from_email: formData.email,
              subject: formData.subject,
              message: formData.message,
            },
            publicKey
          )
            .then(() => { emailSent = true; })
            .catch((err) => { lastError = err; console.warn('EmailJS error', err); })
        );
      }

      // also attempt to save to backend so messages are available in admin
      promises.push(
        contactAPI.submitMessage(formData)
          .then(() => { backendSaved = true; })
          .catch((err) => { lastError = err; console.warn('Backend save error', err); })
      );

      await Promise.all(promises);

      if (backendSaved || emailSent) {
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setStatus(null), 5000);
      } else {
        setStatus('error');
        setErrorMessage(getErrorMessage(lastError));
      }
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
            <fieldset className="form-fieldset">
              <legend className="form-legend">Send Me a Message</legend>

              <div className="form-group">
                <label htmlFor="name">Your Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Abdul majid faki yahya"
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
                  placeholder="Fatmafakiyahya@gmail.com"
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
            </fieldset>
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
