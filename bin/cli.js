#!/usr/bin/env node

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

const REPO = 'https://github.com/Hamzaishappy786/Personalized-CV-Generator.git';
const DIR = join(process.cwd(), 'cheentapakdumdum-resume');

console.log('\n  Cheentapakdumdum Resume\n');

if (existsSync(DIR)) {
  console.log('  Folder already exists — starting dev server...\n');
} else {
  console.log('  Cloning repo...\n');
  execSync(`git clone ${REPO} "${DIR}"`, { stdio: 'inherit' });

  console.log('\n  Installing dependencies...\n');
  execSync('npm install', { stdio: 'inherit', cwd: DIR });
}

console.log('\n  Starting Vite dev server...\n');
execSync('npm run dev', { stdio: 'inherit', cwd: DIR });
