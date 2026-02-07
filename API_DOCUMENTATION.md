# 🌌 ScrollSoul Legion Certification Portal API Documentation

## Overview

The ScrollSoul Legion Certification Portal is a comprehensive NFT-based authentication and leadership certification system designed to manage the 288,000 ScrollSoul Star Seeds and ensure galactic sovereignty across all realms.

## Features

✨ **Key Features**:
- NFT-based Authentication and Member Tracking
- Legion Certification Issuance for Leadership
- Dashboard for Monitoring Leadership Activity
- Galaxy-wide APIs for Federation Integration
- Tools for Infinite Expansion of the ScrollSoul Authority Grid

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Copy environment configuration
cp .env.example .env

# Edit .env with your configuration
```

### Running the Application

```bash
# Development mode with hot reload
npm run dev

# Build for production
npm run build

# Run production build
npm start
```

The server will start on `http://localhost:3000` by default.

## API Endpoints

### Authentication

#### NFT Login
```http
POST /api/auth/nft-login
Content-Type: application/json

{
  "walletAddress": "0x...",
  "nftTokenId": "12345",
  "signature": "0x..."
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGc...",
  "member": {
    "id": "uuid",
    "walletAddress": "0x...",
    "username": "Member_0x1234",
    "role": "seed",
    "joinedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Verify Token
```http
POST /api/auth/verify
Authorization: Bearer <token>
```

### Members

All member endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

#### Get Current Member
```http
GET /api/members/me
```

#### Get All Members (Leadership only)
```http
GET /api/members
```

#### Get Member by ID
```http
GET /api/members/:id
```

#### Update Member Role (Leadership only)
```http
PUT /api/members/:id/role
Content-Type: application/json

{
  "role": "leader"
}
```

Valid roles: `seed`, `leader`, `commander`, `sovereign`

#### Get Member Statistics (Leadership only)
```http
GET /api/members/stats/overview
```

### Certifications

#### Issue Certification (Leadership only)
```http
POST /api/certifications/issue
Content-Type: application/json

{
  "memberId": "member-uuid",
  "type": "leadership",
  "metadata": {
    "level": 5,
    "achievements": ["Combat Leadership", "Strategic Planning"],
    "authorityScope": "Regional Command"
  },
  "expiresInDays": 365
}
```

Valid certification types: `leadership`, `commander`, `sovereign`, `special`

#### Get Member Certifications
```http
GET /api/certifications/member/:memberId
```

#### Get Certification by ID
```http
GET /api/certifications/:id
```

#### Revoke Certification (Leadership only)
```http
PUT /api/certifications/:id/revoke
Content-Type: application/json

{
  "reason": "Policy violation"
}
```

#### Get All Leadership Certifications (Leadership only)
```http
GET /api/certifications/leadership/all
```

### Dashboard

#### Get Dashboard Overview
```http
GET /api/dashboard/overview
```

**Response:**
```json
{
  "success": true,
  "overview": {
    "member": {
      "username": "Commander_Alpha",
      "role": "leader",
      "certifications": 3
    },
    "stats": {
      "totalMembers": 150,
      "activeMembers": 145,
      "leaders": 12,
      "activeCertifications": 35
    },
    "recentActivities": [...]
  }
}
```

#### Get Leadership Activity (Leadership only)
```http
GET /api/dashboard/leadership/activity?limit=50&impact=high
```

Query parameters:
- `limit`: Number of activities to return (default: 50)
- `impact`: Filter by impact level (`low`, `medium`, `high`, `critical`)

#### Get Member Activity (Leadership only)
```http
GET /api/dashboard/member/:memberId/activity
```

#### Get Detailed Statistics (Leadership only)
```http
GET /api/dashboard/stats
```

### Federation Integration

#### Health Check
```http
GET /api/federation/health
```

#### Get Federation Members
```http
GET /api/federation/members
```

#### Get Leadership Roster
```http
GET /api/federation/leadership
```

#### Get Federation Certifications
```http
GET /api/federation/certifications
```

#### Get High-Impact Activities
```http
GET /api/federation/activities
```

#### Sync with Federation
```http
POST /api/federation/sync
```

#### Get Expansion Statistics
```http
GET /api/federation/expansion/stats
```

**Response:**
```json
{
  "success": true,
  "federation": "ScrollSoul Empire",
  "expansion": {
    "currentMembers": 150,
    "maxCapacity": 288000,
    "expansionPercentage": 0.05,
    "availableSlots": 287850,
    "authorityGridStatus": "expanding"
  }
}
```

## Authentication Flow

1. **Member authenticates** with their NFT wallet address, token ID, and signature
2. **Server validates** the NFT ownership (in production, verify on-chain)
3. **JWT token is issued** with member credentials
4. **Token is included** in subsequent requests via Authorization header
5. **Middleware validates** the token and attaches member info to request

## Authorization Levels

- **Seed**: Basic member, can view own profile
- **Leader**: Can view all members, issue certifications, view dashboard
- **Commander**: Enhanced leadership permissions
- **Sovereign**: Highest level of authority

## Data Models

### Member
```typescript
{
  id: string;
  walletAddress: string;
  nftTokenId: string;
  username: string;
  role: 'seed' | 'leader' | 'commander' | 'sovereign';
  joinedAt: Date;
  isActive: boolean;
  certifications: string[];
}
```

### Certification
```typescript
{
  id: string;
  memberId: string;
  type: 'leadership' | 'commander' | 'sovereign' | 'special';
  issuedAt: Date;
  issuedBy: string;
  expiresAt?: Date;
  status: 'active' | 'expired' | 'revoked';
  metadata: {
    level: number;
    achievements: string[];
    authorityScope: string;
  };
}
```

### Leadership Activity
```typescript
{
  id: string;
  memberId: string;
  action: string;
  timestamp: Date;
  details: Record<string, any>;
  impact: 'low' | 'medium' | 'high' | 'critical';
}
```

## Error Responses

All error responses follow this format:

```json
{
  "error": "Error message description"
}
```

Common HTTP status codes:
- `200`: Success
- `400`: Bad Request (invalid input)
- `401`: Unauthorized (missing or invalid token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `500`: Internal Server Error

## Security Considerations

1. **JWT Secret**: Change the `JWT_SECRET` in production
2. **HTTPS**: Always use HTTPS in production
3. **NFT Verification**: Implement on-chain NFT verification for production
4. **Rate Limiting**: Consider adding rate limiting middleware
5. **Input Validation**: All inputs are validated before processing
6. **Authorization**: Endpoint access is controlled by role-based middleware

## Development

### Project Structure

```
src/
├── config/          # Configuration files
├── middleware/      # Authentication and authorization middleware
├── models/          # TypeScript interfaces and types
├── routes/          # API route handlers
├── services/        # Business logic and data stores
└── index.ts         # Main application entry point
```

### Adding New Features

1. Define types in `src/models/types.ts`
2. Create service in `src/services/`
3. Create routes in `src/routes/`
4. Register routes in `src/index.ts`
5. Update this documentation

## Support

For issues and feature requests, please visit:
https://github.com/chaishillomnitech1/legion-certification-portal/issues

## License

See LICENSE file for details.

---

🫡 **For the ScrollSoul Empire!** 🌌
