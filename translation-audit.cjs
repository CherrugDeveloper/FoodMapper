const fs = require('fs');
const path = require('path');

// Function to flatten JSON object to dot notation
function flattenObject(obj, prefix = '') {
  return Object.keys(obj).reduce((acc, key) => {
    const pre = prefix.length ? prefix + '.' : '';
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      Object.assign(acc, flattenObject(obj[key], pre + key));
    } else {
      acc[pre + key] = obj[key];
    }
    return acc;
  }, {});
}

// Read all translation files
const locales = ['en', 'it', 'es', 'de', 'fr'];
const translations = {};

locales.forEach(locale => {
  const filePath = `public/locales/${locale}/translation.json`;
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    translations[locale] = JSON.parse(content);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    process.exit(1);
  }
});

// Flatten all translations
const flattened = {};
locales.forEach(locale => {
  flattened[locale] = flattenObject(translations[locale]);
});

// Get union of all keys
const allKeys = new Set();
locales.forEach(locale => {
  Object.keys(flattened[locale]).forEach(key => allKeys.add(key));
});

// Find missing keys per language
const missingKeys = {};
locales.forEach(locale => {
  missingKeys[locale] = [];
  allKeys.forEach(key => {
    if (!flattened[locale].hasOwnProperty(key)) {
      missingKeys[locale].push(key);
    }
  });
});

// Find duplicates within each file (check for duplicate values that might indicate copy-paste errors)
const duplicates = {};
locales.forEach(locale => {
  duplicates[locale] = [];
  const valueCounts = {};
  Object.keys(flattened[locale]).forEach(key => {
    const value = flattened[locale][key];
    if (valueCounts[value]) {
      valueCounts[value].push(key);
    } else {
      valueCounts[value] = [key];
    }
  });
  
  // Find values that appear more than once
  Object.keys(valueCounts).forEach(value => {
    if (valueCounts[value].length > 1) {
      duplicates[locale].push({
        value: value,
        keys: valueCounts[value]
      });
    }
  });
});

// Find untranslated English text (values matching EN)
const untranslatedEnglish = {};
locales.filter(l => l !== 'en').forEach(locale => {
  untranslatedEnglish[locale] = [];
  Object.keys(flattened[locale]).forEach(key => {
    if (flattened[locale][key] === flattened['en'][key]) {
      untranslatedEnglish[locale].push({
        key: key,
        value: flattened[locale][key]
      });
    }
  });
});

// Check placeholder consistency
const placeholders = {};
locales.forEach(locale => {
  placeholders[locale] = {};
  Object.keys(flattened[locale]).forEach(key => {
    const value = flattened[locale][key];
    // Find {{variable}} placeholders
    const matches = value.match(/{{\s*[^}]+\s*}}/g);
    if (matches) {
      placeholders[locale][key] = matches.map(m => m.trim());
    }
  });
});

// Check for placeholder mismatches between languages
const placeholderMismatches = [];
const allKeysArray = Array.from(allKeys);
allKeysArray.forEach(key => {
  const enPlaceholders = placeholders['en'][key] || [];
  locales.filter(l => l !== 'en').forEach(locale => {
    const localePlaceholders = placeholders[locale][key] || [];
    // Simple comparison - in reality we'd want to check if they're equivalent
    if (JSON.stringify(enPlaceholders.sort()) !== JSON.stringify(localePlaceholders.sort())) {
      placeholderMismatches.push({
        key: key,
        en: enPlaceholders,
        [locale]: localePlaceholders
      });
    }
  });
});

// Other anomalies: check for obvious punctuation issues, tone inconsistencies, etc.
// We'll do some basic checks
const otherAnomalies = [];

// Check for title case inconsistencies in IT (based on earlier observation)
Object.keys(flattened.it).forEach(key => {
  const value = flattened.it[key];
  // Check if it looks like title case but might be inconsistent
  if (value.match(/^[A-Z][a-z]*(\s[A-Z][a-z]*)+$/) && 
      !value.includes(':') && 
      value.length > 10) {
    // This is a rough check - we'd need more sophisticated analysis
    otherAnomalies.push({
      type: 'potential_title_case_inconsistency',
      language: 'it',
      key: key,
      value: value
    });
  }
});

// Generate report
let report = '';
report += '=== TRANSLATION AUDIT REPORT ===\n\n';

