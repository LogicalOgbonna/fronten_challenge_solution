import { configureStore } from '@reduxjs/toolkit'
import reducer from './rootReducer'
import middleware from './rootMiddleware'

export const store = configureStore({
  reducer,
  middleware,
  devTools: process.env.NODE_ENV !== 'production',
})
