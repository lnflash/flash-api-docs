# Setting Up GitHub Secrets for Flash API Documentation Deployment

This guide explains how to set up the required GitHub secrets for the automated deployment of Flash API Documentation to DigitalOcean App Platform.

## Required Secrets

For the deployment workflow to function properly, you need to add the following secrets to your GitHub repository:

1. `DIGITALOCEAN_ACCESS_TOKEN`: API token for authenticating with DigitalOcean
2. `DIGITALOCEAN_APP_ID`: ID of your DigitalOcean App Platform application

## Creating a DigitalOcean Access Token

1. Log in to your DigitalOcean account
2. Go to **API** in the left sidebar (or navigate to https://cloud.digitalocean.com/account/api/tokens)
3. Click **Generate New Token**
4. Enter a name for your token (e.g., "Flash API Docs Deployment")
5. Select **Write** scope to allow the token to create deployments
6. Click **Generate Token**
7. Copy the token immediately (you won't be able to view it again)

## Finding Your DigitalOcean App ID

1. Create an app on DigitalOcean App Platform if you haven't already
2. Go to the App Platform dashboard
3. Select your application
4. The App ID can be found in the URL of your app's page:
   - Example URL: `https://cloud.digitalocean.com/apps/12345a67-b890-1234-5c67-8901d23e45fg`
   - In this example, the App ID is `12345a67-b890-1234-5c67-8901d23e45fg`

## Adding Secrets to GitHub Repository

1. Go to your GitHub repository
2. Click on **Settings**
3. In the left sidebar, click on **Secrets and variables** > **Actions**
4. Click **New repository secret**
5. Add the `DIGITALOCEAN_ACCESS_TOKEN` secret:
   - Name: DIGITALOCEAN_ACCESS_TOKEN
   - Value: Your DigitalOcean API token
6. Click **Add secret**
7. Repeat steps 4-6 to add the `DIGITALOCEAN_APP_ID` secret:
   - Name: DIGITALOCEAN_APP_ID
   - Value: Your DigitalOcean App ID

## Verifying Your Setup

1. After adding both secrets, go to the **Actions** tab in your repository
2. You should see the "Build and Deploy Flash API Docs" workflow
3. If the main branch has been pushed recently, you should see a workflow run
4. Click on the workflow run to see the details and ensure it's working correctly

## Troubleshooting

If your deployment fails, check the following:

- Verify that both secrets are correctly set up in your repository
- Ensure your DigitalOcean token has not expired and has the right permissions
- Confirm that the App ID is correct
- Check the error messages in the GitHub Actions workflow logs

For additional help, consult the [DigitalOcean App Platform documentation](https://docs.digitalocean.com/products/app-platform/) or [GitHub Actions documentation](https://docs.github.com/en/actions).