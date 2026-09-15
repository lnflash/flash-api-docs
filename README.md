# Flash GraphQL API Documentation

Source for [docs.flashapp.me](https://docs.flashapp.me), the reference and
developer guides for the Flash GraphQL API.

The reference (queries, mutations, subscriptions, types) is generated from
`schema.graphql` with [Magidoc](https://magidoc.js.org/). The guides are
hand-written Markdown in `guides/`.

## Layout

| Path | What it is |
|------|------------|
| `guides/*.md` | Hand-written guide pages: introduction, getting started, authentication, API keys, examples, error handling |
| `magidoc.mjs` | Magidoc config: site title, header links, the guide page order, and example values for custom scalars |
| `schema.graphql` | The production API schema, refreshed by `npm run fetch-schema` |
| `scripts/clean-urls.mjs` | Post-build step that adds `X/index.html` next to every `X.html` so extensionless URLs resolve on DigitalOcean |
| `magidoc-static/` | Logo and favicon copied to the site root |
| `public/` | Build output. Gitignored; regenerated on every build |
| `.github/workflows/` | `deploy.yml` builds and deploys on push to `main`; `update-docs.yml` refreshes `schema.graphql` daily |

## Local development

Requires Node.js 20 or newer.

```bash
npm ci
npm run build     # fetch-schema + magidoc generate + clean-urls
npm run dev       # serve public/ on http://localhost:3000
```

`npm run fetch-schema:beta` pulls the schema from the test API instead of
production.

## Editing the guides

1. Edit the Markdown under `guides/`. Links between guides are relative
   (`[Authentication](authentication)`), and Magidoc renders them under
   `/guides/`.
2. To add a guide, create the file and add it to the `pages` list in
   `magidoc.mjs`.
3. Run `npm run build` and open the site locally to check the result.

The reference pages regenerate from the schema, but the guides and their
examples do not. When the schema changes, check that the examples still match.

## Schema updates

`update-docs.yml` runs daily, fetches the production schema, and commits
`schema.graphql` when it has changed. The next deploy rebuilds the reference
from it. You can also trigger it from the Actions tab.

## Deployment

Pushing to `main` runs `deploy.yml`, which builds the site and deploys
`public/` to DigitalOcean App Platform. Setup and required secrets are in
[DEPLOYMENT.md](DEPLOYMENT.md), [DIGITALOCEAN_SETUP.md](DIGITALOCEAN_SETUP.md),
and [GITHUB_SECRETS.md](GITHUB_SECRETS.md).

## Security

See [SECURITY.md](SECURITY.md) for how to report a vulnerability.

## License

[MIT License](LICENSE)
