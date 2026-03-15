import axiosClient from "@shared/services/axiosClient";
import { API_ENDPOINTS } from "@shared/constants/apiEndpoints";
import { Member } from "@appTypes/api.types";

export const accountService = {
  getMe: async (): Promise<Member> => {
    try {
      const response = await axiosClient.get(API_ENDPOINTS.MEMBER.GET_ME);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching account data:', error);
      throw error;
    }
  },
};
