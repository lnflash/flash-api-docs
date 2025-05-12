/**
 * Syntax Highlighter for Flash API Documentation
 * Uses PrismJS to highlight code blocks
 */
(function() {
  // Function to highlight all code blocks on the page
  function highlightCodeBlocks() {
    // Get all code samples
    const codeBlocks = document.querySelectorAll('.code-sample pre');
    
    if (codeBlocks.length === 0) return;
    
    console.log('Initializing syntax highlighting for', codeBlocks.length, 'code blocks');
    
    // Add appropriate language classes and data attributes
    codeBlocks.forEach(function(block) {
      // Skip if already processed
      if (block.classList.contains('prism-highlighted')) return;
      
      // Mark as processed
      block.classList.add('prism-highlighted');
      
      // Detect language from content or parent
      let language = determineLanguage(block);
      
      // Create a new code element if one doesn't exist
      let codeElement = block.querySelector('code');
      if (!codeElement) {
        codeElement = document.createElement('code');
        codeElement.innerHTML = block.innerHTML;
        block.innerHTML = '';
        block.appendChild(codeElement);
      }
      
      // Add language class for Prism
      codeElement.className = 'language-' + language;
      
      // Add a language indicator badge
      addLanguageBadge(block.parentNode, language);
    });
    
    // Apply Prism highlighting
    if (window.Prism) {
      Prism.highlightAll();
      console.log('Code highlighting applied');
    } else {
      console.warn('Prism not loaded, code highlighting skipped');
    }
  }
  
  // Function to determine the language based on code content
  function determineLanguage(block) {
    // Check for explicit language data attribute
    const parent = block.parentNode;
    if (parent.dataset.language) {
      return parent.dataset.language;
    }
    
    const content = block.textContent;
    
    // GraphQL detection
    if (content.includes('query ') || content.includes('mutation ') || 
        content.includes('subscription ') || content.includes('type ') ||
        content.includes('input ') || content.includes('schema ')) {
      return 'graphql';
    }
    
    // JSON detection
    if ((content.trim().startsWith('{') && content.trim().endsWith('}')) ||
        (content.trim().startsWith('[') && content.trim().endsWith(']'))) {
      return 'json';
    }
    
    // JavaScript detection (fallback)
    return 'javascript';
  }
  
  // Function to add a language badge to the code block
  function addLanguageBadge(container, language) {
    // Skip if badge already exists
    if (container.querySelector('.code-language-badge')) return;
    
    const badge = document.createElement('div');
    badge.className = 'code-language-badge';
    badge.textContent = formatLanguageName(language);
    container.appendChild(badge);
  }
  
  // Format language name for display
  function formatLanguageName(language) {
    switch(language) {
      case 'javascript': return 'JavaScript';
      case 'graphql': return 'GraphQL';
      case 'json': return 'JSON';
      default: return language.charAt(0).toUpperCase() + language.slice(1);
    }
  }
  
  // Initialize when DOM is loaded
  function init() {
    highlightCodeBlocks();
    
    // Re-run highlighting when new content might be loaded
    // This helps with dynamic content
    setTimeout(highlightCodeBlocks, 1000);
  }
  
  // Execute when DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // Make the highlight function available globally
  window.highlightCodeBlocks = highlightCodeBlocks;
})();