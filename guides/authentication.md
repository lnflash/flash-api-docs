# Authentication

Flash API uses JSON Web Tokens (JWT) for authentication. Most API operations require authentication to identify the user and determine their permissions.

## Authentication Process

Flash uses a two-step phone verification process for authentication:

1. **Step 1: Initiate phone verification** by sending a `userPhoneRegistrationInitiate` mutation with the phone number:

   ```graphql
   mutation {
     userPhoneRegistrationInitiate(input: { phone: "+1234567890" }) {
       success
       errors {
         message
       }
     }
   }
   ```

   This will trigger a 6-digit code to be sent via SMS to the specified phone number.

2. **Step 2: Verify the code and obtain auth token** by sending a `userLogin` mutation with the phone number and verification code:

   ```graphql
   mutation {
     userLogin(input: { phone: "+1234567890", code: "123456" }) {
       authToken
       errors {
         message
       }
     }
   }
   ```

   Upon successful verification, an authentication token will be returned.

3. **Store the auth token** securely in your application.

   The token is valid for 7 days. For security reasons, do not store it in localStorage in browser environments.

4. **Include the token** in all subsequent API requests via the Authorization header:

   ```http
   Authorization: Bearer YOUR_AUTH_TOKEN
   ```

5. **Handle token expiration** by implementing appropriate error handling:

   ```javascript
   // Check for authentication errors
   if (error.message === 'Unauthorized' || error.message === 'Token expired') {
     // Repeat the authentication process to get a new token
   }
   ```

## Security Best Practices

- Never expose your auth token in client-side code or URLs
- Use HTTPS for all API communication
- Implement token refresh logic before expiration
- Validate the token on your server before using it
