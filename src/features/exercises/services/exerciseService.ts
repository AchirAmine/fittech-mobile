import axios from 'axios';

const BASE_URL = 'https://oss.exercisedb.dev/api/v1';

export interface Exercise {
  exerciseId: string;
  name: string;
  bodyParts?: string[];
  equipments?: string[];
  targetMuscles?: string[];
  secondaryMuscles?: string[];
  gifUrl: string;
  instructions?: string[];
}

export interface PaginatedResponse<T> {
  success: boolean;
  meta: {
    total: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    nextCursor?: string;
    previousCursor?: string;
  };
  data: T[];
}

export interface SearchResponse {
  success: boolean;
  data: Array<{
    exerciseId: string;
    name: string;
    gifUrl: string;
  }>;
}

export interface DetailResponse {
  success: boolean;
  data: Exercise;
}

const plainAxios = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

export const exerciseService = {
  getExercises: async (params: {
    name?: string;
    targetMuscles?: string;
    bodyParts?: string;
    equipments?: string;
    limit?: number;
    after?: string;
    before?: string;
  }): Promise<PaginatedResponse<Exercise>> => {
    const { data } = await plainAxios.get<PaginatedResponse<Exercise>>('/exercises', {
      params: {
        limit: params.limit || 10,
        ...params,
      },
    });
    return data;
  },

  searchExercises: async (search: string): Promise<SearchResponse> => {
    const { data } = await plainAxios.get<SearchResponse>('/exercises/search', {
      params: {
        search,
      },
    });
    return data;
  },

  getExerciseById: async (exerciseId: string): Promise<DetailResponse> => {
    const { data } = await plainAxios.get<DetailResponse>(`/exercises/${exerciseId}`);
    return data;
  },
};
