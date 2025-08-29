import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import R from '../src/router/Routing.jsx'
import { AuthProvider } from './context/AuthContext'
import { HelmetProvider } from 'react-helmet-async'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <AuthProvider>
        <R />
      </AuthProvider>
    </HelmetProvider>
  </StrictMode>,
)
