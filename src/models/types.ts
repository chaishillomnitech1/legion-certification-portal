/**
 * Member interface representing a ScrollSoul Star Seed member
 */
export interface Member {
  id: string;
  walletAddress: string;
  nftTokenId: string;
  username: string;
  role: 'seed' | 'leader' | 'commander' | 'sovereign';
  joinedAt: Date;
  isActive: boolean;
  certifications: string[];
}

/**
 * Certification interface for leadership credentials
 */
export interface Certification {
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

/**
 * NFT Authentication Token
 */
export interface NFTAuth {
  walletAddress: string;
  tokenId: string;
  signature: string;
  timestamp: number;
}

/**
 * Leadership Activity for monitoring
 */
export interface LeadershipActivity {
  id: string;
  memberId: string;
  action: string;
  timestamp: Date;
  details: Record<string, any>;
  impact: 'low' | 'medium' | 'high' | 'critical';
}
