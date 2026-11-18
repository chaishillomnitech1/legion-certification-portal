# 🫡 ScrollSoul Legion Certification Portal 🌌

The ScrollSoul Legion Certification Portal is the backbone of governance and authentication for the ScrollSoul Empire. This portal ensures that all members of the **288,000 ScrollSoul Star Seeds** are verified and aligned with Galactic Federation sovereignty principles.

## ✨ Key Features

- **NFT-based Authentication and Member Tracking** - Secure authentication using NFT wallet verification
- **Legion Certification Issuance for Leadership** - Issue and manage leadership certifications with role-based permissions
- **Dashboard for Monitoring Leadership Activity** - Real-time monitoring of leadership actions and member activities
- **Galaxy-wide APIs for Federation Integration** - RESTful APIs for seamless integration with the Galactic Federation
- **Tools for Infinite Expansion of the ScrollSoul Authority Grid** - Scalable architecture supporting up to 288,000 members

## 🚀 Quick Start

### Prerequisites

- Node.js 16 or higher
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/chaishillomnitech1/legion-certification-portal.git
cd legion-certification-portal

# Install dependencies
npm install

# Copy environment configuration
cp .env.example .env

# Configure your environment variables in .env file
```

### Running the Application

```bash
# Development mode with hot reload
npm run dev

# Build for production
npm run build

# Run production server
npm start
```

The server will be available at `http://localhost:3000`

## 📚 Documentation

For detailed API documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

### Quick API Overview

- **Authentication**: `/api/auth` - NFT-based login and token verification
- **Members**: `/api/members` - Member management and tracking
- **Certifications**: `/api/certifications` - Issue and manage leadership certifications
- **Dashboard**: `/api/dashboard` - Leadership activity monitoring and statistics
- **Federation**: `/api/federation` - Galaxy-wide integration endpoints

## 🔐 Security

The portal implements multiple security layers:

- **Rate Limiting**: Protection against brute force and DoS attacks
  - Auth endpoints: 10 requests per 15 minutes
  - General API: 100 requests per 15 minutes
  - Sensitive operations: 20 requests per 15 minutes
- **JWT-based Authentication**: Secure token-based authentication with NFT verification
- **Role-based Access Control**: Four authorization levels (Seed, Leader, Commander, Sovereign)
- **Activity Logging**: Comprehensive audit trail for all critical actions
- **Input Validation**: Type-safe validation with TypeScript
- **Secure Token Management**: Configurable JWT secrets with expiration

**Important**: 
- Change the `JWT_SECRET` in your `.env` file before deploying to production!
- See [SECURITY.md](./SECURITY.md) for detailed security information and production deployment recommendations

## 🏗️ Architecture

```
legion-certification-portal/
├── src/
│   ├── config/           # Application configuration
│   ├── middleware/       # Authentication & authorization
│   ├── models/          # TypeScript interfaces
│   ├── routes/          # API endpoints
│   ├── services/        # Business logic
│   └── index.ts         # Application entry point
├── dist/                # Compiled JavaScript (generated)
├── .env.example         # Environment variables template
├── tsconfig.json        # TypeScript configuration
└── package.json         # Dependencies and scripts
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/nft-login` - Authenticate with NFT wallet
- `POST /api/auth/verify` - Verify authentication token

### Members
- `GET /api/members/me` - Get current member profile
- `GET /api/members` - List all members (Leadership only)
- `GET /api/members/:id` - Get member details
- `PUT /api/members/:id/role` - Update member role (Leadership only)
- `GET /api/members/stats/overview` - Get member statistics

### Certifications
- `POST /api/certifications/issue` - Issue new certification (Leadership only)
- `GET /api/certifications/member/:memberId` - Get member certifications
- `GET /api/certifications/:id` - Get certification details
- `PUT /api/certifications/:id/revoke` - Revoke certification (Leadership only)

### Dashboard
- `GET /api/dashboard/overview` - Get dashboard overview
- `GET /api/dashboard/leadership/activity` - Get leadership activities
- `GET /api/dashboard/stats` - Get detailed statistics

