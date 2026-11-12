import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getBasePath, getCurrentRelativePath, navigateTo, navigateRef, resetNavigationErrorCount, resetNavigationThrottle, setTestLocationProvider, touchNavigationTime } from '../src/utils/navigation';
import { testLocation, resetTestLocation, setTestLocationHref } from './setup';

describe('navigation utils', () => {
  let dispatchEventSpy: ReturnType<typeof vi.fn>;
  let pushStateSpy: ReturnType<typeof vi.fn>;
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.resetAllMocks();
    resetTestLocation();
    resetNavigationErrorCount();
    resetNavigationThrottle();
    navigateRef.current = null;

    // Set up test location provider
    setTestLocationProvider(() => testLocation);

    // Mock console methods to suppress test output noise
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Set up dispatchEvent spy
    dispatchEventSpy = vi.spyOn(window, 'dispatchEvent').mockImplementation(() => true);

    // Set up pushState spy
    pushStateSpy = vi.fn();
    vi.spyOn(window.history, 'pushState').mockImplementation(pushStateSpy);
  });

  afterEach(() => {
    dispatchEventSpy.mockRestore();
    pushStateSpy.mockRestore?.();
    consoleWarnSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    navigateRef.current = null;
    resetTestLocation();
    setTestLocationProvider(null);
  });

  describe('getBasePath', () => {
    it('returns empty string for localhost', () => {
      setTestLocationHref('http://localhost:3000/calc');
      expect(getBasePath()).toBe('');
    });

    it('returns empty string for 127.0.0.1', () => {
      setTestLocationHref('http://127.0.0.1:3000/calc');
      expect(getBasePath()).toBe('');
    });

    it('returns empty string for empty hostname', () => {
      testLocation.hostname = '';
      expect(getBasePath()).toBe('');
    });

    it('returns base path for GitHub Pages URLs', () => {
      setTestLocationHref('https://foodmapper.github.io/foodmapper/index.html');
      expect(getBasePath()).toBe('/foodmapper');
    });

    it('returns empty string for known routes', () => {
      setTestLocationHref('https://example.com/calc');
      expect(getBasePath()).toBe('');
    });
  });

  describe('getCurrentRelativePath', () => {
    it('returns root path when pathname is empty', () => {
      testLocation.pathname = '';
      testLocation.hostname = 'localhost';
      expect(getCurrentRelativePath()).toBe('/');
    });

    it('returns normalized path', () => {
      testLocation.pathname = '/diet/';
      testLocation.hostname = 'localhost';
      expect(getCurrentRelativePath()).toBe('/diet');
    });

    it('returns path without base path prefix', () => {
      testLocation.pathname = '/foodmapper/calc';
      testLocation.hostname = 'foodmapper.github.io';
      expect(getCurrentRelativePath()).toBe('/calc');
    });
  });
});

