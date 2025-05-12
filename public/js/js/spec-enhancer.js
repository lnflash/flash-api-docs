// Script to enhance the spectaql-generated documentation
document.addEventListener('DOMContentLoaded', function() {
  // Add search box to the sidebar
  const sidebar = document.getElementById('sidebar');
  const navElement = sidebar.querySelector('nav');

  if (sidebar && navElement) {
    // Create search container
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';

    // Create search input
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.id = 'api-search-input';
    searchInput.placeholder = 'Search API...';

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

    // Load search.css if not loaded
    if (!document.querySelector('link[href="stylesheets/search.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'stylesheets/search.css';
      document.head.appendChild(link);
    }

    // Load search.js if not loaded
    if (!document.querySelector('script[src="js/search.js"]')) {
      const script = document.createElement('script');
      script.src = 'js/search.js';
      document.body.appendChild(script);
    }
  }

  // Remove duplicate back link if it exists
  const backLinks = document.querySelectorAll('.back-link');
  if (backLinks.length > 1) {
    backLinks[1].remove();
  }

  // Load pagination styles
  if (!document.querySelector('link[href="stylesheets/pagination.css"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'stylesheets/pagination.css';
    document.head.appendChild(link);
  }

  // Load pagination script
  if (!document.querySelector('script[src="js/pagination.js"]')) {
    const script = document.createElement('script');
    script.src = 'js/pagination.js';
    document.body.appendChild(script);
  }

  // Add a "Back to top" button
  const backToTopButton = document.createElement('button');
  backToTopButton.id = 'back-to-top';
  backToTopButton.innerHTML = '↑';
  backToTopButton.title = 'Back to top';
  document.body.appendChild(backToTopButton);

  // Show/hide back to top button based on scroll position
  window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
      backToTopButton.style.display = 'block';
    } else {
      backToTopButton.style.display = 'none';
    }
  });

  // Scroll to top when button is clicked
  backToTopButton.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // Add back to top button styles
  const style = document.createElement('style');
  style.textContent = `
    #back-to-top {
      display: none;
      position: fixed;
      bottom: 30px;
      right: 30px;
      z-index: 99;
      border: none;
      outline: none;
      background-color: var(--primary-color);
      color: white;
      cursor: pointer;
      padding: 15px;
      border-radius: 50%;
      font-size: 18px;
      width: 50px;
      height: 50px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      transition: all 0.3s ease;
    }

    #back-to-top:hover {
      background-color: var(--primary-color-darker);
      transform: scale(1.1);
    }
  `;
  document.head.appendChild(style);
});