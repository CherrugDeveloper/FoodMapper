const fs = require('fs');
const path = require('path');

// Function to flatten nested objects into dotted keys
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
  if (typeof str !== 'string') return new Set();
  const matches = str.match(/\{\{[^}]+\}\}/g);
  return matches ? new Set(matches) : new Set();
}

// Main execution
const locales = ['en', 'it', 'es', 'de', 'fr'];
const translations = {};
const flattened = {};

console.log('=== Reading translation files ===');

// Read all translation files
for (const locale of locales) {
  const filePath = path.join('public', 'locales', locale, 'translation.json');
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    translations[locale] = JSON.parse(content);
    flattened[locale] = flattenObject(translations[locale]);
    console.log(`${locale}: loaded ${Object.keys(translations[locale]).length} keys`);
  } catch (e) {
    console.error(`Error reading ${filePath}:`, e.message);
    process.exit(1);
  }
}

// Extract keys from source code (t() calls)
function extractTranslationKeys(dir) {
  const keys = new Set();
  function scanDir(currentDir) {
    const files = fs.readdirSync(currentDir);
    for (const file of files) {
      const fullPath = path.join(currentDir, file);
      let stat;
      try {
        stat = fs.statSync(fullPath);
      } catch (e) { continue; }
      if (stat.isDirectory()) {
        scanDir(fullPath);
      } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
        try {
          const content = fs.readFileSync(fullPath, 'utf8');
          // Match t('key'), t("key"), t(`key`)
          const matches = content.match(/t\(['"`]([^'"]+)['"`]/g);
          if (matches) {
            for (const match of matches) {
              const key = match.match(/t\(['"`]([^'"]+)['"`]/)[1];
              if (key && key !== 'T' && key !== '') {
                keys.add(key);
              }
            }
          }
        } catch (e) {
          console.error(`Error reading ${fullPath}:`, e.message);
        }
      }
    }
  }
  scanDir(dir);
  return keys;
}

const srcDir = path.join('src');
const sourceCodeKeys = extractTranslationKeys(srcDir);
console.log(`\nFound ${sourceCodeKeys.size} unique keys in source code`);

// Report missing keys per locale (audit only - no modifications)
console.log('\n=== Missing keys per locale (English as source) ===');

for (const locale of locales) {
  if (locale === 'en') {
    console.log(`\nen (source): No missing keys check against itself`);
    continue;
  }
  const missingKeys = [];
  for (const key of sourceCodeKeys) {
    if (flattened[locale] && !flattened[locale].hasOwnProperty(key)) {
      missingKeys.push(key);
    }
  }
  
  console.log(`${locale}: ${missingKeys.length} missing keys out of ${sourceCodeKeys.size} source keys`);
  
  // Show first 20 missing keys
  const showCount = Math.min(20, missingKeys.length);
  if (showCount > 0) {
    console.log(`  First ${showCount} missing keys:`);
    for (let i = 0; i < showCount; i++) {
      console.log(`    - ${missingKeys[i]}`);
    }
    if (missingKeys.length > 20) {
      console.log(`    ... and ${missingKeys.length - 20} more`);
    }
  }
  
  // Check placeholder consistency for keys that exist in both English and this locale
  const commonKeys = [];
  for (const key of sourceCodeKeys) {
    if (flattened['en'] && flattened['en'].hasOwnProperty(key) && 
        flattened[locale] && flattened[locale].hasOwnProperty(key)) {
      commonKeys.push(key);
    }
  }
  
  if (commonKeys.length > 0) {
    console.log(`  Common keys with English: ${commonKeys.length}`);
    const placeholderIssues = [];
    
    for (const key of commonKeys) {
      const enValue = flattened['en'][key];
      const localeValue = flattened[locale][key];
      
      const enPlaceholders = extractPlaceholders(enValue);
      const localePlaceholders = extractPlaceholders(localeValue);
      
      if (enPlaceholders.size !== localePlaceholders.size) {
        placeholderIssues.push(`${key}: count mismatch EN=${enPlaceholders.size} ${locale}=${localePlaceholders.size}`);
      } else {
        const enArr = Array.from(enPlaceholders);
        const localeArr = Array.from(localePlaceholders);
        for (let i = 0; i < enArr.length; i++) {
          if (enArr[i] !== localeArr[i]) {
            placeholderIssues.push(`${key}: placeholder mismatch - EN: ${enArr[i]} vs ${locale}: ${localeArr[i]}`);
          }
        }
      }
    }
    
    if (placeholderIssues.length > 0) {
      console.log('  Placeholder issues:');
      for (const issue of placeholderIssues.slice(0, 10)) {
        console.log(`    - ${issue}`);
      }
      if (placeholderIssues.length > 10) {
        console.log(`    ... and ${placeholderIssues.length - 10} more`);
      }
    }
  }
}

// Report duplicate JSON keys (using raw file parsing)
console.log('\n=== Potential duplicate JSON keys (raw file parsing) ===');

for (const locale of locales) {
  const filePath = path.join('public', 'locales', locale, 'translation.json');
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    // JSON.parse silently overwrites duplicates, so we check raw
    const keyCount = (content.match(/"([^"]+)":/g) || []).length;
    const uniqueKeys = new Set(content.match(/"([^"]+)":/g) || []).size;
    if (keyCount !== uniqueKeys) {
      console.log(`${locale}: ${keyCount} raw key occurrences, ${uniqueKeys} unique - potential duplicates`);
    } else {
      console.log(`${locale}: ${keyCount} keys, all unique`);
    }
  } catch (e) {
    console.error(`Error reading ${filePath}:`, e.message);
  }
}

// Summary of key structure differences
console.log('\n=== Key structure summary ===');
for (const locale of locales) {
  const keys = Object.keys(translations[locale]);
  const categories = keys.filter(k => k.includes('category') || k.includes('Category'));
  const warnings = keys.filter(k => k.includes('warning') || k.includes('Warning') || k.startsWith('warnings'));
  const diary = keys.filter(k => k.startsWith('diary_'));
  const calc = keys.filter(k => k.startsWith('calc_'));
  const waterReminder = keys.filter(k => k.startsWith('water_reminder_'));
  const workout = keys.filter(k => k.startsWith('workout_'));
  const devices = keys.filter(k => k.startsWith('devices_'));
  const hub = keys.filter(k => k.startsWith('hub_'));
  console.log(`${locale}: total=${keys.length} categories=${categories.length} warnings=${warnings.length} diary=${diary.length} calc=${calc.length} water_reminder=${waterReminder.length} workout=${workout.length} devices=${devices.length} hub=${hub.length}`);
}

console.log('\n=== Audit complete. No files were modified. ===');