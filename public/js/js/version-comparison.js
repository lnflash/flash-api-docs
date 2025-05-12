/**
 * Version Comparison Tool for Flash API Documentation
 * 
 * Allows users to compare differences between API versions:
 * - Shows added, modified, and removed endpoints
 * - Highlights breaking changes
 * - Provides migration guides between versions
 */

class VersionComparison {
  constructor() {
    // Version differences data - this would normally be generated as part of the build process
    this.versionDiffs = {
      'v1.1.0_vs_v1.0.0': {
        title: 'Changes from v1.0.0 to v1.1.0',
        added: [
          {
            name: 'isFlashNpub',
            type: 'Query',
            description: 'Check if a nostr public key belongs to a Flash user'
          },
          {
            name: 'userUpdateNpub',
            type: 'Mutation',
            description: 'Update the nostr public key for a user'
          }
        ],
        modified: [
          {
            name: 'lnInvoiceCreate',
            type: 'Mutation',
            description: 'Added support for description_hash parameter',
            breaking: false
          },
          {
            name: 'intraLedgerPaymentSend',
            type: 'Mutation',
            description: 'Now uses Ibex for routing payments instead of internal ledger',
            breaking: true
          }
        ],
        removed: [],
        migration: `
### Migration Guide from v1.0.0 to v1.1.0

#### Breaking Changes

1. **intraLedgerPaymentSend**:
   - This mutation now uses Ibex for routing instead of an internal ledger
   - Response format remains the same, but payment behavior might differ
   - Testing in staging environment recommended before upgrading

#### New Features

1. **Nostr Integration**:
   - New \`isFlashNpub\` query to check if a nostr public key belongs to a Flash user
   - New \`userUpdateNpub\` mutation to update a user's nostr public key
   - Added \`npub\` field to User type
        `
      },
      'beta_vs_v1.1.0': {
        title: 'Changes from v1.1.0 to Beta',
        added: [
          {
            name: 'npubByUsername',
            type: 'Query',
            description: 'Get the nostr public key for a username'
          },
          {
            name: 'walletExport',
            type: 'Mutation',
            description: 'Export wallet data in various formats'
          }
        ],
        modified: [
          {
            name: 'AccountLimits',
            type: 'Type',
            description: 'Added new limits for conversion between currencies',
            breaking: false
          }
        ],
        removed: [],
        migration: `
### Beta Version Notice

This is a beta version of the API and may change without notice. Do not use in production environments.

#### Upcoming Features

1. **Wallet Export**:
   - New \`walletExport\` mutation to export wallet data in various formats
   - Supports CSV, JSON, and PDF formats
   - Requires additional authentication for security

2. **Enhanced Nostr Integration**:
   - New \`npubByUsername\` query to get the nostr public key for a username
   - Improved performance for nostr-related operations
        `
      }
    };
    
    this.init();
  }
  
  /**
   * Initialize the comparison tool
   */
  init() {
    document.addEventListener('DOMContentLoaded', () => {
      this.addComparisonLink();
    });
  }
  
  /**
   * Add a link to access the comparison tool
   */
  addComparisonLink() {
    const headerLinks = document.querySelector('.header-links');
    if (!headerLinks) return;
    
    const comparisonLink = document.createElement('a');
    comparisonLink.href = '#version-comparison';
    comparisonLink.textContent = 'Compare Versions';
    comparisonLink.style.marginLeft = '1.5rem';
    
    comparisonLink.addEventListener('click', (e) => {
      e.preventDefault();
      this.showComparisonModal();
    });
    
    headerLinks.appendChild(comparisonLink);
  }
  
