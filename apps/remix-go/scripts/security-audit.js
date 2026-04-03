#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔒 Running Security Audit for Remix Go...\n');

// Check for environment variables in code
function checkEnvironmentVariables() {
  console.log('📋 Checking for exposed environment variables...');
  
  const files = execSync('find src -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx"', { encoding: 'utf8' })
    .trim()
    .split('\n')
    .filter(Boolean);

  let exposedVars = [];
  
  files.forEach(file => {
    try {
      const content = fs.readFileSync(file, 'utf8');
      
      // Check for hardcoded API keys or secrets
      const secretPatterns = [
        /['"`]sk-[a-zA-Z0-9_-]{20,}['"`]/g, // OpenAI keys
        /['"`][a-zA-Z0-9_-]{20,}['"`]/g, // Generic long strings that might be keys
        /process\.env\.[A-Z_]+/g, // Environment variables
      ];
      
      secretPatterns.forEach(pattern => {
        const matches = content.match(pattern);
        if (matches) {
          matches.forEach(match => {
            if (!match.includes('VITE_') && !match.includes('import.meta.env')) {
              exposedVars.push(`${file}: ${match}`);
            }
          });
        }
      });
    } catch (error) {
      console.warn(`Warning: Could not read ${file}:`, error.message);
    }
  });
  
  if (exposedVars.length > 0) {
    console.log('❌ Potential exposed secrets found:');
    exposedVars.forEach(item => console.log(`  - ${item}`));
  } else {
    console.log('✅ No exposed environment variables detected');
  }
  
  console.log('');
}

// Check for vulnerable dependencies
function checkDependencies() {
  console.log('📦 Checking for vulnerable dependencies...');
  
  try {
    const auditResult = execSync('npm audit --audit-level moderate --json', { encoding: 'utf8' });
    const audit = JSON.parse(auditResult);
    
    if (audit.vulnerabilities && Object.keys(audit.vulnerabilities).length > 0) {
      console.log('❌ Vulnerabilities found:');
      Object.entries(audit.vulnerabilities).forEach(([pkg, vuln]) => {
        console.log(`  - ${pkg}: ${vuln.severity} (${vuln.title})`);
      });
    } else {
      console.log('✅ No moderate or higher vulnerabilities found');
    }
  } catch (error) {
    console.log('⚠️ Could not run npm audit:', error.message);
  }
  
  console.log('');
}

// Check for security headers and CSP
function checkSecurityHeaders() {
  console.log('🛡️ Checking security configurations...');
  
  const configFiles = ['vite.config.js', 'package.json', 'src/lib/config.js'];
  let hasCSP = false;
  let hasHTTPS = false;
  
  configFiles.forEach(file => {
    try {
      const content = fs.readFileSync(file, 'utf8');
      
      if (content.includes('Content-Security-Policy') || content.includes('CSP')) {
        hasCSP = true;
      }
      
      if (content.includes('https') && content.includes('secure')) {
        hasHTTPS = true;
      }
    } catch (error) {
      // File might not exist
    }
  });
  
  console.log(`CSP Configuration: ${hasCSP ? '✅ Found' : '❌ Missing'}`);
  console.log(`HTTPS Enforcement: ${hasHTTPS ? '✅ Found' : '❌ Missing'}`);
  
  console.log('');
}

// Check for proper error handling
function checkErrorHandling() {
  console.log('🚨 Checking error handling implementation...');
  
  const files = execSync('find src -name "*.js" -o -name "*.jsx"', { encoding: 'utf8' })
    .trim()
    .split('\n')
    .filter(Boolean);

  let hasErrorBoundary = false;
  let hasGlobalErrorHandler = false;
  
  files.forEach(file => {
    try {
      const content = fs.readFileSync(file, 'utf8');
      
      if (content.includes('ErrorBoundary') || content.includes('react-error-boundary')) {
        hasErrorBoundary = true;
      }
      
      if (content.includes('window.addEventListener(\'error\'') || 
          content.includes('window.addEventListener(\'unhandledrejection\'')) {
        hasGlobalErrorHandler = true;
      }
    } catch (error) {
      // Skip
    }
  });
  
  console.log(`React Error Boundary: ${hasErrorBoundary ? '✅ Implemented' : '❌ Missing'}`);
  console.log(`Global Error Handler: ${hasGlobalErrorHandler ? '✅ Implemented' : '❌ Missing'}`);
  
  console.log('');
}

// Generate security report
function generateReport() {
  console.log('📄 Security Audit Complete\n');
  console.log('Recommendations:');
  console.log('1. Regularly run npm audit and address vulnerabilities');
  console.log('2. Use environment variables for all secrets');
  console.log('3. Implement Content Security Policy');
  console.log('4. Add input validation and sanitization');
  console.log('5. Enable HTTPS in production');
  console.log('6. Set up proper error monitoring');
  console.log('7. Regularly review and update dependencies');
}

// Run all checks
checkEnvironmentVariables();
checkDependencies();
checkSecurityHeaders();
checkErrorHandling();
generateReport();
