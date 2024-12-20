import { FilteredSearch, Search } from "./common";

export interface ISalesGetParams extends Search {
    filters?: {
        user?: string;
        client?: string;
        zone?: string;
        initialDate?: string;
        finalDate?: string;
        creditSale?: boolean;
        hasInvoice?: boolean;
        hasClientLoan?: boolean;
        hasClientContract?: boolean;
        hasClientExpiredContracts?: boolean;
        year?: string;
        month?: string;
    }
}

export interface ISalesProductsGetParams extends FilteredSearch {
    filters?: {
        user?: string;
        client?: string;
        zone?: string;
        initialDate?: string;
        finalDate?: string;
        limit?: string;
        skip?: string;
    }
}

export interface ISalesConsolidatedGetParams extends FilteredSearch {
    filters?: {
        user?: string;
        client?: string;
        initialDate?: string;
        finalDate?: string;
    }
}

export interface ISaleBody {
    data: {
        client: string;
        user: string;
        comment: string;
        zone: string;
        detail: {
            product: string;
            quantity: string;
            price: string;
        }[];
        creditSale: boolean;
        hasInvoice: boolean;
        paymentMethodCurrentAccount: boolean;
    };
}

export interface ISaleFilter {
    saleId: string;
}
