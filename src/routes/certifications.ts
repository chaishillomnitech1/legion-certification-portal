import { Router, Response } from 'express';
import { AuthRequest, authenticateNFT, requireLeadership } from '../middleware/auth';
import { certificationStore } from '../services/certificationService';
import { memberStore } from '../services/memberService';
import { activityService } from '../services/activityService';

const router = Router();

// All certification routes require authentication
router.use(authenticateNFT);

/**
 * POST /api/certifications/issue
 * Issue a new certification (leadership only)
 */
router.post('/issue', requireLeadership, (req: AuthRequest, res: Response) => {
  try {
    const { memberId, type, metadata, expiresInDays } = req.body;

    if (!memberId || !type || !metadata) {
      return res.status(400).json({ 
        error: 'Missing required fields: memberId, type, metadata' 
      });
    }

    const validTypes = ['leadership', 'commander', 'sovereign', 'special'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ error: 'Invalid certification type' });
    }

    const member = memberStore.getMemberById(memberId);
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    let expiresAt: Date | undefined;
    if (expiresInDays) {
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + expiresInDays);
    }

    const certification = certificationStore.issueCertification(
      memberId,
      type,
      req.member!.id,
      metadata,
      expiresAt
    );

    // Update member's certification list
    const updatedCertifications = [...member.certifications, certification.id];
    memberStore.updateMember(memberId, { certifications: updatedCertifications });

    activityService.logActivity(
      req.member!.id,
      'certification_issued',
      { certificationId: certification.id, type, memberId },
      'high'
    );

    res.json({
      success: true,
      certification: {
        id: certification.id,
        memberId: certification.memberId,
        type: certification.type,
        issuedAt: certification.issuedAt,
        expiresAt: certification.expiresAt,
        status: certification.status,
        metadata: certification.metadata
      }
    });
  } catch (error) {
    console.error('Issue certification error:', error);
    res.status(500).json({ error: 'Failed to issue certification' });
  }
});

/**
 * GET /api/certifications/member/:memberId
 * Get all certifications for a member
 */
router.get('/member/:memberId', (req: AuthRequest, res: Response) => {
  try {
    const memberId = req.params.memberId as string;

    // Check authorization
    const isOwnProfile = req.member!.id === memberId;
    const leadershipRoles = ['leader', 'commander', 'sovereign'];
    const isLeadership = leadershipRoles.includes(req.member!.role);

    if (!isOwnProfile && !isLeadership) {
      return res.status(403).json({ error: 'Unauthorized to view certifications' });
    }

    const certifications = certificationStore.getCertificationsByMember(memberId);

    res.json({
      success: true,
      count: certifications.length,
      certifications: certifications.map(c => ({
        id: c.id,
        type: c.type,
        issuedAt: c.issuedAt,
        expiresAt: c.expiresAt,
        status: c.status,
        metadata: c.metadata
      }))
    });
  } catch (error) {
    console.error('Get member certifications error:', error);
    res.status(500).json({ error: 'Failed to retrieve certifications' });
  }
});

/**
 * GET /api/certifications/:id
 * Get certification by ID
 */
router.get('/:id', (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const certification = certificationStore.getCertificationById(id);

    if (!certification) {
      return res.status(404).json({ error: 'Certification not found' });
    }

    res.json({
      success: true,
      certification: {
        id: certification.id,
        memberId: certification.memberId,
        type: certification.type,
        issuedAt: certification.issuedAt,
        issuedBy: certification.issuedBy,
        expiresAt: certification.expiresAt,
        status: certification.status,
        metadata: certification.metadata
      }
    });
  } catch (error) {
    console.error('Get certification error:', error);
    res.status(500).json({ error: 'Failed to retrieve certification' });
  }
});

/**
 * PUT /api/certifications/:id/revoke
 * Revoke a certification (leadership only)
 */
router.put('/:id/revoke', requireLeadership, (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const { reason } = req.body;

    const certification = certificationStore.revokeCertification(id, reason);

    if (!certification) {
      return res.status(404).json({ error: 'Certification not found' });
    }

    activityService.logActivity(
      req.member!.id,
      'certification_revoked',
      { certificationId: id, reason },
      'high'
    );

    res.json({
      success: true,
      certification: {
        id: certification.id,
        status: certification.status
      }
    });
  } catch (error) {
    console.error('Revoke certification error:', error);
    res.status(500).json({ error: 'Failed to revoke certification' });
  }
});

/**
 * GET /api/certifications/leadership/all
 * Get all leadership certifications (leadership only)
 */
router.get('/leadership/all', requireLeadership, (req: AuthRequest, res: Response) => {
  try {
    const certifications = certificationStore.getLeadershipCertifications();

    res.json({
      success: true,
      count: certifications.length,
      certifications: certifications.map(c => ({
        id: c.id,
        memberId: c.memberId,
        type: c.type,
        issuedAt: c.issuedAt,
        metadata: c.metadata
      }))
    });
  } catch (error) {
    console.error('Get leadership certifications error:', error);
    res.status(500).json({ error: 'Failed to retrieve certifications' });
  }
});

export default router;
