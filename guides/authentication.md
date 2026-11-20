# Authentication

Flash API uses JSON Web Tokens (JWT) for authentication. Most API operations require authentication to identify the user and determine their permissions.

> **Building a server-side integration?** Use an API key instead of this flow. Sign in to the API Key Console at [console.flashapp.me](https://console.flashapp.me) (production) and create a key there. See [API Keys](api-keys).

## Authentication Process

Flash signs users in with a one-time code sent to their phone. Requesting the code is protected by a captcha, so this flow is meant for apps with a user interface.

1. **Step 1: Create a captcha challenge** with the `captchaCreateChallenge` mutation:

   ```graphql
   mutation {
     captchaCreateChallenge {
       result {
         id
         challengeCode
         newCaptcha
         failbackMode
       }
       errors {
         message
       }
     }
   }
   ```

   Pass `id`, `challengeCode`, `newCaptcha` and `failbackMode` to the GeeTest captcha widget in your app and have the user solve it. The widget returns three values: `geetest_challenge`, `geetest_validate` and `geetest_seccode`.

2. **Step 2: Request the code** with `captchaRequestAuthCode`, passing the phone number and the three captcha values:

   ```graphql
   mutation {
     captchaRequestAuthCode(input: {
       phone: "+1234567890"
       challengeCode: "<geetest_challenge>"
       validationCode: "<geetest_validate>"
       secCode: "<geetest_seccode>"
       channel: SMS
     }) {
       success
       errors {
         message
       }
     }
   }
   ```

   This sends a 6-digit code to the phone number. Set `channel: WHATSAPP` to send it over WhatsApp instead.

3. **Step 3: Verify the code and obtain an auth token** by sending a `userLogin` mutation with the phone number and code:

   ```graphql
   mutation {
     userLogin(input: { phone: "+1234567890", code: "123456" }) {
       authToken
       totpRequired
       errors {
         message
       }
     }
   }
   ```

   Upon successful verification, an authentication token will be returned. A phone number with no Flash account gets a new account at this step.

4. **Store the auth token** securely in your application.

   The token is valid for 7 days. For security reasons, do not store it in localStorage in browser environments.

5. **Include the token** in all subsequent API requests via the Authorization header:

   ```http
   Authorization: Bearer YOUR_AUTH_TOKEN
   ```

6. **Handle token expiration** by implementing appropriate error handling:

   ```javascript
   // Check for authentication errors
   if (error.message === 'Unauthorized' || error.message === 'Token expired') {
     // Repeat the authentication process to get a new token
   }
   ```

`userPhoneRegistrationInitiate` is not part of sign-in. It adds a phone number to an account that is already signed in, so calling it without a token fails.

## Test environment

Sign-in on the test API at `https://api.test.flashapp.me/graphql` is set up for test accounts issued by Flash. Ask Flash for a test account or a test API key. Test accounts can sign in to [console.test.flashapp.me](https://console.test.flashapp.me) to manage their keys.

## Security Best Practices

- Never expose your auth token in client-side code or URLs
- Use HTTPS for all API communication
- Implement token refresh logic before expiration
- Validate the token on your server before using it