report += '1. MISSING KEYS PER LANGUAGE\n';
report += '-----------------------------\n';
locales.forEach(locale => {
  report += locale.toUpperCase() + ': ' + missingKeys[locale].length + ' missing keys\n';
  if (missingKeys[locale].length > 0 && missingKeys[locale].length <= 20) {
    report += '  Keys: ' + missingKeys[locale].join(', ') + '\n';
  } else if (missingKeys[locale].length > 20) {
    report += '  First 20: ' + missingKeys[locale].slice(0, 20).join(', ') + '\n';
    report += '  ... and ' + (missingKeys[locale].length - 20) + ' more\n';
  }
  report += '\n';
});

report += '2. DUPLICATES PER FILE\n';
report += '---------------------\n';
locales.forEach(locale => {
  report += locale.toUpperCase() + ': ' + duplicates[locale].length + ' duplicate values\n';
  if (duplicates[locale].length > 0) {
    duplicates[locale].slice(0, 5).forEach(function(dup) {
      report += '  Value: "' + dup.value.substring(0, 50) + (dup.value.length > 50 ? '...' : '') + '"\n';
      report += '    Keys: ' + dup.keys.join(', ') + '\n';
    });
    if (duplicates[locale].length > 5) {
      report += '  ... and ' + (duplicates[locale].length - 5) + ' more duplicate values\n';
    }
  }
  report += '\n';
});

report += '3. UNLOCALIZED ENGLISH TEXT PER LANGUAGE\n';
report += '----------------------------------------\n';
locales.filter(l => l !== 'en').forEach(function(locale) {
  report += locale.toUpperCase() + ': ' + untranslatedEnglish[locale].length + ' keys with English values\n';
  if (untranslatedEnglish[locale].length > 0) {
    report += '  Examples:\n';
    untranslatedEnglish[locale].slice(0, 10).forEach(function(item) {
      report += '  - ' + item.key + ': "' + item.value + '"\n';
    });
    if (untranslatedEnglish[locale].length > 10) {
      report += '  ... and ' + (untranslatedEnglish[locale].length - 10) + ' more\n';
    }
  }
  report += '\n';
});

report += '4. PLACEHOLDER/PUNCTUATION/TONE/PLURALITY NOTES\n';
report += '------------------------------------------------\n';
report += 'Placeholder consistency:\n';
if (placeholderMismatches.length > 0) {
  report += '  Found ' + placeholderMismatches.length + ' placeholder mismatches:\n';
  placeholderMismatches.slice(0, 5).forEach(function(mismatch) {
    report += '  - ' + mismatch.key + ': EN=' + JSON.stringify(mismatch.en) + ' ';
    Object.keys(mismatch).filter(function(k) { return k !== 'key' && k !== 'en'; }).forEach(function(loc) {
      report += loc.toUpperCase() + '=' + JSON.stringify(mismatch[loc]) + ' ';
    });
    report += '\n';
  });
  if (placeholderMismatches.length > 5) {
    report += '  ... and ' + (placeholderMismatches.length - 5) + ' more\n';
  }
} else {
  report += '  All placeholders are consistent across languages.\n';
}

report += '\nOther observations:\n';
// Add IT-specific observations from manual review
report += '  - IT: Inconsistent indentation on lines 87-89 (diary_hide_details, diary_show_all_micros, diary_show_fewer_micros missing leading spaces)\n';
report += '  - IT: Title-case inconsistencies: "Mostra Tutti", "Reset Giornata", "Conferma Reset Pasto", "Riepilogo Nutrizionale", "Oligoelementi Principali", "Calcolo Fabbisogno Richiesto", "Riepilogo Rapido", "Avvisi Nutrizionali"\n';
report += '  - ES/DE/FR: Large block of untranslated English (lines 210-267 in each file) covering 20 diary_*, 33 diet_*, and 5 warnings.* keys\n';
report += '  - Structural difference: EN/IT use nested "warnings" object; ES/DE/FR use flat "warnings.*" keys\n';
report += '  - FR: Correct French typographic spaces before colons and semicolons (e.g., "Objectif : {{target}} L/jour") - this is correct, not an error\n';
report += '\n';

report += '5. OTHER ANOMALIES\n';
report += '------------------\n';
if (otherAnomalies.length > 0) {
  report += 'Found ' + otherAnomalies.length + ' other potential anomalies:\n';
  otherAnomalies.slice(0, 5).forEach(function(anomaly) {
    report += '  - ' + anomaly.type + ': ' + anomaly.language + ' ' + anomaly.key + ': "' + anomaly.value + '"\n';
  });
} else {
  report += 'No other anomalies detected via automated checks.\n';
}

report += '\n=== END REPORT ===\n';

console.log(report);

// Also write to file for reference
fs.writeFileSync('translation-audit-report.txt', report);
console.log('Report written to translation-audit-report.txt');