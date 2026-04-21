export type NotificationType =
  | 'SUBSCRIPTION_ACTIVATED'
  | 'SUBSCRIPTION_EXPIRED'
  | 'COURSE_ENROLLED'
  | 'COURSE_CANCELLED'
  | 'COURSE_APPROVED'
  | 'COURSE_REJECTED'
  | 'WAITLIST_SPOT_OPENED'
  | 'PLANNING_SLOT_DELETED'
  | 'COACH_ACCEPTED_INVITATION'
  | 'COACH_WITHDREW_INVITATION'
  | 'COACHING_SLOT_CANCELLED'
  | 'COACHING_INVITATION_EXPIRED'
  | 'COACHING_RELATIONSHIP_ENDED'
  | 'PROMO_OFFER_QUALIFIED'
  | 'PROMO_CODE_ISSUED'
  | 'PROMO_CODE_EXPIRING_SOON'
  | 'STARS_AWARDED'
  | 'SYSTEM';
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
  metadata?: {
    courseId?: string;
    courseTitle?: string;
    conversationId?: string;
    promoCode?: string;
    subscriptionId?: string;
  };
}
