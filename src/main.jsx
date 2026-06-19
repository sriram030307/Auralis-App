import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'

// Sync dark class with system preference for Android dark mode compliance
const applyColorScheme = (dark) => {
  document.documentElement.classList.toggle('dark', dark);
};
const mq = window.matchMedia('(prefers-color-scheme: dark)');
applyColorScheme(mq.matches);
mq.addEventListener('change', (e) => applyColorScheme(e.matches));

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)