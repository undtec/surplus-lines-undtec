# Example Workflows for n8n-nodes-surplus-lines-undtec

This folder contains example workflows demonstrating how to use the Surplus Lines API n8n node.

## Prerequisites

1. **Install the node package:**
   ```bash
   npm install n8n-nodes-surplus-lines-undtec
   ```

2. **Get an API key:**
   - Sign up at https://app.surpluslinesapi.com
   - Navigate to API Keys section
   - Generate a new API key

3. **Add credentials in n8n:**
   - Go to Settings → Credentials
   - Click "Add Credential"
   - Select "Surplus Lines API"
   - Paste your API key
   - Save as "Surplus Lines API"

## Available Example Workflows

### 1. Calculate Tax Workflow
**File:** `1-calculate-tax-workflow.json`

**Description:** Demonstrates how to calculate surplus lines tax for a specific state and premium amount.

**What it does:**
1. Triggers manually
2. Calls Calculate Tax operation for Texas with $10,000 premium
3. Formats the results for easy reading

**Expected Output:**
```json
{
  "state": "Texas",
  "premium": 10000,
  "sl_tax": 485.00,
  "tax_rate": 0.0485,
  "stamping_fee": 18.00,
  "stamping_fee_rate": 0.0018,
  "total_tax": 503.00,
  "total_due": 10503.00,
  "message": "Calculated surplus lines tax for Texas: $503.00"
}
```

---

### 2. Get Rate Workflow
**File:** `2-get-rate-workflow.json`

**Description:** Demonstrates how to retrieve current tax rates for a specific state.

**What it does:**
1. Triggers manually
2. Calls Get Rate operation for Texas (current rates)
3. Formats the rate information with percentages

**Expected Output:**
```json
{
  "state": "Texas",
  "query_date": "2026-02-12",
  "tax_rate": 0.0485,
  "tax_rate_percentage": "4.85%",
  "stamping_fee": 0.0018,
  "stamping_fee_percentage": "0.180%",
  "effective_from": "2020-01-01",
  "effective_to": "Current",
  "legislative_source": "Texas Insurance Code § 225.006",
  "fallback_used": false,
  "message": "Retrieved current rate for Texas"
}
```

---

### 3. Historical Rate Workflow
**File:** `3-historical-rate-workflow.json`

**Description:** Demonstrates how to retrieve historical tax rates with automatic fallback.

**What it does:**
1. Triggers manually
2. Calls Get Rate operation for Iowa on a historical date (2020-01-01)
3. Checks if fallback was used
4. Formats the historical rate information

**Expected Output (if historical data available):**
```json
{
  "state": "Iowa",
  "query_date": "2020-01-01",
  "tax_rate": 0.01,
  "tax_rate_percentage": "1.00%",
  "stamping_fee": 0.002,
  "stamping_fee_percentage": "0.200%",
  "effective_from": "2019-01-01",
  "effective_to": "2023-12-31",
  "legislative_source": "Iowa Code § 515.138",
  "confidence": "high",
  "fallback_status": "✅ Historical Data Available",
  "fallback_message": "N/A",
  "message": "Successfully retrieved historical rate for Iowa on 2020-01-01"
}
```

**Expected Output (if fallback used):**
```json
{
  "state": "Iowa",
  "query_date": "2010-01-01",
  "tax_rate": 0.01,
  "tax_rate_percentage": "1.00%",
  "fallback_status": "⚠️ FALLBACK USED",
  "fallback_message": "Historical data not available for this date. Returning current rate.",
  "message": "Warning: Historical data unavailable for Iowa on 2010-01-01. Current rate returned instead."
}
```

---

## How to Import Workflows

### Method 1: Import from File

1. Open n8n
2. Click "Workflows" in the left sidebar
3. Click "Import from File"
4. Select one of the JSON files from this folder
5. Click "Import"

### Method 2: Import from URL (if hosted)

1. Open n8n
2. Click "Workflows" in the left sidebar
3. Click "Import from URL"
4. Paste the workflow URL
5. Click "Import"

### Method 3: Copy-Paste JSON

1. Open the JSON file in a text editor
2. Copy the entire JSON content
3. Open n8n
4. Click "Workflows" → "Import from URL"
5. Click "Import from Text/JSON"
6. Paste the JSON content
7. Click "Import"

---

## Customizing the Workflows

### Change the State

Edit the "Calculate Tax" or "Get Rate" node:
```javascript
"state": "California"  // Change from "Texas" to any U.S. state
```

### Change the Premium Amount

Edit the "Calculate Tax" node:
```javascript
"premium": 25000  // Change from 10000 to any amount
```

### Add Optional Parameters

For Calculate Tax, add additional fields:
```javascript
"additionalFields": {
  "wetMarine": true,
  "fireInsurance": false,
  "electronicFiling": true,
  "fireMarshalRate": 0.005,
  "year": 2026
}
```

### Change Historical Date

Edit the "Get Historical Rate" node:
```javascript
"additionalFields": {
  "date": "2015-06-15"  // Change to any date in YYYY-MM-DD format
}
```

---

## Testing the Workflows

1. **Import the workflow** using one of the methods above
2. **Update credentials** - Make sure the "Surplus Lines API" credential is configured
3. **Click "Execute Workflow"** button (or press Ctrl+Enter)
4. **View results** in the output panel

---

## Troubleshooting

### Error: "Credentials not found"
**Solution:** Create Surplus Lines API credentials in n8n Settings → Credentials

### Error: "401 Unauthorized"
**Solution:** Check that your API key is correct and active at https://app.surpluslinesapi.com

### Error: "Node type not found"
**Solution:** Make sure n8n-nodes-surplus-lines-undtec is installed:
```bash
npm install n8n-nodes-surplus-lines-undtec
pm2 restart n8n  # or restart your n8n instance
```

### Workflow doesn't execute
**Solution:**
1. Check that the manual trigger is connected
2. Verify credentials are saved
3. Check n8n logs for errors

---

## Advanced Examples

### Batch Calculate Multiple States

Create a workflow that:
1. Starts with a "Set" node containing array of states
2. Uses "Split in Batches" node
3. Calls Calculate Tax for each state
4. Aggregates results

### Email Rate Alerts

Create a workflow that:
1. Runs on a schedule (daily)
2. Gets rates for specific states
3. Compares with previous rates
4. Sends email if rates changed

### Webhook Integration

Create a workflow that:
1. Accepts webhook POST requests
2. Extracts state and premium from request
3. Calculates tax
4. Returns formatted response

---

## Resources

- **npm Package:** https://www.npmjs.com/package/n8n-nodes-surplus-lines-undtec
- **API Documentation:** https://surpluslinesapi.com/docs/
- **Free Calculator:** https://sltax.undtec.com/
- **Support:** support@undtec.com

---

## Contributing

Have an interesting workflow example? Feel free to:
1. Create a new workflow JSON file
2. Add documentation
3. Submit via email or GitHub

---

**Created for n8n-nodes-surplus-lines-undtec v1.2.2+**
