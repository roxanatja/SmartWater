import { FilteredSearch, Search } from "./common";

export interface ILoansGetParams extends Search {
    filters?: {
        client?: string;
        initialDate?: string;
        finalDate?: string;
        hasContract?: boolean;
        hasExpiredContract?: boolean;
        renewedAgo?: number;
        renewedIn?: number;
        year?: string;
        month?: string;
    }
}

export interface ILoanConsolidatedGetParams extends FilteredSearch {
    filters?: {
        user?: string;
        client?: string;
        initialDate?: string;
        finalDate?: string;
        hasContract?: boolean;
    }
}

export interface ILoanBody {
    data: {
        user: string;
        client: string;
        contract: {
            link: string | null;
            validUntil: string;
        };
        comment: string;
        detail: {
            item: string;
            quantity: string;
        }[];
    };
}

export interface IUpdateLoanBody {
    data: {
        user?: string;
        client?: string;
        contract?: {
            link: string | null;
            validUntil: string;
        };
        comment?: string;
        detail?: {
            item: string;
            quantity: string;
        }[];
        totalItems?: number;
    };
}

export interface ILoanFilter {
    loanId: string;
}
