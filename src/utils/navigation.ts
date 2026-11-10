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
 * Sets the new URL in browser history without triggering navigation.
 * Used for maintaining history state that can be restored on page reload.
 */
function setHistoryState(url: string): void {
  try {
    window.history.replaceState(null, '', url);
  } catch (err) {
    console.warn('[setHistoryState] Failed:', err);
  }
}

/**
 * Dispatches the app-navigation event that App.tsx listens for.
 * The event listener in App.tsx handles the actual navigation using
 * React Router's navigate or falls back to window.location.href.
 */
function dispatchNavigationEvent(relativePath: string, base: string): void {
  try {
    // Update history state for persistence
    setHistoryState(base + relativePath);
    
    // Dispatch custom event for React Router v7 compatibility
    window.dispatchEvent(new CustomEvent('app-navigation', { detail: relativePath }));
  } catch (err) {
    console.warn('[dispatchNavigationEvent] Failed:', err);
  }
}

/**
 * Navigates to the given path using a custom event system with fallback handling.
 *
 * This function:
 * 1. Validates the path and prevents redundant navigation
 * 2. Throttles rapid navigation calls to prevent race conditions
 * 3. Dispatches a custom 'app-navigation' event that App.tsx listens for
 * 4. Updates browser history for page reload persistence
 *
 * React Router v7 does not respond to window.history.pushState + popstate events,
 * so we use a custom event system.
 *
 * @param path - The path to navigate to (e.g., '/diet', '/workout')
 * @param options - Optional configuration
 * @param options.fallback - Whether to use window.location.href as direct fallback on error (default: true)
 * @param options.force - If true, bypasses the throttle (default: false)
 * @param options.throttleMs - Minimum time between navigations in ms (default: 50)
 */
export function navigateTo(path: string, options?: { fallback?: boolean; force?: boolean; throttleMs?: number }): void {
  if (typeof window === 'undefined') {
    console.warn('[navigateTo] Called outside of browser environment');
    return;
  }

  // Prevent infinite error loops
  if (navigationErrorCount >= MAX_ERROR_COUNT) {
    console.error('[navigateTo] Too many navigation errors, stopping to prevent infinite loop');
    return;
  }

  const { force = false, throttleMs = NAV_THROTTLE_MS, fallback = true } = options ?? {};
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

  // Try to use navigateRef.current directly if available (test environments can mock this)
  if (navigateRef.current) {
    try {
      navigateRef.current(relativePath, { replace: false });
      // Reset error count on successful navigation
      navigationErrorCount = 0;
      // Dispatch event for React Router v7 compatibility
      dispatchNavigationEvent(relativePath, base);
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

  // Fallback: use history.pushState or window.location.href
  try {
    history.pushState(null, '', base + relativePath);
    // Reset error count on successful navigation
    navigationErrorCount = 0;
    // Dispatch event for React Router v7 compatibility
    dispatchNavigationEvent(relativePath, base);
  } catch (err) {
    console.error('[navigateTo] pushState failed:', err);
    navigationErrorCount++;
    if (fallback) {
      try {
        window.location.href = base + relativePath;
      } catch (fallbackErr) {
        console.error('[navigateTo] Fallback navigation also failed:', fallbackErr);
        navigationErrorCount++;
      }
    }
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
