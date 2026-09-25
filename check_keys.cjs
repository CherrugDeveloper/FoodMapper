const fs = require('fs');
const it = JSON.parse(fs.readFileSync('public/locales/it/translation.json', 'utf8'));
const en = JSON.parse(fs.readFileSync('public/locales/en/translation.json', 'utf8'));
const de = JSON.parse(fs.readFileSync('public/locales/de/translation.json', 'utf8'));
const es = JSON.parse(fs.readFileSync('public/locales/es/translation.json', 'utf8'));
const fr = JSON.parse(fs.readFileSync('public/locales/fr/translation.json', 'utf8'));

function getAllKeys(obj, prefix = '') {
  let keys = [];
  for (const key in obj) {
    const fullKey = prefix ? prefix + '.' + key : key;
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      keys = keys.concat(getAllKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

const itKeys = getAllKeys(it).sort();
const enKeys = getAllKeys(en).sort();
const deKeys = getAllKeys(de).sort();
const esKeys = getAllKeys(es).sort();
const frKeys = getAllKeys(fr).sort();

console.log('=== KEY COUNTS ===');
console.log('IT:', itKeys.length);
console.log('EN:', enKeys.length);
console.log('DE:', deKeys.length);
console.log('ES:', esKeys.length);
console.log('FR:', frKeys.length);

console.log('\n=== MISSING IN EN (vs IT) ===');
const missingInEn = itKeys.filter(k => !enKeys.includes(k));
missingInEn.forEach(k => console.log(k));

console.log('\n=== MISSING IN DE (vs IT) ===');
const missingInDe = itKeys.filter(k => !deKeys.includes(k));
missingInDe.forEach(k => console.log(k));

console.log('\n=== MISSING IN ES (vs IT) ===');
const missingInEs = itKeys.filter(k => !esKeys.includes(k));
missingInEs.forEach(k => console.log(k));

console.log('\n=== MISSING IN FR (vs IT) ===');
const missingInFr = itKeys.filter(k => !frKeys.includes(k));
missingInFr.forEach(k => console.log(k));

console.log('\n=== EXTRA IN EN (not in IT) ===');
const extraInEn = enKeys.filter(k => !itKeys.includes(k));
extraInEn.forEach(k => console.log(k));

console.log('\n=== EXTRA IN DE (not in IT) ===');
const extraInDe = deKeys.filter(k => !itKeys.includes(k));
extraInDe.forEach(k => console.log(k));

console.log('\n=== EXTRA IN ES (not in IT) ===');
const extraInEs = esKeys.filter(k => !itKeys.includes(k));
extraInEs.forEach(k => console.log(k));

console.log('\n=== EXTRA IN FR (not in IT) ===');
const extraInFr = frKeys.filter(k => !itKeys.includes(k));
extraInFr.forEach(k => console.log(k));