import { FilteredSearch, Search } from "./common";

export interface ISalesGetParams extends Search {
    filters?: {
        user?: string;
        client?: string;
        renewedAgo?: number;
        renewedIn?: number;
        zone?: string;
        initialDate?: string;
        finalDate?: string;
        userDelete?: boolean;
        creditSale?: boolean;
        pendingBalance?: boolean;
        hasInvoice?: boolean;
        hasClientLoan?: boolean;
        hasClientContract?: boolean;
        hasClientExpiredContracts?: boolean;
        year?: number;
        month?: number;
        paymentMethodCash?: boolean;
        paymentMethodCurrentAccount?: boolean;
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
            quantity: number;
            price: string;
        }[];
        creditSale: boolean;
        hasInvoice: boolean;
        forceOut: boolean;
        paymentMethodCurrentAccount: boolean;
    };
}

export interface ISaleFilter {
    saleId: string;
}
