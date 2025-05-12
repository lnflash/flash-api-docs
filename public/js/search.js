// Search functionality for the API documentation
class ApiSearch {
  constructor() {
    console.log('Initializing ApiSearch...');
    
    // Remove any duplicate search containers first
    const searchContainers = document.querySelectorAll('.search-container');
    if (searchContainers.length > 1) {
      console.log(`Found ${searchContainers.length} search containers, removing duplicates`);
      for (let i = 1; i < searchContainers.length; i++) {
        searchContainers[i].parentNode.removeChild(searchContainers[i]);
      }
    }
    
    // Get the search elements (after cleanup)
    this.searchInput = document.getElementById('api-search-input');
    this.searchResults = document.getElementById('search-results');
    
    // Find the main content container (different selectors for compatibility)
    this.docContent = document.getElementById('doc-container') || 
                      document.querySelector('.content-body') || 
                      document.querySelector('.content') ||
                      document.querySelector('#docs') ||
                      document.body;
                      
    console.log('Document container found:', !!this.docContent);
    
    this.sidebar = document.getElementById('sidebar');
    this.sidebarItems = this.sidebar ? this.sidebar.querySelectorAll('a') : [];
    
    console.log('Search input found:', !!this.searchInput);
    console.log('Search results element found:', !!this.searchResults);
    console.log('Sidebar found:', !!this.sidebar);
    
    // If elements not found, try to wait for them or create them
    if (!this.searchInput || !this.searchResults) {
      console.log('Required search elements not found, attempting to locate or create them');
      if (this.sidebar) {
        // Look for existing search container
        const container = this.sidebar.querySelector('.search-container');
        if (container) {
          this.searchInput = container.querySelector('input');
          this.searchResults = container.querySelector('#search-results');
          console.log('Found existing search elements in container');
        } else {
          // No search container found, create one
          this.createSearchElements();
        }
      } else {
        console.error('Sidebar not found, cannot create search elements');
        return;
      }
    }
    
    // Final validation
    if (!this.searchInput || !this.searchResults || !this.docContent) {
      console.error('Required elements for search not found after attempts. Aborting initialization.');
      return;
    }
    
    this.searchIndex = [];
    this.buildSearchIndex();
    this.attachEvents();
    console.log('Search initialized with', this.searchIndex.length, 'indexed items');
  }
  
  // Create search elements if they don't exist
  createSearchElements() {
    console.log('Creating search elements');
    
    const container = document.createElement('div');
    container.className = 'search-container';
    
    this.searchInput = document.createElement('input');
    this.searchInput.type = 'text';
    this.searchInput.id = 'api-search-input';
    this.searchInput.placeholder = 'Search API documentation...';
    
    const searchIcon = document.createElement('span');
    searchIcon.className = 'search-icon';
    searchIcon.innerHTML = '🔍';
    
    this.searchResults = document.createElement('div');
    this.searchResults.id = 'search-results';
    
    container.appendChild(this.searchInput);
    container.appendChild(searchIcon);
    container.appendChild(this.searchResults);
    
    // Insert after logo or at beginning
    const logoContainer = this.sidebar.querySelector('.sidebar-top-container');
    if (logoContainer) {
      this.sidebar.insertBefore(container, logoContainer.nextSibling);
    } else {
      this.sidebar.insertBefore(container, this.sidebar.firstChild);
    }
    
    console.log('Created search elements successfully');
  }
  
  buildSearchIndex() {
    // Index all headings and descriptions in the documentation
    console.log('Building search index...');
    
    // Use different selectors to find headings
    const headings = this.docContent.querySelectorAll('h1, h2, h3, h4, h5, h6, .heading, .definition-heading, .operation-heading');
    console.log('Found', headings.length, 'headings');
    
    // Try different selectors for descriptions
    const descriptions = this.docContent.querySelectorAll(
      '.description, .property-name, .property-type, .field-name, .type-name, .operation-name, .field-argument-name'
    );
    console.log('Found', descriptions.length, 'descriptions');
    
    // Process headings
    headings.forEach(heading => {
      if (heading.id && heading.textContent.trim()) {
        this.searchIndex.push({
          id: heading.id,
          text: heading.textContent.trim(),
          type: heading.tagName.toLowerCase(),
          element: heading
        });
      } else if (heading.textContent.trim()) {
        // If no ID, try to find or create one
        const id = heading.textContent.trim()
          .toLowerCase()
          .replace(/[^\w]+/g, '-');
        
        heading.id = id;
        this.searchIndex.push({
          id: id,
          text: heading.textContent.trim(),
          type: heading.tagName.toLowerCase(),
          element: heading
        });
      }
    });
    
    // Process descriptions
    descriptions.forEach(desc => {
      const nearestHeading = this.findNearestHeading(desc);
      if (nearestHeading && nearestHeading.id) {
        this.searchIndex.push({
          id: nearestHeading.id,
          text: desc.textContent.trim(),
          type: 'description',
          element: nearestHeading
        });
      }
    });
  }
  
  findNearestHeading(element) {
    // Find the nearest heading to a description element
    let current = element;
    while (current) {
      if (current.id && /^h[1-6]$/i.test(current.tagName)) {
        return current;
      }
      
      // Look for previous siblings with headings
      let prev = current.previousElementSibling;
      while (prev) {
        if (prev.id && /^h[1-6]$/i.test(prev.tagName)) {
          return prev;
        }
        prev = prev.previousElementSibling;
      }
      
      // Go up the tree
      current = current.parentElement;
    }
    return null;
  }
  
