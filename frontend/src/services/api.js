import axios from 'axios';

// Get API base URL from environment variable or use default
// Normalize so callers can set either `https://host` or `https://host/api`.
const rawBase = import.meta.env.VITE_API_BASE_URL;
const API_BASE_URL = (() => {
  if (!rawBase) return 'http://localhost:8000/api';
  // remove trailing slash
  const cleaned = rawBase.replace(/\/+$/, '');
  // ensure it ends with /api
  return cleaned.endsWith('/api') ? cleaned : `${cleaned}/api`;
})();

// Helpful debug: show resolved API base during development builds
try {
  if (import.meta.env && import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.info('Resolved API_BASE_URL ->', API_BASE_URL);
  }
} catch (e) {
  // ignore in environments without import.meta
}

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a response interceptor to handle errors
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 404) {
      console.error('Resource not found');
    } else if (error.response?.status === 500) {
      console.error('Server error');
    } else if (error.message === 'Network Error') {
      console.error('Network error - cannot reach the API');
    }
    return Promise.reject(error);
  }
);

// Profile API
export const profileAPI = {
  getProfile: () => api.get('/profile/'),
  getProfileList: () => api.get('/profile/'),
};

// Skills API
export const skillsAPI = {
  getSkills: (category = null) => {
    const params = category ? { category } : {};
    return api.get('/skills/', { params });
  },
  getSkillsByCategory: (category) => api.get('/skills/', { params: { category } }),
};

// Projects API
export const projectsAPI = {
  getProjects: (featured = null, category = null) => {
    const params = {};
    if (featured) params.featured = 'true';
    if (category) params.category = category;
    return api.get('/projects/', { params });
  },
  getFeaturedProjects: () => api.get('/projects/', { params: { featured: 'true' } }),
  getProjectsByCategory: (category) => api.get('/projects/', { params: { category } }),
  getProjectBySlug: (slug) => api.get(`/projects/${slug}/`),
};

// Experience API
export const experienceAPI = {
  getExperience: (category = null) => {
    const params = category ? { category } : {};
    return api.get('/experience/', { params });
  },
};

// Education API
export const educationAPI = {
  getEducation: (category = 'education') => {
    const params = category ? { category } : {};
    return api.get('/education/', { params });
  },
};

// Testimonials API
export const testimonialsAPI = {
  getTestimonials: () => api.get('/testimonials/'),
};

// Visits API - frontend should POST to /visits/ to record a view
export const visitsAPI = {
  recordVisit: (data = {}) => api.post('/visits/', data),
  getStats: () => api.get('/visits/stats/'),
};

// Contact API
export const contactAPI = {
  submitMessage: (data) => {
    return api.post('/contact/create_message/', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },
};

export default api;
