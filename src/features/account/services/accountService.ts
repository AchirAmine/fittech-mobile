import axiosClient from "@shared/services/axiosClient";
import { API_ENDPOINTS } from "@shared/constants/apiEndpoints";
import { Member } from "@appTypes/api.types";
export const accountService = {
  getMe: async (): Promise<Member> => {
    const response = await axiosClient.get(API_ENDPOINTS.MEMBER.GET_ME);
    return response.data.data;
  },
  updateMe: async (data: any): Promise<Member> => {
    const response = await axiosClient.patch(API_ENDPOINTS.MEMBER.UPDATE_ME, data);
    return response.data.data;
  },
  getMedicalProfile: async (): Promise<any> => {
    const response = await axiosClient.get(API_ENDPOINTS.MEMBER.MEDICAL_PROFILE);
    return response.data.data;
  },
  updateMedicalProfile: async (data: any): Promise<any> => {
    const response = await axiosClient.patch(API_ENDPOINTS.MEMBER.MEDICAL_PROFILE, data);
    return response.data.data;
  },
  getPolicy: async (): Promise<any> => {
    const response = await axiosClient.get(API_ENDPOINTS.MEMBER.GET_POLICY);
    return response.data.data;
  }
};
