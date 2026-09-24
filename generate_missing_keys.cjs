const fs = require('node:fs');
const path = require('node:path');

function flattenObject(obj, prefix = '') {
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? prefix + '.' + key : key;
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.assign(result, flattenObject(value, fullKey));
    } else {
      result[fullKey] = value;
    }
  }
  return result;
}

const locales = ['en', 'it', 'es', 'de', 'fr'];
const translations = {};
const flattened = {};

for (const locale of locales) {
  const filePath = path.join('public', 'locales', locale, 'translation.json');
  const content = fs.readFileSync(filePath, 'utf8');
  translations[locale] = JSON.parse(content);
  flattened[locale] = flattenObject(translations[locale]);
}

const enKeys = Object.keys(flattened.en).sort();

let out = '';
for (const locale of ['it', 'es', 'de', 'fr']) {
  const missing = enKeys.filter(key => !(key in flattened[locale]));
  out += '=== ' + locale.toUpperCase() + ' MISSING (' + missing.length + ') ===\n';
  missing.forEach(key => out += key + ': ' + JSON.stringify(flattened.en[key]) + '\n');
  out += '\n';
}
fs.writeFileSync('missing_keys.txt', out);
console.log('Done');