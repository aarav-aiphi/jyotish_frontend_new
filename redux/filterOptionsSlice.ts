import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, store } from './store';

interface SpecializationType {
  _id: string;
  name: string;
}

export interface FilterOptionsState {
  languages: string[];
  specializations: SpecializationType[];
  minCost: number;
  maxCost: number;
  minExperience: number;
  maxExperience: number;
  loading: boolean;
  error: string | null;
}

const initialState: FilterOptionsState = {
  languages: [],
  specializations: [],
  minCost: 0,
  maxCost: 500,
  minExperience: 0,
  maxExperience: 40,
  loading: false,
  error: null,
};

export const fetchFilterOptions = createAsyncThunk(
  'filterOptions/fetch',
  async (_, thunkAPI) => {
    try {
      const token = (thunkAPI.getState() as RootState).user.token;
      const res = await fetch(`/api/v1/astrologers/filter-options`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch filter options');
      const data = await res.json();
      return data.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const filterOptionsSlice = createSlice({
  name: 'filterOptions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFilterOptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFilterOptions.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.languages = action.payload.languages || [];
        state.specializations = action.payload.specializations || [];
        state.minCost = action.payload.minCost;
        state.maxCost = action.payload.maxCost;
        state.minExperience = action.payload.minExperience;
        state.maxExperience = action.payload.maxExperience;
      })
      .addCase(fetchFilterOptions.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload || 'Could not fetch filter options';
      });
  }
});

export default filterOptionsSlice.reducer;
