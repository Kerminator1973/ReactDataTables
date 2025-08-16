import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
