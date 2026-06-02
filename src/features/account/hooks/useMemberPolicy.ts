import { useQuery } from "@tanstack/react-query";
import { accountService } from "../services/accountService";

export interface MemberPolicy {
  reservationPolicy: {
    cancellationWithoutPenaltyHours: number;
    reservationLimit: number | null;
    reservationLimitEnabled: boolean;
    reservationMinHoursBeforeStart: number;
    waitlistEnabled: boolean | null;
  };
  absencePolicy: {
    justificationSubmissionWindowHours: number | null;
    warningThresholdPerMonth: number;
    blockingThresholdPerMonth: number;
    blockingDurationDays: number;
    creditRestoredWhenJustified: boolean | null;
    autoMarkEnabled: boolean;
    autoMarkDelayMinutesAfterCourseEnd: number;
  };
  subscriptionSuspensionPolicy: {
    noticeDelayHours: number;
    minimumDurationDays: number;
    maximumDurationDays: number;
    maximumSuspensionsPerYear: number;
    extendsSubscriptionEndDate: boolean;
    manualEarlyResumeAllowed: boolean;
  };
  messagingPolicy: {
    availableAfterEnrollment: boolean;
    availableUntilHoursAfterCourseEnd: number;
  };
  attendancePolicy: {
    attendanceMethod: "QR_CODE";
    qrRequiresCoachPresenceValidation: boolean;
    courseEntryWindowBeforeMinutes: number;
    qrCheckinWindowBeforeMinutes: number;
    qrCheckinWindowAfterMinutes: number;
  };
  offerPolicy: {
    monthlyOfferDurationDays: number;
  };
}

export function useMemberPolicy() {
  return useQuery<MemberPolicy>({
    queryKey: ["memberPolicy"],
    queryFn: () => accountService.getPolicy(),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}
