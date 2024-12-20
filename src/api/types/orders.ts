import { Search } from "./common";

export interface IOrdersGetParams extends Search {
    filters?: {
        user?: string;
        client?: string;
        distributorRedirectId?: string;
        zone?: string;
        district?: string;
        attended?: boolean;
        attendedDate?: string;
        deliverDateInit?: string;
        deliverDateEnd?: string;
        initialDate?: string;
        finalDate?: string;
        year?: string;
        month?: string;
    }
}

export interface IOrderBody {
    data: {
        user: string;
        client: string;
        distributorRedirectId: string;
        comment: string;
        deliverDate: string;
        detail: {
            product: string;
            quantity: string;
        }[];
        clientNotRegistered: {
            fullName: string;
            phoneNumber: string;
            address: string;
            district: string;
            zone: string;
            cityId: string;
            location: {
                latitude: string;
                longitude: string;
            };
        };
    }
}

export interface IUpdateOrderBody {
    data: {
        comment?: string;
        deliverDate?: string;
        detail?: {
            product: string;
            quantity: string;
        }[];
        clientNotRegistered?: {
            fullName: string;
            phoneNumber: string;
            address: string;
            district: string;
            location: {
                latitude: string;
                longitude: string;
            };
        };
    }
}

export interface IOrderFilter {
    orderId: string;
}
