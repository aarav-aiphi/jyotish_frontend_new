import { configureStore, Reducer, AnyAction } from '@reduxjs/toolkit';
import userReducer from '@/redux/userSlice';
import chatUIReducer from './chatSlice';
import astrologerFilterReducer from './astrologerFilterSlice';
import filterOptionsReducer from './filterOptionsSlice';
import type { UserState } from './userSlice';
import type { ChatUIState } from './chatSlice';
import type { AstrologerFilterState } from './astrologerFilterSlice';
import type { FilterOptionsState } from './filterOptionsSlice';

export interface RootState {
  user: UserState;
  chatUI: ChatUIState;
  astrologerFilters: AstrologerFilterState;
  filterOptions: FilterOptionsState;
}

// Create a more specific type for the reducer that includes undefined state
type ReducerWithUndefined<S> = Reducer<S, AnyAction, S | undefined>;

// Define the reducers with proper typing
const reducers = {
  user: userReducer as ReducerWithUndefined<UserState>,
  chatUI: chatUIReducer as ReducerWithUndefined<ChatUIState>,
  astrologerFilters: astrologerFilterReducer as ReducerWithUndefined<AstrologerFilterState>,
  filterOptions: filterOptionsReducer as ReducerWithUndefined<FilterOptionsState>
};

export const setupStore = (preloadedState?: Partial<RootState>) => {
  return configureStore({
    reducer: reducers,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['persist/PERSIST']
        }
      })
  });
};

// Create initial state
const initialState: Partial<RootState> = {
  user: {
    user: null,
    token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
    loading: false,
    error: null,
  }
};

export const store = setupStore(initialState);

export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];