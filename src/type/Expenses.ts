import { Providers } from "./providers";

export type Expense = {
    _id: string;
    amount: number;
    accountEntry: string;
    user: string;
    provider?: Providers;
    creditBuy: boolean;
    paymentMethodCurrentAccount: boolean;
    hasInVoice: boolean;
    documentNumber: string;
    comment: string;
    created: string;
    updated: string;
}