const fs = require('node:fs');
const path = require('node:path');

function insertMissingKeys(lang) {
  const filePath = path.join('public', 'locales', lang, 'translation.json');
  let content;
  try {
    content = fs.readFileSync(filePath, 'utf8');
  } catch (err) {
    console.error(`Error reading file for ${lang}: ${err}`);
    return;
  }

  const lines = content.split('\n');

  // Find the line index of the insertion point
  const insertionPointKey = '"diary_recent_magnesium":';
  let insertionIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().startsWith(insertionPointKey)) {
      insertionIndex = i;
      break;
    }
  }

  if (insertionIndex === -1) {
    console.error(`Insertion point not found for ${lang}`);
    return;
  }

  // Read the missing keys for this language from missing_keys.txt
  let missingKeysContent;
  try {
    missingKeysContent = fs.readFileSync('missing_keys.txt', 'utf8');
  } catch (err) {
    console.error(`Error reading missing_keys.txt: ${err}`);
    return;
  }

  const missingLines = missingKeysContent.split('\n');

  // Determine the section for this language
  let startLine, endLine;
  if (lang === 'es') {
    startLine = 35; // 0-indexed, line 36 is index 35
    endLine = 93;   // line 94 is index 93
  } else if (lang === 'de') {
    startLine = 95; // line 96
    endLine = 153;  // line 154
  } else if (lang === 'fr') {
    startLine = 155; // line 156
    endLine = 213;   // line 214
  } else {
    console.error(`Unknown language: ${lang}`);
    return;
  }

  const sectionLines = missingLines.slice(startLine, endLine + 1);
  // Convert each line: from "key: \"value\"" to "\"key\": \"value\","
  const insertLines = sectionLines.map(line => {
    // Skip empty lines and the header line
    if (line.trim() === '' || line.startsWith('===')) {
      return null;
    }
    // Match: key: "value"
    const match = line.match(/^(.+):\s*"(.+)"$/);
    if (match) {
      const key = match[1];
      const value = match[2];
      return `  "${key}": "${value}",`;
    }
    return null;
  }).filter(line => line !== null);

  // Insert the lines after the insertionIndex
  const newLines = [
    ...lines.slice(0, insertionIndex + 1),
    ...insertLines,
    ...lines.slice(insertionIndex + 1)
  ];

  const newContent = newLines.join('\n');
  try {
    fs.writeFileSync(filePath, newContent);
    // Validate JSON
    JSON.parse(newContent);
    console.log(`Inserted missing keys for ${lang} and validated JSON`);
  } catch (err) {
    console.error(`Error writing or validating JSON for ${lang}: ${err}`);
  }
}

// Now call for each language
insertMissingKeys('es');
insertMissingKeys('de');
insertMissingKeys('fr');