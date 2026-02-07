import { Router, Response } from 'express';
import { AuthRequest, authenticateNFT, requireLeadership } from '../middleware/auth';
import { activityService } from '../services/activityService';
import { memberStore } from '../services/memberService';
import { certificationStore } from '../services/certificationService';

const router = Router();

// All dashboard routes require authentication
router.use(authenticateNFT);

/**
 * GET /api/dashboard/overview
 * Get dashboard overview
 */
router.get('/overview', (req: AuthRequest, res: Response) => {
  try {
    const member = memberStore.getMemberById(req.member!.id);
    const allMembers = memberStore.getAllMembers();
    const leaders = memberStore.getLeaders();
    const recentActivities = activityService.getRecentActivities(10);

    const isLeadership = ['leader', 'commander', 'sovereign'].includes(req.member!.role);

    res.json({
      success: true,
      overview: {
        member: {
          username: member?.username,
          role: member?.role,
          certifications: member?.certifications.length || 0
        },
        stats: isLeadership ? {
          totalMembers: allMembers.length,
          activeMembers: memberStore.getActiveMembers().length,
          leaders: leaders.length,
          activeCertifications: certificationStore.getLeadershipCertifications().length
        } : null,
        recentActivities: recentActivities.map(a => ({
          id: a.id,
          action: a.action,
          timestamp: a.timestamp,
          impact: a.impact
        }))
      }
    });
  } catch (error) {
    console.error('Dashboard overview error:', error);
    res.status(500).json({ error: 'Failed to retrieve dashboard data' });
  }
});

/**
 * GET /api/dashboard/leadership/activity
 * Get leadership activity monitoring (leadership only)
 */
router.get('/leadership/activity', requireLeadership, (req: AuthRequest, res: Response) => {
  try {
    const { limit = '50', impact } = req.query;

    let activities;
    if (impact && typeof impact === 'string') {
      activities = activityService.getActivitiesByImpact(impact as any);
    } else {
      activities = activityService.getRecentActivities(parseInt(limit as string));
    }

    res.json({
      success: true,
      count: activities.length,
      activities: activities.map(a => ({
        id: a.id,
        memberId: a.memberId,
        action: a.action,
        timestamp: a.timestamp,
        details: a.details,
        impact: a.impact
      }))
    });
  } catch (error) {
    console.error('Leadership activity error:', error);
    res.status(500).json({ error: 'Failed to retrieve activities' });
  }
});

/**
 * GET /api/dashboard/member/:memberId/activity
 * Get activity for specific member
 */
router.get('/member/:memberId/activity', requireLeadership, (req: AuthRequest, res: Response) => {
  try {
    const memberId = req.params.memberId as string;

    const activities = activityService.getActivitiesByMember(memberId);

    res.json({
      success: true,
      count: activities.length,
      activities: activities.map(a => ({
        id: a.id,
        action: a.action,
        timestamp: a.timestamp,
        details: a.details,
        impact: a.impact
      }))
    });
  } catch (error) {
    console.error('Member activity error:', error);
    res.status(500).json({ error: 'Failed to retrieve member activities' });
  }
});

/**
 * GET /api/dashboard/stats
 * Get detailed statistics (leadership only)
 */
router.get('/stats', requireLeadership, (req: AuthRequest, res: Response) => {
  try {
    const allMembers = memberStore.getAllMembers();
    const activeMembers = memberStore.getActiveMembers();
    const allCertifications = certificationStore.getAllCertifications();
    const allActivities = activityService.getAllActivities();

    const roleDistribution = allMembers.reduce((acc, member) => {
      acc[member.role] = (acc[member.role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const certificationTypes = allCertifications.reduce((acc, cert) => {
      if (cert.status === 'active') {
        acc[cert.type] = (acc[cert.type] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const activityImpact = allActivities.reduce((acc, activity) => {
      acc[activity.impact] = (acc[activity.impact] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    res.json({
      success: true,
      stats: {
        members: {
          total: allMembers.length,
          active: activeMembers.length,
          inactive: allMembers.length - activeMembers.length,
          byRole: roleDistribution
        },
        certifications: {
          total: allCertifications.length,
          active: allCertifications.filter(c => c.status === 'active').length,
          byType: certificationTypes
        },
        activities: {
          total: allActivities.length,
          byImpact: activityImpact
        }
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to retrieve statistics' });
  }
});

export default router;
