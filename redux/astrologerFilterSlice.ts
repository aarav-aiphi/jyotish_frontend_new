import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState, store } from './store';
import { fetchFilterOptions } from './filterOptionsSlice';

export interface AstrologerFilterState {
  search: string;
  sort: string;
  minRating: number;
  specialization: string[];
  language: string[];
  minExperience: number;
  maxCost: number;
  status: string;
  verified: boolean;
  tag: string;
  page: number;
  limit: number;
  astrologers: any[];
  loading: boolean;
  totalPages: number;
  currentPage: number;
}

const initialState: AstrologerFilterState = {
  search: '',
  sort: 'rating',
  minRating: 0,
  specialization: [],
  language: [],
  minExperience: 0,
  maxCost: 500,
  status: '',
  verified: false,
  tag: '',
  page: 1,
  limit: 10,
  astrologers: [],
  loading: false,
  totalPages: 1,
  currentPage: 1,
};

export const fetchAstrologers = createAsyncThunk(
  'astrologers/fetch',
  async (_, { getState }) => {
    const state = getState() as RootState;
    const filters = state.astrologerFilters;

    const queryParams = new URLSearchParams();

    if (filters.search.trim()) queryParams.set('search', filters.search);
    if (filters.sort !== 'rating') queryParams.set('sort', filters.sort);
    if (filters.minRating > 0) queryParams.set('minRating', filters.minRating.toString());
    if (filters.minExperience > 0) queryParams.set('minExperience', filters.minExperience.toString());
    if (filters.maxCost < 500) queryParams.set('maxCost', filters.maxCost.toString());
    if (filters.status) queryParams.set('status', filters.status);
    if (filters.verified) queryParams.set('verified', 'true');
    if (filters.page > 1) queryParams.set('page', filters.page.toString());
    if (filters.limit !== 10) queryParams.set('limit', filters.limit.toString());

    if (filters.specialization.length > 0) {
      queryParams.set('specialization', filters.specialization.join(','));
    }
    if (filters.language.length > 0) {
      queryParams.set('language', filters.language.join(','));
    }
    const token = state.user.token;

    try {
      const res = await fetch(`/api/v1/astrologers?${queryParams}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error('Failed to fetch astrologers');
      const data = await res.json();

      return {
        astrologers: data.data, 
        totalPages: data.totalPages,
        currentPage: data.page
      };
    } catch (error) {
      console.error('Error fetching astrologers:', error);
      throw error;
    }
  }
);

export const astrologerFilterSlice = createSlice({
  name: 'astrologerFilters',
  initialState,
  reducers: {
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
      state.page = 1;
    },
    setSort: (state, action: PayloadAction<string>) => {
      state.sort = action.payload;
      state.page = 1;
    },
    setMinRating: (state, action: PayloadAction<number>) => {
      state.minRating = action.payload;
      state.page = 1;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = Math.max(1, action.payload);
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
    },
    setStatus: (state, action: PayloadAction<string>) => {
      state.status = action.payload;
      state.page = 1;
    },
    setVerified: (state, action: PayloadAction<boolean>) => {
      state.verified = action.payload;
      state.page = 1;
    },
    setSpecializations: (state, action: PayloadAction<string[]>) => {
      state.specialization = action.payload.filter(Boolean);
      state.page = 1;
    },
    setLanguages: (state, action: PayloadAction<string[]>) => {
      state.language = action.payload.filter(Boolean);
      state.page = 1;
    },
    setMinExperience: (state, action: PayloadAction<number>) => {
      state.minExperience = Math.max(0, action.payload);
      state.page = 1;
    },
    setMaxCost: (state, action: PayloadAction<number>) => {
      state.maxCost = Math.min(500, Math.max(0, action.payload));
      state.page = 1;
    },
    resetFilters: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAstrologers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAstrologers.fulfilled, (state, action) => {
        state.loading = false;
        state.astrologers = action.payload.astrologers;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchAstrologers.rejected, (state) => {
        state.loading = false;
        state.astrologers = [];
      });
  },
});

export const {
  setSearch,
  setSort,
  setMinRating,
  setPage,
  setLimit,
  setStatus,
  setVerified,
  setSpecializations,
  setLanguages,
  setMinExperience,
  setMaxCost,
  resetFilters
} = astrologerFilterSlice.actions;

export const selectAstrologerFilters = (state: RootState) => state.astrologerFilters;

export default astrologerFilterSlice.reducer;