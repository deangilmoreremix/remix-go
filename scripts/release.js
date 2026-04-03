const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function createRelease(version, type = 'patch') {
  console.log(`Creating ${type} release: ${version}`);

  // Update version in both package.json files
  updatePackageVersion('./package.json', version);
  updatePackageVersion('./apps/remix-go/package.json', version);

  // Create git tag
  execSync(`git add .`);
  execSync(`git commit -m "Release ${version}"`);
  execSync(`git tag v${version}`);

  // Push changes and tag
  execSync(`git push origin main`);
  execSync(`git push origin v${version}`);

  // Run database migrations if needed
  if (hasDatabaseMigrations()) {
    console.log('Running database migrations...');
    execSync('npm run db:migrate');
  }

  // Deploy to staging first
  console.log('Deploying to staging...');
  execSync('npm run deploy:staging');

  // Wait for staging tests
  console.log('Running staging tests...');
  execSync('npm run test:staging');

  // Deploy to production
  console.log('Deploying to production...');
  execSync('npm run deploy:production');

  console.log(`Release ${version} completed successfully!`);
}

function updatePackageVersion(packagePath, version) {
  const fullPath = path.resolve(packagePath);
  if (!fs.existsSync(fullPath)) {
    console.warn(`Package file not found: ${fullPath}`);
    return;
  }

  const packageJson = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
  packageJson.version = version;
  fs.writeFileSync(fullPath, JSON.stringify(packageJson, null, 2));
  console.log(`Updated ${packagePath} to version ${version}`);
}

function hasDatabaseMigrations() {
  // Check if there are pending migrations
  const migrationsDir = './migrations';
  return fs.existsSync(migrationsDir) && fs.readdirSync(migrationsDir).length > 0;
}

// CLI interface
const args = process.argv.slice(2);
const version = args[0];
const type = args[1] || 'patch';

if (!version) {
  console.error('Usage: node scripts/release.js <version> [patch|minor|major]');
  console.error('Examples:');
  console.error('  node scripts/release.js 1.2.4');
  console.error('  node scripts/release.js 1.3.0 minor');
  process.exit(1);
}

// Validate version format
const versionRegex = /^\d+\.\d+\.\d+$/;
if (!versionRegex.test(version)) {
  console.error('Version must be in format x.y.z (e.g., 1.2.3)');
  process.exit(1);
}

try {
  createRelease(version, type);
} catch (error) {
  console.error('Release failed:', error.message);
  process.exit(1);
}