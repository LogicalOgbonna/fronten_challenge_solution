import github from "../../api"
import { errorHandler, successHandler } from "../utils"
import { Octokit } from "@octokit/rest"

export const getOrganizationsService = async () => {
    const PAGE_SIZE = 100;
    try {
        const { data } = await github.get(`/organizations?page=1&per_page=${PAGE_SIZE}`)
        return successHandler(data.map(org => ({ name: org.login, avatar: org.avatar_url, description: org.description, id: org.id })))
    } catch (error) {
        return errorHandler(error)
    }
}
export const getRepositoriesByOrganizationService = async (payload) => {
    // 8 was used as the page size because of the loop to get closed issues
    const PAGE_SIZE = 8;
    try {
        const { data, headers } = await github.get(`/orgs/${payload.name}/repos?page=${payload.page}&per_page=${PAGE_SIZE}`)
        const lastPage = parseInt(headers?.link?.split(";")[1]?.split("?")[1]?.split("&")[0]?.replace("page=", ""), 10) || 1;
        const nextPage = parseInt(headers?.link?.split(";")[0]?.split("?")[1]?.split("&")[0]?.replace("page=", ""), 10) || 1;
        const newData = { data: [...data], lastPage, nextPage, totalCount: ((lastPage - 1) * PAGE_SIZE) + data.length }
        return successHandler(newData)
    } catch (error) {
        return errorHandler(error)
    }
}
export const getRepositoryStatisticsService = async ({ org, repo }) => {
    try {
        const { data } = await github.get(`/orgs/${org}/${repo}`)
        return successHandler(data)

    } catch (error) {
        return errorHandler(error)
    }
}

export const getRepositoryClosedIssuesService = async ({ org, repo }) => {
    try {
        const { data } = await github.get(`/repos/${org}/${repo}/issues?state=closed`)
        return successHandler(data)

    } catch (error) {
        return errorHandler(error)
    }
}
export const getRepositoryTopicsService = async ({ org, repo }) => {
    try {
        const { data } = await github.get(`/repos/${org}/${repo}/topics`, {
            headers: {
                Accept: "application/vnd.github.mercy-preview+json"
            }
        })
        return successHandler(data)

    } catch (error) {
        return errorHandler(error)
    }
}

export const searchOrganizationService = async (payload) => {
    try {
        const PAGE_SIZE = 100;
        const { data } = await github.get(`/search/users?per_page=${PAGE_SIZE}&q=${payload}`)
        return successHandler(data.items.map(org => ({ name: org.login, avatar: org.avatar_url, description: org.description, id: org.id })))
    } catch (error) {
        return errorHandler(error)
    }
}

export const octoKitFunction = async () => {
    const octoKitInstance = new Octokit();
    octoKitInstance.rest.request()
}