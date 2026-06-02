import { Subscription, SubscriptionPlan } from '@appTypes/index';
export const transformOffer = (offer: any): SubscriptionPlan => {
  const features = (offer.sports || []).map((s: any) => ({
    label: s.sportType.toUpperCase(),
    icon: s.sportType.toLowerCase().includes('box') ? '🥊' : 
          s.sportType.toLowerCase().includes('swim') ? '🏊' : 
          s.sportType.toLowerCase().includes('yoga') ? '🧘' : '💪',
    details: [
      `${s.freeSessions} SOLO`,
      `${s.coachSessions} COURSE`
    ]
  }));

  return {
    id: offer.id,
    title: offer.title,
    price: offer.price,
    currency: 'DA',
    billingCycle: (offer.duration || 0) >= 12 ? 'annual' : 'monthly',
    duration: (offer.duration || 1) * 30, 
    starsAwarded: offer.starsAwarded,
    image: offer.picture ? { uri: `${process.env.EXPO_PUBLIC_API_URL?.split('/api')[0]}/${offer.picture}` } : undefined, 
    features,
  };
};
