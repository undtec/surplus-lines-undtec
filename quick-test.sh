#!/bin/bash

# Quick Test Script for SLAPI Workflows
# Usage: ./quick-test.sh YOUR_API_KEY

if [ -z "$1" ]; then
  echo "Usage: ./quick-test.sh YOUR_API_KEY"
  echo "Example: ./quick-test.sh slapi_xxxxxxxxxxxxx"
  exit 1
fi

API_KEY="$1"
BASE_URL="https://n8n.undtec.com/webhook/slapi/v1"

echo "======================================"
echo "   SLAPI Workflow Quick Test"
echo "======================================"
echo

# Test 1: Calculate Current
echo "Test 1: Calculate Tax - Current Rates"
echo "---------------------------------------"
curl -s -X POST "${BASE_URL}/calculate" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: ${API_KEY}" \
  -d '{"state":"Florida","premium":10000}' | jq -r '
  if .success then
    "✅ SUCCESS\nState: \(.state) (\(.state_code))\nPremium: $\(.premium)\nTotal Tax: $\(.total_tax)\nRates From: \(.rates_from)"
  else
    "❌ FAILED: \(.error // .message)"
  end'
echo
echo

# Test 2: Calculate Historical Fallback
echo "Test 2: Calculate Tax - Fallback"
echo "---------------------------------------"
curl -s -X POST "${BASE_URL}/calculate" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: ${API_KEY}" \
  -d '{"state":"Texas","premium":10000,"effective_date":"2020-01-01"}' | jq -r '
  if .success then
    "✅ SUCCESS\nState: \(.state) (\(.state_code))\nPremium: $\(.premium)\nTotal Tax: $\(.total_tax)\nRates From: \(.rates_from)\nFallback: \(.fallback_reason // "None")"
  else
    "❌ FAILED: \(.error // .message)"
  end'
echo
echo

# Test 3: Get Rate Current
echo "Test 3: Get Rate - Current"
echo "---------------------------------------"
curl -s -X GET "${BASE_URL}/historical-rates?state=Florida" \
  -H "X-API-Key: ${API_KEY}" | jq -r '
  if .success then
    "✅ SUCCESS\nState: \(.state) (\(.state_code))\nTax Rate: \(.rate.tax_rate)\nService Fee: \(.rate.service_fee // "None")\nRates From: \(.rates_from)"
  else
    "❌ FAILED: \(.error // .message)"
  end'
echo
echo

# Test 4: Get Rate Historical Fallback
echo "Test 4: Get Rate - Fallback"
echo "---------------------------------------"
curl -s -X GET "${BASE_URL}/historical-rates?state=Texas&date=2020-01-01" \
  -H "X-API-Key: ${API_KEY}" | jq -r '
  if .success then
    "✅ SUCCESS\nState: \(.state) (\(.state_code))\nTax Rate: \(.rate.tax_rate)\nStamping Fee: \(.rate.stamping_fee // "None")\nRates From: \(.rates_from)\nFallback: \(.fallback_reason // "None")"
  else
    "❌ FAILED: \(.error // .message)"
  end'
echo
echo

echo "======================================"
echo "   All Tests Complete!"
echo "======================================"
