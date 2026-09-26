import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import i18n from './i18n'

const root = createRoot(document.getElementById('root')!)

function renderApp() {
  root.render(<App />)
}

function areInitialResourcesLoaded(): boolean {
  if (!i18n.isInitialized) return false
  const lng = i18n.language || 'it'
  const hasResources = i18n.hasResourceBundle(lng, 'translation')
  const resourceBundle = i18n.getResourceBundle(lng, 'translation')
  return hasResources && !!resourceBundle && Object.keys(resourceBundle).length > 0
}

function renderLoading() {
  root.render(<div>Loading…</div>)
}

function tryRenderApp() {
  if (areInitialResourcesLoaded()) {
    i18n.off('initialized', tryRenderApp)
    i18n.off('loaded', tryRenderApp)
    renderApp()
    return true
  }
  return false
}

if (!tryRenderApp()) {
  renderLoading()
  i18n.on('initialized', tryRenderApp)
  i18n.on('loaded', tryRenderApp)
}
