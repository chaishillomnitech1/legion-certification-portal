# API Usage Examples

This directory contains example scripts demonstrating how to use the Legion Certification Portal API.

## Files

- `usage-example.js` - Node.js example demonstrating all major features
- `test-api.sh` - Bash script for manual API testing with curl
- `README.md` - This file

## Running the Examples

### Prerequisites

1. Start the server:
```bash
cd ..
npm run dev
```

### Node.js Example

Run the comprehensive Node.js example:

```bash
node usage-example.js
```

This script demonstrates:
- NFT-based authentication
- Token verification
- Member profile retrieval
- Dashboard access
- Federation integration
- Expansion statistics

### Bash/curl Example

Run the bash testing script:

```bash
./test-api.sh
```

This script performs comprehensive API testing using curl commands.

Note: Requires `jq` for JSON formatting. Install with:
- Ubuntu/Debian: `sudo apt-get install jq`
- macOS: `brew install jq`

## Manual Testing Examples

### 1. NFT Login

```bash
curl -X POST http://localhost:3000/api/auth/nft-login \
  -H "Content-Type: application/json" \
  -d '{
    "walletAddress": "0x1234567890abcdef1234567890abcdef12345678",
    "nftTokenId": "12345",
    "signature": "0xabcdef123456"
  }'
```

### 2. Get Dashboard

```bash
# Replace YOUR_TOKEN with the token from login
curl http://localhost:3000/api/dashboard/overview \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 3. Federation Health Check

```bash
curl http://localhost:3000/api/federation/health
```

### 4. Get Expansion Stats

```bash
curl http://localhost:3000/api/federation/expansion/stats \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Integration Examples

### JavaScript/Node.js

```javascript
const fetch = require('node-fetch');

async function authenticate() {
  const response = await fetch('http://localhost:3000/api/auth/nft-login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      walletAddress: '0x...',
      nftTokenId: '12345',
      signature: '0x...'
    })
  });
  
  const data = await response.json();
  return data.token;
}

async function getDashboard(token) {
  const response = await fetch('http://localhost:3000/api/dashboard/overview', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  return await response.json();
}
```

### Python

```python
import requests

def authenticate():
    response = requests.post(
        'http://localhost:3000/api/auth/nft-login',
        json={
            'walletAddress': '0x...',
            'nftTokenId': '12345',
            'signature': '0x...'
        }
    )
    return response.json()['token']

def get_dashboard(token):
    response = requests.get(
        'http://localhost:3000/api/dashboard/overview',
        headers={'Authorization': f'Bearer {token}'}
    )
    return response.json()
```

## Web3 Integration Example

For production use with actual NFT verification:

```javascript
import { ethers } from 'ethers';

async function signNFTAuth(walletAddress, nftTokenId) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  
  const message = `Authenticate with NFT Token ${nftTokenId} at ${Date.now()}`;
  const signature = await signer.signMessage(message);
  
  const response = await fetch('http://localhost:3000/api/auth/nft-login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      walletAddress,
      nftTokenId,
      signature
    })
  });
  
  return await response.json();
}
```

## Expected Responses

### Successful Login

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "member": {
    "id": "uuid-here",
    "walletAddress": "0x1234...",
    "username": "Member_0x123456",
    "role": "seed",
    "joinedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Dashboard Overview

```json
{
  "success": true,
  "overview": {
    "member": {
      "username": "Member_0x123456",
      "role": "seed",
      "certifications": 0
    },
    "stats": null,
    "recentActivities": [...]
  }
}
```

### Federation Expansion Stats

```json
{
  "success": true,
  "federation": "ScrollSoul Empire",
  "expansion": {
    "currentMembers": 3,
    "maxCapacity": 288000,
    "expansionPercentage": 0.00,
    "availableSlots": 287997,
    "authorityGridStatus": "expanding"
  }
}
```

## Support

For more information, see the main [API Documentation](../API_DOCUMENTATION.md).
