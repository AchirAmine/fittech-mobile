import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "@shared/constants/apiEndpoints";
import { Member } from "@appTypes/api.types";

export const memberService = {
  getMe: async (): Promise<Member> => {
    const response = await axiosClient.get(API_ENDPOINTS.MEMBER.GET_ME);
    return response.data.data;
  },
};
