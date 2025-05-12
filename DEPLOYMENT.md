# Flash API Documentation Deployment

This document outlines the automated deployment process for the Flash API Documentation site.

## Overview

The Flash API Documentation is automatically built and deployed to DigitalOcean App Platform whenever changes are pushed to the `main` branch. This process is handled by GitHub Actions.

## How It Works

1. When code is pushed to the `main` branch, a GitHub Actions workflow is triggered
2. The workflow:
   - Sets up a Node.js environment
   - Installs dependencies
   - Fetches the latest GraphQL schema from the Flash API
   - Builds the static documentation site
   - Deploys the built site to DigitalOcean App Platform

## Prerequisites

To use this deployment pipeline, you need to set up the following secrets in your GitHub repository:

- `DIGITALOCEAN_ACCESS_TOKEN`: A DigitalOcean API token with write permissions
- `DIGITALOCEAN_APP_ID`: The ID of your DigitalOcean App Platform application

## Setting Up DigitalOcean App Platform

1. Create a new App on DigitalOcean App Platform
2. Select "Static Site" as the resource type
3. Configure the app with the following settings:
   - Source: GitHub
   - Repository: Your Flash API Docs repository
   - Branch: main
   - Build Command: npm run build
   - Output Directory: public
   - Environment: Static Site

## Manual Deployment

If you need to deploy manually, you can trigger the workflow from GitHub:

1. Go to the "Actions" tab in your GitHub repository
2. Select the "Build and Deploy Flash API Docs" workflow
3. Click "Run workflow" and select the branch to deploy from

## Troubleshooting

If deployment fails, check:

1. GitHub Actions logs for build errors
2. DigitalOcean App Platform logs for deployment issues
3. Verify that the required secrets are correctly set up in the GitHub repository

## Modifying the Deployment Process

To modify the deployment process:

1. Edit the `.github/workflows/deploy.yml` file
2. Commit and push changes to the repository

The changes will take effect the next time the workflow runs.