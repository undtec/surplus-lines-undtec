# n8n-nodes-surpluslines - Complete Documentation

**Created:** December 10, 2025
**Published to npm:** December 10, 2025
**Version:** 1.0.0
**npm Package:** https://www.npmjs.com/package/n8n-nodes-surpluslines

---

## Table of Contents

1. [Overview](#overview)
2. [Package Structure](#package-structure)
3. [Files Created](#files-created)
4. [Technical Implementation](#technical-implementation)
5. [API Integration](#api-integration)
6. [Installation Methods](#installation-methods)
7. [Usage in n8n](#usage-in-n8n)
8. [Publishing Process](#publishing-process)
9. [Maintenance & Updates](#maintenance--updates)
10. [Troubleshooting](#troubleshooting)

---

## Overview

This is a custom n8n community node that integrates with the **Surplus Lines Tax API** by Underwriters Technologies. It allows n8n workflows to calculate surplus lines taxes for all 50 U.S. states, District of Columbia, Puerto Rico, and the U.S. Virgin Islands.

### Key Links

| Resource | URL |
|----------|-----|
| npm Package | https://www.npmjs.com/package/n8n-nodes-surpluslines |
| API Service | https://surpluslinesapi.com |
| API Documentation | https://surpluslinesapi.com/docs/ |
| Free Calculator | https://sltax.undtec.com |
| Company Website | https://undtec.com |
| User Portal | https://app.surpluslinesapi.com |

### Branding

The node includes promotional branding for Underwriters Technologies throughout:
- Package description mentions free calculator at sltax.undtec.com
- Credential description links to app.surpluslinesapi.com
- README includes "Try It Free" section and company information
- Keywords optimized for discoverability

---

## Package Structure

```
n8n-nodes/n8n-nodes-surpluslines/
├── credentials/
│   └── SurplusLinesApi.credentials.ts    # API key credential definition
├── nodes/
│   └── SurplusLinesApi/
│       ├── SurplusLinesApi.node.ts       # Main node implementation
│       └── surpluslines.svg              # Node icon (blue with $ and TAX badge)
├── dist/                                  # Compiled JavaScript (generated)
│   ├── credentials/
│   │   └── SurplusLinesApi.credentials.js
│   └── nodes/
│       └── SurplusLinesApi/
│           ├── SurplusLinesApi.node.js
│           └── surpluslines.svg
├── node_modules/                          # Dependencies (not committed)
├── package.json                           # Package configuration
├── tsconfig.json                          # TypeScript configuration
├── gulpfile.js                            # Build task for icons
├── pnpm-lock.yaml                         # Dependency lockfile
├── README.md                              # npm package README
├── LICENSE                                # MIT License
├── DOCUMENTATION.md                       # This file
└── .gitignore                             # Git ignore rules
```

---

## Files Created

### 1. package.json

Defines the npm package with n8n-specific configuration:

```json
{
  "name": "n8n-nodes-surpluslines",
  "version": "1.0.0",
  "n8n": {
    "n8nNodesApiVersion": 1,
    "credentials": [
      "dist/credentials/SurplusLinesApi.credentials.js"
    ],
    "nodes": [
      "dist/nodes/SurplusLinesApi/SurplusLinesApi.node.js"
    ]
  }
}
```

**Key configurations:**
- `n8nNodesApiVersion: 1` - Uses n8n's node API version 1
- `keywords` includes `n8n-community-node-package` (required for discovery)
- `peerDependencies` on `n8n-workflow`
- `files: ["dist"]` - Only publishes compiled code

### 2. SurplusLinesApi.credentials.ts

Defines the credential type for API authentication:

```typescript
export class SurplusLinesApi implements ICredentialType {
  name = 'surplusLinesApi';
  displayName = 'Surplus Lines API';
  documentationUrl = 'https://surpluslinesapi.com/docs/';

  properties: INodeProperties[] = [
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: { password: true },
      required: true,
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      headers: {
        'X-API-Key': '={{$credentials.apiKey}}',
      },
    },
  };

  test: ICredentialTestRequest = {
    // Tests credential by making a real API call
  };
}
```

**Features:**
- Password field for secure API key storage
- Automatic header injection (`X-API-Key`)
- Built-in credential testing (calls /v1/calculate with test data)

### 3. SurplusLinesApi.node.ts

Main node implementation with one operation: **Calculate Tax**

**Required Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| state | dropdown | All 53 jurisdictions (50 states + DC + PR + VI) |
| premium | number | Premium amount in USD |

**Optional Parameters (Additional Options):**
| Parameter | Type | Description | Affects |
|-----------|------|-------------|---------|
| wet_marine | boolean | Wet marine coverage | Alaska |
| fire_insurance | boolean | Fire insurance | SD, MT |
| electronic_filing | boolean | Electronic filing | MT stamping fee |
| fire_marshal_rate | number | 0-1% fire marshal tax | Illinois only |
| medical_malpractice | boolean | Medical malpractice | PR (exempt) |
| workers_comp | boolean | Workers compensation | VA (exempt) |
| year | number | Tax year | Iowa rates 2024-2027 |
| new_business | boolean | New/renewal policy | Oregon $10 fee |

### 4. surpluslines.svg

Custom icon for the node:
- Blue gradient background (#2563eb to #1d4ed8)
- White dollar sign ($)
- Green "TAX" badge in corner
- 60x60px, rounded corners

---

## Technical Implementation

### Authentication Flow

1. User creates credential in n8n with their API key
2. Node uses `httpRequestWithAuthentication()` helper
3. Helper automatically injects `X-API-Key` header
4. API validates key and returns calculation or error

### Request Flow

```
n8n Workflow
    │
    ▼
SurplusLinesApi Node
    │
    ├─► Reads parameters (state, premium, options)
    │
    ├─► Builds request body
    │
    ├─► Calls httpRequestWithAuthentication()
    │       │
    │       ▼
    │   POST https://api.surpluslinesapi.com/v1/calculate
    │   Headers: X-API-Key: [from credentials]
    │   Body: { state, premium, ...options }
    │
    ▼
Returns response to workflow
```

### Error Handling

The node implements `continueOnFail()` support:
- If enabled: Returns error message in output, continues workflow
- If disabled: Throws error, stops workflow execution

---

## API Integration

### Endpoint Used

```
POST https://api.surpluslinesapi.com/v1/calculate
```

### Request Format

```json
{
  "state": "Texas",
  "premium": 10000,
  "wet_marine": false,
  "fire_insurance": false,
  "electronic_filing": false,
  "fire_marshal_rate": 0,
  "medical_malpractice": false,
  "workers_comp": false,
  "year": 2025,
  "new_business": true
}
```

### Response Format

```json
{
  "success": true,
  "state": "Texas",
  "premium": 10000,
  "taxes": {
    "sl_tax": 485.00,
    "tax_rate": 0.0485,
    "stamping_fee": 18.00,
    "stamping_fee_rate": 0.0018,
    "filing_fee": 0,
    "filing_fee_rate": 0
  },
  "total_tax": 503.00,
  "total_due": 10503.00,
  "billing": {
    "charged": 0.05,
    "was_free_query": false,
    "remaining_balance": 9.95,
    "free_queries_remaining": 0
  }
}
```

### Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "INVALID_API_KEY",
    "message": "API key is invalid or expired"
  }
}
```

---

## Installation Methods

### Method 1: n8n Community Nodes UI (Recommended)

1. Open n8n web interface
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter: `n8n-nodes-surpluslines`
5. Accept the risk warning
6. Click **Install**
7. n8n restarts automatically

### Method 2: npm Install (Self-hosted)

```bash
cd ~/.n8n/custom
npm install n8n-nodes-surpluslines
# Restart n8n
```

### Method 3: Docker

```bash
# Find container
docker ps | grep n8n

# Install inside container
docker exec -it <container_id> npm install n8n-nodes-surpluslines

# Restart container
docker restart <container_id>
```

### Method 4: Docker Compose

Add to docker-compose.yml:
```yaml
services:
  n8n:
    environment:
      - N8N_CUSTOM_EXTENSIONS=n8n-nodes-surpluslines
```

---

## Usage in n8n

### Creating Credentials

1. Go to **Credentials** in n8n
2. Click **Add Credential**
3. Search for "Surplus Lines API"
4. Enter your API key from https://app.surpluslinesapi.com
5. Click **Test** to verify
6. Click **Save**

### Using the Node

1. Add **Surplus Lines API** node to workflow
2. Select your credential
3. Choose state from dropdown
4. Enter premium amount
5. (Optional) Expand **Additional Options** for special cases
6. Execute node

### Example Workflow

```
Webhook Trigger
      │
      ▼
Surplus Lines API
(Calculate Tax)
      │
      ▼
IF Node
(Check success)
      │
   ┌──┴──┐
   ▼     ▼
Success  Error
Response Response
```

---

## Publishing Process

### Prerequisites

1. npm account (create at https://www.npmjs.com/signup)
2. Node.js 18+ installed
3. pnpm installed (`npm install -g pnpm`)

### Build & Publish Steps

```bash
# Navigate to package directory
cd "/Volumes/Under_mini/CLAUDE_CAN_USE/surpluslinestax_www/n8n-nodes/n8n-nodes-surpluslines"

# Install dependencies
pnpm install

# Build TypeScript to JavaScript
pnpm build

# Login to npm (opens browser)
npm login

# Publish to npm
pnpm publish --access public --no-git-checks
```

### Version Updates

To publish updates:

1. Update version in `package.json`
2. Make code changes
3. Rebuild: `pnpm build`
4. Publish: `pnpm publish --access public --no-git-checks`

---

## Maintenance & Updates

### Updating the Node

1. Edit source files in `credentials/` or `nodes/`
2. Increment version in `package.json`
3. Run `pnpm build`
4. Run `pnpm publish --access public --no-git-checks`
5. Users update via n8n Community Nodes UI

### Adding New Operations

To add operations (e.g., "Get States", "Validate"):

1. Add new option to `operation` property in node
2. Add operation-specific parameters with `displayOptions`
3. Add logic in `execute()` method
4. Rebuild and publish

### Updating API Endpoints

If the API changes:
1. Update URL in `httpRequestWithAuthentication()` call
2. Update request/response handling as needed
3. Update credential test endpoint if changed
4. Increment version and republish

---

## Troubleshooting

### Node Not Appearing

- Ensure n8n was restarted after installation
- Check n8n logs: `docker logs <container_id>`
- Verify package installed: `npm list n8n-nodes-surpluslines`

### Credential Test Fails

- Verify API key is correct
- Check API key hasn't expired
- Ensure account has available balance or free queries
- Test directly: `curl -X POST https://api.surpluslinesapi.com/v1/calculate -H "X-API-Key: YOUR_KEY" -H "Content-Type: application/json" -d '{"state":"Texas","premium":100}'`

### "Invalid API Key" Error

- API key may be incorrect or expired
- Generate new key at https://app.surpluslinesapi.com
- Update credential in n8n

### Build Errors

```bash
# Clean and rebuild
rm -rf dist node_modules
pnpm install
pnpm build
```

### Common TypeScript Errors

- Missing types: `pnpm add -D @types/node`
- n8n-workflow issues: Ensure compatible version in package.json

---

## Support & Resources

| Resource | Link |
|----------|------|
| API Support | support@undtec.com |
| API Documentation | https://surpluslinesapi.com/docs/ |
| n8n Community Nodes Docs | https://docs.n8n.io/integrations/community-nodes/ |
| npm Package | https://www.npmjs.com/package/n8n-nodes-surpluslines |
| Free Calculator | https://sltax.undtec.com |

---

## Changelog

### v1.0.0 (December 10, 2025)

- Initial release
- Calculate Tax operation with all 53 U.S. jurisdictions
- Support for state-specific options (wet marine, fire insurance, etc.)
- API key credential with built-in testing
- Custom SVG icon
- Full promotional branding for Underwriters Technologies

---

**Surplus Lines Tax API** - A product of [Underwriters Technologies](https://undtec.com)
