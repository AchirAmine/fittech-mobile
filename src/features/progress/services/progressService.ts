import axiosClient from '@shared/services/axiosClient';
import {
  CoachMemberProgressResponse,
  CreateGoalPayload,
  CreateProgressPayload,
  DeleteProgressResponse,
  FeedbackResponse,
  GoalResponse,
  LatestProgressResponse,
  PaginatedProgressResponse,
  ProgressResponse,
  UpdateGoalPayload,
  UpdateProgressPayload,
} from '../types/progress.types';

export const progressService = {
  createProgress: async (payload: CreateProgressPayload): Promise<ProgressResponse> => {
    const { data } = await axiosClient.post<ProgressResponse>('/member/progress', payload);
    return data;
  },

  getProgressList: async (params: {
    page?: number;
    limit?: number;
    from?: string;
    to?: string;
  } = {}): Promise<PaginatedProgressResponse> => {
    const { data } = await axiosClient.get<PaginatedProgressResponse>('/member/progress', {
      params: { page: params.page || 1, limit: params.limit || 15, ...params },
    });
    return data;
  },

  getLatestProgress: async (): Promise<LatestProgressResponse> => {
    const { data } = await axiosClient.get<LatestProgressResponse>('/member/progress/latest');
    return data;
  },

  updateProgress: async (
    progressId: string,
    payload: UpdateProgressPayload,
  ): Promise<ProgressResponse> => {
    const { data } = await axiosClient.patch<ProgressResponse>(
      `/member/progress/${progressId}`,
      payload,
    );
    return data;
  },

  deleteProgress: async (progressId: string): Promise<DeleteProgressResponse> => {
    const { data } = await axiosClient.delete<DeleteProgressResponse>(`/member/progress/${progressId}`);
    return data;
  },

  getProgressFeedback: async (progressId: string): Promise<FeedbackResponse> => {
    const { data } = await axiosClient.get<FeedbackResponse>(
      `/member/progress/${progressId}/feedback`,
    );
    return data;
  },
};

export const goalService = {
  createGoal: async (payload: CreateGoalPayload): Promise<GoalResponse> => {
    const { data } = await axiosClient.post<GoalResponse>('/member/goals', payload);
    return data;
  },

  getCurrentGoal: async (): Promise<GoalResponse> => {
    const { data } = await axiosClient.get<GoalResponse>('/member/goals/current');
    return data;
  },

  updateGoal: async (goalId: string, payload: UpdateGoalPayload): Promise<GoalResponse> => {
    const { data } = await axiosClient.patch<GoalResponse>(`/member/goals/${goalId}`, payload);
    return data;
  },

  updateGoalStatus: async (
    goalId: string,
    status: 'COMPLETED' | 'CANCELLED',
  ): Promise<GoalResponse> => {
    const { data } = await axiosClient.patch<GoalResponse>(
      `/member/goals/${goalId}/status`,
      { status },
    );
    return data;
  },
};

export const coachProgressService = {
  getMemberProgress: async (memberId: string): Promise<CoachMemberProgressResponse> => {
    const { data } = await axiosClient.get<CoachMemberProgressResponse>(
      `/coach/members/${memberId}/progress`,
    );
    return data;
  },

  addFeedback: async (
    memberId: string,
    progressId: string,
    comment: string,
  ): Promise<{ success: boolean; data: unknown }> => {
    const { data } = await axiosClient.post(
      `/coach/members/${memberId}/progress/${progressId}/feedback`,
      { comment },
    );
    return data;
  },
};
