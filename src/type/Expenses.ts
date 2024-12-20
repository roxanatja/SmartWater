export type Expense = {
    _id: string;
    amount: number;
    accountEntry: string;
    user: string;
    provider: string;
    paymentMethodCurrentAccount: boolean;
    hasInVoice: boolean;
    documentNumber: string;
    comment: string;
    created: string;
    updated: string;
    creditbuy: boolean;
}