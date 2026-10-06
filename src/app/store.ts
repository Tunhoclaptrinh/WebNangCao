import { configureStore, type Middleware } from '@reduxjs/toolkit';
import assignmentsReducer from '../features/assignments/assignmentSlice';
import logger from 'redux-logger';

// Check if running in development mode
const isDev =
  (typeof import.meta !== 'undefined' && import.meta.env?.DEV) ||
  process.env.NODE_ENV === 'development';

export const store = configureStore({
  reducer: {
    assignments: assignmentsReducer,
  },
  middleware: (getDefaultMiddleware) => {
    const middlewares = getDefaultMiddleware();
    if (isDev) {
      return middlewares.concat(logger as Middleware);
    }
    return middlewares;
  },
  devTools: isDev,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
