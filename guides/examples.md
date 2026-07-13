# Examples

## Queries

Fetch account details and wallet balances (requires a valid auth token):

```bash
curl -X POST https://api.flashapp.me/graphql \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -d '{"query":"query Me { me { defaultAccount { level wallets { id walletCurrency balance } } } }"}'
```

Response:

```json
{
  "data": {
    "me": {
      "defaultAccount": {
        "level": "ONE",
        "wallets": [
          { "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6", "walletCurrency": "USD", "balance": 1250 },
          { "id": "7c9e6679-7425-40de-944b-e07fc1f90ae7", "walletCurrency": "BTC", "balance": 348940 }
        ]
      }
    }
  }
}
```

Balances are returned in the wallet's minor unit: cents for `USD` wallets, satoshis for `BTC` wallets. You can also fetch the current BTC price without authentication via `realtimePrice(currency: "USD")`.

## Mutations

Create a Lightning invoice on one of your wallets (amount in satoshis):

```bash
curl -X POST https://api.flashapp.me/graphql \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -d '{"query":"mutation CreateInvoice($input: LnInvoiceCreateInput!) { lnInvoiceCreate(input: $input) { errors { message } invoice { paymentRequest paymentHash satoshis } } }","variables":{"input":{"walletId":"7c9e6679-7425-40de-944b-e07fc1f90ae7","amount":12345,"memo":"coffee"}}}'
```

Response:

```json
{
  "data": {
    "lnInvoiceCreate": {
      "errors": [],
      "invoice": {
        "paymentRequest": "lnbc123450n1p...",
        "paymentHash": "298be57216d8dfda8e2e88e2cb6c6a2f85ba461b71e55ca72c0da7c76cec8508",
        "satoshis": 12345
      }
    }
  }
}
```

Use the test environment (`api.test.flashapp.me`) while developing — see the full API reference for every available query, mutation, and subscription.
