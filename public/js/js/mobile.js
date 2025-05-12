/**
 * Mobile responsiveness handlers for Flash API Documentation
 * Manages mobile-specific interactions and responsive behaviors
 */
(function() {
  // Store DOM elements
  let elements = {};
  
  /**
   * Initialize mobile functionality
   */
  function init() {
    if (!isMobile()) return;
    
    console.log('Initializing mobile enhancements...');
    
    // Get DOM elements
    cacheElements();
    
    // Set up mobile navigation
    setupMobileNavigation();
    
    // Create collapsible sections
    setupCollapsibleSections();
    
    // Improve scrolling behavior for code blocks
    setupHorizontalScrollIndicators();
    
    // Adjust heading anchor positions for mobile
    fixAnchorScrollPositioning();
    
    console.log('Mobile enhancements initialized');
  }
  
  /**
   * Check if current device is mobile
   */
  function isMobile() {
    return window.innerWidth < 769;
  }
  
  /**
   * Cache DOM elements for later use
   */
  function cacheElements() {
    elements.body = document.body;
    elements.main = document.querySelector('main');
    elements.content = document.querySelector('.content');
    elements.sidebar = document.querySelector('.sidebar');
    elements.header = document.querySelector('header');
    elements.codeBlocks = document.querySelectorAll('.code-sample pre');
    elements.headings = document.querySelectorAll('h2, h3, h4, h5, h6');
  }
  
  /**
   * Set up mobile navigation
   */
  function setupMobileNavigation() {
    // Only proceed if we don't already have mobile navigation
    if (document.getElementById('mobile-nav')) return;
    
    // Create mobile navigation toggle
    const mobileNav = document.createElement('div');
    mobileNav.id = 'mobile-nav';
    mobileNav.className = 'mobile-nav';
    mobileNav.innerHTML = `
      <button class="mobile-menu-toggle" aria-label="Toggle navigation menu">
        <span class="hamburger-icon"></span>
      </button>
      <div class="mobile-logo">
        <img src="images/logo-black.png" alt="Flash API" height="30">
      </div>
    `;
    
    // Add to document if header exists
    if (elements.header) {
      elements.header.parentNode.insertBefore(mobileNav, elements.header);
    } else {
      document.body.insertBefore(mobileNav, document.body.firstChild);
    }
    
    // Create mobile sidebar overlay
    const overlay = document.createElement('div');
    overlay.className = 'mobile-overlay';
    document.body.appendChild(overlay);
    
    // Store new elements
    elements.mobileNav = mobileNav;
    elements.menuToggle = mobileNav.querySelector('.mobile-menu-toggle');
    elements.overlay = overlay;
    
    // Add event listeners
    elements.menuToggle.addEventListener('click', toggleMobileMenu);
    elements.overlay.addEventListener('click', closeMobileMenu);
    
    // Auto-close menu when clicking links in sidebar
    if (elements.sidebar) {
      const sidebarLinks = elements.sidebar.querySelectorAll('a');
      sidebarLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
      });
    }
  }
  
  /**
   * Toggle mobile menu visibility
   */
  function toggleMobileMenu() {
    document.body.classList.toggle('mobile-menu-open');
  }
  
  /**
   * Close mobile menu
   */
  function closeMobileMenu() {
    document.body.classList.remove('mobile-menu-open');
  }
  
  /**
   * Create collapsible sections for better mobile navigation
   */
  function setupCollapsibleSections() {
    // Only apply to certain sections on mobile
    const sections = elements.content.querySelectorAll('h2[id]');
    
    sections.forEach(section => {
      // Get all content until next h2
      const sectionContent = [];
      let currentElement = section.nextElementSibling;
      
      while (currentElement && currentElement.tagName !== 'H2') {
        sectionContent.push(currentElement);
        currentElement = currentElement.nextElementSibling;
      }
      
      // Create section container
      const sectionContainer = document.createElement('div');
      sectionContainer.className = 'mobile-section';
      sectionContainer.setAttribute('data-section-id', section.id);
      
      // Create header that remains visible
      const sectionHeader = document.createElement('div');
      sectionHeader.className = 'mobile-section-header';
      sectionHeader.innerHTML = section.innerHTML;
      sectionHeader.id = section.id; // Transfer the ID
      
      // Create content container
      const sectionContentDiv = document.createElement('div');
      sectionContentDiv.className = 'mobile-section-content';
      
      // Remove ID from original as we transferred it
      section.removeAttribute('id');
      
      // Add event listener to toggle content visibility
      sectionHeader.addEventListener('click', function() {
        sectionContainer.classList.toggle('open');
      });
      
      // Replace the original section with our container
      section.parentNode.insertBefore(sectionContainer, section);
      sectionContainer.appendChild(sectionHeader);
      sectionContainer.appendChild(sectionContentDiv);
      
      // Move content into the container
      sectionContent.forEach(el => {
        sectionContentDiv.appendChild(el);
      });
      
      // Remove the original section
      section.parentNode.removeChild(section);
    });
    
    // Open section based on hash if present
    if (window.location.hash) {
      const sectionId = window.location.hash.substring(1);
      const section = document.querySelector(`.mobile-section[data-section-id="${sectionId}"]`);
      if (section) {
        section.classList.add('open');
        
        // Scroll to it
        setTimeout(() => {
          section.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }
  
  /**
   * Add horizontal scroll indicators for wide code blocks
   */
  function setupHorizontalScrollIndicators() {
    elements.codeBlocks.forEach(block => {
      // Check if scrollable horizontally
      if (block.scrollWidth > block.clientWidth) {
        // Add indicator class
        block.parentNode.classList.add('horizontally-scrollable');
        
        // Add fade indicators
        const leftFade = document.createElement('div');
        leftFade.className = 'scroll-fade scroll-fade-left';
        
        const rightFade = document.createElement('div');
        rightFade.className = 'scroll-fade scroll-fade-right';
        
        block.parentNode.appendChild(leftFade);
        block.parentNode.appendChild(rightFade);
        
        // Update indicator visibility on scroll
        block.addEventListener('scroll', function() {
          // Left fade visibility
          if (this.scrollLeft > 10) {
            leftFade.classList.add('visible');
          } else {
            leftFade.classList.remove('visible');
          }
          
          // Right fade visibility
          if (this.scrollLeft + this.clientWidth < this.scrollWidth - 10) {
            rightFade.classList.add('visible');
          } else {
            rightFade.classList.remove('visible');
          }
        });
        
        // Trigger once to initialize
        block.dispatchEvent(new Event('scroll'));
      }
    });
  }
  
  /**
   * Fix scrolling to anchors on mobile to account for sticky header
   */
  function fixAnchorScrollPositioning() {
    // Add padding to account for fixed header on mobile
    document.documentElement.style.scrollPaddingTop = '80px';
    
    // Fix internal link navigation
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    
    internalLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          e.preventDefault();
          
          // Close mobile menu if open
          closeMobileMenu();
          
          // Open containing section if it's collapsed
          const parentSection = targetElement.closest('.mobile-section');
          if (parentSection && !parentSection.classList.contains('open')) {
            parentSection.classList.add('open');
          }
          
          // Scroll with offset for fixed header
          setTimeout(() => {
            const headerOffset = 70; 
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }, 100);
        }
      });
    });
  }
  
  // Initialize when DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // Update on window resize
  window.addEventListener('resize', debounce(function() {
    if (isMobile()) {
      // Init if window size changed to mobile
      init();
    } else {
      // Reset mobile menu state if resized to desktop
      document.body.classList.remove('mobile-menu-open');
    }
  }, 250));
  
  // Debounce helper function
  function debounce(func, wait) {
    let timeout;
    return function() {
      const context = this, args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(function() {
        func.apply(context, args);
      }, wait);
    };
  }
})();