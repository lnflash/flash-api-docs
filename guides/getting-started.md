# Getting Started

Follow these steps to integrate Flash payments into your application:

### 1. Create a Flash Account

Sign up for a Flash personal account at [getflash.io](https://getflash.io).

### 2. Obtain API Credentials

For a server-side integration, create an API key in the API Key Console at [console.flashapp.me](https://console.flashapp.me) and send it in the `X-API-KEY` header. See [API Keys](api-keys). For the test environment, ask Flash for a test API key.

Apps that sign users in themselves use the phone-code flow in [Authentication](authentication): `captchaCreateChallenge`, then `captchaRequestAuthCode`, then `userLogin`, which returns an authentication token.

### 3. Set Up Your Environment

```bash
// Install the Flash GraphQL client (Example in JavaScript)
npm install graphql-request graphql
```

### 4. Initialize the Client

```javascript
import { GraphQLClient } from 'graphql-request';

// For development, use the test environment
const endpoint = 'https://api.test.flashapp.me/graphql';

// For production
// const endpoint = 'https://api.flashapp.me/graphql';

const graphQLClient = new GraphQLClient(endpoint);

// With an API key
graphQLClient.setHeader('X-API-KEY', 'fk_YOUR_KEY');

// Or, after a user signs in, with their auth token
// graphQLClient.setHeader('Authorization', 'Bearer YOUR_AUTH_TOKEN');
```

### 5. Make Your First Request

```javascript
const query = `
query GetMyAccount {
  me {
    id
    defaultWalletId
  }
}`;

async function fetchAccount() {
  const data = await graphQLClient.request(query);
  console.log(data);
}

fetchAccount();
```

For detailed examples of common use cases, refer to the Full API Reference.
