import { Search } from "./common";

export interface IProductsGetParams extends Search {
    filters?: {
        year?: string;
        month?: string;
    }
}

export interface IProductBody {
    data: {
        name: string;
        description: string;
        price: string;
        imageUrl: string;
        category: string;
        priceBusiness: string;
    }
}

export interface IProductBodyNoCategory {
    data: {
        name: string;
        description: string;
        price: string;
        imageUrl: string;
        priceBusiness: string;
    }
}

export interface IProductFilter {
    productId: string;
}
