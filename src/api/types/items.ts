import { Search } from "./common";

export interface IItemsGetParams extends Search {
    filters?: {
        year?: string;
        month?: string;
    }
}

export interface IItemBody {
    data: {
        name: string;
        description: string;
    }
}

export interface IItemFilter {
    productId: string;
}
