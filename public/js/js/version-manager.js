/**
 * Version Manager for Flash API Documentation
 * 
 * Manages the versioning system for the API documentation:
 * - Displays version selector in the UI
 * - Handles routing to the correct version documentation
 * - Persists version preferences
 * - Shows version-specific notes and changes
 */

class VersionManager {
  constructor() {
    // Define available versions (newest first)
    this.versions = [
      { 
        version: '1.1.0', 
        label: 'v1.1.0', 
        path: '/v1.1.0',
        date: '2024-05-05',
        notes: 'Latest version with improved authentication flow and additional endpoints'
      },
      { 
        version: '1.0.0', 
        label: 'v1.0.0', 
        path: '/',
        date: '2024-04-10',
        notes: 'Initial stable release'
      },
      { 
        version: 'beta', 
        label: 'Beta', 
        path: '/beta',
        date: 'Current',
        notes: 'Preview of upcoming features (unstable)'
      }
    ];

    // Initialize properties
    this.currentVersion = this.getCurrentVersionFromUrl() || this.versions[0].version;
    this.selectorElement = null;
    this.dropdownElement = null;
    
    // Initialize version selector UI
    this.initVersionSelector();
    
    // Setup event listeners
    this.setupEventListeners();
  }

  /**
   * Initialize the version selector UI component
   */
  initVersionSelector() {
    // Find header or create container for the version selector
    const headerLinks = document.querySelector('.header-links');
    if (!headerLinks) return;

    // Create version selector container
    this.selectorElement = document.createElement('div');
    this.selectorElement.className = 'version-selector';
    
    // Create toggle button
    const toggleButton = document.createElement('button');
    toggleButton.className = 'version-selector-toggle';
    toggleButton.innerHTML = `
      ${this.getCurrentVersionLabel()}
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    `;
    
    // Create dropdown menu
    this.dropdownElement = document.createElement('div');
    this.dropdownElement.className = 'version-selector-dropdown';
    
    // Create list of versions
    const versionList = document.createElement('ul');
    
    // Add version options
    this.versions.forEach(version => {
      const listItem = document.createElement('li');
      const link = document.createElement('a');
      link.href = version.path;
      link.textContent = version.label;
      link.dataset.version = version.version;
      
      if (version.version === this.currentVersion) {
        link.className = 'active';
      }
      
      link.addEventListener('click', (e) => {
        e.preventDefault();
        this.switchVersion(version.version);
      });
      
      listItem.appendChild(link);
      versionList.appendChild(listItem);
    });
    
    // Add version info section
    const versionInfo = document.createElement('div');
    versionInfo.className = 'version-info';
    const currentVersionData = this.getVersionData(this.currentVersion);
    versionInfo.innerHTML = `
      <strong>Released:</strong> ${currentVersionData?.date || 'Unknown'}<br>
      <strong>Notes:</strong> ${currentVersionData?.notes || 'No release notes available'}
    `;
    
    // Assemble the components
    this.dropdownElement.appendChild(versionList);
    this.dropdownElement.appendChild(versionInfo);
    this.selectorElement.appendChild(toggleButton);
    this.selectorElement.appendChild(this.dropdownElement);
    
    // Insert the selector into the header
    headerLinks.insertBefore(this.selectorElement, headerLinks.firstChild);
  }
  
  /**
   * Set up event listeners
   */
  setupEventListeners() {
    // Toggle dropdown when clicking the toggle button
    const toggleButton = this.selectorElement?.querySelector('.version-selector-toggle');
    if (toggleButton) {
      toggleButton.addEventListener('click', () => {
        this.toggleDropdown();
      });
    }
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (this.selectorElement && !this.selectorElement.contains(e.target)) {
        this.closeDropdown();
      }
    });
    
    // Listen for URL changes (for SPA navigation if implemented)
    window.addEventListener('popstate', () => {
      this.currentVersion = this.getCurrentVersionFromUrl() || this.versions[0].version;
      this.updateVersionSelectorUI();
    });
  }
  
  /**
   * Toggle the dropdown menu
   */
  toggleDropdown() {
    const toggleButton = this.selectorElement?.querySelector('.version-selector-toggle');
    if (this.dropdownElement) {
      this.dropdownElement.classList.toggle('open');
      toggleButton?.classList.toggle('active');
    }
  }
  
  /**
   * Close the dropdown menu
   */
  closeDropdown() {
    if (this.dropdownElement) {
      this.dropdownElement.classList.remove('open');
      const toggleButton = this.selectorElement?.querySelector('.version-selector-toggle');
      toggleButton?.classList.remove('active');
    }
  }
  
  /**
   * Switch to a different API version
   */
  switchVersion(version) {
    if (version === this.currentVersion) {
      this.closeDropdown();
      return;
    }
    
    // Get the version data
    const versionData = this.getVersionData(version);
    if (!versionData) return;
    
    // Store the selected version in localStorage for persistence
    localStorage.setItem('flash_api_version', version);
    
    // Update the current version
    this.currentVersion = version;
    
    // Update the UI
    this.updateVersionSelectorUI();
    
    // Navigate to the version
    window.location.pathname = versionData.path;
    
    // Close the dropdown
    this.closeDropdown();
  }
  
  /**
   * Update the version selector UI to reflect the current version
   */
  updateVersionSelectorUI() {
    // Update toggle button text
    const toggleButton = this.selectorElement?.querySelector('.version-selector-toggle');
    if (toggleButton) {
      toggleButton.innerHTML = `
        ${this.getCurrentVersionLabel()}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      `;
    }
    
    // Update active class in dropdown
    const links = this.dropdownElement?.querySelectorAll('a');
    if (links) {
      links.forEach(link => {
        if (link.dataset.version === this.currentVersion) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
    
    // Update version info
    const versionInfo = this.dropdownElement?.querySelector('.version-info');
    if (versionInfo) {
      const currentVersionData = this.getVersionData(this.currentVersion);
      versionInfo.innerHTML = `
        <strong>Released:</strong> ${currentVersionData?.date || 'Unknown'}<br>
        <strong>Notes:</strong> ${currentVersionData?.notes || 'No release notes available'}
      `;
    }
  }
  
  /**
   * Extract the current version from the URL path
   */
  getCurrentVersionFromUrl() {
    const path = window.location.pathname;
    
    // Check if path matches any version path
    for (const version of this.versions) {
      if (path.startsWith(version.path) && version.path !== '/') {
        return version.version;
      }
    }
    
    // If we're at the root, it's the default version (1.0.0)
    if (path === '/' || path === '/index.html') {
      return '1.0.0';
    }
    
    // Check localStorage for saved preference
    return localStorage.getItem('flash_api_version') || null;
  }
  
  /**
   * Get the label for the current version
   */
  getCurrentVersionLabel() {
    const version = this.getVersionData(this.currentVersion);
    return version ? version.label : 'Select Version';
  }
  
  /**
   * Get version data for a specific version
   */
  getVersionData(version) {
    return this.versions.find(v => v.version === version);
  }
}

// Initialize the version manager when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.versionManager = new VersionManager();
});