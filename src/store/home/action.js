import { createAction } from '@reduxjs/toolkit'

export const getOrganizationsAC = createAction('user/getOrganizations')
export const setSelectedOrganizationAC = createAction('user/setSelectedOrganization')
export const getRepositoriesByOrganizationAC = createAction('user/getRepositoriesByOrganization')
export const getRepositoryStatisticsAC = createAction('user/getRepositoryStatistics')
export const searchOrganizationAC = createAction('user/searchOrganization')
