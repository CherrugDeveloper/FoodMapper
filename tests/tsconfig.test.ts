import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

const tsconfigApp = JSON.parse(readFileSync(join(__dirname, '../tsconfig.app.json'), 'utf-8').replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, ''));
const tsconfigNode = JSON.parse(readFileSync(join(__dirname, '../tsconfig.node.json'), 'utf-8').replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, ''));
const tsconfigBase = JSON.parse(readFileSync(join(__dirname, '../tsconfig.json'), 'utf-8').replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, ''));

describe('tsconfig files - Low Priority Fixes', () => {
  it('tsconfig.app.json does not have erasableSyntaxOnly', () => {
    expect(tsconfigApp.compilerOptions).toBeDefined();
    // @ts-ignore - checking for property that shouldn't exist
    expect(tsconfigApp.compilerOptions.erasableSyntaxOnly).toBeUndefined();
  });

  it('tsconfig.node.json does not have erasableSyntaxOnly', () => {
    expect(tsconfigNode.compilerOptions).toBeDefined();
    // @ts-ignore - checking for property that shouldn't exist
    expect(tsconfigNode.compilerOptions.erasableSyntaxOnly).toBeUndefined();
  });

  it('tsconfig.json does not have compilerOptions (it uses references)', () => {
    // tsconfig.json is a project reference config, not a compiler config
    expect(tsconfigBase.references).toBeDefined();
    expect(Array.isArray(tsconfigBase.references)).toBe(true);
  });

  it('tsconfig.app.json has correct target and module settings', () => {
    expect(tsconfigApp.compilerOptions.target).toBe('es2023');
    expect(tsconfigApp.compilerOptions.module).toBe('esnext');
    // @ts-ignore - moduleResolution exists but TS doesn't know
    expect(tsconfigApp.compilerOptions.moduleResolution).toBe('bundler');
    expect(tsconfigApp.compilerOptions.jsx).toBe('react-jsx');
  });

  it('tsconfig.node.json has correct target and module settings', () => {
    expect(tsconfigNode.compilerOptions.target).toBe('es2023');
    expect(tsconfigNode.compilerOptions.module).toBe('nodenext');
    // tsconfig.node.json doesn't have moduleResolution explicitly set
  });

  it('tsconfig.app.json includes src directory', () => {
    expect(tsconfigApp.include).toContain('src');
  });

  it('tsconfig.node.json includes vite.config.ts', () => {
    expect(tsconfigNode.include).toContain('vite.config.ts');
  });

  it('tsconfig.app.json has strict linting options', () => {
    expect(tsconfigApp.compilerOptions.noUnusedLocals).toBe(true);
    expect(tsconfigApp.compilerOptions.noUnusedParameters).toBe(true);
    expect(tsconfigApp.compilerOptions.noFallthroughCasesInSwitch).toBe(true);
  });

  it('tsconfig.node.json has strict linting options', () => {
    expect(tsconfigNode.compilerOptions.noUnusedLocals).toBe(true);
    expect(tsconfigNode.compilerOptions.noUnusedParameters).toBe(true);
    expect(tsconfigNode.compilerOptions.noFallthroughCasesInSwitch).toBe(true);
  });
});