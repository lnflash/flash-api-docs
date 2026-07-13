# Flash GraphQL API

This API provides access to Flash's Bitcoin and Lightning Network payment
services for the Caribbean region — accept and send Bitcoin, run mobile-money
transactions, and build integrations on top of Flash accounts.

Everything the web and mobile Flash apps do is powered by this single GraphQL
API, and it's available to you too.

## Endpoints

| Environment | URL |
|-------------|-----|
| Production | `https://api.flashapp.me/graphql` |
| Testing | `https://api.test.flashapp.me/graphql` |

Use the testing endpoint while you develop, then switch to production.

## How to read these docs

- **Guides** (this section) walk through the common flows: getting started,
  authentication, API keys, example queries and mutations, and error handling.
- The **Queries**, **Mutations**, **Subscriptions**, and **Types** sections are
  the full, always-current reference generated from the API's schema — every
  operation with its arguments, response type, and an example.

## Authentication at a glance

Most operations require authentication. There are two ways to authenticate:

- A **user session token** — obtained by logging a user in with their phone
  number (see [Authentication](authentication)). Best for apps acting on behalf
  of a signed-in user.
- An **API key** — a long-lived, scoped credential for server-to-server
  integrations (see [API Keys](api-keys)). Best for automation.

You can explore the API interactively at the
[testing endpoint](https://api.test.flashapp.me/graphql).
