import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import i18n from './i18n'

const root = createRoot(document.getElementById('root')!)

const FALLBACK_TIMEOUT_MS = 3000

function renderApp() {
  root.render(<App />)
}

function renderLoading() {
  root.render(<div>Loading…</div>)
}

function areInitialResourcesLoaded(): boolean {
  if (!i18n.isInitialized) return false
  const lng = i18n.language || 'it'
  const hasResources = i18n.hasResourceBundle(lng, 'translation')
  const resourceBundle = i18n.getResourceBundle(lng, 'translation')
  return hasResources && !!resourceBundle && Object.keys(resourceBundle).length > 0
}

let fallbackTimer: ReturnType<typeof setTimeout> | null = null
let rendered = false

function cleanup() {
  if (fallbackTimer) {
    clearTimeout(fallbackTimer)
    fallbackTimer = null
  }
  i18n.off('initialized', tryRenderApp)
  i18n.off('loaded', tryRenderApp)
  i18n.off('failedLoading', handleFailedLoading)
}

function renderAppOnce() {
  if (rendered) return
  cleanup()
  rendered = true
  renderApp()
}

function tryRenderApp() {
  if (areInitialResourcesLoaded()) {
    renderAppOnce()
    return true
  }
  return false
}

function handleFailedLoading() {
  if (rendered) return
  // Even if the primary language failed, render the app anyway so the user
  // isn't stuck on a blank "Loading" screen. Fallback keys / fallbackLng
  // will prevent raw translation keys from showing.
  renderAppOnce()
}

function startFallbackTimer() {
  if (fallbackTimer) return
  fallbackTimer = setTimeout(() => {
    if (!rendered) {
      console.warn('[i18n] fallback timeout reached, rendering app anyway')
      renderAppOnce()
    }
  }, FALLBACK_TIMEOUT_MS)
}

i18n.on('initialized', tryRenderApp)
i18n.on('loaded', tryRenderApp)
i18n.on('failedLoading', handleFailedLoading)

if (!tryRenderApp()) {
  renderLoading()
  startFallbackTimer()
}
