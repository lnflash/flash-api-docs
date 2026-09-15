# Getting Started

Follow these steps to make your first authenticated request against the TEST environment.

## 1. Create a Flash account

Install the Flash app and create an account with your phone number. The same phone number is what you log in with below.

## 2. Log in and get a token

Run the three-step login (captcha challenge, request code, exchange code) described in [Authentication](authentication). It returns an opaque session token. For server-to-server work, create an [API key](api-keys) from that session instead.

## 3. Set up your environment

```bash
# Install a GraphQL client (example in JavaScript)
npm install graphql-request graphql
```

## 4. Initialize the client

```javascript
import { GraphQLClient } from 'graphql-request';

// Develop against TEST
const endpoint = 'https://api.test.flashapp.me/graphql';

// Production, once your integration is ready
// const endpoint = 'https://api.flashapp.me/graphql';

const graphQLClient = new GraphQLClient(endpoint);

// After login, set the session token
graphQLClient.setHeader('Authorization', 'Bearer YOUR_AUTH_TOKEN');
```

## 5. Make your first request

`defaultWalletId` lives on the account, not on the user:

```javascript
const query = `
query GetMyAccount {
  me {
    id
    defaultAccount {
      id
      defaultWalletId
      wallets { id walletCurrency balance }
    }
  }
}`;

async function fetchAccount() {
  const data = await graphQLClient.request(query);
  console.log(data);
}

fetchAccount();
```

Or the same query with curl:

```bash
curl -X POST https://api.test.flashapp.me/graphql \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -d '{"query":"query GetMyAccount { me { id defaultAccount { id defaultWalletId wallets { id walletCurrency balance } } } }"}'
```

Querying `me { defaultWalletId }` directly fails validation with `Cannot query field "defaultWalletId" on type "User"`.

For more, see [Examples](examples). The Queries, Mutations, Subscriptions, and Types sections are the full reference.
