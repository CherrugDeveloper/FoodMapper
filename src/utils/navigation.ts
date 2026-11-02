const KNOWN_ROUTES = ['calc', 'diary', 'diet', 'recipes', 'shopping', 'workout', 'sleep', 'foods', 'hub', 'changelog', 'developer'];

export function getBasePath(): string {
  if (typeof window === 'undefined') return '';
  const l = window.location;
  const isLocal = l.hostname === 'localhost' || l.hostname === '127.0.0.1' || l.hostname === '';
  if (isLocal) return '';
  const repo = l.pathname.split('/')[1];
  if (!repo || KNOWN_ROUTES.includes(repo)) {
    return '';
  }
  return '/' + repo;
}

export function getCurrentRelativePath(): string {
  if (typeof window === 'undefined') return '/';
  const l = window.location;
  const base = getBasePath();
  let pathname = l.pathname;
  if (base && pathname.startsWith(base)) {
    pathname = pathname.slice(base.length);
  }
  if (!pathname.startsWith('/')) {
    pathname = '/' + pathname;
  }
  const clean = pathname.replace(/\/+$/, '');
  return clean === '' ? '/' : clean;
}

/**
 * Navigates to the given path using React Router's event system with fallback.
 *
 * React Router v7 does not respond to window.history.pushState + popstate events,
 * so we dispatch a custom 'app-navigation' event that App.tsx listens for.
 * If that fails (listener not ready, etc.), we fall back to window.location.href.
 *
 * @param path - The path to navigate to (e.g., '/diet', '/workout')
 * @param options - Optional configuration
 * @param options.fallback - Whether to use window.location.href as fallback (default: true)
 */
export function navigateTo(path: string, options?: { fallback?: boolean }): void {
  if (typeof window === 'undefined') return;
  
  const { fallback = true } = options ?? {};
  const base = getBasePath();
  const cleanPath = path.startsWith('/') ? path : '/' + path;
  // Remove base from cleanPath if present, since React Router's navigate expects relative paths
  const relativePath = base && cleanPath.startsWith(base)
    ? cleanPath.slice(base.length)
    : cleanPath;
  
  try {
    // Strategy 1: Push to history and dispatch custom event for React Router listener
    window.history.pushState(null, '', base + relativePath);
    window.dispatchEvent(new CustomEvent('app-navigation', { detail: relativePath }));
    window.dispatchEvent(new PopStateEvent('popstate'));
  } catch (error) {
    console.warn('[navigateTo] Failed to dispatch navigation event:', error);
    
    // Strategy 2: Fallback to direct window.location.href navigation
    if (fallback) {
      try {
        window.location.href = base + relativePath;
      } catch (fallbackError) {
        console.error('[navigateTo] Fallback navigation also failed:', fallbackError);
      }
    }
  }
}
