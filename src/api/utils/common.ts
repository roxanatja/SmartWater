import { Search } from "../types/common";

export const generateQueryString = (params: Search): string | null => {
    let query = ""

    if (params.pagination) {
        query += `page=${params.pagination.page}`
        query += `&pageSize=${params.pagination.pageSize}`

        if (params.pagination.sort) {
            query += `&sort=${params.pagination.sort}`
        }
    }

    if (params.filters && Object.keys(params.filters).length > 0) {
        query += `${params.pagination ? "&" : ""}${Object.keys(params.filters).map(key => `${key}=${params.filters![key]}`).join("&")}`
    }

    return query.trim().length > 0 ? query.trim() : null
}