# Error Handling

The API returns errors in the following format:

```json
{
  "data": { ... },
  "errors": [
    {
      "message": "Error message",
      "locations": [{ "line": 2, "column": 3 }],
      "path": ["fieldName"]
    }
  ]
}
```

`message` is human-readable. Some errors also carry a machine-readable code in
`extensions.code`.

## Codes to handle

| Situation | What you get |
|-----------|--------------|
| Invalid, revoked, or expired API key | HTTP `401 Unauthorized` |
| API key over its per-minute budget | HTTP 200 with a GraphQL error, `extensions.code = "TOO_MANY_REQUESTS"` and `extensions.retryAfterSeconds`; the `Retry-After` header is also set |
| Mutation-level failure (bad input, insufficient balance, and so on) | HTTP 200 with the mutation's `errors` array populated and its payload field null |

Always check both the top-level `errors` array and the `errors` field inside a
mutation payload.
