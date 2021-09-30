import _ from 'lodash'
import { notify } from '../utils'
import { homeSetter } from './reducer'
import {
  getOrganizationsService,
  getRepositoriesByOrganizationService,
  getRepositoryClosedIssuesService,
  getRepositoryStatisticsService,
  getRepositoryTopicsService,
  searchOrganizationService
} from './service'

const getOrganizations = (store) => (next) => async (action) => {
  if (action.type !== 'user/getOrganizations') return next(action)
  store.dispatch(homeSetter({ type: "organizationsLoading", data: true }))
  const { data, success } = await getOrganizationsService()
  store.dispatch(homeSetter({ type: "organizationsLoading", data: false }))
  if (!success) return notify({ type: 'error', description: data })
  store.dispatch(homeSetter({ type: "organizations", data: data }))
  //   any other thing goes here
}

const setSelectedOrganization = (store) => next => action => {
  if (action.type !== 'user/setSelectedOrganization') return next(action)
  store.dispatch(homeSetter({ type: "organization", data: action.payload }))
}
const getRepositoriesByOrganization = (store) => (next) => async (action) => {
  if (action.type !== 'user/getRepositoriesByOrganization') return next(action)
  store.dispatch(homeSetter({ type: "repositoriesLoading", data: true }))
  const { data, success } = await getRepositoriesByOrganizationService(action.payload)

  if (!success) {
    store.dispatch(homeSetter({ type: "repositoriesLoading", data: false }))
    return notify({ type: 'error', description: data })
  }
  // GitHub does not return 
  const repositories = [...data.data]
  for (let i = 0; i < repositories.length; i++) {
    const { data: issuesData } = await getRepositoryClosedIssuesService({ repo: repositories[i].name, org: action.payload.name })
    // Getting the topics here
    // const { data: topics } = await getRepositoryTopicsService({ repo: repositories[i].name, org: action.payload.name })
    // console.log("🚀 ~ file: middleware.js ~ line 42 ~ getRepositoriesByOrganization ~ topics", topics)
    repositories[i] = { ...repositories[i], closed_issues: issuesData?.length || 0 }
    if (repositories.length - 1 === i) {
      store.dispatch(homeSetter({ type: "repositories", data: { ...data, data: repositories } }))
      store.dispatch(homeSetter({ type: "repositoriesLoading", data: false }))
    }
  }
}
const getRepositoryStatistics = (store) => (next) => async (action) => {
  if (action.type !== 'user/getRepositoryStatistics') return next(action)
  store.dispatch(homeSetter({ type: "repositoryLoading", data: true }))
  const { data, success } = await getRepositoryStatisticsService(action.payload)
  store.dispatch(homeSetter({ type: "repositoryLoading", data: false }))
  if (!success) return notify({ type: 'error', description: data })
  store.dispatch(homeSetter({ type: "repository", data }))
}
const searchOrganization = (store) => (next) => async (action) => {
  if (action.type !== 'user/searchOrganization') return next(action)
  _.debounce(async () => {
    store.dispatch(homeSetter({ type: "organizationsLoading", data: true }))
    const { data, success } = await searchOrganizationService(action.payload);
    const { organizations } = { ...store.getState().homeSlice }
    const newState = _.unionBy(data, organizations, "name")
    store.dispatch(homeSetter({ type: "organizationsLoading", data: false }))
    if (!success) return notify({ type: 'error', description: data })
    store.dispatch(homeSetter({ type: "organizations", data: newState }))

  }, 1000)()

}
const dashboardMiddleware = [
  getOrganizations,
  getRepositoriesByOrganization,
  getRepositoryStatistics,
  setSelectedOrganization,
  searchOrganization
]
export default dashboardMiddleware