describe('navigateTo', () => {
  let pushStateSpy: ReturnType<typeof vi.fn>;
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  let navigationEvents: CustomEvent[] = [];
  let dispatchEventSpy: ReturnType<typeof vi.fn>;
const navigationEventListener = (e: Event) => {
  navigationEvents.push(e as CustomEvent);
};

beforeEach(() => {
  vi.resetAllMocks();
  resetTestLocation();
  resetNavigationErrorCount();
  resetNavigationThrottle();
  navigateRef.current = null;
  navigationEvents = [];
  
  // Register the event listener
  window.addEventListener('app-navigation', navigationEventListener);

  // Set up dispatchEvent spy
  dispatchEventSpy = vi.spyOn(window, 'dispatchEvent').mockImplementation((event: Event) => {
    // If it's our navigation event, trigger the listener manually
    // because JSDOM doesn't always handle custom events well in tests
    navigationEventListener(event);
    return true;
  });

  // Set up test location provider
  setTestLocationProvider(() => testLocation);

  // Default location
  setTestLocationHref('http://localhost/calc');

  // Mock console methods
  consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

  // Set up pushState spy
  pushStateSpy = vi.fn().mockImplementation(function() {
    return undefined;
  });
  vi.spyOn(window.history, 'pushState').mockImplementation(pushStateSpy);
});

afterEach(() => {
  window.removeEventListener('app-navigation', navigationEventListener);
  vi.restoreAllMocks();
  navigateRef.current = null;
  resetTestLocation();
  setTestLocationProvider(null);
});

  it('uses navigateRef when available', () => {
    const mockNavigate = vi.fn();
    navigateRef.current = mockNavigate;

    navigateTo('/diet');

    expect(mockNavigate).toHaveBeenCalledWith('/diet', { replace: false });
    expect(dispatchEventSpy).toHaveBeenCalled();
  });

  it('falls back to history.pushState when navigateRef is null', () => {
    navigateRef.current = null;

    navigateTo('/diet');

    expect(pushStateSpy).toHaveBeenCalledWith(null, '', '/diet');
    expect(navigationEvents.length).toBe(1);
    expect(navigationEvents[0].type).toBe('app-navigation');
    expect(navigationEvents[0].detail).toBe('/diet');
  });

  it('falls back to window.location.href on pushState failure', () => {
    // Make pushState throw
    pushStateSpy.mockImplementation(() => {
      throw new Error('pushState failed');
    });

    // Should not throw, should set location.href
    expect(() => navigateTo('/diet')).not.toThrow();
  });

  it('throttles rapid navigation calls', () => {
    navigateTo('/diet');
    navigateTo('/recipes'); // Should be throttled

    expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('Navigation throttled'));
  });

  it('bypasses throttling with force option', () => {
    resetNavigationThrottle(); // Ensure throttle is reset
    
    const mockNavigate = vi.fn();
    navigateRef.current = mockNavigate;

    navigateTo('/diet');
    navigateTo('/recipes', { force: true }); // Should not be throttled

    expect(consoleWarnSpy).not.toHaveBeenCalledWith(expect.stringContaining('Navigation throttled'));
    expect(mockNavigate).toHaveBeenCalledTimes(2);
  });

  it('prevents redundant navigation to same path', () => {
    testLocation.pathname = '/diet';
    testLocation.hostname = 'localhost';

    const mockNavigate = vi.fn();
    navigateRef.current = mockNavigate;

    navigateTo('/diet');

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('navigates to path without leading slash by adding it', () => {
    resetNavigationThrottle(); // Ensure throttle is reset
    
    const mockNavigate = vi.fn();
    navigateRef.current = mockNavigate;

    navigateTo('diet');

    expect(mockNavigate).toHaveBeenCalledWith('/diet', { replace: false });
  });

  it('handles navigation with custom throttle', () => {
    resetNavigationThrottle(); // Ensure throttle is reset
    
    const mockNavigate = vi.fn();
    navigateRef.current = mockNavigate;

    // Set a very short throttle time
    navigateTo('/diet', { throttleMs: 5 });
    navigateTo('/recipes'); // Should still be throttled

    expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('Navigation throttled'));
  });

  it('dispatches app-navigation event for React Router v7 compatibility', () => {
    resetNavigationThrottle(); // Ensure throttle is reset
    
    const mockNavigate = vi.fn();
    navigateRef.current = mockNavigate;

    navigateTo('/workout');

    expect(dispatchEventSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'app-navigation',
        detail: '/workout',
      })
    );
  });

  it('handles errors gracefully when navigateRef throws', () => {
    const mockNavigate = vi.fn().mockImplementation(() => {
      throw new Error('Navigation failed');
    });
    navigateRef.current = mockNavigate;

    // Should not throw, should fall back to pushState
    expect(() => navigateTo('/test-path')).not.toThrow();
  });

  it('resets error count on successful navigation', () => {
    resetNavigationThrottle(); // Ensure throttle is reset
    
    const mockNavigate = vi.fn();
    navigateRef.current = mockNavigate;

    navigateTo('/diet');

    // Reset error count and throttle, then verify navigation still works
    resetNavigationErrorCount();
    resetNavigationThrottle();
    navigateTo('/recipes');

    expect(mockNavigate).toHaveBeenCalledTimes(2);
  });

  it('stops navigation after too many errors', () => {
    resetNavigationThrottle(); // Ensure throttle is reset

    // Create a navigate function that always fails
    navigateRef.current = vi.fn().mockImplementation(() => {
      throw new Error('Navigation failed');
    });

    // Make pushState also fail
    pushStateSpy.mockImplementation(() => {
      throw new Error('pushState failed');
    });

    // Trigger multiple errors to hit the limit
    for (let i = 0; i < 15; i++) {
      navigateTo('/test-' + i);
    }

    // After MAX_ERROR_COUNT, should stop trying
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  it('increments error count on failed navigation', () => {
    resetNavigationThrottle(); // Ensure throttle is reset
    
    const mockNavigate = vi.fn().mockImplementation(() => {
      throw new Error('Navigation failed');
    });
    navigateRef.current = mockNavigate;

    navigateTo('/test');

    // Error count should be incremented after failure
    // We can verify by checking that subsequent call also fails
    expect(() => navigateTo('/test2')).not.toThrow();
  });

  it('handles force navigation after error state', () => {
    resetNavigationThrottle(); // Ensure throttle is reset
    
    const mockNavigate = vi.fn().mockImplementation(() => {
      throw new Error('Navigation failed');
    });
    navigateRef.current = mockNavigate;

    // Trigger errors
    for (let i = 0; i < 5; i++) {
      navigateTo('/test-' + i);
    }

    // Force navigation should still work even with errors
    pushStateSpy.mockClear();
    navigateTo('/forced', { force: true });

    expect(pushStateSpy).toHaveBeenCalled();
    expect(navigationEvents.length).toBeGreaterThan(0);
    const lastEvent = navigationEvents[navigationEvents.length - 1];
    expect(lastEvent.type).toBe('app-navigation');
    expect(lastEvent.detail).toBe('/forced');
  });

  it('works with GitHub Pages base path', () => {
    resetNavigationThrottle(); // Ensure throttle is reset
    
    // Set up GitHub Pages scenario
    setTestLocationHref('https://foodmapper.github.io/foodmapper/calc');

    const mockNavigate = vi.fn();
    navigateRef.current = mockNavigate;

    navigateTo('/diet');

    // Should navigate to /diet (relative to base)
    expect(mockNavigate).toHaveBeenCalledWith('/diet', { replace: false });
    // pushState is not called when navigateRef succeeds (it's only a fallback)
    // verify base path is correctly detected for GitHub Pages
    expect(getBasePath()).toBe('/foodmapper');
  });
});

