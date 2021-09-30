import { createSlice } from '@reduxjs/toolkit'

const homeSlice = createSlice({
  name: 'homeSlice',
  initialState: {
    organizations: [],
    organization: null,
    organizationsLoading: false,
    repositories: { data: [] },
    repositoriesLoading: false,
    repository: null,
    repositoryLoading: false,
  },
  reducers: {
    homeSetter: (state, action) => ({
      ...state,
      [action.payload.type]: action.payload.data,
    }),
  },
})

export const { homeSetter } = homeSlice.actions
export default homeSlice.reducer
