const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'public', 'locales');
const languages = ['en', 'it', 'de', 'es', 'fr'];

function loadJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err.message);
    process.exit(1);
  }
}

function getAllKeys(obj, prefix = '') {
  let keys = [];
  for (const k of Object.keys(obj)) {
    const fullKey = prefix ? `${prefix}.${k}` : k;
    if (obj[k] && typeof obj[k] === 'object' && !Array.isArray(obj[k])) {
      keys = keys.concat(getAllKeys(obj[k], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

const baseLang = 'en';
const baseFilePath = path.join(localesDir, baseLang, 'translation.json');
const baseData = loadJson(baseFilePath);
const baseKeys = new Set(getAllKeys(baseData));

let hasErrors = false;

languages.forEach(lang => {
  if (lang === baseLang) return;
  const filePath = path.join(localesDir, lang, 'translation.json');
  const langData = loadJson(filePath);
  const langKeys = new Set(getAllKeys(langData));

  baseKeys.forEach(key => {
    if (!langKeys.has(key)) {
      console.error(`[Missing Key] Language '${lang}' is missing key: '${key}'`);
      hasErrors = true;
    }
  });

  langKeys.forEach(key => {
    if (!baseKeys.has(key)) {
      console.warn(`[Extra Key] Language '${lang}' has extra key not in '${baseLang}': '${key}'`);
    }
  });
});

if (hasErrors) {
  console.error('Translation key audit failed.');
  process.exit(1);
} else {
  console.log('Translation key audit passed successfully.');
}
