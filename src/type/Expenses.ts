import { Account } from "./AccountEntry";
import { Providers } from "./providers";
import { User } from "./User";

export type Expense = {
    _id: string;
    amount: number;
    amountStatic: number;
    accountEntry: Account;
    user: User;
    provider?: Providers;
    creditBuy: boolean;
    paymentMethodCurrentAccount: boolean;
    hasInVoice: boolean;
    hasReceipt: boolean;
    documentNumber: string;
    comment: string;
    created: string;
    updated: string;

    // Inventories
    items: EgresoItemItem[];
    itemsTotal: number;
    products: EgresoProductItem[];
    productsTotal: number;
}

export type EgresoProductItem = {
    product: {
        name: string;
        _id: string;
    },
    quantity: number;
    subtotal: number;
    unitPrice: number;
}
export type EgresoItemItem = {
    item: {
        name: string;
        _id: string;
    },
    quantity: number;
    subtotal: number;
    unitPrice: number;
}

export type EgresoItem = EgresoItemItem | EgresoProductItem