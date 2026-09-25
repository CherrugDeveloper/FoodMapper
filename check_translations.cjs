const fs = require('fs');
const it = JSON.parse(fs.readFileSync('public/locales/it/translation.json', 'utf8'));
const en = JSON.parse(fs.readFileSync('public/locales/en/translation.json', 'utf8'));
const de = JSON.parse(fs.readFileSync('public/locales/de/translation.json', 'utf8'));
const es = JSON.parse(fs.readFileSync('public/locales/es/translation.json', 'utf8'));
const fr = JSON.parse(fs.readFileSync('public/locales/fr/translation.json', 'utf8'));

function getAllKeysWithValues(obj, prefix = '') {
  let keys = [];
  for (const key in obj) {
    const fullKey = prefix ? prefix + '.' + key : key;
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      keys = keys.concat(getAllKeysWithValues(obj[key], fullKey));
    } else {
      keys.push({key: fullKey, value: obj[key]});
    }
  }
  return keys;
}

const itKV = getAllKeysWithValues(it);
const enKV = getAllKeysWithValues(en);
const deKV = getAllKeysWithValues(de);
const esKV = getAllKeysWithValues(es);
const frKV = getAllKeysWithValues(fr);

const enMap = Object.fromEntries(enKV.map(kv => [kv.key, kv.value]));
const deMap = Object.fromEntries(deKV.map(kv => [kv.key, kv.value]));
const esMap = Object.fromEntries(esKV.map(kv => [kv.key, kv.value]));
const frMap = Object.fromEntries(frKV.map(kv => [kv.key, kv.value]));

console.log('=== KEYS IN DE WITH ENGLISH VALUES ===');
let deCount = 0;
itKV.forEach(kv => {
  if (deMap[kv.key] === enMap[kv.key]) {
    console.log(kv.key + ': ' + deMap[kv.key]);
    deCount++;
  }
});
console.log('Total DE with EN values:', deCount);

console.log('\n=== KEYS IN ES WITH ENGLISH VALUES ===');
let esCount = 0;
itKV.forEach(kv => {
  if (esMap[kv.key] === enMap[kv.key]) {
    console.log(kv.key + ': ' + esMap[kv.key]);
    esCount++;
  }
});
console.log('Total ES with EN values:', esCount);

console.log('\n=== KEYS IN FR WITH ENGLISH VALUES ===');
let frCount = 0;
itKV.forEach(kv => {
  if (frMap[kv.key] === enMap[kv.key]) {
    console.log(kv.key + ': ' + frMap[kv.key]);
    frCount++;
  }
});
console.log('Total FR with EN values:', frCount);