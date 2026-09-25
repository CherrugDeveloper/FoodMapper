import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

const viteConfigContent = readFileSync(join(__dirname, '../vite.config.ts'), 'utf-8');

describe('vite.config.ts - Medium/Low Priority Fixes', () => {
  it('base is set to \'./\' not \'/FoodMapper/\'', () => {
    expect(viteConfigContent).toContain("base: './'");
  });

  it('chunkSizeWarningLimit is set to 1000', () => {
    expect(viteConfigContent).toContain('chunkSizeWarningLimit: 1000');
  });

  it('has react and tailwindcss plugins', () => {
    expect(viteConfigContent).toContain("react()");
    expect(viteConfigContent).toContain("tailwindcss()");
  });

  it('server host is set to true', () => {
    expect(viteConfigContent).toContain('host: true');
  });
});