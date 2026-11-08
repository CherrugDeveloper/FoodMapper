const KNOWN_ROUTES = ['calc', 'diary', 'diet', 'recipes', 'shopping', 'workout', 'sleep', 'foods', 'hub', 'changelog', 'developer'];

/**
 * Module-level ref to store the navigate function from React Router.
 * This allows the event listener to be registered at module level (synchronously)
 * while still having access to the current navigate function from React Router's useNavigate().
 * 
 * When navigateRef.current is null (before useLayoutEffect runs), the event listener
 * in App.tsx will fall back to window.location.href for reliable navigation.
 */
let navigateFn: ((path: string, options?: { replace?: boolean }) => void) | null = null;

/**
 * Navigation ref object that mimics React Router's ref pattern.
 * The current property can be set by App.tsx's useLayoutEffect,
 * but if it's ever reset to null, navigation will fall back to window.location.href.
 */
export const navigateRef = {
  get current(): ((path: string, options?: { replace?: boolean }) => void) | null {
    return navigateFn;
  },
  set current(fn: ((path: string, options?: { replace?: boolean }) => void) | null) {
    navigateFn = fn;
  }
};

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
 * Default throttle duration for navigation (in milliseconds)
 */
const NAV_THROTTLE_MS = 100;

/**
 * Navigates to the given path using React Router's event system with fallback.
 *
 * React Router v7 does not respond to window.history.pushState + popstate events,
 * so we dispatch a custom 'app-navigation' event that App.tsx listens for.
 * The event listener in App.tsx handles both the normal case (navigateRef.current set)
 * and the fallback case (navigateRef.current null, use window.location.href).
 *
 * @param path - The path to navigate to (e.g., '/diet', '/workout')
 * @param options - Optional configuration
 * @param options.fallback - Whether to use window.location.href as direct fallback (default: true)
 * @param options.force - If true, bypasses the throttle (default: false)
 * @param options.throttleMs - Minimum time between navigations in ms (default: 100)
 */
// Last navigation timestamp for throttle prevention
let lastNavTime = 0;

export function navigateTo(path: string, options?: { fallback?: boolean; force?: boolean; throttleMs?: number }): void {
  if (typeof window === 'undefined') return;
  
  const { force = false, throttleMs = NAV_THROTTLE_MS } = options ?? {};
  const base = getBasePath();
  const cleanPath = path.startsWith('/') ? path : '/' + path;
  // Remove base from cleanPath if present, since React Router's navigate expects relative paths
  const relativePath = base && cleanPath.startsWith(base)
    ? cleanPath.slice(base.length)
    : cleanPath;
  
  const currentRelPath = getCurrentRelativePath();
  // Prevent redundant navigation to the current path unless forced
  if (!force && currentRelPath === relativePath) {
    return;
  }

  const now = Date.now();
  // Prevent rapid navigation race conditions (within throttle period) unless forced
  if (!force && (now - lastNavTime < throttleMs)) {
    return;
  }
  
  lastNavTime = now;

  // Use React Router navigate if available
  if (navigateRef.current) {
    try {
      navigateRef.current(relativePath, { replace: false });
    } catch (err) {
      console.warn('[navigateTo] navigateRef current failed, falling back:', err);
      try {
        window.location.href = base + relativePath;
      } catch (navErr) {
        console.error('[navigateTo] Fallback navigation failed:', navErr);
      }
    }
  } else {
    // navigateRef.current is null (before mount or error state)
    try {
      window.history.pushState(null, '', base + relativePath);
    } catch (error) {
      console.warn('[navigateTo] Failed to push to history:', error);
    }
    
    // Dispatch custom event - App.tsx event listener will handle navigation
    window.dispatchEvent(new CustomEvent('app-navigation', { detail: relativePath }));
    window.dispatchEvent(new PopStateEvent('popstate'));
  }
}
