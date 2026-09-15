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
    expiresIn: 7776000        # optional — seconds until expiry (90 days); omit for no expiry
    rateLimitPerMinute: 300   # optional — 1 to 10000; omit to use the platform default (120)
  }) {
    apiKey { keyId apiKey scopes expiresAt rateLimitPerMinute }
    errors { message }
  }
}
```

The `apiKey` field is the raw key — copy it now. An account can hold at most
10 keys; `apiKeyCreate` refuses an eleventh until one is revoked.

## Authenticating with a key

Send the key in the `X-API-KEY` header — not the `Authorization` header, which
carries user session tokens:

```bash
curl -X POST https://api.test.flashapp.me/graphql \
  -H 'Content-Type: application/json' \
  -H "X-API-KEY: fk_<keyId>_<secret>" \
  -d '{"query":"query { me { defaultAccount { wallets { walletCurrency balance } } } }"}'
```

An invalid, revoked, or expired key returns HTTP `401 Unauthorized` from the
gateway with an HTML body, not GraphQL JSON.

## Scopes

Access is **deny-by-default**: a key can only reach the operations covered by
its scopes. Grant the minimum an integration needs.

| Scope | Grants |
|-------|--------|
| `read_user` | Read profile and account details |
| `write_user` | Update language, username, npub, contact aliases, default wallet, display currency, notification settings |
| `read_wallet` | Read wallet balances and details |
| `write_wallet` | Move funds: create invoices, send Lightning, on-chain, and intraledger payments |
| `read_transactions` | Read transaction history and transaction details |
| `write_transactions` | Reserved. No operation currently requires it; a key with only this scope can perform no write at all. Whether it should map to anything is a separate product decision |
| `admin` | Every scope, including webhook (`callbackEndpoint*`) management |

`write_*` implies the matching `read_*`, and `admin` implies every scope.

Some operations are never available to API keys, whatever the scopes: login
and TOTP, API-key management itself, cash-out and Bridge withdrawals and KYC,
card checkout creation, ID document upload, and feedback. They need a user
session.

## Rate limits

Each key has a requests-per-minute budget: the value you set at creation
(1–10,000), or the platform default of 120. When it is exceeded the response
is **HTTP 200** with a GraphQL error, because the federation router only
forwards 200 responses from the API:

```json
{
  "data": null,
  "errors": [
    {
      "message": "API key rate limit exceeded",
      "extensions": {
        "code": "TOO_MANY_REQUESTS",
        "retryAfterSeconds": 12,
        "rateLimit": { "limit": 120, "remaining": 0 }
      }
    }
  ]
}
```

Read `extensions.retryAfterSeconds` and wait. The API sets `Retry-After` and
`X-RateLimit-*` headers as well, but the router does not forward them, so do
not depend on headers.

## Managing keys

From a user session you can list (`apiKeys`), rotate (`apiKeyRotate`), and
revoke (`apiKeyRevoke`) keys.

**Rotation** is create-first: `apiKeyRotate` issues a new key with the same
name, scopes, rate limit, and the same absolute `expiresAt`, and only then
revokes the old one. For a moment both keys are active. If revoking the old
key fails, the new key is revoked again so the account is never left with two.
Rotation does not extend the expiry, and an expired key cannot be rotated:
create a new one.

**Revoking** disables a key on its next request.