  search(query) {
    if (!query) {
      this.clearResults();
      return;
    }
    
    query = query.toLowerCase();
    const results = this.searchIndex.filter(item => 
      item.text.toLowerCase().includes(query)
    );
    
    // Get unique results based on ID
    const uniqueResults = [];
    const ids = new Set();
    
    results.forEach(result => {
      if (!ids.has(result.id)) {
        ids.add(result.id);
        uniqueResults.push(result);
      }
    });
    
    this.displayResults(uniqueResults.slice(0, 10)); // Limit to top 10 results
  }
  
  displayResults(results) {
    this.searchResults.innerHTML = '';
    
    if (results.length === 0) {
      const noResults = document.createElement('div');
      noResults.className = 'search-no-results';
      noResults.textContent = 'No results found';
      this.searchResults.appendChild(noResults);
      this.searchResults.style.display = 'block';
      return;
    }
    
    results.forEach(result => {
      const resultItem = document.createElement('div');
      resultItem.className = 'search-result-item';
      
      // Title based on type
      const title = document.createElement('div');
      title.className = 'search-result-title';
      title.textContent = result.text.length > 60 
        ? result.text.substring(0, 60) + '...' 
        : result.text;
      
      // Type badge
      const badge = document.createElement('span');
      badge.className = `search-result-badge ${result.type}`;
      badge.textContent = result.type;
      
      resultItem.appendChild(title);
      resultItem.appendChild(badge);
      
      resultItem.addEventListener('click', () => {
        this.navigateToResult(result);
      });
      
      this.searchResults.appendChild(resultItem);
    });
    
    this.searchResults.style.display = 'block';
  }
  
  navigateToResult(result) {
    // Clear search and navigate to the result
    this.clearResults();
    this.searchInput.value = '';
    
    result.element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
    
    // Highlight the element temporarily
    result.element.classList.add('search-highlight');
    setTimeout(() => {
      result.element.classList.remove('search-highlight');
    }, 2000);
    
    // Update the sidebar selection
    this.updateSidebarSelection(result.id);
  }
  
  updateSidebarSelection(id) {
    if (this.sidebarItems && this.sidebarItems.length > 0) {
      this.sidebarItems.forEach(item => {
        const href = item.getAttribute('href');
        if (href && href === `#${id}`) {
          // Find all parent li and add active class
          let parent = item.parentElement;
          while (parent && parent !== this.sidebar) {
            if (parent.tagName.toLowerCase() === 'li') {
              parent.classList.add('active');
              // If there's a nav-group-section, expand it
              if (parent.classList.contains('nav-group-section')) {
                parent.classList.add('nav-scroll-expand');
              }
            }
            parent = parent.parentElement;
          }
          
          // Scroll sidebar to show the active item
          item.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }
      });
    }
  }
  
  clearResults() {
    if (this.searchResults) {
      this.searchResults.innerHTML = '';
      this.searchResults.style.display = 'none';
    }
  }
  
  attachEvents() {
    // Debounce function
    const debounce = (func, delay) => {
      let debounceTimer;
      return function() {
        const context = this;
        const args = arguments;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(context, args), delay);
      };
    };

    // Debounced search function
    const debouncedSearch = debounce((value) => {
      this.search(value);
    }, 300); // 300ms debounce

    if (this.searchInput) {
      // Search input events
      this.searchInput.addEventListener('input', () => {
        // Show "Searching..." message
        if (this.searchInput.value.length > 2) {
          this.searchResults.innerHTML = '<div class="search-no-results">Searching...</div>';
          this.searchResults.style.display = 'block';
          debouncedSearch(this.searchInput.value);
        } else if (this.searchInput.value.length === 0) {
          this.clearResults();
        }
      });

      this.searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && this.searchResults.children.length > 0) {
          // Navigate to the first result on Enter
          e.preventDefault();
          const firstResult = this.searchResults.querySelector('.search-result-item');
          if (firstResult) {
            firstResult.click();
          }
        }
      });
    }

    // Close search results when clicking outside
    document.addEventListener('click', (e) => {
      if (this.searchResults && !this.searchResults.contains(e.target) && 
          this.searchInput && e.target !== this.searchInput) {
        this.clearResults();
      }
    });
  }
}

// Make ApiSearch available globally
window.ApiSearch = ApiSearch;

document.addEventListener('DOMContentLoaded', () => {
  // Initialize search after the document is fully loaded
  const initializeSearch = () => {
    try {
      console.log('Initializing API search from DOMContentLoaded...');
      
      // Check if the required containers exist
      const searchInput = document.getElementById('api-search-input');
      const docContainer = document.getElementById('doc-container') || 
                          document.querySelector('.content-body') || 
                          document.querySelector('.content') ||
                          document.querySelector('#docs');
      
      if (searchInput && docContainer) {
        // Check if already initialized
        if (!window.searchInstance) {
          window.searchInstance = new ApiSearch();
          console.log('API search initialized successfully');
        }
      } else {
        console.log('Required elements not found yet, retrying...', {
          searchInput: !!searchInput,
          docContainer: !!docContainer
        });
        setTimeout(initializeSearch, 500);
      }
    } catch (error) {
      console.error('Error initializing search:', error);
      setTimeout(initializeSearch, 1000);
    }
  };

  // Start initialization after a short delay
  setTimeout(initializeSearch, 500);
});