import { Search } from "./common";

export interface IAccountsGetParams extends Search {
    filters?: {
        year?: number;
        month?: number;
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
