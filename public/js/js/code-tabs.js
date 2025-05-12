// JavaScript for multi-language code examples
document.addEventListener('DOMContentLoaded', function() {
  // Get all code tabs containers
  const codeTabsContainers = document.querySelectorAll('.code-tabs');
  
  codeTabsContainers.forEach(container => {
    const triggers = container.querySelectorAll('.code-tab-trigger');
    const tabs = container.querySelectorAll('.code-tab-pane');
    
    // Set first tab as active by default
    if (triggers.length > 0 && tabs.length > 0) {
      triggers[0].classList.add('active');
      tabs[0].classList.add('active');
    }
    
    // Add click event to each trigger
    triggers.forEach(trigger => {
      trigger.addEventListener('click', function() {
        // Remove active class from all triggers and tabs
        triggers.forEach(t => t.classList.remove('active'));
        tabs.forEach(t => t.classList.remove('active'));
        
        // Add active class to clicked trigger
        trigger.classList.add('active');
        
        // Get target tab
        const targetId = trigger.getAttribute('data-target');
        const targetTab = container.querySelector(`.code-tab-pane[data-id="${targetId}"]`);
        
        if (targetTab) {
          targetTab.classList.add('active');
        }
        
        // Store preference in localStorage
        localStorage.setItem('preferredLanguage', targetId);
      });
    });
    
    // Check for user preference
    const preferredLanguage = localStorage.getItem('preferredLanguage');
    if (preferredLanguage) {
      const preferredTrigger = container.querySelector(`.code-tab-trigger[data-target="${preferredLanguage}"]`);
      if (preferredTrigger) {
        preferredTrigger.click();
      }
    }
  });
  
  // Function to convert code examples
  window.createMultiLanguageExamples = function() {
    // Common operations
    const commonOperations = [
      {
        name: 'authentication',
        examples: {
          javascript: `// JavaScript - Authentication
import { GraphQLClient } from 'graphql-request';

// Initialize client
const client = new GraphQLClient('https://api.flashapp.me/graphql');

// Login mutation
const loginMutation = gql\`
  mutation Login {
    login(input: { 
      phone: "+1876xxxxxxx", 
      password: "yourpassword" 
    }) {
      authToken
      user {
        id
        phone
      }
    }
  }
\`;

// Execute login
client.request(loginMutation)
  .then(data => {
    // Store the auth token
    const authToken = data.login.authToken;
    
    // Set auth header for future requests
    client.setHeader('Authorization', \`Bearer \${authToken}\`);
  })
  .catch(error => console.error(error));`,
          
          python: `# Python - Authentication
import requests

# GraphQL endpoint
url = 'https://api.flashapp.me/graphql'

# Login mutation
login_mutation = """
mutation Login {
  login(input: { 
    phone: "+1876xxxxxxx", 
    password: "yourpassword" 
  }) {
    authToken
    user {
      id
      phone
    }
  }
}
"""

# Execute login request
response = requests.post(
    url, 
    json={'query': login_mutation}
)

# Process response
data = response.json()
auth_token = data['data']['login']['authToken']

# Set auth header for future requests
headers = {
    'Authorization': f'Bearer {auth_token}'
}`,
          
          curl: `# cURL - Authentication
curl -X POST \\
  -H "Content-Type: application/json" \\
  --data '{"query":"mutation Login { login(input: { phone: \\"+1876xxxxxxx\\", password: \\"yourpassword\\" }) { authToken user { id phone } } }"}' \\
  https://api.flashapp.me/graphql

# Store the authToken from the response
AUTH_TOKEN="your_auth_token_from_response"

# Use the token in subsequent requests
curl -X POST \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer $AUTH_TOKEN" \\
  --data '{"query":"query { me { id } }"}' \\
  https://api.flashapp.me/graphql`
        }
      },
      {
        name: 'fetch-account',
        examples: {
          javascript: `// JavaScript - Fetch Account Details
import { gql } from 'graphql-request';

const accountQuery = gql\`
query GetMyAccount {
  me {
    id
    defaultWalletId
    displayCurrency
    wallets {
      id
      balance
      walletCurrency
    }
  }
}
\`;

// Client is already authenticated
client.request(accountQuery)
  .then(data => {
    console.log('Account details:', data.me);
    
    // Process wallets
    const wallets = data.me.wallets;
    wallets.forEach(wallet => {
      console.log(\`Wallet \${wallet.id}: \${wallet.balance} \${wallet.walletCurrency}\`);
    });
  })
  .catch(error => console.error(error));`,
          
          python: `# Python - Fetch Account Details
import requests

# GraphQL endpoint
url = 'https://api.flashapp.me/graphql'
headers = {
    'Authorization': f'Bearer {auth_token}',
    'Content-Type': 'application/json'
}

# Get account query
account_query = """
query GetMyAccount {
  me {
    id
    defaultWalletId
    displayCurrency
    wallets {
      id
      balance
      walletCurrency
    }
  }
}
"""

# Execute request
response = requests.post(
    url, 
    json={'query': account_query},
    headers=headers
)

# Process response
data = response.json()
account = data['data']['me']
print(f"Account ID: {account['id']}")

# Process wallets
wallets = account['wallets']
for wallet in wallets:
    print(f"Wallet {wallet['id']}: {wallet['balance']} {wallet['walletCurrency']}")`,
          
          curl: `# cURL - Fetch Account Details
curl -X POST \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer $AUTH_TOKEN" \\
  --data '{"query":"query GetMyAccount { me { id defaultWalletId displayCurrency wallets { id balance walletCurrency } } }"}' \\
  https://api.flashapp.me/graphql`
        }
      },
      {
        name: 'create-invoice',
        examples: {
          javascript: `// JavaScript - Create Invoice
import { gql } from 'graphql-request';

const createInvoiceMutation = gql\`
mutation CreateInvoice {
  createInvoice(input: {
    walletId: "wallet_123"
    amount: 10000
    memo: "Payment for services"
  }) {
    invoice {
      id
      paymentRequest
      amount
      memo
      expiresAt
    }
    status
    errors {
      message
    }
  }
}
\`;

// Client is already authenticated
client.request(createInvoiceMutation)
  .then(data => {
    console.log('Invoice created:', data.createInvoice.invoice);
    
    // Share the payment request with the payer
    const paymentRequest = data.createInvoice.invoice.paymentRequest;
    console.log(\`Payment request: \${paymentRequest}\`);
  })
  .catch(error => console.error(error));`,
          
          python: `# Python - Create Invoice
import requests

# GraphQL endpoint
url = 'https://api.flashapp.me/graphql'
headers = {
    'Authorization': f'Bearer {auth_token}',
    'Content-Type': 'application/json'
}

# Create invoice mutation
create_invoice_mutation = """
mutation CreateInvoice {
  createInvoice(input: {
    walletId: "wallet_123"
    amount: 10000
    memo: "Payment for services"
  }) {
    invoice {
      id
      paymentRequest
      amount
      memo
      expiresAt
    }
    status
    errors {
      message
    }
  }
}
"""

# Execute request
response = requests.post(
    url, 
    json={'query': create_invoice_mutation},
    headers=headers
)

# Process response
data = response.json()
invoice = data['data']['createInvoice']['invoice']
print(f"Invoice created with ID: {invoice['id']}")
print(f"Payment request: {invoice['paymentRequest']}")`,
          
          curl: `# cURL - Create Invoice
curl -X POST \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer $AUTH_TOKEN" \\
  --data '{"query":"mutation CreateInvoice { createInvoice(input: { walletId: \\"wallet_123\\" amount: 10000 memo: \\"Payment for services\\" }) { invoice { id paymentRequest amount memo expiresAt } status errors { message } } }"}' \\
  https://api.flashapp.me/graphql`
        }
      }
    ];
    
    // Find all code-examples containers and initialize them
    const codeExampleContainers = document.querySelectorAll('.code-examples');
    
    codeExampleContainers.forEach(container => {
      // Get operation from data-operation attribute
      const operation = container.getAttribute('data-operation');
      
      // Find matching operation in the list
      const operationData = commonOperations.find(op => op.name === operation);
      
      if (operationData) {
        // Create tabs structure
        const tabsContainer = document.createElement('div');
        tabsContainer.className = 'code-tabs';
        
        // Create tabs header
        const tabsHeader = document.createElement('div');
        tabsHeader.className = 'code-tabs-header';
        
        // Create tabs content
        const tabsContent = document.createElement('div');
        tabsContent.className = 'code-tabs-content';
        
        // Languages to include
        const languages = ['javascript', 'python', 'curl'];
        
        // Create tabs
        languages.forEach(lang => {
          // Skip if example doesn't exist
          if (!operationData.examples[lang]) return;
          
          // Create tab trigger
          const trigger = document.createElement('button');
          trigger.className = 'code-tab-trigger';
          trigger.setAttribute('data-target', lang);
          trigger.textContent = getLanguageDisplayName(lang);
          tabsHeader.appendChild(trigger);
          
          // Create tab pane
          const pane = document.createElement('div');
          pane.className = 'code-tab-pane';
          pane.setAttribute('data-id', lang);
          
          // Create code sample
          const codeSample = document.createElement('div');
          codeSample.className = 'code-sample';
          
          // Language label
          const langLabel = document.createElement('div');
          langLabel.className = 'code-language-label';
          langLabel.textContent = getLanguageDisplayName(lang);
          
          // Add code
          const pre = document.createElement('pre');
          const code = document.createElement('code');
          code.textContent = operationData.examples[lang];
          pre.appendChild(code);
          
          codeSample.appendChild(langLabel);
          codeSample.appendChild(pre);
          pane.appendChild(codeSample);
          tabsContent.appendChild(pane);
        });
        
        // Add copy button to each code sample
        setTimeout(() => {
          tabsContent.querySelectorAll('.code-sample').forEach(block => {
            if (!block.querySelector('.copy-button')) {
              const copyButton = document.createElement('button');
              copyButton.className = 'copy-button';
              copyButton.textContent = 'Copy';
              
              copyButton.addEventListener('click', function() {
                const code = block.querySelector('pre').textContent;
                navigator.clipboard.writeText(code).then(function() {
                  copyButton.textContent = 'Copied!';
                  copyButton.classList.add('copied');
                  
                  setTimeout(function() {
                    copyButton.textContent = 'Copy';
                    copyButton.classList.remove('copied');
                  }, 2000);
                });
              });
              
              block.appendChild(copyButton);
            }
          });
        }, 100);
        
        // Assemble tabs
        tabsContainer.appendChild(tabsHeader);
        tabsContainer.appendChild(tabsContent);
        
        // Replace container with tabs
        container.innerHTML = '';
        container.appendChild(tabsContainer);
      }
    });
    
    // Initialize tab behavior
    const newTabsContainers = document.querySelectorAll('.code-tabs');
    newTabsContainers.forEach(container => {
      const triggers = container.querySelectorAll('.code-tab-trigger');
      const tabs = container.querySelectorAll('.code-tab-pane');
      
      // Set first tab as active by default
      if (triggers.length > 0 && tabs.length > 0) {
        triggers[0].classList.add('active');
        tabs[0].classList.add('active');
      }
      
      // Add click event to each trigger
      triggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
          // Remove active class from all triggers and tabs
          triggers.forEach(t => t.classList.remove('active'));
          tabs.forEach(t => t.classList.remove('active'));
          
          // Add active class to clicked trigger
          trigger.classList.add('active');
          
          // Get target tab
          const targetId = trigger.getAttribute('data-target');
          const targetTab = container.querySelector(`.code-tab-pane[data-id="${targetId}"]`);
          
          if (targetTab) {
            targetTab.classList.add('active');
          }
          
          // Store preference in localStorage
          localStorage.setItem('preferredLanguage', targetId);
        });
      });
      
      // Check for user preference
      const preferredLanguage = localStorage.getItem('preferredLanguage');
      if (preferredLanguage) {
        const preferredTrigger = container.querySelector(`.code-tab-trigger[data-target="${preferredLanguage}"]`);
        if (preferredTrigger) {
          preferredTrigger.click();
        }
      }
    });
  }
  
  // Helper function to get display name for language
  function getLanguageDisplayName(lang) {
    const displayNames = {
      'javascript': 'JavaScript',
      'python': 'Python',
      'curl': 'cURL',
      'go': 'Go',
      'ruby': 'Ruby'
    };
    
    return displayNames[lang] || lang;
  }
  
  // Call the function once document is fully loaded
  setTimeout(createMultiLanguageExamples, 500);
});