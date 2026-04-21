export interface HomeSummary {
  fullName: string;
  profilePicture: string | null;
  starBalance: number;
  hasUnreadNotifications: boolean;
  hasActivePlanning: boolean;
  paymentDone: boolean;
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
      }>;
    }>;
  } | null;
  activeSubscription: {
    id: string;
    offerTitle: string;
    endDate: string | null;
    remainingSessions: number | null;
    remainingOpenSessions: number | null;
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
}
