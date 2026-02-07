import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { memberStore } from '../services/memberService';

/**
 * Extended Request interface with authenticated member
 */
export interface AuthRequest extends Request {
  member?: {
    id: string;
    walletAddress: string;
    role: string;
  };
}

/**
 * NFT-based authentication middleware
 */
export const authenticateNFT = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No authentication token provided' });
    }

    const token = authHeader.substring(7);
    
    try {
      const decoded = jwt.verify(token, config.jwtSecret) as {
        walletAddress: string;
        tokenId: string;
        memberId: string;
      };

      // Verify member exists and is active
      const member = memberStore.getMemberById(decoded.memberId);
      if (!member || !member.isActive) {
        return res.status(403).json({ error: 'Invalid or inactive member' });
      }

      // Attach member info to request
      req.member = {
        id: member.id,
        walletAddress: member.walletAddress,
        role: member.role
      };

      next();
    } catch (jwtError) {
      return res.status(401).json({ error: 'Invalid authentication token' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Authentication error' });
  }
};

/**
 * Authorization middleware for leadership roles
 */
export const requireLeadership = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.member) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const leadershipRoles = ['leader', 'commander', 'sovereign'];
  if (!leadershipRoles.includes(req.member.role)) {
    return res.status(403).json({ error: 'Leadership role required' });
  }

  next();
};

/**
 * Authorization middleware for sovereign role
 */
export const requireSovereign = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.member) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  if (req.member.role !== 'sovereign') {
    return res.status(403).json({ error: 'Sovereign role required' });
  }

  next();
};
