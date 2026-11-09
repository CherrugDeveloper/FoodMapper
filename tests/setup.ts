import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Test location mock - a fully mockable location object for testing
// This is used by the navigation module's getTestLocation function
const testLocationState = {
  _href: 'http://localhost/',
  _hostname: 'localhost',
  _pathname: '/',
  _search: '',
  _hash: '',
  _origin: 'http://localhost',
  _port: '',
  _protocol: 'http:',
};

export const testLocation = {
  get href() {
    return testLocationState._href;
  },
  set href(value: string) {
    testLocationState._href = value;
    try {
      const url = new URL(value);
      testLocationState._hostname = url.hostname;
      testLocationState._pathname = url.pathname;
      testLocationState._search = url.search;
      testLocationState._hash = url.hash;
      testLocationState._origin = url.origin;
      testLocationState._port = url.port;
      testLocationState._protocol = url.protocol;
    } catch {
      // If URL parsing fails, just keep the raw value
    }
  },
  get hostname() {
    return testLocationState._hostname;
  },
  set hostname(value: string) {
    testLocationState._hostname = value;
  },
  get pathname() {
    return testLocationState._pathname;
  },
  set pathname(value: string) {
    testLocationState._pathname = value;
  },
  get search() {
    return testLocationState._search;
  },
  set search(value: string) {
    testLocationState._search = value;
  },
  get hash() {
    return testLocationState._hash;
  },
  set hash(value: string) {
    testLocationState._hash = value;
  },
  get origin() {
    return testLocationState._origin;
  },
  set origin(value: string) {
    testLocationState._origin = value;
  },
  get port() {
    return testLocationState._port;
  },
  set port(value: string) {
    testLocationState._port = value;
  },
  get protocol() {
    return testLocationState._protocol;
  },
  set protocol(value: string) {
    testLocationState._protocol = value;
  },
  get host() {
    return testLocationState._hostname + (testLocationState._port ? ':' + testLocationState._port : '');
  },
  set host(value: string) {
    const [hostname, port] = value.split(':');
    testLocationState._hostname = hostname;
    testLocationState._port = port || '';
  },
  assign: vi.fn(),
  replace: vi.fn(),
  reload: vi.fn(),
  toString: vi.fn().mockImplementation(() => testLocationState._href),
};

// Helper function to reset location state for tests
export const resetTestLocation = () => {
  testLocationState._href = 'http://localhost/';
  testLocationState._hostname = 'localhost';
  testLocationState._pathname = '/';
  testLocationState._search = '';
  testLocationState._hash = '';
  testLocationState._origin = 'http://localhost';
  testLocationState._port = '';
  testLocationState._protocol = 'http:';
};

// Helper to set location href and sync all properties
export const setTestLocationHref = (href: string) => {
  testLocation.href = href;
};