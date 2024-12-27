import { FilteredSearch, Search } from "./common";

export interface IDevolutionGetParams extends Search {
    filters?: {
        client?: string;
        loan?: string;
        year?: number;
        month?: number;
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
            quantity: number;
        }[];
    }
}

export interface IDevolutionFilter {
    devolutionId: string;
}
