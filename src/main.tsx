import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
// AGGIORNATO: Carica la configurazione multilingua all'avvio dell'app
import './i18n'

createRoot(document.getElementById('root')!).render(
  <App />
)
