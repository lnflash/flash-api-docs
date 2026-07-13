# API Keys

API keys let server-side integrations and third-party developers call the Flash
API without a user session — a payment processor accepting Bitcoin, an analytics
job reading balances, or a bot creating invoices. Unlike a short-lived login
token, a key is long-lived, scoped to specific permissions, and managed by the
account owner.

A key has the format `fk_<keyId>_<secret>`. Only a hash of the secret is ever
stored, so the full key is shown **once** at creation and can never be retrieved
again — store it securely.

## Creating a key

Keys are created from an authenticated user **session** (an API key cannot
create or manage keys). Call `apiKeyCreate` with a name, the scopes it needs,
and optionally an expiry and a per-key rate limit:

```graphql
mutation {
  apiKeyCreate(input: {
    name: "BTCPayServer integration"
    scopes: [read_user, read_wallet, write_wallet]
    expiresIn: 7776000        # optional — seconds until expiry (90 days)
    rateLimitPerMinute: 300   # optional — omit to use the platform default
  }) {
    apiKey { keyId apiKey scopes expiresAt }
    errors { message }
  }
}
```

The `apiKey` field is the raw key — copy it now.

## Authenticating with a key

Send the key in the `X-API-KEY` header — not the `Authorization` header, which
carries user session tokens:

```bash
curl -X POST https://api.flashapp.me/graphql \
  -H 'Content-Type: application/json' \
  -H "X-API-KEY: fk_<keyId>_<secret>" \
  -d '{"query":"query { me { defaultAccount { wallets { walletCurrency balance } } } }"}'
```

An invalid, revoked, or expired key returns `401 Unauthorized`.

## Scopes

Access is **deny-by-default**: a key can only reach the operations covered by
its scopes. Grant the minimum an integration needs.

| Scope | Grants |
|-------|--------|
| `read_user` | Read profile and account details |
| `write_user` | Modify profile and account settings |
| `read_wallet` | Read wallet balances and details |
| `write_wallet` | Move funds — send and receive |
| `read_transactions` | Read transaction history |
| `write_transactions` | Create transactions |
| `admin` | Full account access |

`write_*` implies the matching `read_*`, and `admin` implies every scope.
Sensitive operations — login, two-factor, and API-key management itself — are
never available to API keys, only to user sessions.

## Rate limits

Each key has a requests-per-minute budget. When exceeded, requests are rejected
with a GraphQL error carrying `extensions.code = "TOO_MANY_REQUESTS"` and a
`retryAfterSeconds` hint.

## Managing keys

From a user session you can list (`apiKeys`), rotate (`apiKeyRotate`), and
revoke (`apiKeyRevoke`) keys. Rotating issues a fresh secret and retires the old
one atomically; revoking permanently disables a key on its next request.
