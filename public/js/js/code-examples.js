/**
 * Code Examples Manager for Flash API Documentation
 * Handles the dynamic loading and display of code examples in different languages
 */
(function() {
  // Sample code examples in different languages
  const codeExamples = {
    'fetch-account': {
      'javascript': `// Fetch account details with JavaScript
const query = \`
query GetAccountInfo {
  me {
    id
    defaultAccount {
      id
      defaultWalletId
      wallets {
        id
        balance
        walletCurrency
      }
    }
  }
}\`;

async function fetchAccountInfo() {
  try {
    const data = await graphQLClient.request(query);
    console.log('Account details:', data.me.defaultAccount);
    return data.me.defaultAccount;
  } catch (error) {
    console.error('Error fetching account:', error);
  }
}`,
      'typescript': `// Fetch account details with TypeScript
interface Wallet {
  id: string;
  balance: string;
  walletCurrency: 'BTC' | 'USD';
}

interface Account {
  id: string;
  defaultWalletId: string;
  wallets: Wallet[];
}

interface User {
  id: string;
  defaultAccount: Account;
}

interface AccountResponse {
  me: User;
}

const query = \`
query GetAccountInfo {
  me {
    id
    defaultAccount {
      id
      defaultWalletId
      wallets {
        id
        balance
        walletCurrency
      }
    }
  }
}\`;

async function fetchAccountInfo(): Promise<Account | null> {
  try {
    const data = await graphQLClient.request<AccountResponse>(query);
    console.log('Account details:', data.me.defaultAccount);
    return data.me.defaultAccount;
  } catch (error) {
    console.error('Error fetching account:', error);
    return null;
  }
}`,
      'python': `# Fetch account details with Python
import gql
from gql import Client
from gql.transport.requests import RequestsHTTPTransport

# Set up the transport with your authentication
transport = RequestsHTTPTransport(
    url='https://api.flashapp.me/graphql',
    headers={'Authorization': 'Bearer YOUR_AUTH_TOKEN'}
)

# Create a GraphQL client
client = Client(transport=transport, fetch_schema_from_transport=True)

# Define the query
query = gql.gql("""
query GetAccountInfo {
  me {
    id
    defaultAccount {
      id
      defaultWalletId
      wallets {
        id
        balance
        walletCurrency
      }
    }
  }
}
""")

# Execute the query
try:
    result = client.execute(query)
    account = result['me']['defaultAccount']
    print(f"Account details: {account}")
except Exception as e:
    print(f"Error fetching account: {e}")`,
      'curl': `# Fetch account details with curl
curl -X POST \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \\
  --data '{"query":"query GetAccountInfo {\\n  me {\\n    id\\n    defaultAccount {\\n      id\\n      defaultWalletId\\n      wallets {\\n        id\\n        balance\\n        walletCurrency\\n      }\\n    }\\n  }\\n}"}' \\
  https://api.flashapp.me/graphql`
    },
    'create-invoice': {
      'javascript': `// Create a Lightning invoice with JavaScript
const mutation = \`
mutation CreateInvoice($input: LnInvoiceCreateInput!) {
  lnInvoiceCreate(input: $input) {
    invoice {
      paymentRequest
      paymentHash
      satoshis
    }
    errors {
      message
    }
  }
}\`;

const variables = {
  input: {
    walletId: "YOUR_WALLET_ID",
    amount: 50000,  // 50,000 satoshis = 0.0005 BTC
    memo: "Payment for services"
  }
};

async function createInvoice() {
  try {
    const { lnInvoiceCreate } = await graphQLClient.request(mutation, variables);
    
    if (lnInvoiceCreate.errors && lnInvoiceCreate.errors.length > 0) {
      throw new Error(lnInvoiceCreate.errors[0].message);
    }
    
    console.log('Created invoice:', lnInvoiceCreate.invoice);
    return lnInvoiceCreate.invoice;
  } catch (error) {
    console.error('Error creating invoice:', error);
  }
}`,
      'typescript': `// Create a Lightning invoice with TypeScript
interface LnInvoice {
  paymentRequest: string;
  paymentHash: string;
  satoshis: number;
}

interface LnInvoiceCreateResponse {
  lnInvoiceCreate: {
    invoice: LnInvoice | null;
    errors: Array<{ message: string }> | null;
  }
}

const mutation = \`
mutation CreateInvoice($input: LnInvoiceCreateInput!) {
  lnInvoiceCreate(input: $input) {
    invoice {
      paymentRequest
      paymentHash
      satoshis
    }
    errors {
      message
    }
  }
}\`;

const variables = {
  input: {
    walletId: "YOUR_WALLET_ID",
    amount: 50000,  // 50,000 satoshis = 0.0005 BTC
    memo: "Payment for services"
  }
};

async function createInvoice(): Promise<LnInvoice | null> {
  try {
    const response = await graphQLClient.request<LnInvoiceCreateResponse>(
      mutation, 
      variables
    );
    
    if (response.lnInvoiceCreate.errors?.length) {
      throw new Error(response.lnInvoiceCreate.errors[0].message);
    }
    
    console.log('Created invoice:', response.lnInvoiceCreate.invoice);
    return response.lnInvoiceCreate.invoice;
  } catch (error) {
    console.error('Error creating invoice:', error);
    return null;
  }
}`,
      'python': `# Create a Lightning invoice with Python
import gql
from gql import Client
from gql.transport.requests import RequestsHTTPTransport

# Set up the transport with your authentication
transport = RequestsHTTPTransport(
    url='https://api.flashapp.me/graphql',
    headers={'Authorization': 'Bearer YOUR_AUTH_TOKEN'}
)

# Create a GraphQL client
client = Client(transport=transport, fetch_schema_from_transport=True)

# Define the mutation
mutation = gql.gql("""
mutation CreateInvoice($input: LnInvoiceCreateInput!) {
  lnInvoiceCreate(input: $input) {
    invoice {
      paymentRequest
      paymentHash
      satoshis
    }
    errors {
      message
    }
  }
}
""")

# Set up variables
variables = {
  "input": {
    "walletId": "YOUR_WALLET_ID",
    "amount": 50000,  # 50,000 satoshis = 0.0005 BTC
    "memo": "Payment for services"
  }
}

# Execute the mutation
try:
    result = client.execute(mutation, variable_values=variables)
    
    if result['lnInvoiceCreate']['errors']:
        raise Exception(result['lnInvoiceCreate']['errors'][0]['message'])
        
    invoice = result['lnInvoiceCreate']['invoice']
    print(f"Created invoice: {invoice}")
except Exception as e:
    print(f"Error creating invoice: {e}")`,
      'curl': `# Create a Lightning invoice with curl
curl -X POST \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \\
  --data '{"query":"mutation CreateInvoice($input: LnInvoiceCreateInput!) {\\n  lnInvoiceCreate(input: $input) {\\n    invoice {\\n      paymentRequest\\n      paymentHash\\n      satoshis\\n    }\\n    errors {\\n      message\\n    }\\n  }\\n}","variables":{"input":{"walletId":"YOUR_WALLET_ID","amount":50000,"memo":"Payment for services"}}}' \\
  https://api.flashapp.me/graphql`
    },
    'authentication': {
      'javascript': `// Authenticate with Flash API using JavaScript
const mutation = \`
mutation Login($input: UserLoginInput!) {
  userLogin(input: $input) {
    authToken
    totpRequired
    errors {
      message
    }
  }
}\`;

const variables = {
  input: {
    phone: "+1234567890",  // Replace with your phone
    code: "123456"         // Authentication code sent to your phone
  }
};

async function login() {
  try {
    const { userLogin } = await graphQLClient.request(mutation, variables);
    
    if (userLogin.errors && userLogin.errors.length > 0) {
      throw new Error(userLogin.errors[0].message);
    }
    
    if (userLogin.totpRequired) {
      console.log('TOTP verification required');
      // Prompt user for TOTP code
      return null;
    }
    
    console.log('Authentication successful');
    
    // Store the auth token securely
    const authToken = userLogin.authToken;
    
    // Set auth token for future requests
    graphQLClient.setHeader('Authorization', \`Bearer \${authToken}\`);
    
    return authToken;
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}`,
      'typescript': `// Authenticate with Flash API using TypeScript
interface AuthResponse {
  userLogin: {
    authToken: string | null;
    totpRequired: boolean;
    errors: Array<{ message: string }> | null;
  }
}

const mutation = \`
mutation Login($input: UserLoginInput!) {
  userLogin(input: $input) {
    authToken
    totpRequired
    errors {
      message
    }
  }
}\`;

const variables = {
  input: {
    phone: "+1234567890",  // Replace with your phone
    code: "123456"         // Authentication code sent to your phone
  }
};

async function login(): Promise<string | null> {
  try {
    const response = await graphQLClient.request<AuthResponse>(
      mutation, 
      variables
    );
    
    if (response.userLogin.errors?.length) {
      throw new Error(response.userLogin.errors[0].message);
    }
    
    if (response.userLogin.totpRequired) {
      console.log('TOTP verification required');
      // Prompt user for TOTP code
      return null;
    }
    
    console.log('Authentication successful');
    
    // Store the auth token securely
    const authToken = response.userLogin.authToken;
    
    if (!authToken) {
      throw new Error('No auth token returned');
    }
    
    // Set auth token for future requests
    graphQLClient.setHeader('Authorization', \`Bearer \${authToken}\`);
    
    return authToken;
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}`,
      'python': `# Authenticate with Flash API using Python
import gql
from gql import Client
from gql.transport.requests import RequestsHTTPTransport

# Set up the transport without authentication initially
transport = RequestsHTTPTransport(
    url='https://api.flashapp.me/graphql',
    headers={'Content-Type': 'application/json'}
)

# Create a GraphQL client
client = Client(transport=transport, fetch_schema_from_transport=True)

# Define the mutation
mutation = gql.gql("""
mutation Login($input: UserLoginInput!) {
  userLogin(input: $input) {
    authToken
    totpRequired
    errors {
      message
    }
  }
}
""")

# Set up variables
variables = {
  "input": {
    "phone": "+1234567890",  # Replace with your phone
    "code": "123456"         # Authentication code sent to your phone
  }
}

# Execute the mutation
try:
    result = client.execute(mutation, variable_values=variables)
    
    if result['userLogin']['errors']:
        raise Exception(result['userLogin']['errors'][0]['message'])
        
    if result['userLogin']['totpRequired']:
        print('TOTP verification required')
        # Prompt user for TOTP code
    else:
        auth_token = result['userLogin']['authToken']
        print('Authentication successful')
        
        # Update client with auth token for future requests
        transport.headers['Authorization'] = f"Bearer {auth_token}"
except Exception as e:
    print(f"Authentication error: {e}")`,
      'curl': `# Authenticate with Flash API using curl
curl -X POST \\
  -H "Content-Type: application/json" \\
  --data '{"query":"mutation Login($input: UserLoginInput!) {\\n  userLogin(input: $input) {\\n    authToken\\n    totpRequired\\n    errors {\\n      message\\n    }\\n  }\\n}","variables":{"input":{"phone":"+1234567890","code":"123456"}}}' \\
  https://api.flashapp.me/graphql`
    }
  };

  // Languages to display in tabs
  const languages = ['javascript', 'typescript', 'python', 'curl'];
  
  // Language display names
  const languageNames = {
    'javascript': 'JavaScript',
    'typescript': 'TypeScript',
    'python': 'Python',
    'curl': 'cURL'
  };

  // Create tabs and code blocks for an example
  function createCodeExampleTabs(container, operation) {
    const examples = codeExamples[operation];
    if (!examples) return;
    
    // Create container for tabs
    const tabsContainer = document.createElement('div');
    tabsContainer.className = 'code-tabs';
    
    // Create tab headers
    const tabHeaders = document.createElement('div');
    tabHeaders.className = 'code-tabs-header';
    
    // Create tab content
    const tabContent = document.createElement('div');
    tabContent.className = 'code-tabs-content';
    
    // Create tabs for each language
    languages.forEach((lang, index) => {
      if (!examples[lang]) return;
      
      // Create tab header
      const tabHeader = document.createElement('button');
      tabHeader.className = 'code-tab-btn';
      tabHeader.textContent = languageNames[lang] || lang;
      tabHeader.dataset.lang = lang;
      tabHeader.dataset.target = `${operation}-${lang}`;
      if (index === 0) tabHeader.classList.add('active');
      
      // Create tab content
      const codeContainer = document.createElement('div');
      codeContainer.className = 'code-sample code-tab-content';
      codeContainer.id = `${operation}-${lang}`;
      codeContainer.dataset.language = lang;
      if (index === 0) codeContainer.classList.add('active');
      
      const pre = document.createElement('pre');
      const code = document.createElement('code');
      code.className = `language-${lang === 'curl' ? 'bash' : lang}`;
      code.textContent = examples[lang];
      
      pre.appendChild(code);
      codeContainer.appendChild(pre);
      
      // Add copy button
      const copyButton = document.createElement('button');
      copyButton.className = 'copy-button';
      copyButton.textContent = 'Copy';
      copyButton.addEventListener('click', function() {
        navigator.clipboard.writeText(examples[lang]).then(function() {
          copyButton.textContent = 'Copied!';
          copyButton.classList.add('copied');
          
          setTimeout(function() {
            copyButton.textContent = 'Copy';
            copyButton.classList.remove('copied');
          }, 2000);
        });
      });
      codeContainer.appendChild(copyButton);
      
      // Add tab header click event
      tabHeader.addEventListener('click', function() {
        // Remove active class from all tabs
        tabHeaders.querySelectorAll('.code-tab-btn').forEach(btn => {
          btn.classList.remove('active');
        });
        tabContent.querySelectorAll('.code-tab-content').forEach(content => {
          content.classList.remove('active');
        });
        
        // Add active class to this tab
        tabHeader.classList.add('active');
        document.getElementById(tabHeader.dataset.target).classList.add('active');
      });
      
      // Add to containers
      tabHeaders.appendChild(tabHeader);
      tabContent.appendChild(codeContainer);
    });
    
    // Assemble the tabs
    tabsContainer.appendChild(tabHeaders);
    tabsContainer.appendChild(tabContent);
    
    // Add to the main container
    container.appendChild(tabsContainer);
  }

  // Initialize all code examples on the page
  function initCodeExamples() {
    const codeExampleContainers = document.querySelectorAll('.code-examples');
    
    codeExampleContainers.forEach(container => {
      const operation = container.dataset.operation;
      if (!operation) return;
      
      createCodeExampleTabs(container, operation);
    });
    
    // Highlight code if Prism is available
    if (window.Prism) {
      Prism.highlightAll();
    }
    
    // Force rehighlighting after a short delay to handle dynamic content
    setTimeout(function() {
      if (window.highlightCodeBlocks) {
        window.highlightCodeBlocks();
      }
    }, 500);
  }

  // Initialize when DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCodeExamples);
  } else {
    initCodeExamples();
  }
})();