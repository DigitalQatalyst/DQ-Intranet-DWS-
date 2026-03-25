#!/usr/bin/env node

/**
 * Local SonarQube Scanner Script
 * Run this script locally to trigger a SonarQube analysis
 * 
 * Prerequisites:
 * 1. Install SonarQube Scanner: npm install -g sonar-scanner
 * 2. Set SONAR_TOKEN environment variable
 * 3. Run from project root: node scripts/sonar-scan.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Starting SonarQube Analysis...');

// Check if SonarQube scanner is installed
try {
  execSync('sonar-scanner --version', { stdio: 'pipe' });
  console.log('✅ SonarQube scanner found');
} catch (error) {
  console.error('❌ SonarQube scanner not found. Please install it with:');
  console.error('   npm install -g sonar-scanner');
  process.exit(1);
}

// Check if SONAR_TOKEN is set
if (!process.env.SONAR_TOKEN) {
  console.error('❌ SONAR_TOKEN environment variable not set');
  console.error('   Please set it: export SONAR_TOKEN=your_token_here');
  process.exit(1);
}

// Create sonar-project.properties if it doesn't exist or update it
const sonarPropsPath = path.resolve(__dirname, '..', 'sonar-project.properties');
const sonarProps = `sonar.projectKey=DigitalQatalyst_DQ-Intranet-DWS-
sonar.organization=dq
sonar.projectName=DQ Intranet DWS
sonar.projectVersion=1.0

# Source configuration
sonar.sources=src
sonar.sourceEncoding=UTF-8
sonar.exclusions=scripts/**,node_modules/**,dist/**,build/**,coverage/**

# TypeScript configuration
sonar.typescript.lcov.reportPaths=coverage/lcov.info

# JavaScript/TypeScript analysis
sonar.javascript.lcov.reportPaths=coverage/lcov.info
`;

try {
  fs.writeFileSync(sonarPropsPath, sonarProps);
  console.log('✅ SonarQube configuration updated');
} catch (error) {
  console.error('❌ Failed to write sonar-project.properties:', error.message);
  process.exit(1);
}

// Run the SonarQube scan
try {
  console.log('🚀 Running SonarQube analysis...');
  execSync('sonar-scanner', { stdio: 'inherit' });
  console.log('✅ SonarQube analysis completed successfully!');
  console.log('📊 Check your SonarCloud dashboard for results');
} catch (error) {
  console.error('❌ SonarQube analysis failed:', error.message);
  process.exit(1);
}
