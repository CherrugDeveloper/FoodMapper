const fs = require('fs');
const path = require('path');

// Function to extract all t() calls from source code
function extractTranslationKeys(dir) {
  const keys = new Set();
  
  function scanDir(currentDir) {
    const files = fs.readdirSync(currentDir);
    for (const file of files) {
      const fullPath = path.join(currentDir, file);
      const stat = fs.statSync(fullPath);
      
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
              if (key && key !== 'T' && key !== '') { // Filter out false positives
                keys.add(key);
              }
            }
          }
          
          // Also match t(variable) patterns for common usage
          // This is more complex, so we'll stick to literal keys for now
        } catch (e) {
          console.error(`Error reading ${fullPath}:`, e.message);
        }
      }
    }
  }
  
  scanDir(dir);
  return keys;
}

// Function to flatten nested objects
function flattenObject(obj, prefix = '') {
  return Object.keys(obj).reduce((acc, key) => {
    const pre = prefix.length ? `${prefix}.` : '';
    if (obj[key] !== null && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      Object.assign(acc, flattenObject(obj[key], pre + key));
    } else {
      acc[pre + key] = obj[key];
    }
    return acc;
  }, {});
}

// Function to unflatten a dotted key into nested object
function setNestedObject(obj, keyPath, value) {
  const keys = keyPath.split('.');
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!current[key]) {
      current[key] = {};
    }
    current = current[key];
  }
  current[keys[keys.length - 1]] = value;
}

// Main execution
const locales = ['en', 'it', 'es', 'de', 'fr'];
const translations = {};
const flattened = {};

// Read all translation files
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

// Extract keys from source code
const srcDir = path.join('src');
const sourceCodeKeys = extractTranslationKeys(srcDir);
console.log(`Found ${sourceCodeKeys.size} unique keys in source code`);

// Check each language for missing keys
const updates = {};

for (const locale of locales) {
  const missingKeys = [];
  for (const key of sourceCodeKeys) {
    if (!flattened[locale].hasOwnProperty(key)) {
      missingKeys.push(key);
    }
  }
  
  if (missingKeys.length > 0) {
    updates[locale] = missingKeys;
    console.log(`${locale}: ${missingKeys.length} missing keys`);
  }
}

// Apply updates
for (const locale of locales) {
  if (!updates[locale]) continue;
  
  const missingKeys = updates[locale];
  const sourceLocale = locale === 'en' ? 'it' : 'en'; // For EN, use IT as source; for others, use EN
  
  console.log(`\nUpdating ${locale} using ${sourceLocale} as source:`);
  
  for (const key of missingKeys) {
    if (flattened[sourceLocale].hasOwnProperty(key)) {
      setNestedObject(translations[locale], key, flattened[sourceLocale][key]);
      console.log(`  Added ${locale}.${key}`);
    } else {
      console.log(`  Warning: Key ${key} not found in source locale ${sourceLocale}`);
    }
  }
  
  // Write back the file
  const filePath = path.join('public', 'locales', locale, 'translation.json');
  fs.writeFileSync(filePath, JSON.stringify(translations[locale], null, 2));
  console.log(`  Updated ${filePath}`);
}

console.log('\nDone.');