import { FilteredSearch, Search } from "./common";

export interface IDevolutionGetParams extends Search {
    filters?: {
        client?: string;
        loan?: string;
        year?: string;
        month?: string;
    }
}

export interface IDevolutionConsolidatedGetParams extends FilteredSearch {
    filters?: {
        client?: string;
        user?: string;
        hasContract?: boolean;
        initialDate?: string;
        finalDate?: string;
    }
}

export interface IDevolutionBody {
    data: {
        user: string;
        loan: string;
        client: string;
        comment: string;
        detail: {
            item: string;
            quantity: string;
        }[];
    }
}

export interface IDevolutionFilter {
    devolutionId: string;
}
