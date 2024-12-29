import { Search } from "./common";

export interface IProductsGetParams extends Search {
    filters?: {
        year?: number;
        month?: number;
    }
}

export interface IProductBody {
    data: {
        name: string;
        description: string;
        price: number;
        imageUrl: string;
        category: string;
        priceBusiness: number;
    }
}

export interface IProductFilter {
    productId: string;
}
