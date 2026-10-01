import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import { applyPerformanceMode } from './utils/performanceMode';
import './index.css';
import './styles/performance-lite.css';

// Antes del primer render, para que el modo liviano aplique desde el inicio.
applyPerformanceMode();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
