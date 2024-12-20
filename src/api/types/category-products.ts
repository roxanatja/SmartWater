import { Search } from "./common";

export interface ICategoryGetParams extends Search {
    filters?: {
        year?: string;
        month?: string;
    }
}

export interface ICategoryBody {
    data: {
        name: string;
        description: string;
    }
}

export interface ICategoryFilter {
    categoryId: string;
}
