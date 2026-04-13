export interface Reward {
  id: string;
  name: string;
  starsRequired: number;
  discountPercentage: number;
  startDate: string;
  endDate: string;
  canRedeem: boolean;
  hasRedeemed: boolean;
  redemptionCount: number;
  starsNeeded: number;
  promoCode: Voucher | null;
}

export interface Voucher {
  id: string;
  code: string;
  promoOfferId: string;
  memberId: string;
  isUsed: boolean;
  usedAt: string | null;
  createdAt: string;
  promoOffer?: Reward;
}

export type StarTransactionReason = 'PLAN_PURCHASE' | 'PROMO_REDEMPTION' | 'STAR_EXPIRY' | 'PROMO_REFUND' | 'PROMO_CODE_DELETED';

export interface StarTransaction {
  id: string;
  changeAmount: number;
  balanceAfter: number;
  reason: StarTransactionReason;
  description: string;
  createdAt: string;
}

export interface RewardsSummary {
  starBalance: number;
  starsExpireAt: string | null;
  offers: Reward[];
}
