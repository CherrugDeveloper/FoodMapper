const fs = require('fs');
const path = require('path');

const LOCALES = ['it', 'en', 'de', 'es', 'fr'];
const BASE_DIR = path.join(__dirname, 'public', 'locales');
const OUTPUT_FILE = path.join(__dirname, 'audit_output.json');

function loadJson(locale) {
  const filePath = path.join(BASE_DIR, locale, 'translation.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
}

function flatten(obj, prefix = '', result = {}) {
  if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) {
    result[prefix] = obj;
    return result;
  }
  const keys = Object.keys(obj);
  if (keys.length === 0) {
    result[prefix] = obj;
    return result;
  }
  for (const key of keys) {
    const newKey = prefix ? `${prefix}.${key}` : key;
    flatten(obj[key], newKey, result);
  }
  return result;
}

function getGroup(key) {
  const patterns = [
    { pattern: /^disclaimer\./, group: 'disclaimer' },
    { pattern: /^calc_ibs_/, group: 'calc_ibs' },
    { pattern: /^calc_/, group: 'calc' },
    { pattern: /^report_/, group: 'report' },
    { pattern: /^ibs_rec_/, group: 'ibs_rec' },
    { pattern: /^hub_/, group: 'hub' },
    { pattern: /^filter_/, group: 'filter' },
    { pattern: /^macro_/, group: 'macro' },
    { pattern: /^months\./, group: 'months' },
    { pattern: /^seasons\./, group: 'seasons' },
    { pattern: /^micros\./, group: 'micros' },
    { pattern: /^diet_/, group: 'diet' },
    { pattern: /^conditions\./, group: 'conditions' },
    { pattern: /^diary_/, group: 'diary' },
    { pattern: /^symptoms\./, group: 'symptoms' },
    { pattern: /^transit\./, group: 'transit' },
    { pattern: /^water_reminder_/, group: 'water_reminder' },
    { pattern: /^workout_/, group: 'workout' },
    { pattern: /^devices_/, group: 'devices' },
    { pattern: /^device_/, group: 'device' },
    { pattern: /^measure_/, group: 'measure' },
    { pattern: /^days\./, group: 'days' },
    { pattern: /^tab_/, group: 'tab' },
    { pattern: /^developer\./, group: 'developer' },
    { pattern: /^changelog\./, group: 'changelog' },
    { pattern: /^categories\./, group: 'categories' },
    { pattern: /^foods\.\d+\.name$/, group: 'foods.name' },
    { pattern: /^foods\.\d+\.alt$/, group: 'foods.alt' },
    { pattern: /^recipes\./, group: 'recipes' },
    { pattern: /^shopping\./, group: 'shopping' },
    { pattern: /^fodmap_/, group: 'fodmap' },
    { pattern: /^unit_/, group: 'unit' },
    { pattern: /^app_/, group: 'app' },
  ];

  for (const { pattern, group } of patterns) {
    if (pattern.test(key)) return group;
  }
  return 'other';
}

function isLocalizable(group, keysInGroup) {
  const definitelyYes = [
    'disclaimer', 'calc', 'calc_ibs', 'report', 'ibs_rec', 'hub', 'filter',
    'diet', 'diary', 'symptoms', 'transit', 'water_reminder', 'workout',
    'devices', 'device', 'measure', 'recipes', 'shopping', 'app',
  ];
  const definitelyNo = [
    'macro', 'months', 'micros', 'fodmap', 'categories',
  ];
  const maybe = [
    'foods.name', 'foods.alt', 'conditions', 'seasons', 'days', 'tab',
    'developer', 'changelog', 'unit', 'other',
  ];

  if (definitelyYes.includes(group)) return { localizable: 'sì', reason: 'Testo UI destinato all\'utente finale.' };
  if (definitelyNo.includes(group)) return { localizable: 'no', reason: 'Nomi tecnici, categorie scientifiche o etichette standard che rimangono invariati.' };
  if (maybe.includes(group)) {
    return { localizable: 'forse', reason: 'Dipende dal contesto: nomi propri, etichette brevi o termini condivisi tra lingue.' };
  }
  return { localizable: 'forse', reason: 'Gruppo non classificato esplicitamente.' };
}

function main() {
  const data = {};
  for (const locale of LOCALES) {
    data[locale] = loadJson(locale);
  }

  const flattened = {};
  for (const locale of LOCALES) {
    flattened[locale] = flatten(data[locale]);
  }

  const targetLocales = ['de', 'es', 'fr'];
  const results = {};

  for (const locale of targetLocales) {
    const keys = Object.keys(flattened[locale]).filter(
      (key) => flattened[locale][key] === flattened.en[key] && flattened[locale][key] !== flattened.it[key]
    );

    const grouped = {};
    for (const key of keys) {
      const group = getGroup(key);
      if (!grouped[group]) grouped[group] = [];
      grouped[group].push(key);
    }

    const groups = Object.keys(grouped).sort().map((group) => {
      const groupKeys = grouped[group].sort();
      const decision = isLocalizable(group, groupKeys);
      return {
        group,
        localizable: decision.localizable,
        reason: decision.reason,
        count: groupKeys.length,
        keys: groupKeys,
      };
    });

    results[locale] = {
      total: keys.length,
      groups,
    };
  }

  const output = {
    generatedAt: new Date().toISOString(),
    criteria: 'flattened[locale][key] === flattened[en][key] AND flattened[locale][key] !== flattened[it][key]',
    summary: Object.fromEntries(targetLocales.map((l) => [l, results[l].total])),
    details: results,
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2), 'utf-8');

  console.log(buildReadableText(output));
}

function buildReadableText(output) {
  const lines = [];
  lines.push('========================================');
  lines.push('Translation Audit Report');
  lines.push(`Generated at: ${output.generatedAt}`);
  lines.push(`Criteria: ${output.criteria}`);
  lines.push('========================================');
  lines.push('');
  lines.push('Summary:');
  for (const [locale, total] of Object.entries(output.summary)) {
    lines.push(`  ${locale}: ${total} suspect keys`);
  }
  lines.push('');

  for (const [locale, data] of Object.entries(output.details)) {
    lines.push('----------------------------------------');
    lines.push(`Locale: ${locale} (${data.total} suspect keys)`);
    lines.push('----------------------------------------');

    for (const groupData of data.groups) {
      lines.push(`\n[${groupData.group}] — localizable: ${groupData.localizable}`);
      lines.push(`  Reason: ${groupData.reason}`);
      lines.push(`  Count: ${groupData.count}`);
      for (const key of groupData.keys) {
        lines.push(`    - ${key}`);
      }
    }
    lines.push('');
  }

  return lines.join('\n');
}

main();
