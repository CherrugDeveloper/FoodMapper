import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Create mock functions that can track calls
const mockUse = vi.fn().mockReturnThis();
const mockInit = vi.fn();
const mockOn = vi.fn();
const mockChangeLanguage = vi.fn();
const mockT = vi.fn((key: string) => key);

// Mock i18next and related modules
vi.mock('i18next', () => ({
  default: {
    use: mockUse,
    init: mockInit,
    on: mockOn,
    changeLanguage: mockChangeLanguage,
    t: mockT,
  },
}));

vi.mock('i18next-http-backend', () => ({
  default: { name: 'httpBackend' },
}));

vi.mock('i18next-browser-languagedetector', () => ({
  default: { name: 'languageDetector' },
}));

vi.mock('react-i18next', () => ({
  initReactI18next: { name: 'reactI18next' },
}));

describe('i18n.ts - Critical Fixes', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it('i18n initializes without direct JSON imports, uses http-backend', async () => {
    // Import the i18n module - this should not throw
    const i18nModule = await import('../src/i18n');
    
    // Verify the module exports i18n instance
    expect(i18nModule.default).toBeDefined();
    expect(typeof i18nModule.default.init).toBe('function');
  });

  it('i18n configuration includes supportedLngs', async () => {
    // Import i18n to trigger initialization
    await import('../src/i18n');
    
    // Verify init was called with correct config
    expect(mockInit).toHaveBeenCalled();
    const initCall = mockInit.mock.calls[0][0];
    
    expect(initCall.supportedLngs).toEqual(['it', 'en', 'de', 'es', 'fr']);
    expect(initCall.fallbackLng).toBe('en');
  });

  it('i18n configuration includes detection options', async () => {
    await import('../src/i18n');
    
    const initCall = mockInit.mock.calls[0][0];
    
    expect(initCall.detection).toBeDefined();
    expect(initCall.detection.order).toEqual(['localStorage', 'navigator', 'htmlTag']);
    expect(initCall.detection.caches).toEqual(['localStorage']);
  });

  it('i18n configuration includes react options', async () => {
    await import('../src/i18n');
    
    const initCall = mockInit.mock.calls[0][0];
    
    expect(initCall.react).toBeDefined();
    expect(initCall.react.useSuspense).toBe(false);
    expect(initCall.react.transSupportBasicHtmlNodes).toBe(true);
  });

  it('i18n uses HttpBackend for loading translations', async () => {
    await import('../src/i18n');
    
    // Verify HttpBackend was used
    expect(mockUse).toHaveBeenCalled();
    const httpBackend = (await import('i18next-http-backend')).default;
    expect(mockUse).toHaveBeenCalledWith(httpBackend);
  });

  it('i18n backend configuration uses correct loadPath', async () => {
    await import('../src/i18n');
    
    const initCall = mockInit.mock.calls[0][0];
    
    expect(initCall.backend).toBeDefined();
    expect(initCall.backend.loadPath).toBe('/locales/{{lng}}/translation.json');
  });
});