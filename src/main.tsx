import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RaffleApp } from './RaffleApp';

import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RaffleApp></RaffleApp>
  </StrictMode>,
)