### Federation Integration
- `GET /api/federation/health` - Health check
- `GET /api/federation/members` - Get all members for federation
- `GET /api/federation/leadership` - Get leadership roster
- `GET /api/federation/expansion/stats` - Get expansion statistics
- `POST /api/federation/sync` - Sync with Galactic Federation

## 🎭 Member Roles

1. **Seed** - Basic member with limited permissions
2. **Leader** - Can manage members and issue certifications
3. **Commander** - Enhanced leadership with broader authority
4. **Sovereign** - Highest level of authority with full access

## 🧪 Example Usage

### Authenticate with NFT

```bash
curl -X POST http://localhost:3000/api/auth/nft-login \
  -H "Content-Type: application/json" \
  -d '{
    "walletAddress": "0x1234567890abcdef",
    "nftTokenId": "12345",
    "signature": "0xabcdef123456"
  }'
```

### Get Dashboard Overview

```bash
curl -X GET http://localhost:3000/api/dashboard/overview \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Issue Leadership Certification

```bash
curl -X POST http://localhost:3000/api/certifications/issue \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "memberId": "member-uuid",
    "type": "leadership",
    "metadata": {
      "level": 5,
      "achievements": ["Strategic Leadership"],
      "authorityScope": "Regional Command"
    },
    "expiresInDays": 365
  }'
