import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { profileAPI, visitsAPI } from './services/api'

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
  } catch (error) {
    // The portfolio UI must not wait for the backend cold start.
  }
}

// Mount immediately. Backend requests continue in the background.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

setFaviconFromProfile()

try {
  visitsAPI.recordVisit({ path: window.location.pathname }).catch(() => {})
} catch (error) {
  // Visit tracking is optional and must never delay rendering.
}
