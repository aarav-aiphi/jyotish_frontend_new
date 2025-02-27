import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './types';
import { getCookie } from '@/lib/utils';

interface SignupPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}


interface LoginResponse {
  success: boolean;
  message: string;
  user: {
    _id: string;
    name: string;
    username: string;
    email: string;
    avatar: string;
    role: 'User' | 'Astrologer' | 'Admin';
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  token: string;
}

export interface UserState {
  user: {
    _id: string;
    name: string;
    username: string;
    email: string;
    avatar: string;
    role: 'User' | 'Astrologer' | 'Admin';
    createdAt: string;
    updatedAt: string;
    __v: number;
  } | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

// 1) Async thunk for signing up
export const signupUser = createAsyncThunk<
  any,
  SignupPayload
>(
  'user/signup',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/v1/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message);
      }
      const data = await response.json();
      return data; // This is the user object from the server
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Something went wrong');
    }
  }
);


export const signupAstrologer = createAsyncThunk(
  'user/signupAstrologer',
  async (
    payload: {
      name: string;
      username: string;
      email: string;
      password: string;
      languages: string[];
      experience: number;
      costPerMinute: number;
      about: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch('/api/v1/signup-astrologer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message);
      }
      const data = await response.json();
      return data; // user data
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Something went wrong');
    }
  }
);

const setAuthCookies = (token: string) => {
  document.cookie = `token=${token}; path=/; max-age=86400; secure; samesite=lax`;
};
export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (formData: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/v1/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include', // Important for cookie handling
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message);
      }

      const data: LoginResponse = await response.json();

      // Store token in localStorage
      localStorage.setItem('token', data.token);
      
      // Set authentication cookie 
      setAuthCookies(data.token);

      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);


// 3) Async thunk for signing out
export const signoutUser = createAsyncThunk(
  'user/signout',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/v1/signout', { method: 'GET' });
      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message);
      }

      localStorage.removeItem('token');
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      return response.json();
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Something went wrong');
    }
  }
);

export const isAuthenticated = (): boolean => {
  const token = getCookie('token'); 
  if (!token) return false;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp > Date.now() / 1000;
  } catch {
    return false;
  }
};

export const fetchCurrentUser = createAsyncThunk(
  "user/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!isAuthenticated()) {
        return rejectWithValue("Not authenticated");
      }

      const response = await fetch('/api/v1/users/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch profile");
      }

      return await response.json();
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // For any synchronous reducers if needed
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    // ============== SIGNUP THUNKS ==============
    builder.addCase(signupUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(signupUser.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.user = payload;
      state.error = null;
    });
    builder.addCase(signupUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    builder.addCase(signupAstrologer.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(signupAstrologer.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.user = payload;
      state.error = null;
    });
    builder.addCase(signupAstrologer.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });


    // ============== LOGIN THUNKS ==============
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.user = payload.user;
      state.token = payload.token;
      state.error = null;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // ============== SIGNOUT THUNKS ==============
    builder.addCase(signoutUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(signoutUser.fulfilled, (state) => {
      state.token = null;
      localStorage.removeItem('token');
    });
    builder.addCase(signoutUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Then handle in extraReducers
    builder
      .addCase(fetchCurrentUser.fulfilled, (state, { payload }) => {
        state.user = payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchCurrentUser.rejected, (state, { payload }) => {
        state.user = null;    // means not logged in or error
        state.loading = false;
        state.error = payload as string;
      })
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      });
  },
});

export const { setUser } = userSlice.actions;

export const selectUser = (state: RootState) => state.user.user;
export const selectLoading = (state: RootState) => state.user.loading;
export const selectError = (state: RootState) => state.user.error;
export default userSlice.reducer;
