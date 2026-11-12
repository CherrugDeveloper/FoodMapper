const KNOWN_ROUTES = ['calc', 'diet', 'recipes', 'shopping', 'workout', 'sleep', 'foods', 'hub', 'changelog', 'developer', 'diary'];

/**
 * Test location provider - allows mocking window.location in tests
 * In production, this returns undefined and real window.location is used
 */
let testLocationProvider: (() => Partial<Location>) | null = null;

/**
 * Set a test location provider (used in tests)
 */
export const setTestLocationProvider = (provider: (() => Partial<Location>) | null) => {
  testLocationProvider = provider;
};

/**
 * Get the current location object, using test provider if available
 */
function getLocation(): Location {
  if (testLocationProvider && typeof window !== 'undefined') {
    const testLoc = testLocationProvider();
    // Merge test location with real location for missing properties
    const realLoc = window.location;
    return {
      href: testLoc.href ?? realLoc.href,
      hostname: testLoc.hostname ?? realLoc.hostname,
      pathname: testLoc.pathname ?? realLoc.pathname,
      search: testLoc.search ?? realLoc.search,
      hash: testLoc.hash ?? realLoc.hash,
      origin: testLoc.origin ?? realLoc.origin,
      host: testLoc.host ?? realLoc.host,
      port: testLoc.port ?? realLoc.port,
      protocol: testLoc.protocol ?? realLoc.protocol,
      ancestorOrigins: testLoc.ancestorOrigins ?? realLoc.ancestorOrigins,
      assign: testLoc.assign ?? realLoc.assign.bind(realLoc),
      reload: testLoc.reload ?? realLoc.reload.bind(realLoc),
      replace: testLoc.replace ?? realLoc.replace.bind(realLoc),
      toString: testLoc.toString ?? realLoc.toString.bind(realLoc),
    };
  }
  return typeof window !== 'undefined' ? window.location : ({} as Location);
}

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
  const l = getLocation();
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
  const l = getLocation();
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
 * Reduced from 100ms to 50ms for better UI responsiveness
 * - 50ms is sufficient to prevent race conditions while allowing rapid UI interactions
 */
const NAV_THROTTLE_MS = 50;

/**
 * Throttle state to prevent navigation spam
 */
let lastNavTime = 0;
let navigationErrorCount = 0;
const MAX_ERROR_COUNT = 10; // Prevent infinite error loops

/**
 * Navigates to the given path using React Router's navigate function directly.
 * This avoids double navigation that was causing the flickering issue.
 * Falls back to window.location.href if navigateRef is not available.
 *
 * @param path - The path to navigate to (e.g., '/diet', '/workout')
 * @param options - Optional configuration
 * @param options.fallback - Whether to use window.location.href as direct fallback on error (default: true)
 * @param options.force - If true, bypasses the throttle (default: false)
 * @param options.throttleMs - Minimum time between navigations in ms (default: 50)
 */
export function navigateTo(path: string, options?: { fallback?: boolean; force?: boolean; throttleMs?: number }): void {
  console.log('DEBUG: Navigating to:', path);
  if (typeof window === 'undefined') {
    console.warn('[navigateTo] Called outside of browser environment');
    return;
  }

  // Prevent infinite error loops
  if (navigationErrorCount >= MAX_ERROR_COUNT) {
    console.error('[navigateTo] Too many navigation errors, stopping to prevent infinite loop');
    return;
  }

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
    console.warn(`[navigateTo] Navigation throttled (${throttleMs}ms), ignoring request to: ${relativePath}`);
    return;
  }

  lastNavTime = now;

  // Use React Router's navigate function directly (set via navigateRef in App.tsx)
  // This avoids double navigation that was causing the flickering issue
  if (navigateRef.current) {
    try {
      navigateRef.current(relativePath, { replace: false });
      // Dispatch app-navigation event to notify listeners
      window.dispatchEvent(new CustomEvent('app-navigation', { detail: relativePath }));
      // Reset error count on successful navigation
      navigationErrorCount = 0;
      return;
    } catch (err) {
      console.error('[navigateTo] navigateRef threw, falling back:', err);
      navigationErrorCount++;
      if (navigationErrorCount >= MAX_ERROR_COUNT) {
        console.error('[navigateTo] Too many navigation errors, stopping to prevent infinite loop');
        return;
      }
    }
  }

  // Fallback: use window.history.pushState if navigateRef is not available
  try {
    window.history.pushState(null, '', base + relativePath);
    window.dispatchEvent(new CustomEvent('app-navigation', { detail: relativePath }));
  } catch (err) {
    console.error('[navigateTo] Navigation failed:', err);
    navigationErrorCount++;
  }
}

/**
 * Resets the navigation error counter - useful after successful navigation
 */
export function resetNavigationErrorCount(): void {
  navigationErrorCount = 0;
}

/**
 * Resets the navigation throttle timer - useful for testing throttle behavior
 */
export function resetNavigationThrottle(): void {
  lastNavTime = 0;
}

/**
 * Updates the navigation time stamp without actually navigating.
 * Used by the event listener in App.tsx to synchronize throttle state
 * when navigation is triggered via the app-navigation event.
 * This prevents race conditions from duplicate navigation paths where
 * navigateTo() calls navigateRef.current() and then the event listener
 * would call it again.
 */
export function touchNavigationTime(): void {
  lastNavTime = Date.now();
}
