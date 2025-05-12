/**
 * Flash API Documentation - Main JavaScript
 * This file handles all interactions for the documentation.
 */
(function() {
  // Store DOM elements
  let elements = {};
  
  /**
   * Initialize all documentation functionality
   */
  function init() {
    console.log('Initializing Flash API Documentation...');
    
    // Get DOM elements
    cacheElements();
    
    // Set up event listeners and interactions
    setupSidebar();
    setupSidebarToggle();
    setupSearch();
    setupScrollToTop();
    setupSectionToggle();
    
    // Setup mobile interactions
    setupMobileInteractions();
    
    console.log('Flash API Documentation initialized successfully');
  }
  
  /**
   * Cache DOM elements for later use
   */
  function cacheElements() {
    elements.body = document.getElementById('spectaql');
    elements.sidebar = document.getElementById('sidebar');
    elements.docs = document.getElementById('docs');
    elements.nav = document.getElementById('nav');
    elements.logo = document.getElementById('logo');
    elements.mobileNav = document.getElementById('mobile-navbar');
    elements.drawerOverlay = document.querySelector('.drawer-overlay');
    elements.sidebarOpenButton = document.querySelector('.sidebar-open-button');
    elements.sidebarCloseButton = document.querySelector('.close-button');
    elements.navSections = document.querySelectorAll('.nav-group-section-title');
    elements.backLink = document.querySelector('.back-link');
    
    // Create doc container if it doesn't exist
    if (!document.getElementById('doc-container')) {
      elements.docContainer = document.createElement('div');
      elements.docContainer.id = 'doc-container';
      
      // Move content to container
      if (elements.docs) {
        // Find content (can be either content-body or direct children)
        let contentBody = elements.docs.querySelector('.content-body');
        if (contentBody) {
          elements.docContainer = contentBody;
          elements.docContainer.id = 'doc-container';
        } else {
          // Clone children to avoid modifying during iteration
          const children = Array.from(elements.docs.children);
          children.forEach(child => {
            elements.docContainer.appendChild(child);
          });
          elements.docs.appendChild(elements.docContainer);
        }
      }
    } else {
      elements.docContainer = document.getElementById('doc-container');
    }
  }
  
  /**
   * Set up sidebar functionality
   */
  function setupSidebar() {
    // Add logo if missing or needs enhancement
    if (elements.logo && !elements.logo.querySelector('img')) {
      const logoImg = document.createElement('img');
      logoImg.src = 'images/logo-black.png';
      logoImg.alt = 'Flash API';
      elements.logo.appendChild(logoImg);
    }
    
    // Fix navigation active links
    if (elements.nav) {
      const links = elements.nav.querySelectorAll('a');
      links.forEach(link => {
        link.addEventListener('click', function(e) {
          // Remove active class from all links
          links.forEach(l => l.classList.remove('nav-scroll-active'));
          
          // Add active class to clicked link
          this.classList.add('nav-scroll-active');
          
          // On mobile, close the menu after clicking
          if (window.innerWidth < 768) {
            elements.body.classList.remove('drawer-open');
          }
        });
      });
    }
  }
  
  /**
   * Set up sidebar toggle functionality
   */
  function setupSidebarToggle() {
    // Create toggle button if it doesn't exist
    if (!document.getElementById('sidebar-toggle')) {
      const toggleButton = document.createElement('button');
      toggleButton.id = 'sidebar-toggle';
      toggleButton.innerHTML = '&lsaquo;';
      toggleButton.setAttribute('aria-label', 'Toggle sidebar');
      document.body.appendChild(toggleButton);
      elements.sidebarToggle = toggleButton;
    } else {
      elements.sidebarToggle = document.getElementById('sidebar-toggle');
    }
    
    // Check localStorage for saved preference
    const sidebarState = localStorage.getItem('flash-docs-sidebar-collapsed');
    if (sidebarState === 'true') {
      elements.body.classList.add('sidebar-collapsed');
      if (elements.sidebarToggle) {
        elements.sidebarToggle.innerHTML = '&rsaquo;';
      }
    }
    
    // Add toggle event
    if (elements.sidebarToggle) {
      elements.sidebarToggle.addEventListener('click', function() {
        elements.body.classList.toggle('sidebar-collapsed');
        
        // Update button text
        const isCollapsed = elements.body.classList.contains('sidebar-collapsed');
        this.innerHTML = isCollapsed ? '&rsaquo;' : '&lsaquo;';
        
        // Store preference
        localStorage.setItem('flash-docs-sidebar-collapsed', isCollapsed);
      });
    }
  }
  
  /**
   * Set up search functionality
   */
  function setupSearch() {
    // Initialize search functionality
    const initializeSearch = () => {
      // First, remove any duplicate search containers
      const searchContainers = document.querySelectorAll('.search-container');
      if (searchContainers.length > 1) {
        // Keep only the first one
        for (let i = 1; i < searchContainers.length; i++) {
          searchContainers[i].remove();
        }
        console.log('Removed duplicate search containers');
      }

      // Ensure we have one search input
      let searchInput = document.getElementById('api-search-input');
      const docContainer = document.getElementById('doc-container');

      if (!searchInput || !docContainer) {
        // Check if we already have a search container
        if (!document.querySelector('.search-container') && elements.sidebar) {
          // Create search container
          const searchContainer = document.createElement('div');
          searchContainer.className = 'search-container';
          searchContainer.id = 'main-search-container';

          // Create search input
          const input = document.createElement('input');
          input.type = 'text';
          input.id = 'api-search-input';
          input.placeholder = 'Search API documentation...';

          // Create search icon
          const searchIcon = document.createElement('span');
          searchIcon.className = 'search-icon';
          searchIcon.innerHTML = '🔍';

          // Create results container
          const results = document.createElement('div');
          results.id = 'search-results';

          // Assemble and insert
          searchContainer.appendChild(input);
          searchContainer.appendChild(searchIcon);
          searchContainer.appendChild(results);

          // Insert at top of sidebar after the logo
          const logoContainer = elements.sidebar.querySelector('.sidebar-top-container');
          if (logoContainer) {
            elements.sidebar.insertBefore(searchContainer, logoContainer.nextSibling);
          } else if (elements.nav) {
            elements.sidebar.insertBefore(searchContainer, elements.nav);
          } else {
            elements.sidebar.insertBefore(searchContainer, elements.sidebar.firstChild);
          }

          // Update reference to search input
          searchInput = input;
        }

        // Retry after a short delay if we still don't have what we need
        if (!searchInput || !docContainer) {
          setTimeout(initializeSearch, 500);
          return;
        }
      }

      // Load the search script and initialize the API search only if it hasn't been initialized
      if (!window.searchInstance) {
        if (window.ApiSearch) {
          try {
            window.searchInstance = new ApiSearch();
            console.log('Search initialized successfully');

            // Add event listener directly to ensure it works
            searchInput.addEventListener('input', function(e) {
              if (window.searchInstance && typeof window.searchInstance.search === 'function') {
                // Show "Searching..." message for queries of 3+ characters
                if (this.value.length > 2) {
                  const searchResults = document.getElementById('search-results');
                  if (searchResults) {
                    searchResults.innerHTML = '<div class="search-no-results">Searching...</div>';
                    searchResults.style.display = 'block';
                  }

                  // Use debounce pattern
                  clearTimeout(this._searchTimeout);
                  this._searchTimeout = setTimeout(() => {
                    window.searchInstance.search(this.value);
                  }, 300);
                } else if (this.value.length === 0) {
                  const searchResults = document.getElementById('search-results');
                  if (searchResults) {
                    searchResults.innerHTML = '';
                    searchResults.style.display = 'none';
                  }
                }
              }
            });
          } catch (error) {
            console.error('Error initializing search:', error);
          }
        } else {
          // If ApiSearch is not defined, load the search.js file
          if (!document.querySelector('script[src="js/search.js"]')) {
            const script = document.createElement('script');
            script.src = 'js/search.js';
            script.onload = function() {
              setTimeout(() => {
                if (window.ApiSearch) {
                  window.searchInstance = new ApiSearch();
                  console.log('Search initialized after loading script');
                }
              }, 500);
            };
            document.body.appendChild(script);
          }
        }
      }
    };

    // Start search initialization
    initializeSearch();
  }
  
  /**
   * Set up back-to-top button
   */
  function setupScrollToTop() {
    // Create back-to-top button if it doesn't exist
    if (!document.getElementById('back-to-top')) {
      const backToTopButton = document.createElement('button');
      backToTopButton.id = 'back-to-top';
      backToTopButton.innerHTML = '&#x2191;';
      backToTopButton.title = 'Back to top';
      backToTopButton.style.display = 'none';
      document.body.appendChild(backToTopButton);
      
      // Show/hide based on scroll position
      window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
          backToTopButton.style.display = 'flex';
        } else {
          backToTopButton.style.display = 'none';
        }
      });
      
      // Scroll to top on click
      backToTopButton.addEventListener('click', function() {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
  }
  
  /**
   * Setup expandable/collapsible sections
   */
  function setupSectionToggle() {
    if (elements.navSections) {
      elements.navSections.forEach(section => {
        section.addEventListener('click', function(e) {
          const parentLi = this.closest('li');
          if (parentLi) {
            parentLi.classList.toggle('nav-scroll-expand');
          }
        });
      });
    }
  }
  
  /**
   * Set up mobile interactions
   */
  function setupMobileInteractions() {
    // Mobile menu open button
    if (elements.sidebarOpenButton) {
      elements.sidebarOpenButton.addEventListener('click', function() {
        elements.body.classList.add('drawer-open');
      });
    }
    
    // Mobile menu close button
    if (elements.sidebarCloseButton) {
      elements.sidebarCloseButton.addEventListener('click', function() {
        elements.body.classList.remove('drawer-open');
      });
    }
    
    // Close menu when clicking overlay
    if (elements.drawerOverlay) {
      elements.drawerOverlay.addEventListener('click', function() {
        elements.body.classList.remove('drawer-open');
      });
    }
  }
  
  // Initialize when DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();