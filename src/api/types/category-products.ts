import { Search } from "./common";

export interface ICategoryGetParams extends Search {
    filters?: {
        year?: number;
        month?: number;
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
