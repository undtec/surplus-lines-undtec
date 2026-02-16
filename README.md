# n8n-nodes-surplus-lines-undtec

This is an n8n community node for the [Surplus Lines Tax API](https://surpluslinesapi.com) by [Underwriters Technologies](https://undtec.com).

Calculate surplus lines taxes for all 50 U.S. states, the District of Columbia, Puerto Rico, and the U.S. Virgin Islands with accurate state-specific rules and rounding.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

## Try It Free

Want to test surplus lines tax calculations before integrating? Try our **free web-based calculator** at [sltax.undtec.com](https://sltax.undtec.com/) - no signup required!

## About

The Surplus Lines Tax API is a product of [Underwriters Technologies](https://undtec.com), providing insurance technology solutions for the surplus lines industry.

- **API Service**: [surpluslinesapi.com](https://surpluslinesapi.com)
- **Free Calculator**: [sltax.undtec.com](https://sltax.undtec.com/)
- **Company**: [undtec.com](https://undtec.com)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

### npm

```bash
npm install n8n-nodes-surplus-lines-undtec
```

### n8n Community Nodes

1. Go to **Settings > Community Nodes**
2. Select **Install**
3. Enter `n8n-nodes-surplus-lines-undtec` and confirm

## Credentials

You need a Surplus Lines API key to use this node:

1. Create an account at [app.surpluslinesapi.com](https://app.surpluslinesapi.com)
2. Navigate to the API Keys section in your dashboard
3. Generate a new API key
4. In n8n, create new credentials of type "Surplus Lines API" and paste your key

New accounts include **100 free API calls** to get started.

## Operations

### Calculate Tax

Calculate surplus lines tax for a specific state and premium amount.

**Required Parameters:**
- **State**: Select from all 50 U.S. states plus DC, Puerto Rico, and Virgin Islands
- **Premium**: The premium amount in USD

**Optional Parameters:**
- **Wet Marine**: For wet marine coverage (affects Alaska)
- **Fire Insurance**: For fire insurance (affects SD, MT)
- **Electronic Filing**: For electronic filing (affects MT stamping fee)
- **Fire Marshal Rate**: 0-1% fire marshal tax (Illinois only)
- **Medical Malpractice**: For medical malpractice coverage (exempt in PR)
- **Workers Comp**: For workers comp coverage (exempt in VA)
- **Year**: Tax year (affects Iowa rates 2024-2027)
- **New Business**: New/renewal policy flag (affects Oregon $10 fee)

**Example Response:**

```json
{
  "success": true,
  "state": "Texas",
  "premium": 10000,
  "taxes": {
    "sl_tax": 485.00,
    "tax_rate": 0.0485,
    "stamping_fee": 18.00,
    "stamping_fee_rate": 0.0018
  },
  "total_tax": 503.00,
  "total_due": 10503.00
}
```

### Get Rate

Get the current or historical tax rate for a specific state. Automatically falls back to current rates if historical data is unavailable.

**Required Parameters:**
- **State**: Select from all 50 U.S. states plus DC, Puerto Rico, and Virgin Islands

**Optional Parameters:**
- **Date**: Date in YYYY-MM-DD format for historical rates. Leave empty for current rates.

**Example Response (Current Rate):**

```json
{
  "success": true,
  "state": "Texas",
  "query_date": "2026-02-12",
  "rate": {
    "tax_rate": 0.0485,
    "stamping_fee": 0.0018,
    "filing_fee": null,
    "service_fee": null,
    "surcharge": null,
    "regulatory_fee": null,
    "effective_from": "2020-01-01",
    "effective_to": null,
    "legislative_source": "Texas Insurance Code § 225.006",
    "confidence": "high"
  }
}
```

**Example Response (Historical Rate with Fallback):**

```json
{
  "success": true,
  "state": "Iowa",
  "query_date": "2020-01-01",
  "rate": {
    "tax_rate": 0.01,
    "stamping_fee": 0.002,
    "filing_fee": null,
    "service_fee": null,
    "surcharge": null,
    "regulatory_fee": null,
    "effective_from": "2019-01-01",
    "effective_to": "2023-12-31",
    "legislative_source": "Iowa Code § 515.138",
    "confidence": "high"
  },
  "fallback_used": false,
  "fallback_message": null
}
```

**Automatic Fallback:**

If historical data is unavailable for the requested date, the API automatically returns the current rate with a helpful message:

```json
{
  "success": true,
  "state": "Texas",
  "query_date": "2010-01-01",
  "rate": {
    "tax_rate": 0.0485,
    "stamping_fee": 0.0018,
    // ... current rate data
  },
  "fallback_used": true,
  "fallback_message": "Historical data not available for this date. Returning current rate."
}
```

### Calculate Historical Tax

The **Calculate Tax** operation also supports historical calculations. Simply provide an `effective_date` parameter to calculate taxes using rates that were in effect on that date.

**Example:**
- State: Texas
- Premium: 10,000
- Effective Date: 2020-01-01

The API will use the tax rates that were in effect on January 1, 2020 for the calculation. If historical data is unavailable, it automatically falls back to current rates with a notification.

## Why Use Surplus Lines API?

- **Accurate**: State-specific rounding rules and current tax rates
- **Complete**: Covers all 50 states, DC, Puerto Rico, and Virgin Islands
- **Fast**: Real-time calculations with low latency
- **Reliable**: Built for production insurance workflows
- **Affordable**: Pay-as-you-go pricing with 100 free calls to start

## Resources

- [Surplus Lines API Documentation](https://surpluslinesapi.com/docs/)
- [Free Web Calculator](https://sltax.undtec.com/)
- [Underwriters Technologies](https://undtec.com)
- [n8n Community Nodes Documentation](https://docs.n8n.io/integrations/community-nodes/)

## Support

For API support, contact [support@undtec.com](mailto:support@undtec.com)

## License

[MIT](LICENSE)

---

**Surplus Lines Tax API** is a product of [Underwriters Technologies](https://undtec.com) - Insurance Technology Solutions
