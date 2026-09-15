# Getting Started

Follow these steps to integrate Flash payments into your application:

## 1. Create a Flash Account

Sign up for a Flash personal account at [getflash.io](https://getflash.io).

## 2. Obtain API Credentials

Authentication requires a two-step process: first trigger a verification code to be sent to the user's phone with `userPhoneRegistrationInitiate`, then submit the code with `userLogin` to receive an authentication token. See [Authentication](authentication) for detailed examples, or [API Keys](api-keys) for server-to-server integrations.

## 3. Set Up Your Environment

```bash
# Install a GraphQL client (example in JavaScript)
npm install graphql-request graphql
```

## 4. Initialize the Client

```javascript
import { GraphQLClient } from 'graphql-request';

// For development, use the test environment
const endpoint = 'https://api.test.flashapp.me/graphql';

// For production
// const endpoint = 'https://api.flashapp.me/graphql';

const graphQLClient = new GraphQLClient(endpoint);

// After authentication, set the auth token
graphQLClient.setHeader('Authorization', 'Bearer YOUR_AUTH_TOKEN');
```

## 5. Make Your First Request

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

For more, see [Examples](examples). The Queries, Mutations, Subscriptions, and Types sections are the full reference.
