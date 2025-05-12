// Script to ensure search functionality is properly loaded and initialized
(function() {
  // Function to initialize document container
  function setupDocContainer() {
    if (!document.getElementById('doc-container')) {
      // Try different content containers
      const contentContainers = [
        document.querySelector('#docs'),
        document.querySelector('.content-body'),
        document.querySelector('.content'),
        document.querySelector('main'),
        document.querySelector('#spectaql')
      ];

      // Use the first available container
      for (const container of contentContainers) {
        if (container) {
          // If it's the docs container, we need to add another layer
          if (container.id === 'docs') {
            // Check if there's already a content-body
            let contentBody = container.querySelector('.content-body');
            if (!contentBody) {
              contentBody = document.createElement('div');
              contentBody.className = 'content-body';
              // Move all children into this container
              while (container.firstChild) {
                contentBody.appendChild(container.firstChild);
              }
              container.appendChild(contentBody);
            }
            contentBody.id = 'doc-container';
            console.log('Doc container set up within docs:', contentBody);
          } else {
            container.id = 'doc-container';
            console.log('Doc container set up:', container);
          }
          return true;
        }
      }

      console.warn('Could not find a suitable document container');
      return false;
    }

    return true;
  }
  
  // Function to set up search UI
  function setupSearchUI() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) {
      console.warn('Sidebar not found, search cannot be added');
      return false;
    }
    
    // Check if search is already set up
    if (document.getElementById('api-search-input')) {
      console.log('Search UI already set up');
      return true;
    }
    
    const navElement = sidebar.querySelector('nav');
    if (!navElement) {
      console.warn('Navigation element not found in sidebar');
      return false;
    }
    
    // Create search container
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    
    // Create search input
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.id = 'api-search-input';
    searchInput.placeholder = 'Search documentation...';
    searchInput.setAttribute('autocomplete', 'off');
    
    // Create search icon
    const searchIcon = document.createElement('span');
    searchIcon.className = 'search-icon';
    searchIcon.innerHTML = '🔍';
    
    // Create search results container
    const searchResults = document.createElement('div');
    searchResults.id = 'search-results';
    
    // Add elements to container
    searchContainer.appendChild(searchInput);
    searchContainer.appendChild(searchIcon);
    searchContainer.appendChild(searchResults);
    
    // Insert before nav
    sidebar.insertBefore(searchContainer, navElement);
    console.log('Search UI set up successfully');
    
    return true;
  }
  
  // Function to load stylesheet
  function loadStylesheet(href) {
    if (document.querySelector(`link[href="${href}"]`)) {
      console.log(`Stylesheet ${href} already loaded`);
      return;
    }
    
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
    console.log(`Loaded stylesheet: ${href}`);
  }
  
  // Function to initialize search functionality
  function initializeSearch() {
    if (!setupDocContainer()) {
      setTimeout(initializeSearch, 500);
      return;
    }
    
    if (!setupSearchUI()) {
      setTimeout(initializeSearch, 500);
      return;
    }
    
    // Load search stylesheet
    loadStylesheet('stylesheets/search.css');
    
    // Check if search script is already loaded
    if (window.ApiSearch) {
      console.log('ApiSearch class already available, initializing...');
      if (!window.searchInstance) {
        try {
          window.searchInstance = new ApiSearch();
          console.log('Search initialized from loader script');
        } catch (error) {
          console.error('Error initializing search:', error);
        }
      }
      return;
    }
    
    // Load search script if not already loaded
    const script = document.createElement('script');
    script.src = 'js/search.js';
    script.onload = function() {
      console.log('Search script loaded successfully');
      setTimeout(() => {
        if (window.ApiSearch) {
          try {
            window.searchInstance = new ApiSearch();
            console.log('Search initialized after script load');
          } catch (error) {
            console.error('Error initializing search after script load:', error);
          }
        } else {
          console.error('ApiSearch class not available after script load');
        }
      }, 500);
    };
    document.body.appendChild(script);
  }
  
  // Start initialization when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(initializeSearch, 500);
    });
  } else {
    setTimeout(initializeSearch, 500);
  }
  
  // Also try initializing after window load for good measure
  window.addEventListener('load', () => {
    setTimeout(() => {
      if (!window.searchInstance) {
        console.log('Retrying search initialization after window load');
        initializeSearch();
      }
    }, 1000);
  });
})();