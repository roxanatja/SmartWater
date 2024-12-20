import { Search } from "./common";

export interface IAccountsGetParams extends Search {
    filters?: {
        year?: string;
        month?: string;
    }
}

export interface IAccountBody {
    data: {
        name: string;
        description: string;
    }
}

export interface IAccountFilter {
    accountId: string;
}