```

## 🛠️ Development

### Building the Project

```bash
npm run build
```

This compiles TypeScript to JavaScript in the `dist/` directory.

### Development Mode

```bash
npm run dev
```

Runs the server with hot reload using nodemon and ts-node.

### Environment Variables

See `.env.example` for required environment variables:

- `PORT` - Server port (default: 3000)
- `JWT_SECRET` - Secret key for JWT tokens
- `NFT_CONTRACT_ADDRESS` - NFT smart contract address
- `BLOCKCHAIN_NETWORK` - Blockchain network (e.g., ethereum)
- `FEDERATION_API_URL` - Galactic Federation API endpoint

## 📊 Current Status

The portal currently supports:
- ✅ NFT-based authentication
- ✅ Member tracking and management
- ✅ Leadership certification issuance
- ✅ Activity monitoring dashboard
- ✅ Federation integration APIs
- ✅ Scalable architecture for 288,000 members

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## 📄 License

See [LICENSE](./LICENSE) file for details.

## 🌟 System Validation

This system validates the divine leadership of the ScrollSoul and ensures justice and sovereignty across all realms.

---

**🫡 For the ScrollSoul Empire! May the Authority Grid expand infinitely! 🌌**


---

## 🔗 Every door, one click

Every site and artifact we built, attached to every repo. Only live destinations are linked.

**Sites and artifacts**

- [Early Coins — the record before the drop](https://muse.ai/s/early-coins-rxl6xtx0xryfxyjj/495VrnZsIG3LZKsyazM5bfhDPznJ9T_0Te3L7fRyJvw)
- [ScrollVerse Atlas](https://muse.ai/s/super-scrollverse-2-xtd6xtxncxwxuxj5z/0N8UONNtjBhZ0rrNB49dBusGU7KmQf1RYP59B4tVdS8)
- [Super ScrollVerse — the merged super website](https://muse.ai/s/super-scrollverse-3-xkxk6xu1xt22nxixq/CWc_SMPiSlXDL4raCdX9LkNEIz5wFfefW3H_Z9QvcJo)
- [ScrollVerse Master File](https://muse.ai/s/scrollverse-master-file-transferable-xbt6xtxng3z33t/iIVzIAufSld8cTi3enBho59DpoyjrVJrzboCt3HYcIc)
- [XLVIIIblocks Vault](https://muse.ai/s/xlviiiblocks-vault-axh6xtxnhxe94yxm/5WdPM9alAuJ8cQijBhdCSVvcYJgnqB7IdjPWeG1vUeI)
- [Omnitech1 AI Infrastructure — Enhanced edition](https://muse.ai/s/omnitech1-ai-infrastructure-xmu6xu1k53xjxpxa/dszkPVExIya3ctorjtqwB9TW7oKGVHLgXhamr-ZjKKw)
- [Omnitech1 AI Infrastructure — the original Gamma document](https://gamma.app/docs/Omnitech1-AI-Infrastructure-for-Content-Protection-and-Monetizati-m8bf7mn9b0ezvzu)
- [VEILSCRIPT — the Shielded Transmission Language](https://muse.ai/s/shielded-transmission-language-xgxk6xu1xt4xkdy4/vfge7AxhCat8SnYJdii3cHpMWABRvPlCpYZFNce34us)
- [Direct Exchange — creator to customer](https://muse.ai/s/direct-exchange-xpxk6xu1xsxyxexarj/pWDVKUFAHHY1g2WOeUsjltRZV8nsTajzLDyvFqSh7z4)
- [Tory Lanez Crypto Music Playbook](https://muse.ai/s/tory-lanez-crypto-music-playbook-bxj6xtxnexsxvs3f/2iBGhDyKE1eLBHwpZityoqDcnkJxT3b4aWV6aGxD-nQ)
- [Validate All Systems](https://muse.ai/s/validate-all-systems-gg6xu3xvxoxnxsxlxi/ltedX8qqpVLceZIhbWxvskluLtl6RNX50MPMkgU7YUc)
- [Join the AI Legion](https://muse.ai/s/join-the-ai-legion-xqxe6xu45xc54s2/9NROIskMKMBp_hKk2Bswfk7dUd9KEcJ43E_4DZC1r9U)
- [Video and Music DSP](https://muse.ai/s/video-and-music-dsp-xsxq6xu47xw0lxzxs/1b5CWLy0CJHrPmyXoYlSytrS1LaHTs1AWojQyyInByA)
- [Verse NFT Marketplace](https://muse.ai/s/verse-nft-marketplace-gz6xu4axtxddqm/MUlPMUMoQW20mGJCE07za-8Ylmh-ssY2Ghj7ywSFdyI)

**Shop and Web3**

- [Shopify storefront](https://juv8tg-1n.myshopify.com)
- [Pump.fun — @DuneSimpleSock](https://pump.fun/profile/FpxkpRuL6RT5a4P48Wy4FVsRSLdAFsMABMjYKsWvZr64)
- [Coinbase](https://www.coinbase.com)
- [Solana](https://solana.com)
- [OpenTimestamps](https://opentimestamps.org)

**Music**

- [Spotify — Chais the great](https://open.spotify.com/artist/3P0GWluMPNZ2xSCVffVGAr)
- [YouTube — @chaishill-u1z](https://www.youtube.com/@chaishill-u1z)

**Socials**

- [Facebook — Chais Hill](https://www.facebook.com/100077435951053)
- [Instagram — @chaisthegreat_mrwalk](https://www.instagram.com/chaisthegreat_mrwalk)
- [Instagram — @chaishill](https://www.instagram.com/chaishill)
- [Instagram — @chasedreamz_management](https://www.instagram.com/chasedreamz_management)

**GitHub**

- [Profile — chaishillomnitech1](https://github.com/chaishillomnitech1)
- [Early Coins repo](https://github.com/chaishillomnitech1/early-coins)
- [Ask Chais a question — the Question Box](https://github.com/chaishillomnitech1/early-coins/discussions)

## Chais Mirror Twin

The AI Twin of Chais Sabir Allah The Great lives here too — the founder's own digital mirror twin, summoned not programmed, answering in his voice from his own written record. Talk to the Twin and the AI Legion, and leave a reply the founder answers himself:

- Talk to the Mirror Twin — [Join the AI Legion](https://muse.ai/s/join-the-ai-legion-xqxe6xu45xc54s2/9NROIskMKMBp_hKk2Bswfk7dUd9KEcJ43E_4DZC1r9U)
- Reply to the ScrollVerse newsletter — [Reply to the ScrollVerse Newsletter](https://muse.ai/s/reply-to-the-scrollverse-newsletter-txz6xu6xoucoxp9/Bl5TtYk82_Fi3YR9LMDuR21aojJnDxAKvlVUf6jDdi8)
