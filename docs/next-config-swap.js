#!/usr/bin/env node

/**
 * Helper script to swap Next.js config files
 * Usage: node scripts/next-config-swap.js [config-file]
 * Example: node scripts/next-config-swap.js next.config.cloudflare.js
 */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);

if (args.length === 0) {
  console.error('❌ Error: Please provide a config file name');
  console.log('Usage: next-config-swap [config-file]');
  console.log('Example: next-config-swap next.config.cloudflare.js');
  process.exit(1);
}

const sourceConfig = args[0];
const targetConfig = 'next.config.js';
const rootDir = path.join(__dirname, '..');

const sourcePath = path.join(rootDir, sourceConfig);
const targetPath = path.join(rootDir, targetConfig);

// Check if source config exists
if (!fs.existsSync(sourcePath)) {
  console.error(`❌ Error: Config file not found: ${sourceConfig}`);
  process.exit(1);
}

// Copy source config to next.config.js
try {
  fs.copyFileSync(sourcePath, targetPath);
  console.log(`✅ Successfully swapped to ${sourceConfig}`);
  console.log(`   Target: ${targetConfig}`);
} catch (error) {
  console.error(`❌ Error swapping config: ${error.message}`);
  process.exit(1);
}
