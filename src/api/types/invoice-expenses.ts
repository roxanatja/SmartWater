import { FilteredSearch } from "./common";

export interface IInvExpensesGetParams extends FilteredSearch {
    filters?: {
        user?: string;
        provider?: string;
    }
}

export interface IInvExpensesBody {
    data: {
        expense: string;
        user: string;
        provider: string;
        amount: number;
        date: string;
        cashPayment: boolean;
        paymentMethodCurrentAccount: boolean;
    }
}

export interface IInvExpensesUpdateBody {
    data: {
        expense: string;
        user: string;
        provider: string;
        amount: number;
        date: string;
    }
}

export interface IInvExpensesFilter {
    invExpensesId: string;
}