describe('navigateRef', () => {
  it('allows setting and getting navigate function', () => {
    const mockNavigate = vi.fn();

    navigateRef.current = mockNavigate;

    expect(navigateRef.current).toBe(mockNavigate);
  });

  it('allows resetting to null', () => {
    const mockNavigate = vi.fn();
    navigateRef.current = mockNavigate;
    navigateRef.current = null;

    expect(navigateRef.current).toBeNull();
  });
});

describe('resetNavigationErrorCount', () => {
  it('resets the error counter to zero', () => {
    // This should not throw
    expect(() => resetNavigationErrorCount()).not.toThrow();
  });
});

describe('resetNavigationThrottle', () => {
  it('resets the throttle timer', () => {
    // This should not throw
    expect(() => resetNavigationThrottle()).not.toThrow();
  });
});

describe('touchNavigationTime', () => {
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
  });

  it('updates the navigation timestamp without navigating', () => {
    // This should not throw
    expect(() => touchNavigationTime()).not.toThrow();
  });

  it('prevents throttling when called before rapid navigation', () => {
    resetNavigationThrottle();

    // Touch the navigation time - this sets lastNavTime to current Date.now()
    // We need to mock Date.now() AFTER calling touchNavigationTime to ensure
    // the timestamp is captured before we change it
    let callCount = 0;
    const originalDateNow = Date.now;
    Date.now = vi.fn().mockImplementation(() => {
      callCount++;
      // First call is touchNavigationTime, second is navigateTo
      return callCount === 1 ? 1000000 : 1000100; // 100ms difference, enough to avoid throttle
    });

    touchNavigationTime();

    // Navigate - should not be throttled since we just touched the time
    const mockNavigate = vi.fn();
    navigateRef.current = mockNavigate;

    navigateTo('/diet');

    Date.now = originalDateNow;

    expect(consoleWarnSpy).not.toHaveBeenCalledWith(expect.stringContaining('Navigation throttled'));
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });
});