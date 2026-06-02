export interface HomeSummary {
  fullName: string;
  profilePicture: string | null;
  weight: number | null;
  starBalance: number;
  hasUnreadNotifications: boolean;
  hasActivePlanning: boolean;
  paymentDone: boolean;
  subscriptions: any[];
  hasActiveSubscription: boolean;
  activeSubscriptionCount: number;
  activeSubscription: {
    id: string;
    offerTitle: string;
    endDate: string | null;
    remainingSessions: number | null;
    remainingOpenSessions: number | null;
  } | null;
  actualPlanning: {
    subscriptionId: string;
    offerTitle: string;
    endDate: string | null;
    sports: Array<{
      sport: string;
      slots: Array<{
        id: string;
        slotType: string;
        dayOfWeek: string;
        startTime: string;
        endTime: string;
        gender: string | null;
        courses?: Array<{
          id: string;
          title: string;
          date?: string;
          gymZone: string | null;
          isReservedByMember?: boolean;
          isWaitlistedByMember?: boolean;
        }>;
      }>;
    }>;
  } | null;
  nearestCourse: {
    id: string;
    title: string;
    date: string;
    gymZone: string | null;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
  } | null;
  personalCoachName: string | null;
  personalCoaching: {
    state: string;
    label: string;
    invitationId: string | null;
    invitationStatus: string | null;
    paymentStatus: string | null;
    coach: {
      id: string;
      firstName: string;
      lastName: string;
      profilePicture: string | null;
      speciality: string | null;
    } | null;
    startedAt: string | null;
    endedAt: string | null;
    nextBooking: {
      id: string;
      startTime: string;
      endTime: string;
      status: string;
    } | null;
  } | null;
}
