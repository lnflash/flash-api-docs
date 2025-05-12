/**
 * Build script for versioned API documentation
 * 
 * This script:
 * 1. Creates directory structure for different API versions
 * 2. Copies the appropriate files to each version directory
 * 3. Updates paths and references in the files
 * 4. Generates version-specific schema files if needed
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Available versions to build
const versions = [
  { 
    version: '1.1.0', 
    path: 'v1.1.0',
    schemaUrl: 'https://api.flashapp.me/graphql',
    date: '2024-05-05'
  },
  { 
    version: '1.0.0', 
    path: '',  // Root directory for the current stable version
    schemaUrl: 'https://api.flashapp.me/graphql',
    date: '2024-04-10'
  },
  { 
    version: 'beta', 
    path: 'beta',
    schemaUrl: 'https://api.test.flashapp.me/graphql',
    date: 'Current'
  }
];

// Build directory (default is 'public')
const BUILD_DIR = path.join(__dirname, 'public');

// Source directory
const SRC_DIR = path.join(__dirname, 'src');

// Create version directories and copy files
async function buildVersionedDocs() {
  try {
    console.log('Starting versioned build process...');
    
    // Create build directory if it doesn't exist
    if (!fs.existsSync(BUILD_DIR)) {
      fs.mkdirSync(BUILD_DIR, { recursive: true });
    }
    
    // Build each version
    for (const version of versions) {
      await buildVersion(version);
    }
    
    // Create version manifest file
    createVersionManifest();
    
    console.log('Versioned build complete!');
  } catch (error) {
    console.error('Error building versioned docs:', error);
    process.exit(1);
  }
}

/**
 * Build a specific version of the documentation
 */
async function buildVersion(version) {
  console.log(`Building version ${version.version}...`);
  
  // Create version directory
  const versionDir = path.join(BUILD_DIR, version.path);
  if (version.path && !fs.existsSync(versionDir)) {
    fs.mkdirSync(versionDir, { recursive: true });
  }
  
  // For root version (current stable), we'll use the main build process
  if (!version.path) {
    return;
  }
  
  // Copy files from public to version directory
  console.log(`Copying files to ${versionDir}...`);
  
  // Copy all files from public to version directory
  execSync(`cp -r ${BUILD_DIR}/* ${versionDir}/`);
  
  // Update paths in HTML files to reference version-specific files
  updatePaths(versionDir, version);
  
  console.log(`Version ${version.version} built successfully`);
}

/**
 * Update paths in HTML files to reference version-specific files
 */
function updatePaths(versionDir, version) {
  // Update index.html
  const indexPath = path.join(versionDir, 'index.html');
  
  if (fs.existsSync(indexPath)) {
    let content = fs.readFileSync(indexPath, 'utf8');
    
    // Add version information to the page
    content = content.replace(
      /<div class="logo">/,
      `<div class="logo">
        <div class="version-badge" style="background: rgba(0,0,0,0.2); border-radius: 4px; padding: 2px 8px; font-size: 0.8rem; margin-right: 10px;">${version.version}</div>`
    );
    
    // Write updated content
    fs.writeFileSync(indexPath, content);
  }
  
  // Update spec.html
  const specPath = path.join(versionDir, 'spec.html');
  
  if (fs.existsSync(specPath)) {
    let content = fs.readFileSync(specPath, 'utf8');
    
    // Add version information to the page
    content = content.replace(
      /<a href="index\.html" class="back-link">/,
      `<a href="index.html" class="back-link">
        <span class="version-badge" style="background: rgba(0,0,0,0.2); border-radius: 4px; padding: 2px 8px; font-size: 0.8rem; margin-right: 10px;">${version.version}</span>`
    );
    
    // Write updated content
    fs.writeFileSync(specPath, content);
  }
}

/**
 * Create a version manifest file that lists all available versions
 */
function createVersionManifest() {
  const manifestPath = path.join(BUILD_DIR, 'versions.json');
  
  const manifest = {
    versions: versions.map(v => ({
      version: v.version,
      path: v.path || '/',
      date: v.date
    })),
    latest: versions.find(v => v.version !== 'beta') || versions[0]
  };
  
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log('Version manifest created');
}

// Run the build process
buildVersionedDocs();