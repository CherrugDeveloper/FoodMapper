import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import i18n from './i18n'
import { registerSW } from 'virtual:pwa-register'

// Timeout for fallback rendering (increased for E2E tests)
const FALLBACK_TIMEOUT_MS = 15000

function renderApp() {
  const root = createRoot(document.getElementById('root')!)
  root.render(<App />)
}

function renderLoading() {
  const root = createRoot(document.getElementById('root')!)
  root.render(<div>Loading…</div>)
}

let fallbackTimer: ReturnType<typeof setTimeout> | null = null
let rendered = false

function setI18nReady() {
  if (rendered) return
  clearTimeout(fallbackTimer!)
  fallbackTimer = null
  document.documentElement.dataset.i18nReady = 'true'
  renderApp()
  resolveAppReady?.()
  resolveAppReady = null
  rendered = true
}

let resolveAppReady: (() => void) | null = null
const appReady = new Promise<void>((resolve) => {
  resolveAppReady = resolve
})

function handleFailedLoading() {
  if (rendered) return
  // Even if the primary language failed, render the app anyway so the user
  // isn't stuck on a blank "Loading" screen. Fallback keys / fallbackLng
  // will prevent raw translation keys from showing.
  setI18nReady()
}

function startFallbackTimer() {
  if (fallbackTimer) return
  fallbackTimer = setTimeout(() => {
    if (!rendered) {
      console.warn('[i18n] fallback timeout reached, rendering app anyway')
      setI18nReady()
    }
  }, FALLBACK_TIMEOUT_MS)
}

// Register service worker using vite-plugin-pwa
registerSW({
  onNeedRefresh() {
    if (confirm('Nuova versione disponibile. Ricaricare?')) {
      window.location.reload()
    }
  },
  onOfflineReady() {
    console.info('[PWA] App pronta per uso offline')
  }
})

// Expose a typed runtime contract so E2E tests can wait for actual readiness
if (typeof window !== 'undefined') {
  window.appReady = { i18n, ready: appReady }
  window.i18n = i18n
}

// Render app once i18next is initialized (primary language ready)
// Additional language bundles load asynchronously in background
// FIX: Check if i18n is already initialized to avoid race condition
// where the 'initialized' event was already emitted before this listener was added.
if (i18n.isInitialized) {
  window.i18n = i18n
  setI18nReady()
} else {
  i18n.on('initialized', () => {
    window.i18n = i18n
    setI18nReady()
  })
}

i18n.on('failedLoading', handleFailedLoading)

// Show loading state and start fallback timer
renderLoading()
startFallbackTimer()