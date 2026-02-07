import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { memberStore } from '../services/memberService';
import { activityService } from '../services/activityService';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();

/**
 * POST /api/auth/nft-login
 * NFT-based authentication endpoint
 */
router.post('/nft-login', authLimiter, async (req: Request, res: Response) => {
  try {
    const { walletAddress, nftTokenId, signature } = req.body;

    if (!walletAddress || !nftTokenId || !signature) {
      return res.status(400).json({ 
        error: 'Missing required fields: walletAddress, nftTokenId, signature' 
      });
    }

    // Verify NFT ownership (simplified for demo - in production, verify on-chain)
    // For now, we'll accept any valid signature format
    if (signature.length < 10) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    // Find or create member
    let member = memberStore.getMemberByWallet(walletAddress);
    
    if (!member) {
      // Create new member with default 'seed' role
      member = memberStore.addMember({
        walletAddress,
        nftTokenId,
        username: `Member_${walletAddress.substring(0, 8)}`,
        role: 'seed',
        isActive: true,
        certifications: []
      });

      activityService.logActivity(
        member.id,
        'member_joined',
        { walletAddress, nftTokenId },
        'medium'
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        walletAddress: member.walletAddress,
        tokenId: member.nftTokenId,
        memberId: member.id,
        role: member.role
      },
      config.jwtSecret,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      member: {
        id: member.id,
        walletAddress: member.walletAddress,
        username: member.username,
        role: member.role,
        joinedAt: member.joinedAt
      }
    });
  } catch (error) {
    console.error('NFT login error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

/**
 * POST /api/auth/verify
 * Verify current authentication token
 */
router.post('/verify', authLimiter, async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);
    
    try {
      const decoded = jwt.verify(token, config.jwtSecret) as {
        memberId: string;
        walletAddress: string;
        role: string;
      };

      const member = memberStore.getMemberById(decoded.memberId);
      
      if (!member || !member.isActive) {
        return res.status(403).json({ error: 'Invalid or inactive member' });
      }

      res.json({
        valid: true,
        member: {
          id: member.id,
          walletAddress: member.walletAddress,
          username: member.username,
          role: member.role
        }
      });
    } catch (jwtError) {
      res.status(401).json({ error: 'Invalid token' });
    }
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({ error: 'Verification failed' });
  }
});

export default router;
