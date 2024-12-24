import { Search } from "./common";

export interface IBillsGetParams extends Search {
    filters?: {
        client?: string;
        zone?: string;
        user?: string;
        hasClientLoan?: boolean;
        hasClientContract?: boolean;
        hasClientCredit?: boolean;
        cashPayment?: boolean;
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
        amount: string;
        client: string;
        cashPayment: boolean;
        paymentMethodCurrentAccount: boolean;
    }
}

export interface IBillByClientBody {
    data: {
        zone: string;
        user: string;
        amount: string;
        client: string;
        cashPayment: boolean;
        paymentMethodCurrentAccount: boolean;
    }
}

export interface IBillsFilter {
    billsId: string;
}
