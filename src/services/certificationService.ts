import { Certification } from '../models/types';
import { v4 as uuidv4 } from 'uuid';

/**
 * In-memory storage for certifications (in production, use a real database)
 */
class CertificationStore {
  private certifications: Map<string, Certification> = new Map();

  issueCertification(
    memberId: string,
    type: Certification['type'],
    issuedBy: string,
    metadata: Certification['metadata'],
    expiresAt?: Date
  ): Certification {
    const cert: Certification = {
      id: uuidv4(),
      memberId,
      type,
      issuedAt: new Date(),
      issuedBy,
      expiresAt,
      status: 'active',
      metadata
    };
    this.certifications.set(cert.id, cert);
    return cert;
  }

  getCertificationById(id: string): Certification | undefined {
    return this.certifications.get(id);
  }

  getCertificationsByMember(memberId: string): Certification[] {
    return Array.from(this.certifications.values()).filter(
      c => c.memberId === memberId
    );
  }

  getActiveCertifications(memberId: string): Certification[] {
    const now = new Date();
    return this.getCertificationsByMember(memberId).filter(
      c => c.status === 'active' && (!c.expiresAt || c.expiresAt > now)
    );
  }

  revokeCertification(id: string, reason?: string): Certification | undefined {
    const cert = this.certifications.get(id);
    if (!cert) return undefined;

    cert.status = 'revoked';
    this.certifications.set(id, cert);
    return cert;
  }

  getAllCertifications(): Certification[] {
    return Array.from(this.certifications.values());
  }

  getLeadershipCertifications(): Certification[] {
    return Array.from(this.certifications.values()).filter(
      c => c.type === 'leadership' && c.status === 'active'
    );
  }
}

export const certificationStore = new CertificationStore();
