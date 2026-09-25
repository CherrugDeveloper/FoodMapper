import { describe, it, expect } from 'vitest';
import packageJson from '../package.json';

describe('package.json - Low Priority Fixes', () => {
  it('TypeScript version is 5.6.x', () => {
    const tsVersion = packageJson.devDependencies?.typescript;
    expect(tsVersion).toBeDefined();
    // Version string includes ^ prefix, so match against that
    expect(tsVersion).toMatch(/^\^5\.6\./);
  });

  it('Vite version is 5.4.x', () => {
    const viteVersion = packageJson.devDependencies?.vite;
    expect(viteVersion).toBeDefined();
    expect(viteVersion).toMatch(/^\^5\.4\./);
  });

  it('React version is 19 compatible', () => {
    const reactVersion = packageJson.dependencies?.react;
    const reactDomVersion = packageJson.dependencies?.['react-dom'];
    expect(reactVersion).toBeDefined();
    expect(reactDomVersion).toBeDefined();
    // React 19.x
    expect(reactVersion).toMatch(/^\^19\./);
    expect(reactDomVersion).toMatch(/^\^19\./);
  });

  it('i18next dependencies are present', () => {
    expect(packageJson.dependencies?.i18next).toBeDefined();
    expect(packageJson.dependencies?.['i18next-http-backend']).toBeDefined();
    expect(packageJson.dependencies?.['i18next-browser-languagedetector']).toBeDefined();
    expect(packageJson.dependencies?.['react-i18next']).toBeDefined();
  });

  it('tailwindcss and @tailwindcss/vite are present', () => {
    expect(packageJson.dependencies?.['@tailwindcss/vite']).toBeDefined();
    expect(packageJson.devDependencies?.tailwindcss).toBeDefined();
  });

  it('eslint and typescript-eslint are present', () => {
    expect(packageJson.devDependencies?.eslint).toBeDefined();
    expect(packageJson.devDependencies?.['typescript-eslint']).toBeDefined();
  });
});