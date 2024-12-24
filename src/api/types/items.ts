import { Search } from "./common";

export interface IItemsGetParams extends Search {
    filters?: {
        year?: number;
        month?: number;
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
