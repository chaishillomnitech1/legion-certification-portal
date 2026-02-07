import { Router, Response } from 'express';
import { AuthRequest, authenticateNFT, requireLeadership } from '../middleware/auth';
import { memberStore } from '../services/memberService';
import { activityService } from '../services/activityService';

const router = Router();

// All member routes require authentication
router.use(authenticateNFT);

/**
 * GET /api/members/me
 * Get current authenticated member details
 */
router.get('/me', (req: AuthRequest, res: Response) => {
  try {
    const member = memberStore.getMemberById(req.member!.id);
    
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    res.json({
      success: true,
      member: {
        id: member.id,
        walletAddress: member.walletAddress,
        username: member.username,
        role: member.role,
        joinedAt: member.joinedAt,
        isActive: member.isActive,
        certifications: member.certifications
      }
    });
  } catch (error) {
    console.error('Get member error:', error);
    res.status(500).json({ error: 'Failed to retrieve member' });
  }
});

/**
 * GET /api/members/stats/overview
 * Get member statistics
 */
router.get('/stats/overview', requireLeadership, (req: AuthRequest, res: Response) => {
  try {
    const allMembers = memberStore.getAllMembers();
    const activeMembers = memberStore.getActiveMembers();
    const leaders = memberStore.getLeaders();

    const roleDistribution = allMembers.reduce((acc, member) => {
      acc[member.role] = (acc[member.role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    res.json({
      success: true,
      stats: {
        totalMembers: allMembers.length,
        activeMembers: activeMembers.length,
        leaders: leaders.length,
        roleDistribution
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to retrieve statistics' });
  }
});

/**
 * GET /api/members
 * Get all members (leadership only)
 */
router.get('/', requireLeadership, (req: AuthRequest, res: Response) => {
  try {
    const members = memberStore.getAllMembers();
    
    res.json({
      success: true,
      count: members.length,
      members: members.map(m => ({
        id: m.id,
        username: m.username,
        walletAddress: m.walletAddress,
        role: m.role,
        joinedAt: m.joinedAt,
        isActive: m.isActive,
        certificationsCount: m.certifications.length
      }))
    });
  } catch (error) {
    console.error('Get members error:', error);
    res.status(500).json({ error: 'Failed to retrieve members' });
  }
});

/**
 * GET /api/members/:id
 * Get member by ID
 */
router.get('/:id', (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const member = memberStore.getMemberById(id);
    
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    // Only allow viewing own profile or leadership can view all
    const isOwnProfile = req.member!.id === id;
    const leadershipRoles = ['leader', 'commander', 'sovereign'];
    const isLeadership = leadershipRoles.includes(req.member!.role);

    if (!isOwnProfile && !isLeadership) {
      return res.status(403).json({ error: 'Unauthorized to view this member' });
    }

    res.json({
      success: true,
      member: {
        id: member.id,
        username: member.username,
        walletAddress: member.walletAddress,
        role: member.role,
        joinedAt: member.joinedAt,
        isActive: member.isActive,
        certifications: member.certifications
      }
    });
  } catch (error) {
    console.error('Get member by ID error:', error);
    res.status(500).json({ error: 'Failed to retrieve member' });
  }
});

/**
 * PUT /api/members/:id/role
 * Update member role (leadership only)
 */
router.put('/:id/role', requireLeadership, (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const { role } = req.body;

    const validRoles = ['seed', 'leader', 'commander', 'sovereign'];
    if (!role || !validRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const member = memberStore.updateMember(id, { role });
    
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    activityService.logActivity(
      req.member!.id,
      'role_updated',
      { targetMemberId: id, newRole: role },
      'high'
    );

    res.json({
      success: true,
      member: {
        id: member.id,
        username: member.username,
        role: member.role
      }
    });
  } catch (error) {
    console.error('Update member role error:', error);
    res.status(500).json({ error: 'Failed to update member role' });
  }
});

export default router;
