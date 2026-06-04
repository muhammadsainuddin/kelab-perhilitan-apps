import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const gradlePath = join(__dirname, '../android/app/build.gradle');
const pkgPath    = join(__dirname, '../package.json');

let gradle  = readFileSync(gradlePath, 'utf8');
const pkg   = JSON.parse(readFileSync(pkgPath, 'utf8'));

// Increment versionCode
const match = gradle.match(/versionCode\s+(\d+)/);
const oldCode = match ? parseInt(match[1]) : 0;
const newCode = oldCode + 1;
gradle = gradle.replace(/versionCode\s+\d+/, `versionCode ${newCode}`);

// Selaraskan versionName dengan package.json
const versionName = pkg.version || '1.0';
gradle = gradle.replace(/versionName\s+"[^"]*"/, `versionName "${versionName}"`);

writeFileSync(gradlePath, gradle);

console.log(`Android version: ${versionName} (${oldCode} → ${newCode})`);
