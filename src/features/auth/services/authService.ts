import { AxiosResponse } from 'axios';
import { axiosClient } from '@shared/services';
import { API_ENDPOINTS } from '@shared/constants/apiEndpoints';
import { User } from '@appTypes/index';
import { ApiResponse } from '@appTypes/api.types';

export const authService = {
  login: async (email: string, password: string): Promise<AxiosResponse<ApiResponse<{ user: User, token: string, refreshToken: string }>>> => {
    return axiosClient.post(API_ENDPOINTS.AUTH.LOGIN, { email, password });
  },

  register: async (userData: Partial<User> & { password?: string }): Promise<AxiosResponse<ApiResponse<{ user: User, token: string, refreshToken: string }>>> => {

    const dateOfBirth = userData.dateOfBirth;

    const formData = new FormData();
    formData.append('firstName', userData.firstName || '');
    formData.append('lastName', userData.lastName || '');
    formData.append('email', userData.email || '');
    formData.append('password', userData.password || '');
    formData.append('gender', userData.gender || '');
    formData.append('phoneNumber', userData.phone || '');
    formData.append('dateOfBirth', dateOfBirth || '');
    formData.append('height', String(userData.healthProfile?.heightValue || ''));
    formData.append('weight', String(userData.healthProfile?.weightValue || ''));
    formData.append('fitnessObjective', userData.healthProfile?.goals?.[0] || '');
    formData.append('medicalRestrictions', userData.healthProfile?.restrictions || '');

    if (userData.photoLocalUri) {
      const filename = userData.photoLocalUri.split('/').pop() || 'profile.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image/jpeg`;
      formData.append('profilePicture', {
        uri: userData.photoLocalUri,
        name: filename,
        type,
      } as any);
    }


    return axiosClient.post(API_ENDPOINTS.AUTH.REGISTER, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  logout: async (): Promise<AxiosResponse<ApiResponse<null>>> => {
    return axiosClient.post(API_ENDPOINTS.AUTH.LOGOUT);
  },

  refreshToken: async (refreshToken: string): Promise<AxiosResponse<ApiResponse<{ token: string, refreshToken: string }>>> => {
    return axiosClient.post(API_ENDPOINTS.AUTH.REFRESH, { refreshToken });
  },

  forgotPassword: async (email: string): Promise<AxiosResponse<ApiResponse<null>>> => {
    return axiosClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
  },

  resetPassword: async (email: string, newPassword: string): Promise<AxiosResponse<ApiResponse<null>>> => {
    return axiosClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, { email, newPassword });
  },

  verifyResetOtp: async (email: string, otp: string): Promise<AxiosResponse<ApiResponse<null>>> => {
    return axiosClient.post(API_ENDPOINTS.AUTH.VERIFY_OTP, { email, otp });
  },

  verifyEmail: async (email: string, code: string): Promise<AxiosResponse<ApiResponse<null>>> => {
    return axiosClient.post(API_ENDPOINTS.AUTH.VERIFY_EMAIL, { email, code });
  },

};

