# API Documentation Versions

This document describes the available versions of the Flash API documentation and their key differences.

## Available Versions

| Version | Release Date | Status | Description |
|---------|-------------|--------|-------------|
| 1.0.0   | 2024-04-10  | Stable | Initial stable release |
| 1.1.0   | 2024-05-05  | Latest | Improved authentication flow and additional endpoints |
| Beta    | Current     | Preview | Preview of upcoming features (unstable) |

## Version Features

### v1.0.0 (Initial Release)
- Basic GraphQL API documentation
- Authentication flow with JWT tokens
- Core payment operations (Lightning, On-chain)
- User management operations

### v1.1.0 (Current Stable)
- Added Nostr integration with new endpoints:
  - `isFlashNpub` query to check if a nostr public key belongs to a Flash user
  - `userUpdateNpub` mutation to update a user's nostr public key
- Enhanced payment operations:
  - Updated `intraLedgerPaymentSend` to use Ibex for routing instead of internal ledger
  - Added `description_hash` parameter to `lnInvoiceCreate`
- Improved error handling with more detailed error messages
- Performance optimizations for payment processing

### Beta (Preview)
- Enhanced Nostr integration:
  - New `npubByUsername` query to get the nostr public key for a username
  - Improved performance for nostr-related operations
- New wallet export functionality:
  - `walletExport` mutation to export wallet data in various formats (CSV, JSON, PDF)
  - Requires additional authentication for security
- Updated account limits:
  - Added new limits for conversion between currencies

## Versioning Strategy

The Flash API follows semantic versioning (MAJOR.MINOR.PATCH):

- MAJOR version changes indicate backward-incompatible API changes
- MINOR version changes add functionality in a backward-compatible manner
- PATCH version changes make backward-compatible bug fixes

For most integrations, we recommend using the latest stable version which includes all improvements and bug fixes. The beta version is intended for testing upcoming features and should not be used in production environments.

## Version Lifecycle

1. **Beta**: Preview of upcoming features, may change without notice
2. **Latest**: The most recent stable release with all features and bug fixes
3. **Stable**: Previous versions that are still supported
4. **Deprecated**: Versions that will be removed in a future release

We maintain backward compatibility for at least 6 months for minor versions and provide migration guides for major version upgrades.

## Accessing Specific Versions

You can access a specific version of the API documentation by using the version selector in the top navigation bar, or by directly accessing the URL with the version prefix:

- Latest (v1.1.0): `/v1.1.0/`
- Initial Release (v1.0.0): `/`
- Beta: `/beta/`