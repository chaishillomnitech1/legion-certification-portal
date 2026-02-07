# Production Deployment Guide

This guide provides instructions for deploying the Legion Certification Portal to a production environment.

## Prerequisites

- Node.js 16+ installed on production server
- Domain name with SSL certificate
- Database server (PostgreSQL recommended)
- Redis instance (for distributed rate limiting)
- NFT contract deployed on blockchain

## Pre-Deployment Checklist

### Security

- [ ] Generate strong, random JWT secret (minimum 32 characters)
- [ ] Configure HTTPS/TLS certificates
- [ ] Set up firewall rules
- [ ] Configure reverse proxy (nginx/Apache)
- [ ] Implement Web3 provider for on-chain NFT verification
- [ ] Review and update CORS settings
- [ ] Enable security headers (helmet.js)
- [ ] Set up secure environment variable management

### Infrastructure

- [ ] Set up production database (PostgreSQL/MongoDB)
- [ ] Configure Redis for session/rate limit storage
- [ ] Set up backup system
- [ ] Configure monitoring and logging
- [ ] Set up CDN (optional)
- [ ] Configure auto-scaling (if using cloud)

### Application

- [ ] Update all dependencies to latest stable versions
- [ ] Run security audit: `npm audit`
- [ ] Configure production environment variables
- [ ] Set up process manager (PM2)
- [ ] Configure log rotation
- [ ] Set up health check endpoint monitoring

## Environment Variables

Create a production `.env` file with the following variables:

```bash
# Server Configuration
PORT=3000
NODE_ENV=production

# Security - CRITICAL: Use strong, random secrets
JWT_SECRET=your-super-secure-random-jwt-secret-minimum-32-characters

# NFT Configuration
NFT_CONTRACT_ADDRESS=0xYourNFTContractAddress
BLOCKCHAIN_NETWORK=mainnet
WEB3_PROVIDER_URL=https://mainnet.infura.io/v3/YOUR_PROJECT_ID

# Database Configuration
DATABASE_URL=postgresql://user:password@host:5432/legion_portal
DATABASE_POOL_SIZE=20

# Redis Configuration
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=your-redis-password

# Federation API Configuration
FEDERATION_API_URL=https://api.galacticfederation.production.com
FEDERATION_API_KEY=your-production-federation-api-key

# Monitoring
LOG_LEVEL=info
SENTRY_DSN=https://your-sentry-dsn
```

## Database Setup

### PostgreSQL Schema

```sql
-- Create database
CREATE DATABASE legion_portal;

-- Members table
CREATE TABLE members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_address VARCHAR(42) UNIQUE NOT NULL,
    nft_token_id VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('seed', 'leader', 'commander', 'sovereign')),
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Certifications table
CREATE TABLE certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID REFERENCES members(id),
    type VARCHAR(20) NOT NULL CHECK (type IN ('leadership', 'commander', 'sovereign', 'special')),
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    issued_by UUID REFERENCES members(id),
    expires_at TIMESTAMP,
    status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'expired', 'revoked')),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Activities table
CREATE TABLE activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID REFERENCES members(id),
    action VARCHAR(255) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    details JSONB,
    impact VARCHAR(20) CHECK (impact IN ('low', 'medium', 'high', 'critical'))
);

-- Create indexes
CREATE INDEX idx_members_wallet ON members(wallet_address);
CREATE INDEX idx_certifications_member ON certifications(member_id);
CREATE INDEX idx_certifications_status ON certifications(status);
CREATE INDEX idx_activities_member ON activities(member_id);
CREATE INDEX idx_activities_timestamp ON activities(timestamp DESC);
```

## Deployment Steps

### 1. Clone Repository

```bash
cd /var/www
git clone https://github.com/chaishillomnitech1/legion-certification-portal.git
cd legion-certification-portal
```

### 2. Install Dependencies

```bash
npm ci --production
```

### 3. Build Application

```bash
npm run build
```

### 4. Install PM2 Process Manager

```bash
npm install -g pm2
```

### 5. Configure PM2

Create `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'legion-portal',
    script: './dist/index.js',
    instances: 4,
    exec_mode: 'cluster',
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    max_memory_restart: '1G',
    autorestart: true,
    restart_delay: 4000,
    max_restarts: 10,
    min_uptime: '10s'
  }]
};
```

### 6. Start Application

```bash
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

### 7. Configure Nginx Reverse Proxy

Create `/etc/nginx/sites-available/legion-portal`:

```nginx
upstream legion_portal {
    server 127.0.0.1:3000;
    keepalive 64;
}

server {
    listen 80;
    server_name portal.scrollsoul.empire;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name portal.scrollsoul.empire;

    ssl_certificate /etc/letsencrypt/live/portal.scrollsoul.empire/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/portal.scrollsoul.empire/privkey.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    location / {
        proxy_pass http://legion_portal;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
    limit_req zone=api_limit burst=20 nodelay;
}
```

Enable the site:
```bash
ln -s /etc/nginx/sites-available/legion-portal /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

## Monitoring Setup

### PM2 Monitoring

```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 100M
pm2 set pm2-logrotate:retain 10
```

### Application Monitoring

Install monitoring tools:
```bash
npm install --save helmet
npm install --save @sentry/node
```

Update `src/index.ts` to include monitoring.

## Backup Strategy

### Database Backups

Create a backup script:
```bash
#!/bin/bash
BACKUP_DIR="/var/backups/legion-portal"
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump legion_portal > "$BACKUP_DIR/db_backup_$DATE.sql"
find $BACKUP_DIR -mtime +7 -delete
```

Schedule with cron:
```bash
0 2 * * * /path/to/backup-script.sh
```

## Health Checks

Monitor these endpoints:
- `GET /` - Health check
- `GET /api/federation/health` - Service health

Set up automated monitoring with tools like:
- UptimeRobot
- Pingdom
- DataDog
- New Relic

## Scaling Considerations

### Horizontal Scaling

- Use PM2 cluster mode (already configured)
- Add more application servers behind load balancer
- Use Redis for shared session storage
- Implement database read replicas

### Vertical Scaling

- Increase server resources (CPU, RAM)
- Optimize database queries
- Add database indexes
- Enable caching

## Troubleshooting

### Application Won't Start

```bash
# Check logs
pm2 logs legion-portal

# Check environment variables
pm2 env 0

# Restart application
pm2 restart legion-portal
```

### High Memory Usage

```bash
# Monitor resources
pm2 monit

# Reload with zero downtime
pm2 reload legion-portal
```

### Database Connection Issues

```bash
# Test database connection
psql -h localhost -U username -d legion_portal

# Check connection pool
# Add to application code for debugging
```

## Maintenance

### Updates

```bash
# Pull latest code
git pull origin main

# Install dependencies
npm ci --production

# Rebuild
npm run build

# Reload with zero downtime
pm2 reload legion-portal
```

### Security Updates

```bash
# Check for vulnerabilities
npm audit

# Update dependencies
npm update

# Fix vulnerabilities
npm audit fix
```

## Support

For production support:
- GitHub Issues: https://github.com/chaishillomnitech1/legion-certification-portal/issues
- Security Issues: See SECURITY.md for responsible disclosure

## Rollback Procedure

If deployment fails:

```bash
# Stop current version
pm2 stop legion-portal

# Checkout previous version
git checkout <previous-commit>

# Rebuild
npm ci --production
npm run build

# Restart
pm2 start legion-portal
```

---

**Last Updated**: February 7, 2026  
**Maintained By**: ScrollSoul Empire DevOps Team
