import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { SiteConfigProvider } from "./SiteConfigContext";

// In cloud/iFrame preview environments where HMR is disabled, suppress benign dev-socket reconnect notices
if (typeof window !== "undefined") {
  window.addEventListener("unhandledrejection", (event) => {
    const reason = event.reason?.message || String(event.reason || "");
    if (reason.includes("WebSocket") || reason.includes("websocket")) {
      event.preventDefault();
    }
  });

  window.addEventListener("vite:preloadError", (event) => {
    event.preventDefault();
    console.warn("[App] Vite asset preload notice:", event);
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SiteConfigProvider>
      <App />
    </SiteConfigProvider>
  </StrictMode>,
);
