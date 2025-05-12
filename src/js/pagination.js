// Pagination for API reference documentation
document.addEventListener('DOMContentLoaded', function() {
  // Configuration
  const PAGE_SIZE = 10; // Number of items to show per page
  const MAX_BUTTONS = 5; // Maximum number of page buttons to show
  
  // Main pagination function
  function initializePagination() {
    // Find the documentation container and all sections to paginate
    const docContainer = document.getElementById('doc-container');
    if (!docContainer) return;
    
    // Find all the major sections in the documentation
    const sections = docContainer.querySelectorAll('.operation, .schema');
    
    if (sections.length <= PAGE_SIZE) return; // No need for pagination if few sections
    
    // Split sections into pages
    const pages = [];
    for (let i = 0; i < sections.length; i += PAGE_SIZE) {
      pages.push(Array.from(sections).slice(i, i + PAGE_SIZE));
    }
    
    // Create pagination controls
    createPaginationControls(docContainer, pages);
    
    // Show first page by default
    showPage(1, pages);
    
    // Update URL with hash for the current page
    window.addEventListener('hashchange', function() {
      const pageNumber = getPageNumberFromHash();
      if (pageNumber && pageNumber <= pages.length) {
        showPage(pageNumber, pages);
        updatePaginationButtons(pageNumber, pages.length);
      }
    });
    
    // Check if there's a page in the URL hash on load
    const initialPage = getPageNumberFromHash();
    if (initialPage && initialPage <= pages.length) {
      showPage(initialPage, pages);
      updatePaginationButtons(initialPage, pages.length);
    }
  }
  
  // Create pagination controls
  function createPaginationControls(container, pages) {
    const totalPages = pages.length;
    
    // Create pagination container
    const paginationContainer = document.createElement('div');
    paginationContainer.className = 'pagination-container';
    
    // Create pagination info
    const paginationInfo = document.createElement('div');
    paginationInfo.className = 'pagination-info';
    paginationInfo.textContent = `Page 1 of ${totalPages}`;
    
    // Create pagination buttons container
    const paginationButtons = document.createElement('div');
    paginationButtons.className = 'pagination-buttons';
    
    // Previous button
    const prevButton = document.createElement('button');
    prevButton.className = 'pagination-button prev';
    prevButton.textContent = '←';
    prevButton.disabled = true;
    prevButton.addEventListener('click', function() {
      const currentPage = getCurrentPage();
      if (currentPage > 1) {
        navigateToPage(currentPage - 1);
      }
    });
    
    // Next button
    const nextButton = document.createElement('button');
    nextButton.className = 'pagination-button next';
    nextButton.textContent = '→';
    nextButton.addEventListener('click', function() {
      const currentPage = getCurrentPage();
      if (currentPage < totalPages) {
        navigateToPage(currentPage + 1);
      }
    });
    
    // Page number buttons
    for (let i = 1; i <= Math.min(totalPages, MAX_BUTTONS); i++) {
      const pageButton = document.createElement('button');
      pageButton.className = 'pagination-button page-number';
      if (i === 1) pageButton.classList.add('active');
      pageButton.textContent = i;
      pageButton.addEventListener('click', function() {
        navigateToPage(i);
      });
      paginationButtons.appendChild(pageButton);
    }
    
    // Add buttons to container
    paginationButtons.insertBefore(prevButton, paginationButtons.firstChild);
    paginationButtons.appendChild(nextButton);
    
    // Add to pagination container
    paginationContainer.appendChild(paginationInfo);
    paginationContainer.appendChild(paginationButtons);
    
    // Add pagination at top and bottom
    const topPagination = paginationContainer.cloneNode(true);
    topPagination.id = 'pagination-top';
    
    const bottomPagination = paginationContainer.cloneNode(true);
    bottomPagination.id = 'pagination-bottom';
    
    // Add event listeners for the cloned buttons
    addPaginationButtonListeners(topPagination, totalPages);
    addPaginationButtonListeners(bottomPagination, totalPages);
    
    // Insert pagination controls
    container.insertBefore(topPagination, container.firstChild);
    container.appendChild(bottomPagination);
  }
  
  // Add event listeners to pagination buttons
  function addPaginationButtonListeners(paginationContainer, totalPages) {
    const prevButton = paginationContainer.querySelector('.prev');
    const nextButton = paginationContainer.querySelector('.next');
    const pageButtons = paginationContainer.querySelectorAll('.page-number');
    
    prevButton.addEventListener('click', function() {
      const currentPage = getCurrentPage();
      if (currentPage > 1) {
        navigateToPage(currentPage - 1);
      }
    });
    
    nextButton.addEventListener('click', function() {
      const currentPage = getCurrentPage();
      if (currentPage < totalPages) {
        navigateToPage(currentPage + 1);
      }
    });
    
    pageButtons.forEach(button => {
      button.addEventListener('click', function() {
        navigateToPage(parseInt(button.textContent, 10));
      });
    });
  }
  
  // Show a specific page
  function showPage(pageNumber, pages) {
    // Hide all sections
    const allSections = document.querySelectorAll('.operation, .schema');
    allSections.forEach(section => {
      section.style.display = 'none';
    });
    
    // Show sections for the current page
    const currentPageSections = pages[pageNumber - 1];
    if (currentPageSections) {
      currentPageSections.forEach(section => {
        section.style.display = 'block';
      });
    }
    
    // Update pagination info
    document.querySelectorAll('.pagination-info').forEach(info => {
      info.textContent = `Page ${pageNumber} of ${pages.length}`;
    });
    
    // Scroll to top of documentation
    document.getElementById('doc-container').scrollIntoView({ behavior: 'smooth' });
  }
  
  // Update pagination buttons based on current page
  function updatePaginationButtons(currentPage, totalPages) {
    const paginationContainers = document.querySelectorAll('.pagination-container');
    
    paginationContainers.forEach(container => {
      const prevButton = container.querySelector('.prev');
      const nextButton = container.querySelector('.next');
      const pageButtons = container.querySelectorAll('.page-number');
      
      // Update prev/next button states
      prevButton.disabled = currentPage === 1;
      nextButton.disabled = currentPage === totalPages;
      
      // Calculate which page buttons to show
      let startPage = Math.max(1, currentPage - Math.floor(MAX_BUTTONS / 2));
      let endPage = Math.min(totalPages, startPage + MAX_BUTTONS - 1);
      
      if (endPage - startPage + 1 < MAX_BUTTONS) {
        startPage = Math.max(1, endPage - MAX_BUTTONS + 1);
      }
      
      // Update page buttons
      pageButtons.forEach((button, index) => {
        const pageNumber = startPage + index;
        if (pageNumber <= totalPages) {
          button.textContent = pageNumber;
          button.style.display = 'inline-block';
          button.classList.toggle('active', pageNumber === currentPage);
        } else {
          button.style.display = 'none';
        }
      });
    });
  }
  
  // Navigate to a specific page
  function navigateToPage(pageNumber) {
    window.location.hash = `page=${pageNumber}`;
  }
  
  // Get current page number
  function getCurrentPage() {
    return getPageNumberFromHash() || 1;
  }
  
  // Get page number from URL hash
  function getPageNumberFromHash() {
    const match = window.location.hash.match(/page=(\d+)/);
    return match ? parseInt(match[1], 10) : null;
  }
  
  // Initialize pagination after a slight delay to ensure DOM is fully loaded
  setTimeout(initializePagination, 500);
});