  /**
   * Show the version comparison modal
   */
  showComparisonModal() {
    // Create modal container
    const modal = document.createElement('div');
    modal.className = 'version-comparison-modal';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
    modal.style.zIndex = '1000';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    
    // Create modal content
    const content = document.createElement('div');
    content.className = 'version-comparison-content';
    content.style.backgroundColor = 'var(--bg-color, white)';
    content.style.color = 'var(--text-color, black)';
    content.style.borderRadius = '5px';
    content.style.padding = '20px';
    content.style.maxWidth = '800px';
    content.style.width = '90%';
    content.style.maxHeight = '80vh';
    content.style.overflow = 'auto';
    content.style.position = 'relative';
    
    // Add close button
    const closeButton = document.createElement('button');
    closeButton.textContent = '×';
    closeButton.style.position = 'absolute';
    closeButton.style.right = '15px';
    closeButton.style.top = '10px';
    closeButton.style.border = 'none';
    closeButton.style.background = 'none';
    closeButton.style.fontSize = '24px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.color = 'var(--text-color, black)';
    
    closeButton.addEventListener('click', () => {
      document.body.removeChild(modal);
    });
    
    // Create comparison selector
    const selectorContainer = document.createElement('div');
    selectorContainer.style.marginBottom = '20px';
    
    const selectorLabel = document.createElement('label');
    selectorLabel.textContent = 'Select versions to compare: ';
    selectorLabel.htmlFor = 'version-compare-select';
    
    const selector = document.createElement('select');
    selector.id = 'version-compare-select';
    selector.style.padding = '5px 10px';
    selector.style.marginLeft = '10px';
    selector.style.borderRadius = '4px';
    
    // Add options
    const options = [
      { value: 'v1.1.0_vs_v1.0.0', text: 'v1.1.0 vs v1.0.0' },
      { value: 'beta_vs_v1.1.0', text: 'Beta vs v1.1.0' }
    ];
    
    options.forEach(option => {
      const opt = document.createElement('option');
      opt.value = option.value;
      opt.textContent = option.text;
      selector.appendChild(opt);
    });
    
    // Comparison content container
    const comparisonContainer = document.createElement('div');
    comparisonContainer.id = 'comparison-content';
    
    // Event listener for selector change
    selector.addEventListener('change', () => {
      this.updateComparisonContent(comparisonContainer, selector.value);
    });
    
    // Assemble the selector
    selectorContainer.appendChild(selectorLabel);
    selectorContainer.appendChild(selector);
    
    // Assemble the modal
    content.appendChild(closeButton);
    content.appendChild(selectorContainer);
    content.appendChild(comparisonContainer);
    modal.appendChild(content);
    
    // Add to DOM
    document.body.appendChild(modal);
    
    // Initialize with first comparison
    this.updateComparisonContent(comparisonContainer, options[0].value);
    
    // Close when clicking outside
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    });
  }
  
  /**
   * Update the comparison content based on selected versions
   */
  updateComparisonContent(container, compareKey) {
    const diff = this.versionDiffs[compareKey];
    if (!diff) {
      container.innerHTML = '<p>No comparison data available for these versions.</p>';
      return;
    }
    
    // Build the HTML content
    let html = `<h2>${diff.title}</h2>`;
    
    // Added endpoints
    if (diff.added && diff.added.length > 0) {
      html += `
        <h3>Added</h3>
        <div class="comparison-section added">
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr>
                <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">Name</th>
                <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">Type</th>
                <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">Description</th>
              </tr>
            </thead>
            <tbody>
      `;
      
      diff.added.forEach(item => {
        html += `
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.name}</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.type}</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.description}</td>
          </tr>
        `;
      });
      
      html += `
            </tbody>
          </table>
        </div>
      `;
    }
    
    // Modified endpoints
    if (diff.modified && diff.modified.length > 0) {
      html += `
        <h3>Modified</h3>
        <div class="comparison-section modified">
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr>
                <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">Name</th>
                <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">Type</th>
                <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">Changes</th>
                <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">Breaking</th>
              </tr>
            </thead>
            <tbody>
      `;
      
      diff.modified.forEach(item => {
        html += `
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.name}</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.type}</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.description}</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; color: ${item.breaking ? 'red' : 'green'};">
              ${item.breaking ? 'Yes' : 'No'}
            </td>
          </tr>
        `;
      });
      
      html += `
            </tbody>
          </table>
        </div>
      `;
    }
    
    // Removed endpoints
    if (diff.removed && diff.removed.length > 0) {
      html += `
        <h3>Removed</h3>
        <div class="comparison-section removed">
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr>
                <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">Name</th>
                <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">Type</th>
                <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">Description</th>
              </tr>
            </thead>
            <tbody>
      `;
      
      diff.removed.forEach(item => {
        html += `
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.name}</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.type}</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.description}</td>
          </tr>
        `;
      });
      
      html += `
            </tbody>
          </table>
        </div>
      `;
    }
    
    // Migration guide
    if (diff.migration) {
      html += `
        <h3>Migration Guide</h3>
        <div class="comparison-section migration">
          <pre style="background-color: #f5f5f5; padding: 10px; border-radius: 4px; overflow: auto;">${diff.migration}</pre>
        </div>
      `;
    }
    
    container.innerHTML = html;
  }
}

// Initialize the comparison tool when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.versionComparison = new VersionComparison();
});