const fs = require('fs');
const path = require('path');

const locales = ['en', 'it', 'es', 'de', 'fr'];
const translations = {};
const flattened = {};

function flattenObject(obj, prefix = '') {
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.assign(result, flattenObject(value, fullKey));
    } else {
      result[fullKey] = value;
    }
  }
  return result;
}

function extractPlaceholders(str) {
  if (typeof str !== 'string') return new Set();
  const matches = str.match(/\{\{[^}]+\}\}/g);
  return new Set(matches || []);
}

console.log('=== Loading translation files ===');
for (const locale of locales) {
  const filePath = path.join('public', 'locales', locale, 'translation.json');
  const content = fs.readFileSync(filePath, 'utf8');
  translations[locale] = JSON.parse(content);
  flattened[locale] = flattenObject(translations[locale]);
  console.log(`${locale}: ${Object.keys(translations[locale]).length} top-level keys, ${Object.keys(flattened[locale]).length} flattened keys`);
}

// Compare English (source) against all other locales
console.log('\n=== Key comparison (English as source) ===');
const enKeys = Object.keys(flattened.en).sort();
for (const locale of ['it', 'es', 'de', 'fr']) {
  const missing = enKeys.filter(key => !(key in flattened[locale]));
  const extra = Object.keys(flattened[locale]).filter(key => !(key in flattened.en));
  console.log(`${locale}: missing ${missing.length}, extra ${extra.length}`);
  if (missing.length) {
    console.log(`  Missing: ${missing.slice(0, 12).join(', ')}${missing.length > 12 ? ' ...' : ''}`);
  }
  if (extra.length) {
    console.log(`  Extra: ${extra.slice(0, 12).join(', ')}${extra.length > 12 ? ' ...' : ''}`);
  }
}

// Placeholder consistency across locales
console.log('\n=== Placeholder consistency ===');
for (const locale of ['it', 'es', 'de', 'fr']) {
  const issues = [];
  for (const key of enKeys) {
    if (!flattened[locale][key]) continue;
    const enPlaceholders = extractPlaceholders(flattened.en[key]);
    const localePlaceholders = extractPlaceholders(flattened[locale][key]);
    if (enPlaceholders.size !== localePlaceholders.size ||
        [...enPlaceholders].some(p => !localePlaceholders.has(p))) {
      issues.push(`${key}: EN=[${[...enPlaceholders].join(', ')}] ${locale}=[${[...localePlaceholders].join(', ')}]`);
    }
  }
  console.log(`${locale}: ${issues.length} placeholder issues`);
  if (issues.length) {
    issues.slice(0, 8).forEach(issue => console.log(`  - ${issue}`));
    if (issues.length > 8) console.log(`  ... and ${issues.length - 8} more`);
  }
}

// Detect untranslated English in non-English files
console.log('\n=== Potential untranslated English ===');
for (const locale of ['it', 'es', 'de', 'fr']) {
  const candidates = [];
  for (const key of Object.keys(flattened[locale])) {
    const value = flattened[locale][key];
    if (typeof value === 'string' && value.length > 4 && /[A-Za-z]{4}/.test(value)) {
      // Check if value matches English exactly or contains long English phrases
      const enValue = flattened.en[key];
      if (enValue === value || (typeof enValue === 'string' && enValue.length > 8 && value === enValue)) {
        candidates.push(key);
      }
    }
  }
  console.log(`${locale}: ${candidates.length} exact English matches`);
  if (candidates.length) console.log(`  ${candidates.slice(0, 15).join(', ')}${candidates.length > 15 ? ' ...' : ''}`);
}

// Empty values
console.log('\n=== Empty values ===');
for (const locale of locales) {
  const empty = Object.entries(flattened[locale]).filter(([key, value]) => typeof value === 'string' && value.trim() === '');
  console.log(`${locale}: ${empty.length} empty values`);
  if (empty.length) console.log(`  ${empty.slice(0, 10).map(([key]) => key).join(', ')}${empty.length > 10 ? ' ...' : ''}`);
}

// Key families summary
console.log('\n=== Key families (top-level) ===');
const families = {};
for (const key of enKeys) {
  const family = key.split('.')[0];
  families[family] = (families[family] || 0) + 1;
}
for (const [family, count] of Object.entries(families).sort()) {
  console.log(`${family}: ${count}`);
}
