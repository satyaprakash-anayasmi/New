const fs = require('fs');
const path = require('path');

const i18nDir = path.join(__dirname, 'src', 'assets', 'i18n');
const languages = ['en', 'hi', 'or', 'te'];

// Load all files
const data = {};
languages.forEach(lang => {
    const filePath = path.join(i18nDir, `${lang}.json`);
    if (fs.existsSync(filePath)) {
        try {
            data[lang] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        } catch (e) {
            console.error(`Error parsing ${lang}.json:`, e);
            data[lang] = {};
        }
    } else {
        data[lang] = {};
    }
});

// Deep merge helper to collect all keys
function collectAllKeys(sources) {
    const allKeys = {};
    sources.forEach(source => {
        deepMergeKeys(allKeys, source);
    });
    return allKeys;
}

function deepMergeKeys(target, source) {
    for (const key in source) {
        if (typeof source[key] === 'object' && source[key] !== null) {
            if (!target[key] || typeof target[key] !== 'object') {
                target[key] = {};
            }
            deepMergeKeys(target[key], source[key]);
        } else {
            if (target[key] === undefined) {
                target[key] = source[key];
            }
        }
    }
}

// Get the master template (union of all keys)
// We prefer English values as the fallback, so we put 'en' first.
const allSources = [data['en'], data['hi'], data['or'], data['te']];
const masterTemplate = collectAllKeys(allSources);

// Function to enforce template on a specific language
function enforceTemplate(template, langData) {
    const result = {};
    for (const key in template) {
        if (typeof template[key] === 'object' && template[key] !== null) {
            result[key] = enforceTemplate(template[key], langData[key] || {});
        } else {
            // If the language has the key, use it. Otherwise, fallback to the template value (which is usually English)
            result[key] = (langData[key] !== undefined && langData[key] !== "") ? langData[key] : template[key];
        }
    }
    return result;
}

// Sync all languages
languages.forEach(lang => {
    const syncedData = enforceTemplate(masterTemplate, data[lang]);
    
    // Write back to file
    const filePath = path.join(i18nDir, `${lang}.json`);
    fs.writeFileSync(filePath, JSON.stringify(syncedData, null, 2), 'utf8');
    console.log(`Synced ${lang}.json successfully.`);
});
