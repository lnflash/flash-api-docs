/**
 * Theme Switcher for Flash API Documentation
 * Handles dark/light mode toggling with system preference detection and state persistence
 */
(function() {
  // Theme constants
  const DARK_THEME = 'dark';
  const LIGHT_THEME = 'light';
  const THEME_STORAGE_KEY = 'flash-docs-theme';
  
  // Get DOM elements
  let themeToggle;
  
  /**
   * Initialize theme functionality
   */
  function init() {
    // Create toggle button if it doesn't exist
    createToggleButton();
    
    // Set initial theme based on user preference or system setting
    setInitialTheme();
    
    // Set up event listeners
    setupEventListeners();
    
    // Log initialization
    console.log('Theme switcher initialized');
  }
  
  /**
   * Create theme toggle button
   */
  function createToggleButton() {
    // Don't create duplicate buttons
    if (document.querySelector('.theme-toggle')) return;

    // Create button element
    themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.setAttribute('aria-label', 'Toggle dark mode');
    themeToggle.setAttribute('title', 'Toggle dark/light mode');

    // Add extra styles to ensure visibility
    themeToggle.style.position = 'fixed';
    themeToggle.style.zIndex = '9999';
    themeToggle.style.bottom = '30px';
    themeToggle.style.right = '30px';
    themeToggle.style.width = '50px';
    themeToggle.style.height = '50px';
    themeToggle.style.borderRadius = '50%';
    themeToggle.style.backgroundColor = '#1655c0';
    themeToggle.style.color = 'white';
    themeToggle.style.border = 'none';
    themeToggle.style.cursor = 'pointer';
    themeToggle.style.display = 'flex';
    themeToggle.style.alignItems = 'center';
    themeToggle.style.justifyContent = 'center';
    themeToggle.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
    themeToggle.style.transition = 'all 0.3s ease';

    // Set initial icon
    updateToggleIcon();

    // Add to document
    document.body.appendChild(themeToggle);

    // Add a pulsing animation to highlight the button
    setTimeout(() => {
      themeToggle.style.animation = 'pulse 2s infinite';

      // Add the keyframes for the pulse animation
      const style = document.createElement('style');
      style.textContent = `
        @keyframes pulse {
          0% { transform: scale(1); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3); }
          50% { transform: scale(1.05); box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4); }
          100% { transform: scale(1); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3); }
        }
      `;
      document.head.appendChild(style);

      // Remove animation after a few pulses
      setTimeout(() => {
        themeToggle.style.animation = 'none';
      }, 6000); // Pulse for 6 seconds (3 full pulses)
    }, 1000); // Start pulsing after 1 second
  }
  
  /**
   * Set up event listeners
   */
  function setupEventListeners() {
    // Toggle button click
    themeToggle.addEventListener('click', toggleTheme);
    
    // Listen for system theme changes
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
        if (getStoredTheme() === null) {
          // Only adjust to system changes if user hasn't explicitly set a preference
          setTheme(e.matches ? DARK_THEME : LIGHT_THEME);
        }
      });
    }
  }
  
  /**
   * Set initial theme based on stored preference or system setting
   */
  function setInitialTheme() {
    const storedTheme = getStoredTheme();
    
    if (storedTheme) {
      // Use stored user preference
      setTheme(storedTheme);
    } else {
      // Use system preference
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? DARK_THEME : LIGHT_THEME);
    }
  }
  
  /**
   * Toggle between light and dark theme
   */
  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === DARK_THEME ? LIGHT_THEME : DARK_THEME;
    
    setTheme(newTheme);
    storeTheme(newTheme);
    
    // Optional: Add a subtle animation effect
    animateThemeChange();
  }
  
  /**
   * Apply theme to document - Enhanced with Absolute Zero methodology
   */
  function setTheme(theme) {
    // Set theme on main document
    document.documentElement.setAttribute('data-theme', theme);

    // Try to set theme on all iframes (using multiple targeting strategies)
    const iframes = document.querySelectorAll('iframe');
    iframes.forEach(iframe => {
      try {
        // Apply to standard iframes
        if (iframe.contentDocument) {
          iframe.contentDocument.documentElement.setAttribute('data-theme', theme);
        }

        // For SpectaQL specific iframe
        if (iframe.classList.contains('spec-container')) {
          // Create a style element for higher enforcement
          const styleEl = document.createElement('style');
          styleEl.textContent = `
            :root, html, body {
              --force-theme: "${theme}" !important;
              data-theme: ${theme} !important;
            }
            [data-theme] {
              data-theme: ${theme} !important;
            }
          `;

          try {
            // Attempt to inject the style
            if (iframe.contentDocument && iframe.contentDocument.head) {
              // Remove any previous injected style
              const oldStyle = iframe.contentDocument.head.querySelector('#theme-enforcer');
              if (oldStyle) oldStyle.remove();

              // Add ID to identify this style
              styleEl.id = 'theme-enforcer';
              iframe.contentDocument.head.appendChild(styleEl);
            }
          } catch (e) {
            console.warn('Could not inject style into iframe', e);
          }
        }
      } catch (e) {
        console.warn('Could not set theme on iframe due to security restrictions', e);
      }
    });

    updateToggleIcon();

    // Notify theme change for any components that need to know
    document.dispatchEvent(new CustomEvent('themechange', {
      detail: { theme }
    }));
  }
  
  /**
   * Update toggle button icon based on current theme
   */
  function updateToggleIcon() {
    if (!themeToggle) return;

    const currentTheme = document.documentElement.getAttribute('data-theme');

    // Set appropriate icon with text
    themeToggle.innerHTML = currentTheme === DARK_THEME
      ? '<span style="font-size: 24px;">☀️</span>' // Sun for light mode toggle
      : '<span style="font-size: 24px;">🌙</span>'; // Moon for dark mode toggle

    // Update aria-label for accessibility
    themeToggle.setAttribute('aria-label', currentTheme === DARK_THEME
      ? 'Switch to light mode'
      : 'Switch to dark mode');

    // Add text to indicate purpose
    themeToggle.title = currentTheme === DARK_THEME
      ? 'Switch to light mode'
      : 'Switch to dark mode';
  }
  
  /**
   * Add animation when changing themes
   */
  function animateThemeChange() {
    // Create an overlay for the animation
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = document.documentElement.getAttribute('data-theme') === DARK_THEME
      ? 'rgba(255,255,255,0.15)' // Flash of light when switching to light mode
      : 'rgba(0,0,0,0.15)';      // Flash of darkness when switching to dark mode
    overlay.style.zIndex = '9998';
    overlay.style.opacity = '0';
    overlay.style.pointerEvents = 'none';
    overlay.style.transition = 'opacity 0.4s ease';

    document.body.appendChild(overlay);

    // Create a ripple effect from the toggle button
    const ripple = document.createElement('div');
    const rect = themeToggle.getBoundingClientRect();
    ripple.style.position = 'fixed';
    ripple.style.top = rect.top + rect.height/2 + 'px';
    ripple.style.left = rect.left + rect.width/2 + 'px';
    ripple.style.width = '10px';
    ripple.style.height = '10px';
    ripple.style.borderRadius = '50%';
    ripple.style.backgroundColor = document.documentElement.getAttribute('data-theme') === DARK_THEME
      ? '#ffffff'
      : '#121212';
    ripple.style.transform = 'translate(-50%, -50%) scale(1)';
    ripple.style.opacity = '0.7';
    ripple.style.zIndex = '9997';
    ripple.style.transition = 'transform 0.6s ease-out, opacity 0.6s ease-out';

    document.body.appendChild(ripple);

    // Trigger animations
    setTimeout(() => {
      // Fade in overlay
      overlay.style.opacity = '1';

      // Expand ripple
      ripple.style.transform = 'translate(-50%, -50%) scale(150)';
      ripple.style.opacity = '0';

      // Clean up after animations
      setTimeout(() => {
        overlay.style.opacity = '0';

        setTimeout(() => {
          document.body.removeChild(overlay);
          document.body.removeChild(ripple);
        }, 400);
      }, 300);
    }, 10);
  }
  
  /**
   * Store theme preference in localStorage
   */
  function storeTheme(theme) {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (e) {
      console.warn('Unable to store theme preference:', e);
    }
  }
  
  /**
   * Get stored theme from localStorage
   */
  function getStoredTheme() {
    try {
      return localStorage.getItem(THEME_STORAGE_KEY);
    } catch (e) {
      console.warn('Unable to retrieve theme preference:', e);
      return null;
    }
  }
  
  /**
   * Check for system dark mode preference
   */
  function prefersDarkMode() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  
  // Initialize when DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // Make functions available globally for testing
  window.themeSwitcher = {
    toggleTheme,
    setTheme
  };
})();