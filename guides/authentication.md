# Authentication

The Flash API authenticates a user with a one-time code sent to their phone and returns an opaque session token. Send that token as a bearer token on every request.

Use `https://api.test.flashapp.me/graphql` while you develop. The examples below target TEST.

## Login flow

Login is three mutations. The first two request the code; the third exchanges it for a token.

### 1. Create a captcha challenge

```graphql
mutation {
  captchaCreateChallenge {
    errors { message }
    result { id challengeCode newCaptcha failbackMode }
  }
}
```

Keep `challengeCode`. `failbackMode` tells you how to fill in the next step.

### 2. Request the code

```graphql
mutation RequestCode($input: CaptchaRequestAuthCodeInput!) {
  captchaRequestAuthCode(input: $input) {
    success
    errors { message }
  }
}
```

```json
{
  "input": {
    "phone": "+18765550100",
    "channel": "SMS",
    "challengeCode": "<challengeCode from step 1>",
    "validationCode": "<see below>",
    "secCode": "<see below>"
  }
}
```

`channel` is `SMS` or `WHATSAPP`.

The captcha is Geetest. How you fill `validationCode` and `secCode` depends on `failbackMode` from step 1:

- `failbackMode: true` (the captcha service is unavailable, which is the state TEST is normally in): the server only checks that both values are non-empty. Passing the `challengeCode` for `validationCode` and `<challengeCode>|jordan` for `secCode` works; that is what the Flash API key console does.
- `failbackMode: false`: you must run the Geetest widget in a browser with the returned `id` and `challengeCode`, and pass the `validate` and `seccode` values it produces. A script cannot get past this on its own.

A successful call returns `success: true` and the code is sent. There is no separate registration step: a phone number that has never logged in gets an account on step 3.

### 3. Exchange the code for a token

```graphql
mutation Login($input: UserLoginInput!) {
  userLogin(input: $input) {
    authToken
    totpRequired
    errors { message }
  }
}
```

```json
{ "input": { "phone": "+18765550100", "code": "123456" } }
```

`authToken` is an opaque bearer token (it starts with `ory_st_`). It is not a JWT; there is nothing to decode.

If `totpRequired` is `true`, the account has two-factor authentication enabled and the token is not usable yet. Complete it with a plain HTTP POST to the auth endpoint of the same environment:

```http
POST https://api.test.flashapp.me/auth/totp/validate
Content-Type: application/json

{ "totpCode": "123456", "authToken": "<authToken from userLogin>" }
```

A `200` upgrades the session; then use `authToken` as normal. A wrong code returns `401 {"error":"invalid code"}`.

### 4. Use the token

```http
Authorization: Bearer <authToken>
```

## Session lifetime

Sessions are managed by Ory Kratos. The configured lifespan is 9360 hours (a little over a year) in both TEST and PROD, and the session is not extended by use. Plan to re-run the login flow when you get a 401; do not hard-code the lifespan.

## What failure looks like

| Situation | Response |
|-----------|----------|
| Missing or expired token, or an invalid one | HTTP `401` from the gateway with an HTML body, not GraphQL JSON. Your client must handle a non-JSON 401. |
| No token on a query that needs one | HTTP `200` with `data.me: null` and a top-level error `"Not authorized"` |
| Wrong login code | `userLogin` returns `errors: [{ "message": "Invalid or incorrect code entered." }]` |
| Code requested without steps 1 and 2 | `userLogin` fails (`UnknownPhoneProviderServiceError`) because no code was issued |

## Security notes

- Never expose a session token in client-side code, URLs, or logs.
- Use HTTPS for all API communication.
- For server-to-server integrations, create an [API key](api-keys) from the session instead of storing the session token.
