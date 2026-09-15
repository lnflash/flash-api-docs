# Flash API Documentation Deployment

This document outlines the automated deployment process for the Flash API Documentation site.

## Overview

The Flash API Documentation is automatically built and deployed to DigitalOcean App Platform whenever changes are pushed to the `main` branch. This process is handled by GitHub Actions.

## How It Works

1. When code is pushed to the `main` branch, `.github/workflows/deploy.yml` runs.
2. The **build** job installs dependencies and runs `npm run build`, which fetches the **production** schema and generates the site. This build is a check: the job uploads `public/` as a workflow artifact and nothing downloads it into the deploy.
3. The **deploy** job installs `doctl`, verifies the token, and runs `doctl apps create-deployment <app id>`. That tells DigitalOcean App Platform to rebuild and publish the site itself, from the GitHub repository and the app's own build settings. The artifact from step 2 is not what gets served.
4. The workflow's final "Live URL" line prints `https://flash-api-docs.flashapp.me`; the real host is `https://docs.flashapp.me`. That line is cosmetic and wrong.

### Daily schema refresh

`.github/workflows/update-docs.yml` runs at 00:00 UTC, fetches the production schema, and commits `schema.graphql` when it changed. It pushes with the default `GITHUB_TOKEN`, and pushes made with that token do not trigger other workflows, so `deploy.yml` does **not** run for those commits. The refreshed schema reaches the site only if the DigitalOcean app deploys on push, or if someone runs `deploy.yml` from the Actions tab.

## Prerequisites

To use this deployment pipeline, you need to set up the following secrets in your GitHub repository:

- `DIGITALOCEAN_ACCESS_TOKEN`: A DigitalOcean API token with **both read and write permissions**
- `DIGITALOCEAN_APP_ID`: The ID of your DigitalOcean App Platform application

For detailed instructions on setting up these secrets correctly, see [DIGITALOCEAN_SETUP.md](DIGITALOCEAN_SETUP.md).

## Setting Up DigitalOcean App Platform

1. Create a new App on DigitalOcean App Platform
2. Select "Static Site" as the resource type
3. Configure the app as a Static Site from the GitHub repository, branch `main`. Because `public/` is gitignored, the app must build the site itself: build command `npm run build`, output directory `public`.

   **The live app's actual settings (build command, source and output directories, deploy-on-push) are not recorded in this repository.** The committed `.do/app.yaml` is a template with a placeholder repository and no build command, and `DIGITALOCEAN_SETUP.md` previously gave different values from this file. Before changing anything, read the real spec with `doctl apps spec get <app id>` and treat that as the source of truth.

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