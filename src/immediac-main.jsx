import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import ImmEdiacApp from './ImmEdiacApp.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ImmEdiacApp />
  </StrictMode>,
)
