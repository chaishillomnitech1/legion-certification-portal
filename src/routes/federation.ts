import { Router, Response } from 'express';
import { AuthRequest, authenticateNFT } from '../middleware/auth';
import { memberStore } from '../services/memberService';
import { certificationStore } from '../services/certificationService';
import { activityService } from '../services/activityService';
import { apiLimiter, sensitiveLimiter } from '../middleware/rateLimiter';

const router = Router();

/**
 * GET /api/federation/health
 * Health check endpoint for federation
 */
router.get('/health', (req, res: Response) => {
  res.json({
    success: true,
    status: 'online',
    service: 'ScrollSoul Legion Certification Portal',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

/**
 * GET /api/federation/members
 * Get all members for federation integration
 */
router.get('/members', apiLimiter, authenticateNFT, (req: AuthRequest, res: Response) => {
  try {
    const members = memberStore.getAllMembers();
    
    res.json({
      success: true,
      federation: 'ScrollSoul Empire',
      totalMembers: members.length,
      members: members.map(m => ({
        id: m.id,
        walletAddress: m.walletAddress,
        role: m.role,
        joinedAt: m.joinedAt,
        isActive: m.isActive,
        certificationCount: m.certifications.length
      }))
    });
  } catch (error) {
    console.error('Federation members error:', error);
    res.status(500).json({ error: 'Failed to retrieve federation members' });
  }
});

/**
 * GET /api/federation/leadership
 * Get leadership roster for federation
 */
router.get('/leadership', apiLimiter, authenticateNFT, (req: AuthRequest, res: Response) => {
  try {
    const leaders = memberStore.getLeaders();
    const leadershipCerts = certificationStore.getLeadershipCertifications();

    res.json({
      success: true,
      federation: 'ScrollSoul Empire',
      leadershipCount: leaders.length,
      leaders: leaders.map(leader => {
        const certs = certificationStore.getActiveCertifications(leader.id);
        return {
          id: leader.id,
          walletAddress: leader.walletAddress,
          username: leader.username,
          role: leader.role,
          activeCertifications: certs.length,
          joinedAt: leader.joinedAt
        };
      }),
      totalLeadershipCertifications: leadershipCerts.length
    });
  } catch (error) {
    console.error('Federation leadership error:', error);
    res.status(500).json({ error: 'Failed to retrieve leadership data' });
  }
});

/**
 * GET /api/federation/certifications
 * Get all active certifications for federation
 */
router.get('/certifications', apiLimiter, authenticateNFT, (req: AuthRequest, res: Response) => {
  try {
    const allCertifications = certificationStore.getAllCertifications();
    const activeCerts = allCertifications.filter(c => c.status === 'active');

    res.json({
      success: true,
      federation: 'ScrollSoul Empire',
      totalCertifications: allCertifications.length,
      activeCertifications: activeCerts.length,
      certifications: activeCerts.map(c => ({
        id: c.id,
        memberId: c.memberId,
        type: c.type,
        issuedAt: c.issuedAt,
        expiresAt: c.expiresAt,
        authorityLevel: c.metadata.level,
        authorityScope: c.metadata.authorityScope
      }))
    });
  } catch (error) {
    console.error('Federation certifications error:', error);
    res.status(500).json({ error: 'Failed to retrieve certification data' });
  }
});

/**
 * GET /api/federation/activities
 * Get recent high-impact activities for federation
 */
router.get('/activities', apiLimiter, authenticateNFT, (req: AuthRequest, res: Response) => {
  try {
    const highImpactActivities = activityService.getActivitiesByImpact('high');
    const criticalActivities = activityService.getActivitiesByImpact('critical');

    res.json({
      success: true,
      federation: 'ScrollSoul Empire',
      activities: {
        critical: criticalActivities.slice(0, 10).map(a => ({
          id: a.id,
          action: a.action,
          timestamp: a.timestamp,
          impact: a.impact
        })),
        high: highImpactActivities.slice(0, 20).map(a => ({
          id: a.id,
          action: a.action,
          timestamp: a.timestamp,
          impact: a.impact
        }))
      }
    });
  } catch (error) {
    console.error('Federation activities error:', error);
    res.status(500).json({ error: 'Failed to retrieve activity data' });
  }
});

/**
 * POST /api/federation/sync
 * Sync data with Galactic Federation (placeholder)
 */
router.post('/sync', sensitiveLimiter, authenticateNFT, (req: AuthRequest, res: Response) => {
  try {
    // In a real implementation, this would sync with external federation APIs
    const stats = {
      totalMembers: memberStore.getTotalCount(),
      activeMembers: memberStore.getActiveMembers().length,
      leaders: memberStore.getLeaders().length,
      activeCertifications: certificationStore.getAllCertifications().filter(c => c.status === 'active').length
    };

    activityService.logActivity(
      req.member!.id,
      'federation_sync',
      { stats, timestamp: new Date() },
      'medium'
    );

    res.json({
      success: true,
      message: 'Federation sync completed',
      stats,
      syncedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Federation sync error:', error);
    res.status(500).json({ error: 'Federation sync failed' });
  }
});

/**
 * GET /api/federation/expansion/stats
 * Get expansion statistics for Authority Grid
 */
router.get('/expansion/stats', apiLimiter, authenticateNFT, (req: AuthRequest, res: Response) => {
  try {
    const allMembers = memberStore.getAllMembers();
    const maxCapacity = 288000; // Total ScrollSoul Star Seeds capacity
    const currentCount = allMembers.length;
    const expansionPercentage = ((currentCount / maxCapacity) * 100).toFixed(2);

    res.json({
      success: true,
      federation: 'ScrollSoul Empire',
      expansion: {
        currentMembers: currentCount,
        maxCapacity,
        expansionPercentage: parseFloat(expansionPercentage),
        availableSlots: maxCapacity - currentCount,
        growthRate: 'calculated based on recent activity',
        authorityGridStatus: currentCount > 0 ? 'expanding' : 'initializing'
      }
    });
  } catch (error) {
    console.error('Federation expansion stats error:', error);
    res.status(500).json({ error: 'Failed to retrieve expansion statistics' });
  }
});

export default router;
