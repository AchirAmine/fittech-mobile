import axios from 'axios';

const USDA_API_URL = process.env.EXPO_PUBLIC_USDA_API_URL || 'https://api.nal.usda.gov/fdc/v1';
const USDA_API_KEY = process.env.EXPO_PUBLIC_USDA_API_KEY || 'DEMO_KEY';

export interface FoodSearchCriteria {
  query: string;
  dataType?: string[];
  pageSize?: number;
  pageNumber?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FoodNutrient {
  nutrientId?: number;
  nutrientName?: string;
  nutrientNumber?: string;
  unitName?: string;
  value?: number;
  amount?: number;
  name?: string;
  nutrient?: {
    name: string;
  };
}

export interface FoodSearchResult {
  fdcId: number;
  description: string;
  brandOwner?: string;
  brandName?: string;
  dataType: string;
  publishedDate: string;
  foodNutrients: FoodNutrient[];
  score: number;
}

export interface FoodSearchResponse {
  totalHits: number;
  currentPage: number;
  totalPages: number;
  foods: FoodSearchResult[];
}

const usdaApi = axios.create({
  baseURL: USDA_API_URL,
  params: {
    api_key: USDA_API_KEY,
  },
});

export const nutritionService = {
  searchFoods: async (criteria: FoodSearchCriteria): Promise<FoodSearchResponse> => {
    try {
      const response = await usdaApi.post('/foods/search', {
        ...criteria,
        pageSize: criteria.pageSize || 25,
      });
      return response.data;
    } catch (error) {
      console.error('Error searching foods in USDA API:', error);
      throw error;
    }
  },

  getFoodsList: async (pageNumber: number = 1, pageSize: number = 25): Promise<FoodSearchResult[]> => {
    try {
      const response = await usdaApi.post('/foods/list', {
        dataType: ['Foundation', 'Branded'],
        pageSize,
        pageNumber,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching foods list:', error);
      throw error;
    }
  },

  getGymFoods: async (): Promise<FoodSearchResult[]> => {
    const gymFoodsQueries = [
      'Chicken Breast',
      'Eggs',
      'Whey Protein Isolate',
      'Oats',
      'Salmon',
      'Brown Rice',
      'Sweet Potato',
      'Almonds',
      'Lean Beef',
      'Greek Yogurt',
    ];

    try {
      const promises = gymFoodsQueries.map(query =>
        usdaApi.post('/foods/search', {
          query,
          dataType: ['SR Legacy'],
          pageSize: 1,
        }).then(res => res.data.foods[0]).catch(() => null)
      );

      const results = await Promise.all(promises);
      return results.filter(food => !!food);
    } catch (error) {
      console.error('Error fetching gym foods:', error);
      throw error;
    }
  },

  getFoodDetails: async (fdcId: string | number): Promise<any> => {
    try {
      const response = await usdaApi.get(`/food/${fdcId}`);
      return response.data;
    } catch (error: any) {
      if (error?.response?.status === 404) {
        return null;
      }
      console.error(`Error fetching food details for FDC ID ${fdcId}:`, error);
      throw error;
    }
  },
};
