# Examples

All samples target TEST (`https://api.test.flashapp.me/graphql`) and need a session token from [Authentication](authentication) in `$AUTH_TOKEN`. Swap the host for `https://api.flashapp.me/graphql` only when you move to production.

## List your wallets

```bash
curl -X POST https://api.test.flashapp.me/graphql \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -d '{"query":"query Me { me { defaultAccount { defaultWalletId wallets { id walletCurrency balance } } } }"}'
```

Response for an account with a single USD wallet:

```json
{
  "data": {
    "me": {
      "defaultAccount": {
        "defaultWalletId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "wallets": [
          { "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6", "walletCurrency": "USD", "balance": 0 }
        ]
      }
    }
  }
}
```

Do not assume every account has the same wallets:

- Accounts created since June 2024 have no server-side BTC wallet. The app's Bitcoin wallet runs on the device (Breez SDK) and may appear here as an external wallet whose `balance` is `null`.
- New accounts currently get `USD` and `USDT` wallets with `USDT` as the default. Older accounts, including the TEST fixture account, may have only `USD`.

Always read `wallets`, pick the one you want by `walletCurrency`, and use its `id`.

`balance` on `USD` and `USDT` wallets is in fractional US cents (a number that may carry a fraction of a cent). On the app's external BTC wallet it is `null`. If an account still has an older server-side BTC wallet object, check what its `balance` returns rather than assuming either rule. This note is about the `balance` field only; other Bitcoin-denominated amounts in the API (invoice amounts, fees) are in satoshis as their types say.

You can fetch the current BTC price without authentication:

```bash
curl -X POST https://api.test.flashapp.me/graphql \
  -H 'Content-Type: application/json' \
  -d '{"query":"query { realtimePrice(currency: \"USD\") { btcSatPrice { base offset } } }"}'
```

## Create a Lightning invoice

Create a USD-denominated invoice on your USD or USDT wallet. `amount` is in cents:

```bash
curl -X POST https://api.test.flashapp.me/graphql \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -d '{"query":"mutation CreateUsdInvoice($input: LnUsdInvoiceCreateInput!) { lnUsdInvoiceCreate(input: $input) { errors { message } invoice { paymentRequest paymentHash } } }","variables":{"input":{"walletId":"3fa85f64-5717-4562-b3fc-2c963f66afa6","amount":100,"memo":"coffee"}}}'
```

Response:

```json
{
  "data": {
    "lnUsdInvoiceCreate": {
      "errors": [],
      "invoice": {
        "paymentRequest": "lnbc13180n1p...",
        "paymentHash": "298be57216d8dfda8e2e88e2cb6c6a2f85ba461b71e55ca72c0da7c76cec8508"
      }
    }
  }
}
```

The invoice is for one US dollar; the sat amount encoded in `paymentRequest` follows the exchange rate at creation. The `satoshis` field on this invoice type is `null` for USD invoices, so do not read it.

`lnInvoiceCreate` (amount in satoshis) needs a BTC wallet. On an account without one it returns `errors: [{ "message": "Flash does not support BTC wallets." }]`.

Creating an invoice does not move funds. The full list of queries, mutations, and subscriptions is in the reference sections.
