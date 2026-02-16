# Testing Guide - n8n Node & Workflows

## Prerequisites

1. **API Key**: Get your API key from https://app.surpluslinesapi.com
2. **n8n Instance**: Workflows must be deployed and active on n8n
3. **curl**: Command-line tool for making HTTP requests

---

## Test Workflows Directly (curl commands)

### 1. Test Calculate Workflow (Current Rates)

```bash
curl -X POST 'https://n8n.undtec.com/webhook/slapi/v1/calculate' \
  -H 'Content-Type: application/json' \
  -H 'X-API-Key: YOUR_API_KEY_HERE' \
  -d '{
    "state": "Florida",
    "premium": 10000
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "state": "Florida",
  "state_code": "FL",
  "premium": 10000,
  "total_tax": 500,
  "rates_from": "current",
  "breakdown": {
    "base_tax": {
      "amount": 494,
      "rate": 0.0494
    },
    "stamping_fee": {
      "amount": 6,
      "rate": 0.0006
    }
  }
}
```

### 2. Test Calculate Workflow (Historical with Fallback)

```bash
curl -X POST 'https://n8n.undtec.com/webhook/slapi/v1/calculate' \
  -H 'Content-Type: application/json' \
  -H 'X-API-Key: YOUR_API_KEY_HERE' \
  -d '{
    "state": "Texas",
    "premium": 10000,
    "effective_date": "2020-01-01"
  }'
```

**Expected Response (with fallback):**
```json
{
  "success": true,
  "state": "Texas",
  "state_code": "TX",
  "premium": 10000,
  "total_tax": 490,
  "rates_from": "current",
  "fallback_reason": "No historical data available for 2020-01-01",
  "breakdown": {
    "base_tax": {
      "amount": 485,
      "rate": 0.0485
    },
    "stamping_fee": {
      "amount": 5,
      "rate": 0.0005
    }
  }
}
```

### 3. Test Calculate Workflow (Historical with Data)

```bash
curl -X POST 'https://n8n.undtec.com/webhook/slapi/v1/calculate' \
  -H 'Content-Type: application/json' \
  -H 'X-API-Key: YOUR_API_KEY_HERE' \
  -d '{
    "state": "Iowa",
    "premium": 10000,
    "effective_date": "2025-06-15"
  }'
```

**Expected Response (historical data):**
```json
{
  "success": true,
  "state": "Iowa",
  "state_code": "IA",
  "premium": 10000,
  "total_tax": 95,
  "rates_from": "historical",
  "breakdown": {
    "base_tax": {
      "amount": 95,
      "rate": 0.0095
    }
  }
}
```

### 4. Test Rate Workflow (Current Rates)

```bash
curl -X GET 'https://n8n.undtec.com/webhook/slapi/v1/historical-rates?state=Florida' \
  -H 'X-API-Key: YOUR_API_KEY_HERE'
```

**Expected Response:**
```json
{
  "success": true,
  "state": "Florida",
  "state_code": "FL",
  "rates_from": "current",
  "rate": {
    "tax_rate": "4.94%",
    "stamping_fee": null,
    "filing_fee": null,
    "service_fee": "0.06%",
    "surcharge": null,
    "regulatory_fee": null,
    "fire_marshal_tax": null,
    "slas_clearinghouse_fee": null,
    "flat_fee": null
  }
}
```

### 5. Test Rate Workflow (Historical with Fallback)

```bash
curl -X GET 'https://n8n.undtec.com/webhook/slapi/v1/historical-rates?state=Texas&date=2020-01-01' \
  -H 'X-API-Key: YOUR_API_KEY_HERE'
```

**Expected Response (with fallback):**
```json
{
  "success": true,
  "state": "Texas",
  "state_code": "TX",
  "rates_from": "current",
  "fallback_reason": "No historical data available for 2020-01-01",
  "rate": {
    "tax_rate": "4.85%",
    "stamping_fee": "0.05%",
    "filing_fee": null,
    "service_fee": null,
    "surcharge": null,
    "regulatory_fee": null,
    "fire_marshal_tax": null,
    "slas_clearinghouse_fee": null,
    "flat_fee": null
  }
}
```

