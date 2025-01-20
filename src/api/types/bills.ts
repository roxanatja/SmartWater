import { Search } from "./common";

export interface IBillsGetParams extends Search {
    filters?: {
        client?: string;
        zone?: string;
        user?: string;
        initialDate?: string;
        finalDate?: string;
        hasClientLoan?: boolean;
        hasClientContract?: boolean;
        hasClientExpiredContracts?: boolean;
        hasClientCredit?: boolean;
        cashPayment?: boolean;
        paymentMethodCurrentAccount?: boolean;
        hasBalance?: boolean;
        renewedAgo?: number;
        renewedIn?: number;
        year?: number;
        month?: number;
    }
}

export interface IBillsBody {
    data: {
        zone: string;
        user: string;
        sale: string;
        client: string;
        amount: number
        cashPayment: boolean;
        paymentMethodCurrentAccount: boolean;
    }
}

export interface IBillByClientBody {
    data: {
        zone: string;
        user: string;
        amount: number;
        client: string;
        cashPayment: boolean;
        paymentMethodCurrentAccount: boolean;
    }
}

export interface IBillsFilter {
    billsId: string;
}
