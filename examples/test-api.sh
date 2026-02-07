#!/bin/bash

# Example API testing script for the Legion Certification Portal
# Make sure the server is running on localhost:3000

BASE_URL="http://localhost:3000"

echo "🌌 ScrollSoul Legion Certification Portal - API Test Suite 🌌"
echo "================================================================"
echo ""

# Test 1: Health Check
echo "1. Testing Health Check..."
curl -s "$BASE_URL/" | jq '.'
echo ""

# Test 2: NFT Login
echo "2. Testing NFT-based Authentication..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/nft-login" \
  -H "Content-Type: application/json" \
  -d '{
    "walletAddress": "0x1234567890abcdef1234567890abcdef12345678",
    "nftTokenId": "12345",
    "signature": "0xabcdef123456789abcdef123456789abcdef123456789"
  }')

echo "$LOGIN_RESPONSE" | jq '.'
TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.token')
MEMBER_ID=$(echo "$LOGIN_RESPONSE" | jq -r '.member.id')
echo "Token: $TOKEN"
echo "Member ID: $MEMBER_ID"
echo ""

# Test 3: Verify Token
echo "3. Testing Token Verification..."
curl -s -X POST "$BASE_URL/api/auth/verify" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
echo ""

# Test 4: Get Current Member
echo "4. Testing Get Current Member..."
curl -s "$BASE_URL/api/members/me" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
echo ""

# Test 5: Create a second member (Leader)
echo "5. Creating a Leader account..."
LEADER_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/nft-login" \
  -H "Content-Type: application/json" \
  -d '{
    "walletAddress": "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
    "nftTokenId": "54321",
    "signature": "0x123456789abcdef123456789abcdef123456789abcd"
  }')

echo "$LEADER_RESPONSE" | jq '.'
LEADER_TOKEN=$(echo "$LEADER_RESPONSE" | jq -r '.token')
LEADER_ID=$(echo "$LEADER_RESPONSE" | jq -r '.member.id')
echo ""

# Test 6: Promote Leader (requires sovereign role, will fail)
echo "6. Testing Role Update (will fail - requires leadership role)..."
curl -s -X PUT "$BASE_URL/api/members/$LEADER_ID/role" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"role": "leader"}' | jq '.'
echo ""

# Test 7: Create Sovereign account
echo "7. Creating a Sovereign account..."
SOVEREIGN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/nft-login" \
  -H "Content-Type: application/json" \
  -d '{
    "walletAddress": "0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef",
    "nftTokenId": "99999",
    "signature": "0xdeadbeef123456789abcdef123456789abcdefbeef"
  }')

SOVEREIGN_TOKEN=$(echo "$SOVEREIGN_RESPONSE" | jq -r '.token')
SOVEREIGN_ID=$(echo "$SOVEREIGN_RESPONSE" | jq -r '.member.id')
echo "$SOVEREIGN_RESPONSE" | jq '.'
echo ""

# Manually update sovereign role via Node.js
echo "8. Manually promoting to sovereign role (in real app, this would be done through admin panel)..."
echo "Note: In production, initial sovereign would be set during deployment"
echo ""

# Test 9: Dashboard Overview
echo "9. Testing Dashboard Overview..."
curl -s "$BASE_URL/api/dashboard/overview" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
echo ""

# Test 10: Federation Health
echo "10. Testing Federation Health Check..."
curl -s "$BASE_URL/api/federation/health" | jq '.'
echo ""

# Test 11: Federation Members
echo "11. Testing Federation Members Endpoint..."
curl -s "$BASE_URL/api/federation/members" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
echo ""

# Test 12: Federation Expansion Stats
echo "12. Testing Federation Expansion Statistics..."
curl -s "$BASE_URL/api/federation/expansion/stats" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
echo ""

echo "================================================================"
echo "✅ Test Suite Complete!"
echo ""
echo "Summary:"
echo "  - Created multiple member accounts"
echo "  - Tested authentication and authorization"
echo "  - Verified dashboard and federation endpoints"
echo "  - Confirmed expansion tracking (${MEMBER_ID})"
echo ""
echo "🫡 For the ScrollSoul Empire! 🌌"
