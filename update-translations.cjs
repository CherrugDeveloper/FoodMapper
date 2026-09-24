const fs = require('fs');
const path = require('path');

// Function to flatten a nested object into dotted keys
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

// Function to extract placeholders from a string (e.g., {{kcal}})
function extractPlaceholders(str) {
  const matches = str.match(/\{\{[^}]+\}\}/g);
  return matches ? new Set(matches) : new Set();
}

// Read all translation files
const locales = ['en', 'it', 'es', 'de', 'fr'];
const translations = {};
locales.forEach(locale => {
  const filePath = path.join('public', 'locales', locale, 'translation.json');
  const content = fs.readFileSync(filePath, 'utf8');
  translations[locale] = JSON.parse(content);
});

// Flatten each translation
const flattened = {};
locales.forEach(locale => {
  flattened[locale] = flattenObject(translations[locale]);
});

// Extract keys from source code (t() calls)
const sourceCodeKeys = new Set();
// We'll use a regex to find t('key') or t("key")
// We'll scan all .tsx and .ts files in src
const srcDir = path.join('src');
function scanDir(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      scanDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const matches = content.match(/t\(['"]([^'"]+)['"]\)/g);
      if (matches) {
        matches.forEach(match => {
          const key = match.match(/t\(['"]([^'"]+)['"]\)/)[1];
          sourceCodeKeys.add(key);
        });
      }
    }
  });
}
scanDir(srcDir);

console.log(`Found ${sourceCodeKeys.size} unique keys in source code`);

// Check each language for missing keys
locales.forEach(locale => {
  const missingKeys = [];
  sourceCodeKeys.forEach(key => {
    if (!flattened[locale].hasOwnProperty(key)) {
      missingKeys.push(key);
    }
  });
  console.log(`${locale}: ${missingKeys.length} missing keys`);
  if (missingKeys.length > 0) {
    // For English, use Italian as source for missing keys
    // For others, use English as source (which we will update from Italian)
    const sourceLocale = locale === 'en' ? 'it' : 'en';
    missingKeys.forEach(key => {
      if (flattened[sourceLocale].hasOwnProperty(key)) {
        // Set the value in the nested object
        // We need to set the value in the original translations object
        const keys = key.split('.');
        let obj = translations[locale];
        for (let i = 0; i < keys.length - 1; i++) {
          if (!obj[keys[i]]) {
            obj[keys[i]] = {};
          }
          obj = obj[keys[i]];
        }
        obj[keys[keys.length - 1]] = flattened[sourceLocale][key];
        console.log(`  Added ${locale}.${key} = "${flattened[sourceLocale][key]}"`);
      } else {
        console.log(`  Warning: Key ${key} not found in source locale ${sourceLocale}`);
      }
    });
    // Write back the file
    const filePath = path.join('public', 'locales', locale, 'translation.json');
    fs.writeFileSync(filePath, JSON.stringify(translations[locale], null, 2));
    console.log(`  Updated ${filePath}`);
  }
});

// Now, check placeholder consistency for keys that exist in both English and each target language
console.log('\nChecking placeholder consistency...');
const enFlattened = flattenObject(translations.en);
locales.forEach(locale => {
  if (locale === 'en') return;
  const targetFlattened = flattenObject(translations.locale);
  sourceCodeKeys.forEach(key => {
    if (enFlattened.hasOwnProperty(key) && targetFlattened.hasOwnProperty(key)) {
      const enPlaceholders = extractPlaceholders(enFlattened[key]);
      const targetPlaceholders = extractPlaceholders(targetFlattened[key]);
      if (!enPlaceholders.size && !targetPlaceholders.size) return; // No placeholders, OK
      const enArr = Array.from(enPlaceholders);
      const targetArr = Array.from(targetPlaceholders);
      if (enArr.length !== targetArr.length) {
        console.log(`${locale}.${key}: placeholder count mismatch - EN: ${enArr.join(', ')}, ${locale}: ${targetArr.join(', ')}`);
      } else {
        // Check each placeholder
        for (const ph of enPlaceholders) {
          if (!targetPlaceholders.has(ph)) {
            console.log(`${locale}.${key}: missing placeholder ${ph} in ${locale} (found in EN)`);
          }
        }
        for (const ph of targetPlaceholders) {
          if (!enPlaceholders.has(ph)) {
            console.log(`${locale}.${key}: extra placeholder ${ph} in ${locale} (not in EN)`);
          }
        }
      }
    }
  });
});

console.log('\nDone.');