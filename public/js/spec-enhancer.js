// Script to enhance the spectaql-generated documentation
document.addEventListener('DOMContentLoaded', function() {
  // Create document container element if it doesn't exist
  if (!document.getElementById('doc-container')) {
    // Find the main content container
    const mainContent = document.querySelector('.content-body');
    if (mainContent) {
      mainContent.id = 'doc-container';
    }
  }

  // Search box is now added by documentation.js
  // We'll just make sure search CSS is loaded, but won't add a duplicate search box

  // Load search.css if not loaded
  if (!document.querySelector('link[href="stylesheets/search.css"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'stylesheets/search.css';
    document.head.appendChild(link);
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