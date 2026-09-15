import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

// Paths are resolved relative to this config file so `magidoc generate` is
// cwd-independent (CI runs it from the repo root).
const __dirname = dirname(fileURLToPath(import.meta.url))
const guide = (name) => readFileSync(resolve(__dirname, `guides/${name}.md`), 'utf-8')

export default {
  introspection: {
    // The schema is fetched to ./schema.graphql by `npm run fetch-schema`
    // (production API) before generation.
    type: 'sdl',
    paths: [resolve(__dirname, 'schema.graphql')],
  },
  website: {
    template: 'carbon-multi-page',
    // Generated straight into the directory DigitalOcean serves.
    output: resolve(__dirname, 'public'),
    // Contents copied to the site root (logo + favicon referenced below).
    staticAssets: resolve(__dirname, 'magidoc-static'),
    options: {
      appTitle: 'Flash API',
      appLogo: '/logo.png',
      appFavicon: '/favicon.ico',
      siteMeta: {
        description: 'Flash GraphQL API — reference and developer guides for Bitcoin and Lightning payments across the Caribbean.',
        'og:title': 'Flash API Documentation',
        'og:description': 'Flash GraphQL API reference and developer guides.',
      },
      externalLinks: [
        { label: 'TEST endpoint', href: 'https://api.test.flashapp.me/graphql', kind: 'External', position: 'header' },
        { label: 'Flash Website', href: 'https://getflash.io', kind: 'External', position: 'header' },
      ],
      pages: [
        {
          title: 'Guides',
          content: [
            { title: 'Introduction', content: guide('introduction') },
            { title: 'Getting Started', content: guide('getting-started') },
            { title: 'Authentication', content: guide('authentication') },
            { title: 'API Keys', content: guide('api-keys') },
            { title: 'Examples', content: guide('examples') },
            { title: 'Error Handling', content: guide('errors') },
          ],
        },
      ],
      // Example values for the schema's custom scalars so Magidoc can render a
      // realistic sample query/mutation on each operation page. Illustrative only.
      queryGenerationFactories: {
        AccountNumber: '1234567890',
        AuthToken: 'ory_st_exampletoken0123456789',
        CentAmount: 1000,
        ContactAlias: 'alice',
        CountryCode: 'US',
        DisplayCurrency: 'USD',
        EmailAddress: 'dev@flashapp.me',
        EmailRegistrationId: 'email-reg-01HEXAMPLE',
        EndpointId: 'endpoint-01HEXAMPLE',
        EndpointUrl: 'https://example.com/webhook',
        Feedback: 'Great experience!',
        FractionalCentAmount: 1000,
        Hex32Bytes: '0000000000000000000000000000000000000000000000000000000000000000',
        JMDCents: 15000,
        Language: 'en',
        LnPaymentPreImage: '0000000000000000000000000000000000000000000000000000000000000000',
        LnPaymentRequest: 'lnbc1exampleinvoice0000000000000000000000000000000000000000000000',
        LnPaymentSecret: '0000000000000000000000000000000000000000000000000000000000000000',
        Lnurl: 'lnurl1exampleaddress0000000000000000000000000000000000000000',
        Memo: 'Payment for coffee',
        Minutes: 60,
        NotificationCategory: 'Payments',
        npub: 'npub1exampleexampleexampleexampleexampleexampleexampleexample',
        OnChainAddress: 'bc1qexampleaddress00000000000000000000000',
        OnChainTxHash: '0000000000000000000000000000000000000000000000000000000000000000',
        OneTimeAuthCode: '123456',
        PaymentHash: '0000000000000000000000000000000000000000000000000000000000000000',
        Phone: '+18765550100',
        SafeInt: 100,
        SatAmount: 50000,
        Seconds: 7776000,
        SignedAmount: 50000,
        SignedDisplayMajorAmount: '100.00',
        Timestamp: 1704067200,
        TotpCode: '123456',
        TotpRegistrationId: 'totp-reg-01HEXAMPLE',
        TotpSecret: 'JBSWY3DPEHPK3PXP',
        USDCents: 1000,
        Username: 'alice',
        WalletId: '00000000-0000-0000-0000-000000000000',
      },
    },
  },
}
