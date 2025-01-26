export type FilteredSearch = {
    filters?: { [key: string]: any }
}

export type PaginatedSearch = {
    pagination?: {
        pageSize: number
        page: number
        sort?: 'asc' | 'desc'
    }
}

export type Search = FilteredSearch & PaginatedSearch

export type QueryMetadata = {
    metadata: {
        totalCount?: number;
        page: number;
        pageSize: number;
        previousPage: number | null;
        nextPage: number | null;
        year?: number | null;
        month?: number | null;
    }
} 