import { Member, Certification } from '../models/types';
import { v4 as uuidv4 } from 'uuid';

/**
 * In-memory storage for members (in production, use a real database)
 */
class MemberStore {
  private members: Map<string, Member> = new Map();

  addMember(member: Omit<Member, 'id' | 'joinedAt'>): Member {
    const newMember: Member = {
      id: uuidv4(),
      ...member,
      joinedAt: new Date(),
      isActive: true,
      certifications: []
    };
    this.members.set(newMember.id, newMember);
    return newMember;
  }

  getMemberById(id: string): Member | undefined {
    return this.members.get(id);
  }

  getMemberByWallet(walletAddress: string): Member | undefined {
    return Array.from(this.members.values()).find(
      m => m.walletAddress.toLowerCase() === walletAddress.toLowerCase()
    );
  }

  getAllMembers(): Member[] {
    return Array.from(this.members.values());
  }

  getActiveMembers(): Member[] {
    return Array.from(this.members.values()).filter(m => m.isActive);
  }

  updateMember(id: string, updates: Partial<Member>): Member | undefined {
    const member = this.members.get(id);
    if (!member) return undefined;
    
    const updated = { ...member, ...updates };
    this.members.set(id, updated);
    return updated;
  }

  getTotalCount(): number {
    return this.members.size;
  }

  getLeaders(): Member[] {
    return Array.from(this.members.values()).filter(
      m => m.role === 'leader' || m.role === 'commander' || m.role === 'sovereign'
    );
  }
}

export const memberStore = new MemberStore();
