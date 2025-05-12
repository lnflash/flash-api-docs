# Setting Up DigitalOcean Deployment for Flash API Documentation

This guide explains how to set up DigitalOcean App Platform and the necessary tokens for deploying the Flash API Documentation.

## DigitalOcean App Platform Setup

1. **Create a DigitalOcean App**:
   - Go to [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)
   - Click "Create App"
   - Choose "Static Site" as the resource type
   - Configure with the following settings:
     - Source: GitHub
     - Repository: Your Flash API Docs repository
     - Branch: main
     - Source Directory: `/public` (Important: This should point to the built static files)
     - Environment: Static Site

2. **Note Your App ID**:
   - After creating your app, the App ID is visible in the URL when viewing your app
   - Example URL: `https://cloud.digitalocean.com/apps/12345a67-b890-1234-5c67-8901d23e45fg`
   - In this example, the App ID is `12345a67-b890-1234-5c67-8901d23e45fg`

## Creating a Proper DigitalOcean Access Token

1. **Generate a New API Token**:
   - Go to [API > Tokens/Keys](https://cloud.digitalocean.com/account/api/tokens)
   - Click "Generate New Token"
   - Name: "Flash API Docs Deployment"
   - Scopes: Select **both** "Read" and "Write" scopes
   - Click "Generate Token"
   - **Important**: Copy the token immediately - you won't be able to see it again!

2. **Verify Token Permissions**:
   - The token must have the `apps` scope with write permissions
   - Without the write permission, you'll get a "403 You are not authorized" error

## Adding Secrets to GitHub Repository

1. **Add Token to GitHub Secrets**:
   - Go to your GitHub repository
   - Navigate to Settings > Secrets and variables > Actions
   - Click "New repository secret"
   - Name: `DIGITALOCEAN_ACCESS_TOKEN`
   - Value: Your DigitalOcean API token with read/write permission
   - Click "Add secret"

2. **Add App ID to GitHub Secrets**:
   - Click "New repository secret" again
   - Name: `DIGITALOCEAN_APP_ID`
   - Value: Your DigitalOcean App ID (from the URL)
   - Click "Add secret"

## Troubleshooting Deployment Issues

If you're seeing a "403 You are not authorized" error:

1. **Check Token Permissions**:
   - Your token might only have Read permissions, but needs Write permissions
   - Create a new token with both Read and Write scopes

2. **Verify App ID**:
   - Make sure you've copied the correct App ID from the URL
   - The format should be something like `12345a67-b890-1234-5c67-8901d23e45fg`

3. **Token Expiration**:
   - DigitalOcean tokens can expire if you set an expiration date
   - Create a new token if your old one has expired

4. **Repository Access**:
   - Ensure the GitHub repository is connected to your DigitalOcean account
   - Check if the app was created using the same account as the token

## Manual Deployment Testing

To test your token and app ID manually:

```bash
# Install doctl CLI
brew install doctl  # On macOS
# Or download from https://github.com/digitalocean/doctl/releases

# Authenticate
doctl auth init
# Paste your token when prompted

# Test account access
doctl account get

# Test apps list access
doctl apps list

# Try creating a deployment (replace with your App ID)
doctl apps create-deployment YOUR_APP_ID --wait
```

If these commands work from your local machine but not in GitHub Actions, there may be an issue with how the secrets are set up in your repository.