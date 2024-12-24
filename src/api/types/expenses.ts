import { Search } from "./common";

export interface IExpensesGetParams extends Search {
    filters?: {
        user?: string;
        provider?: string;
        accountEntry?: string;
        creditBuy?: boolean;
        documentNumber?: string;
        amount?: number;
        paymentMethodCurrentAccount?: boolean;
        hasInVoice?: boolean;
        year?: number;
        month?: number;
    }
}

export interface IExpenseBody {
    data: {
        amount: string;
        accountEntry: string;
        user: string;
        provider: string;
        creditbuy: boolean;
        paymentMethodCurrentAccount: boolean;
        hasInVoice: boolean;
        documentNumber: string;
        comment: string;
    }
}

export interface IExpenseFilter {
    expenseId: string;
}