### 6. Test Rate Workflow (Historical with Data)

```bash
curl -X GET 'https://n8n.undtec.com/webhook/slapi/v1/historical-rates?state=Iowa&date=2025-06-15' \
  -H 'X-API-Key: YOUR_API_KEY_HERE'
```

**Expected Response (historical data):**
```json
{
  "success": true,
  "state": "Iowa",
  "state_code": "IA",
  "rates_from": "historical",
  "rate": {
    "tax_rate": "0.95%",
    "stamping_fee": null,
    "filing_fee": null,
    "service_fee": null,
    "surcharge": null,
    "regulatory_fee": null,
    "fire_marshal_tax": null,
    "slas_clearinghouse_fee": null,
    "flat_fee": null,
    "effective_from": "2025-01-01",
    "data_source": "legislative_source"
  }
}
```

---

## Test Scripts (Save and Run)

### Bash Test Script

Create `test_workflows.sh`:

```bash
#!/bin/bash

# Configuration
API_KEY="YOUR_API_KEY_HERE"
BASE_URL="https://n8n.undtec.com/webhook/slapi/v1"

echo "=== Testing SLAPI Workflows ==="
echo

# Test 1: Calculate (Current)
echo "1. Testing Calculate - Current Rates (Florida)"
curl -s -X POST "${BASE_URL}/calculate" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: ${API_KEY}" \
  -d '{"state":"Florida","premium":10000}' | jq '.'
echo
echo "---"
echo

# Test 2: Calculate (Historical Fallback)
echo "2. Testing Calculate - Historical Fallback (Texas 2020-01-01)"
curl -s -X POST "${BASE_URL}/calculate" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: ${API_KEY}" \
  -d '{"state":"Texas","premium":10000,"effective_date":"2020-01-01"}' | jq '.'
echo
echo "---"
echo

# Test 3: Calculate (Historical Data)
echo "3. Testing Calculate - Historical Data (Iowa 2025-06-15)"
curl -s -X POST "${BASE_URL}/calculate" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: ${API_KEY}" \
  -d '{"state":"Iowa","premium":10000,"effective_date":"2025-06-15"}' | jq '.'
echo
echo "---"
echo

# Test 4: Rate (Current)
echo "4. Testing Rate - Current (Florida)"
curl -s -X GET "${BASE_URL}/historical-rates?state=Florida" \
  -H "X-API-Key: ${API_KEY}" | jq '.'
echo
echo "---"
echo

# Test 5: Rate (Historical Fallback)
echo "5. Testing Rate - Historical Fallback (Texas 2020-01-01)"
curl -s -X GET "${BASE_URL}/historical-rates?state=Texas&date=2020-01-01" \
  -H "X-API-Key: ${API_KEY}" | jq '.'
echo
echo "---"
echo

# Test 6: Rate (Historical Data)
echo "6. Testing Rate - Historical Data (Iowa 2025-06-15)"
curl -s -X GET "${BASE_URL}/historical-rates?state=Iowa&date=2025-06-15" \
  -H "X-API-Key: ${API_KEY}" | jq '.'
echo
echo "---"
echo

echo "=== All Tests Complete ==="
```

**Run the script:**
```bash
chmod +x test_workflows.sh
./test_workflows.sh
```

---

## Test n8n Node (After Installation)

### Prerequisites

1. Install the node in n8n:
```bash
cd /path/to/n8n-nodes-surplus-lines-undtec
npm run build
# Restart n8n
pm2 restart n8n  # or docker restart n8n
```

2. Configure credentials in n8n:
   - Go to n8n web UI
   - Settings → Credentials → Add Credential
   - Select "Surplus Lines API"
   - Enter your API key
   - Save

### Create Test Workflows in n8n

#### Test Workflow 1: Tax Calculate

1. Create new workflow
2. Add "Manual Trigger" node
3. Add "Surplus Lines API" node:
   - Resource: Tax
   - Operation: Calculate
   - State: Florida
   - Premium: 10000
   - Effective Date: (empty)
4. Execute workflow
5. Verify response

