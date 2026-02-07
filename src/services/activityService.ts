import { LeadershipActivity } from '../models/types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Service for tracking leadership activities
 */
class ActivityService {
  private activities: Map<string, LeadershipActivity> = new Map();

  logActivity(
    memberId: string,
    action: string,
    details: Record<string, any>,
    impact: LeadershipActivity['impact']
  ): LeadershipActivity {
    const activity: LeadershipActivity = {
      id: uuidv4(),
      memberId,
      action,
      timestamp: new Date(),
      details,
      impact
    };
    this.activities.set(activity.id, activity);
    return activity;
  }

  getActivitiesByMember(memberId: string): LeadershipActivity[] {
    return Array.from(this.activities.values())
      .filter(a => a.memberId === memberId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  getRecentActivities(limit: number = 50): LeadershipActivity[] {
    return Array.from(this.activities.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  getActivitiesByImpact(impact: LeadershipActivity['impact']): LeadershipActivity[] {
    return Array.from(this.activities.values())
      .filter(a => a.impact === impact)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  getAllActivities(): LeadershipActivity[] {
    return Array.from(this.activities.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }
}

export const activityService = new ActivityService();
