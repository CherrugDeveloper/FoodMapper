const fs = require('fs');
const path = require('path');

function extractRealTranslationKeys(dir) {
  const keys = new Set();
  function scanDir(currentDir) {
    try {
      const files = fs.readdirSync(currentDir);
      for (const file of files) {
        const fullPath = path.join(currentDir, file);
        let stat;
        try { stat = fs.statSync(fullPath); } catch (e) { continue; }
        if (stat.isDirectory()) {
          scanDir(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
          try {
            const content = fs.readFileSync(fullPath, 'utf8');
            const singleQuoteMatches = content.match(/t\('([^'\\]*(?:\\.[^'\\]*)*)'\)/g) || [];
            const doubleQuoteMatches = content.match(/t\("([^"\\]*(?:\\.[^"\\]*)*)"\)/g) || [];
            for (const match of singleQuoteMatches) {
              const keyMatch = match.match(/t\('([^'\\]*(?:\\.[^'\\]*)*)'\)/);
              if (keyMatch && keyMatch[1]) {
                const key = keyMatch[1];
                if (key && !key.includes('${') && !key.includes('}') && key !== 'T' && key !== '') {
                  keys.add(key);
                }
              }
            }
            for (const match of doubleQuoteMatches) {
              const keyMatch = match.match(/t\("([^"\\]*(?:\\.[^"\\]*)*)"\)/);
              if (keyMatch && keyMatch[1]) {
                const key = keyMatch[1];
                if (key && !key.includes('${') && !key.includes('}') && key !== 'T' && key !== '') {
                  keys.add(key);
                }
              }
            }
          } catch (e) {
            console.error(`Error reading ${fullPath}:`, e.message);
          }
        }
      }
    } catch (e) {
      console.error(`Error scanning directory ${currentDir}:`, e.message);
    }
  }
  scanDir(dir);
  return keys;
}

function flattenObject(obj, prefix = '') {
  return Object.keys(obj).reduce((acc, key) => {
    const pre = prefix.length ? `${prefix}.` : '';
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      Object.assign(acc, flattenObject(obj[key], pre + key));
    } else {
      acc[pre + key] = obj[key];
    }
    return acc;
  }, {});
}

const locales = ['en', 'it', 'es', 'de', 'fr'];
const translations = {};
const flattened = {};

for (const locale of locales) {
  const filePath = path.join('public', 'locales', locale, 'translation.json');
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    translations[locale] = JSON.parse(content);
    flattened[locale] = flattenObject(translations[locale]);
  } catch (e) {
    console.error(`Error reading ${filePath}:`, e.message);
    process.exit(1);
  }
}

const srcDir = path.join('src');
const sourceCodeKeys = extractRealTranslationKeys(srcDir);

// Get all keys from Italian (most complete)
const itKeys = new Set(Object.keys(flattened.it));
const enKeys = new Set(Object.keys(flattened.en));

// Keys in Italian but not in English
const missingInEn = Array.from(itKeys).filter(k => !enKeys.has(k)).sort();

// Keys in source code but not in English
const missingInEnFromSource = Array.from(sourceCodeKeys).filter(k => !enKeys.has(k)).sort();

// Keys in source code but not in Italian
const missingInItFromSource = Array.from(sourceCodeKeys).filter(k => !itKeys.has(k)).sort();

console.log('=== Keys in Italian but not in English ===');
console.log(`Total: ${missingInEn.length}`);
for (const key of missingInEn) {
  const itValue = flattened.it[key];
  console.log(`${key} = "${itValue}"`);
}

console.log('\n=== Keys in source code but not in English ===');
console.log(`Total: ${missingInEnFromSource.length}`);
for (const key of missingInEnFromSource) {
  const itValue = flattened.it[key] || '(not in Italian either)';
  console.log(`${key} = "${itValue}"`);
}

console.log('\n=== Keys in source code but not in Italian ===');
console.log(`Total: ${missingInItFromSource.length}`);
for (const key of missingInItFromSource) {
  console.log(`${key}`);
}

// Check for keys that are in source code but not in any locale
const allLocaleKeys = new Set();
for (const locale of locales) {
  for (const key of Object.keys(flattened[locale])) {
    allLocaleKeys.add(key);
  }
}
const missingInAll = Array.from(sourceCodeKeys).filter(k => !allLocaleKeys.has(k)).sort();
console.log('\n=== Keys in source code but not in ANY locale ===');
console.log(`Total: ${missingInAll.length}`);
for (const key of missingInAll) {
  console.log(`${key}`);
}