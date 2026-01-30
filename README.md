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

### Get Rates

Get current tax rates for all states or a specific state.

**Optional Parameters:**
- **State Filter**: Filter rates for a specific state (leave empty for all states)

**Example Response (All States):**

```json
{
  "success": true,
  "count": 53,
  "data": [
    {
      "state": "Alabama",
      "tax_rate": 0.0375,
      "stamping_fee_rate": 0.002,
      "notes": "Rounded to nearest penny"
    },
    {
      "state": "Texas",
      "tax_rate": 0.0485,
      "stamping_fee_rate": 0.0018,
      "notes": "State-specific rounding"
    }
    // ... 51 more states
  ]
}
```

**Example Response (Single State):**

```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "state": "Texas",
      "tax_rate": 0.0485,
      "stamping_fee_rate": 0.0018,
      "notes": "State-specific rounding"
    }
  ]
}
```

### Get States

Get a list of all supported states/jurisdictions.

**No Parameters Required**

**Example Response:**

```json
{
  "success": true,
  "count": 53,
  "data": [
    "Alabama",
    "Alaska",
    "Arizona",
    // ... 50 more states/territories
  ]
}
```

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
