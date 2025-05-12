// Search functionality for the API documentation
class ApiSearch {
  constructor() {
    this.searchInput = document.getElementById('api-search-input');
    this.searchResults = document.getElementById('search-results');
    this.docContent = document.getElementById('doc-container');
    this.sidebar = document.getElementById('sidebar');
    this.sidebarItems = this.sidebar.querySelectorAll('a');
    
    this.searchIndex = [];
    this.buildSearchIndex();
    this.attachEvents();
  }
  
  buildSearchIndex() {
    // Index all headings and descriptions in the documentation
    const headings = this.docContent.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const descriptions = this.docContent.querySelectorAll('.description, .property-name, .property-type');
    
    // Process headings
    headings.forEach(heading => {
      if (heading.id && heading.textContent.trim()) {
        this.searchIndex.push({
          id: heading.id,
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
    this.sidebarItems.forEach(item => {
      if (item.getAttribute('href') === `#${id}`) {
        // Find all parent li and add active class
        let parent = item.parentElement;
        while (parent && parent !== this.sidebar) {
          if (parent.tagName.toLowerCase() === 'li') {
            parent.classList.add('active');
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
  
  clearResults() {
    this.searchResults.innerHTML = '';
    this.searchResults.style.display = 'none';
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

    // Close search results when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.searchResults.contains(e.target) && e.target !== this.searchInput) {
        this.clearResults();
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Initialize search after the document is fully loaded
  const initializeSearch = () => {
    try {
      console.log('Initializing API search...');
      if (document.getElementById('api-search-input') && document.getElementById('doc-container')) {
        new ApiSearch();
        console.log('API search initialized successfully');
      } else {
        console.log('Required elements not found yet, retrying...');
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