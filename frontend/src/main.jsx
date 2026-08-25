import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { profileAPI } from './services/api'
import { visitsAPI } from './services/api'

async function setFaviconFromProfile() {
  try {
    const res = await profileAPI.getProfile();
    const profile = res?.data ?? res;
    const url = profile?.profile_photo;
    if (url) {
      let link = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = url;
    }
  } catch (e) {
    // ignore - leave existing favicon
    // console.warn('Could not set favicon from profile', e);
  }
}

// Try to set favicon quickly before mounting React
setFaviconFromProfile().finally(() => {
  // record a visit (non-blocking)
  try {
    visitsAPI.recordVisit({ path: window.location.pathname }).catch(() => {});
  } catch (e) {
    // ignore
  }

  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
});
