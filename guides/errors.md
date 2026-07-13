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
