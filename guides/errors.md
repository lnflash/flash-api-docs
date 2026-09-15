# Error Handling

Errors reach you through three different channels. Check all three.

## 1. The gateway: HTTP 401 with an HTML body

A missing, invalid, expired, or revoked bearer token or API key is rejected
before it reaches GraphQL. The response is HTTP `401 Authorization Required`
with an HTML page from the gateway, not JSON:

```
HTTP/1.1 401 Authorization Required
<html><head><title>401 Authorization Required</title></head>...
```

Your client must handle a non-JSON 401. Re-run the login flow or check the
key.

## 2. Top-level GraphQL errors

Requests that are syntactically wrong, ask for fields that do not exist, or
call an operation without the required authentication come back in the
standard `errors` array:

```json
{
  "data": { "me": null },
  "errors": [
    {
      "message": "Not authorized",
      "locations": [{ "line": 1, "column": 3 }],
      "path": ["me"],
      "extensions": { "service": "public" }
    }
  ]
}
```

Notes, all observed on TEST:

- A query for an unknown field is HTTP `400` with `extensions.code =
  "GRAPHQL_VALIDATION_FAILED"`.
- An API key over its per-minute budget is HTTP `200` with
  `extensions.code = "TOO_MANY_REQUESTS"` and `extensions.retryAfterSeconds`.
  See [API Keys](api-keys).
- Other top-level errors currently carry only `message` and
  `extensions.service`; the backend's error codes are not forwarded at this
  level today. Match on `message` ("Not authorized", "Not authenticated")
  until that changes.

## 3. Errors inside a mutation payload

Most business failures are not top-level errors at all. The request is HTTP
`200`, the mutation's payload field is `null`, and its `errors` list is
populated. Every payload error implements the same interface:

```graphql
interface Error {
  code: String
  message: String!
  path: [String]
}
```

For example, `lnInvoiceCreate` on a wallet that is not a BTC wallet:

```json
{
  "data": {
    "lnInvoiceCreate": {
      "errors": [{ "message": "Flash does not support BTC wallets." }],
      "invoice": null
    }
  }
}
```

Ask for `errors { code message path }` on every mutation and check the list
before reading the payload. Codes such as `INVALID_INPUT`, `TOO_MANY_REQUEST`,
and the `BRIDGE_*` family appear here.