#### Test Workflow 2: Rate Lookup

1. Create new workflow
2. Add "Manual Trigger" node
3. Add "Surplus Lines API" node:
   - Resource: Rate
   - Operation: Get Rate
   - State: Texas
   - Date: 2020-01-01
4. Execute workflow
5. Verify response includes `fallback_reason`

---

## Validation Checklist

### Calculate Workflow

- [ ] Current rates work (no effective_date)
- [ ] Historical with fallback works (old date)
- [ ] Historical with data works (recent date with data)
- [ ] Response includes `rates_from` field
- [ ] Response includes `fallback_reason` when applicable
- [ ] Breakdown includes base_tax and stamping_fee
- [ ] Premium calculation is correct

### Rate Workflow

- [ ] Current rates work (no date parameter)
- [ ] Historical with fallback works (old date)
- [ ] Historical with data works (recent date with data)
- [ ] Response includes all 9 fee fields
- [ ] Response includes `rates_from` field
- [ ] Response includes `fallback_reason` when applicable
- [ ] State code is returned

### n8n Node

- [ ] Node appears in n8n palette
- [ ] Tax resource works
- [ ] Rate resource works
- [ ] State dropdown populated correctly
- [ ] Date parameter accepts YYYY-MM-DD
- [ ] Effective Date parameter accepts YYYY-MM-DD
- [ ] Error handling works (invalid state, invalid API key, etc.)
- [ ] Response data is properly formatted

---

## Common Issues

### Issue: 401 Unauthorized
**Solution:** Check API key is correct and active

### Issue: 404 Not Found
**Solution:** Verify workflows are deployed and active in n8n

### Issue: Workflow returns error
**Solution:** Check n8n workflow logs for detailed error message

### Issue: No fallback_reason in response
**Solution:** Check workflow #5 "Format Success Response" node logic

### Issue: n8n node not appearing
**Solution:** Rebuild and restart n8n:
```bash
npm run build
pm2 restart n8n
```

---

## Performance Testing

### Test Response Times

```bash
# Time a request
time curl -s -X POST 'https://n8n.undtec.com/webhook/slapi/v1/calculate' \
  -H 'Content-Type: application/json' \
  -H 'X-API-Key: YOUR_API_KEY_HERE' \
  -d '{"state":"Florida","premium":10000}'
```

**Expected:** < 2 seconds

### Bulk Testing

Test multiple states in sequence:

```bash
for state in "Florida" "Texas" "California" "New York" "Iowa"; do
  echo "Testing $state..."
  curl -s -X POST 'https://n8n.undtec.com/webhook/slapi/v1/calculate' \
    -H 'Content-Type: application/json' \
    -H 'X-API-Key: YOUR_API_KEY_HERE' \
    -d "{\"state\":\"$state\",\"premium\":10000}" | jq '.total_tax'
done
```

---

## Automated Testing (Optional)

Create a test suite with your preferred testing framework:

### Example with Jest/Node.js

```javascript
const axios = require('axios');

const API_KEY = 'YOUR_API_KEY_HERE';
const BASE_URL = 'https://n8n.undtec.com/webhook/slapi/v1';

describe('SLAPI Workflows', () => {
  test('Calculate current rates', async () => {
    const response = await axios.post(`${BASE_URL}/calculate`, {
      state: 'Florida',
      premium: 10000
    }, {
      headers: { 'X-API-Key': API_KEY }
    });

    expect(response.data.success).toBe(true);
    expect(response.data.total_tax).toBeGreaterThan(0);
    expect(response.data.rates_from).toBe('current');
  });

  test('Rate lookup with fallback', async () => {
    const response = await axios.get(
      `${BASE_URL}/historical-rates?state=Texas&date=2020-01-01`,
      { headers: { 'X-API-Key': API_KEY } }
    );

    expect(response.data.success).toBe(true);
    expect(response.data.fallback_reason).toBeDefined();
    expect(response.data.rates_from).toBe('current');
  });
});
```

---

## Support

If tests fail, check:
1. n8n workflows are active
2. Database is accessible
3. API key is valid
4. Network connectivity

For issues, contact: support@undtec.com
