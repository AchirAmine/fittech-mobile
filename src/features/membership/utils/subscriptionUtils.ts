import { Subscription, SubscriptionPlan } from '@appTypes/index';

/**
 * Derives the subscription status from payment data.
 * Used as a safety fallback — the backend should now return `status` directly.
 */
export function deriveSubscriptionStatus(
  sub: Subscription
): 'ACTIVE' | 'PENDING_PAYMENT' | 'EXPIRED' {
  // If status is already set by the backend, trust it
  if (sub.status) return sub.status as 'ACTIVE' | 'PENDING_PAYMENT' | 'EXPIRED';

  const paymentStatus = sub.payment?.status;

  if (!paymentStatus || paymentStatus === 'PENDING') {
    return 'PENDING_PAYMENT';
  }

  if (paymentStatus === 'FAILED') {
    return 'EXPIRED';
  }

  if (sub.endDate) {
    const now = new Date();
    const endDate = new Date(sub.endDate);
    return endDate > now ? 'ACTIVE' : 'EXPIRED';
  }

  return 'ACTIVE';
}

// Helper to transform backend Offer to UI SubscriptionPlan
export const transformOffer = (offer: any): SubscriptionPlan => ({
  id: offer.id,
  title: offer.title,
  price: offer.price,
  currency: 'DA',
  billingCycle: offer.duration >= 12 ? 'annual' : 'monthly',
  duration: offer.duration * 30, // Convert months to days approx
  image: offer.picture ? { uri: `${process.env.EXPO_PUBLIC_API_URL?.split('/api')[0]}/${offer.picture}` } : require('../../../../assets/images/boxing-swim.png'), // fallback image
  features: (offer.sports || []).map((s: any) => ({
    label: s.sportType.toUpperCase(),
    icon: s.sportType.toLowerCase().includes('box') ? '🥊' : 
          s.sportType.toLowerCase().includes('swim') ? '🏊' : 
          s.sportType.toLowerCase().includes('yoga') ? '🧘' : '💪',
    details: [
      `${s.freeSessions} SOLO`,
      `${s.coachSessions} COURSE`
    ]
  })),
});

/**
 * Ensures every subscription has a `status` field.
 */
export function enrichSubscriptions(subscriptions: Subscription[]): Subscription[] {
  return subscriptions.map((sub) => ({
    ...sub,
    status: deriveSubscriptionStatus(sub),
  }));
}
