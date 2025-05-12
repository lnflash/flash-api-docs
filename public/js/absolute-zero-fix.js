/**
 * AbsoluteZero layout fix for SpectaQL documentation
 * This script fixes layout issues by using a minimal approach that preserves
 * the existing structure and only adds necessary fixes.
 */
(function() {
  // Function to ensure doc-container exists
  function ensureDocContainer() {
    // First look for the content element with the right structure
    const docsContainer = document.getElementById('docs');

    if (!docsContainer) {
      console.error('Could not find #docs container');
      return false;
    }

    // Find or create the doc-container
    let docContainer = document.getElementById('doc-container');

    if (!docContainer) {
      // Try to find the main content area using various selectors
      const contentSelectors = [
        '.content-body',
        '#docs > .content',
        '#spectaql > #page > #docs',
        '#docs'
      ];

      let contentBody = null;
      for (const selector of contentSelectors) {
        contentBody = document.querySelector(selector);
        if (contentBody) break;
      }

      if (contentBody) {
        // Set the content body as the doc container
        contentBody.id = 'doc-container';
        console.log('Created doc-container from existing element:', contentBody);
      } else {
        // Create a new doc-container and move all content into it
        docContainer = document.createElement('div');
        docContainer.id = 'doc-container';

        // Move all children of docs to the doc-container
        while (docsContainer.firstChild) {
          docContainer.appendChild(docsContainer.firstChild);
        }

        docsContainer.appendChild(docContainer);
        console.log('Created new doc-container element');
      }
    }

    return true;
  }

  // Function to add sidebar toggle functionality
  function addSidebarToggle() {
    const spectaqlContainer = document.getElementById('spectaql');
    const sidebar = document.getElementById('sidebar');

    if (!spectaqlContainer || !sidebar) {
      console.error('Could not find spectaql or sidebar containers');
      return false;
    }

    // Create toggle button
    const toggleButton = document.createElement('button');
    toggleButton.id = 'sidebar-toggle';
    toggleButton.innerHTML = '&lsaquo;';
    toggleButton.title = 'Toggle sidebar';
    toggleButton.setAttribute('aria-label', 'Toggle sidebar');

    // Add toggle functionality
    const storedState = localStorage.getItem('sidebar-collapsed');
    const isCollapsed = storedState === 'true';

    if (isCollapsed) {
      spectaqlContainer.classList.add('sidebar-collapsed');
      toggleButton.innerHTML = '&rsaquo;';
    }

    toggleButton.addEventListener('click', function() {
      spectaqlContainer.classList.toggle('sidebar-collapsed');
      const isNowCollapsed = spectaqlContainer.classList.contains('sidebar-collapsed');

      // Update toggle button text
      toggleButton.innerHTML = isNowCollapsed ? '&rsaquo;' : '&lsaquo;';

      // Store state in localStorage
      localStorage.setItem('sidebar-collapsed', isNowCollapsed);
    });

    // Add to document
    document.body.appendChild(toggleButton);
    console.log('Added sidebar toggle button');

    return true;
  }
  
  // Function to fix duplicate back links
  function fixBackLinks() {
    const backLinks = document.querySelectorAll('.back-link');
    if (backLinks.length > 1) {
      for (let i = 1; i < backLinks.length; i++) {
        backLinks[i].style.display = 'none';
      }
      console.log('Fixed duplicate back links:', backLinks.length - 1, 'hidden');
    }
  }
  
  // Function to fix CSS loading
  function fixCssLoading() {
    const linkElement = document.createElement('link');
    linkElement.rel = 'stylesheet';
    linkElement.href = 'stylesheets/fix.css';
    document.head.appendChild(linkElement);
    console.log('Added fix.css stylesheet');
  }
  
  // Function to add a proper content wrapper if needed
  function ensureContentWrapper() {
    const docs = document.getElementById('docs');
    const docContainer = document.getElementById('doc-container');
    
    if (docs && docContainer) {
      // Check if we need a content body wrapper
      if (!docs.querySelector('.content-body')) {
        const contentBody = document.createElement('div');
        contentBody.className = 'content-body';
        
        // Move doc-container inside content-body if needed
        if (docContainer.parentNode === docs) {
          docs.removeChild(docContainer);
          contentBody.appendChild(docContainer);
          docs.appendChild(contentBody);
          console.log('Added content-body wrapper');
        }
      }
    }
  }
  
  // Execute fixes when DOM is loaded
  function applyFixes() {
    console.log('Applying AbsoluteZero fixes...');
    fixCssLoading();
    ensureDocContainer();
    fixBackLinks();
    ensureContentWrapper();
    addSidebarToggle();

    // Fix any z-index issues with search
    const searchContainer = document.querySelector('.search-container');
    if (searchContainer) {
      searchContainer.style.zIndex = '100';
    }

    // Make sure sidebar does not overlap content on initial load
    const spectaqlContainer = document.getElementById('spectaql');
    const storedState = localStorage.getItem('sidebar-collapsed');
    if (storedState === 'true' && spectaqlContainer) {
      spectaqlContainer.classList.add('sidebar-collapsed');
    }

    // Final check to ensure the search works properly
    setTimeout(() => {
      if (window.ApiSearch && !window.searchInstance) {
        try {
          window.searchInstance = new ApiSearch();
          console.log('Reinitialized API search after layout fixes');
        } catch (error) {
          console.error('Error reinitializing search:', error);
        }
      }
    }, 1000);

    console.log('AbsoluteZero fixes applied');
  }
  
  // Apply fixes when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyFixes);
  } else {
    applyFixes();
  }
})();