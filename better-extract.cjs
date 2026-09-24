const fs = require('fs');
const path = require('path');

// Function to extract REAL t() calls from source code (avoiding template literals in JSX)
function extractRealTranslationKeys(dir) {
  const keys = new Set();
  
  function scanDir(currentDir) {
    try {
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
            
            // Match t('single-quoted'), t("double-quoted"), but NOT t(`template-literal`)
            // We'll be more careful to avoid matching inside JSX template literals
            const singleQuoteMatches = content.match(/t\('([^'\\]*(?:\\.[^'\\]*)*)'\)/g) || [];
            const doubleQuoteMatches = content.match(/t\("([^"\\]*(?:\\.[^"\\]*)*)"\)/g) || [];
            
            // Process single quotes
            for (const match of singleQuoteMatches) {
              const keyMatch = match.match(/t\('([^'\\]*(?:\\.[^'\\]*)*)'\)/);
              if (keyMatch && keyMatch[1]) {
                const key = keyMatch[1];
                // Filter out obvious false positives
                if (key && !key.includes('${') && !key.includes('}') && key !== 'T' && key !== '') {
                  keys.add(key);
                }
              }
            }
            
            // Process double quotes
            for (const match of doubleQuoteMatches) {
              const keyMatch = match.match(/t\("([^"\\]*(?:\\.[^"\\]*)*)"\)/);
              if (keyMatch && keyMatch[1]) {
                const key = keyMatch[1];
                // Filter out obvious false positives
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

// Function to flatten nested objects
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
    console.log(`${locale}: loaded ${Object.keys(translations[locale]).length} top-level keys`);
  } catch (e) {
    console.error(`Error reading ${filePath}:`, e.message);
    process.exit(1);
  }
}

// Extract REAL keys from source code
const srcDir = path.join('src');
const sourceCodeKeys = extractRealTranslationKeys(srcDir);
console.log(`\nFound ${sourceCodeKeys.size} REAL unique keys in source code`);

// Show first 30 keys for verification
console.log('\nFirst 30 source keys:');
const first30 = Array.from(sourceCodeKeys).slice(0, 30);
for (const key of first30) {
  console.log(`  ${key}`);
}
if (sourceCodeKeys.size > 30) {
  console.log(`  ... and ${sourceCodeKeys.size - 30} more`);
}

// Check each language for missing keys (English as source)
console.log('\n=== Missing keys per locale (English as source) ===');

for (const locale of locales) {
  if (locale === 'en') {
    console.log(`\nen (source): Reference language`);
    continue;
  }
  const missingKeys = [];
  for (const key of sourceCodeKeys) {
    if (!flattened[locale].hasOwnProperty(key)) {
      missingKeys.push(key);
    }
  }
  
  console.log(`${locale}: ${missingKeys.length} missing keys out of ${sourceCodeKeys.size} source keys`);
  
  // Show first 15 missing keys
  const showCount = Math.min(15, missingKeys.length);
  if (showCount > 0) {
    console.log(`  First ${showCount} missing keys:`);
    for (let i = 0; i < showCount; i++) {
      console.log(`    - ${missingKeys[i]}`);
    }
    if (missingKeys.length > 15) {
      console.log(`    ... and ${missingKeys.length - 15} more`);
    }
  }
  
  // Check placeholder consistency for keys that exist in both English and this locale
  const commonKeys = [];
  for (const key of sourceCodeKeys) {
    if (flattened['en'].hasOwnProperty(key) && flattened[locale].hasOwnProperty(key)) {
      commonKeys.push(key);
    }
  }
  
  if (commonKeys.length > 0) {
    console.log(`  Common keys with English: ${commonKeys.length}`);
    const placeholderIssues = [];
    
    for (const key of commonKeys) {
      const enValue = flattened['en'][key];
      const localeValue = flattened[locale][key];
      
      // Extract placeholders
      const extractPlaceholders = (str) => {
        if (typeof str !== 'string') return new Set();
        const matches = str.match(/\{\{[^}]+\}\}/g);
        return matches ? new Set(matches) : new Set();
      };
      
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

// Summary of what we found
console.log('\n=== Summary ===');
console.log(`Source code uses ${sourceCodeKeys.size} unique translation keys`);
console.log(`English file has ${Object.keys(translations.en).length} top-level keys`);
console.log(`Italian file has ${Object.keys(translations.it).length} top-level keys`);
console.log(`Spanish file has ${Object.keys(translations.es).length} top-level keys`);
console.log(`German file has ${Object.keys(translations.de).length} top-level keys`);
console.log(`French file has ${Object.keys(translations.fr).length} top-level keys`);

console.log('\n=== Next Steps ===');
console.log('1. Use Italian as reference to understand the expected structure');
console.log('2. Add missing keys to English file with proper English translations');
console.log('3. Synchronize other languages with English (not Italian)');
console.log('4. Fix placeholder consistency');
console.log('5. Run build and lint checks');