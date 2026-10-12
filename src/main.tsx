import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Store from './pages/Store'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Store />
  </StrictMode>,
)
