import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Особенное свойство StrictMode в режиме отладки кода - рендеринг осуществляется дважды, чтобы
// увидеть различные side-effects и убедиться в "чистоте" компонентной модели

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
