/**
 * Version Router for Flash API Documentation
 * 
 * Handles routing to different API versions:
 * - Detects the version from the URL
 * - Redirects to the appropriate version documentation
 * - Provides a fallback for missing versions
 */

class VersionRouter {
  constructor() {
    // Available versions with their path prefixes
    this.versions = [
      { version: '1.1.0', path: '/v1.1.0', fallback: '/' }, 
      { version: '1.0.0', path: '/', fallback: null },
      { version: 'beta', path: '/beta', fallback: '/' }
    ];
    
    // Initialize router
    this.init();
  }
  
  /**
   * Initialize the router
   */
  init() {
    // Check if we need to redirect
    this.checkForRedirect();
    
    // Listen for URL changes
    window.addEventListener('popstate', () => {
      this.checkForRedirect();
    });
  }
  
  /**
   * Check if the current URL needs to be redirected
   */
  checkForRedirect() {
    const path = window.location.pathname;
    
    // Skip if we're already at a known version path
    if (this.isKnownVersionPath(path)) {
      return;
    }
    
    // Check for version number in URL
    const versionMatch = path.match(/\/v(\d+\.\d+\.\d+)\//);
    if (versionMatch) {
      const requestedVersion = versionMatch[1];
      const versionData = this.versions.find(v => v.version === requestedVersion);
      
      if (versionData) {
        // Redirect to the correct version
        this.redirectTo(versionData.path);
      } else {
        // Version not found, redirect to fallback
        this.redirectToFallback(requestedVersion);
      }
    }
  }
  
  /**
   * Check if the path is a known version path
   */
  isKnownVersionPath(path) {
    return this.versions.some(v => {
      if (v.path === '/') {
        return path === '/' || path === '/index.html' || path === '/spec.html';
      }
      return path.startsWith(v.path);
    });
  }
  
  /**
   * Redirect to a specific path
   */
  redirectTo(path) {
    window.location.href = path;
  }
  
  /**
   * Redirect to the fallback version for an unknown version
   */
  redirectToFallback(requestedVersion) {
    // Find the nearest version that's less than or equal to the requested version
    const versionNumbers = requestedVersion.split('.').map(Number);
    let bestMatch = this.versions[0]; // Default to the latest version
    
    for (const vData of this.versions) {
      if (vData.version === 'beta') continue; // Skip beta
      
      const vParts = vData.version.split('.').map(Number);
      
      // Check if this version is less than or equal to the requested version
      if (
        vParts[0] < versionNumbers[0] || 
        (vParts[0] === versionNumbers[0] && vParts[1] < versionNumbers[1]) ||
        (vParts[0] === versionNumbers[0] && vParts[1] === versionNumbers[1] && vParts[2] <= versionNumbers[2])
      ) {
        bestMatch = vData;
        break;
      }
    }
    
    // Show version not found message
    this.showVersionNotFoundMessage(requestedVersion, bestMatch.version);
    
    // Redirect to the fallback
    setTimeout(() => {
      this.redirectTo(bestMatch.path);
    }, 5000);
  }
  
  /**
   * Show a message when a version is not found
   */
  showVersionNotFoundMessage(requestedVersion, fallbackVersion) {
    const messageContainer = document.createElement('div');
    messageContainer.style.position = 'fixed';
    messageContainer.style.top = '50%';
    messageContainer.style.left = '50%';
    messageContainer.style.transform = 'translate(-50%, -50%)';
    messageContainer.style.background = '#f8d7da';
    messageContainer.style.color = '#721c24';
    messageContainer.style.padding = '20px';
    messageContainer.style.borderRadius = '5px';
    messageContainer.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    messageContainer.style.zIndex = '9999';
    messageContainer.style.maxWidth = '500px';
    messageContainer.style.textAlign = 'center';
    
    messageContainer.innerHTML = `
      <h3>Version Not Found</h3>
      <p>API version ${requestedVersion} documentation is not available.</p>
      <p>Redirecting to version ${fallbackVersion} in 5 seconds...</p>
    `;
    
    document.body.appendChild(messageContainer);
    
    // Remove the message after redirect
    setTimeout(() => {
      document.body.removeChild(messageContainer);
    }, 5000);
  }
}

// Initialize the router when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.versionRouter = new VersionRouter();
});