import { Client } from "../../type/Cliente/Client";
import { FilteredSearch, Search } from "./common";

export interface IClientGetParams extends Search {
    filters?: {
        user?: string;
        hasOrder?: boolean;
        hasLoad?: boolean;
        hasExpiredContracts?: boolean;
        hasContract?: boolean;
        zone?: string;
        initialDate?: string;
        finalDate?: string;
        year?: number;
        month?: number;
        renewedAgo?: number;
        hasCredit?: boolean;
    }
}

export interface IReportClientsParams extends FilteredSearch {
    filters?: {
        user?: string;
        hasOrder?: boolean;
        hasLoad?: boolean;
        hasContract?: boolean;
        zone?: string;
        initialDate?: string;
        finalDate?: string;
        limit?: string;
        renewedAgo?: number;
        renewedIn?: number;
        skip?: string;
    }
}

export interface ISearchGetParams extends Search {
    filters?: {
        text?: string;
    }
}

export interface IClientGetOneParams {
    clientId: string;
}

export interface IClientMatchParams {
    data: {
        phoneNumber: string;
        email: string;
    };
}

export interface IClientRegisterParams {
    data: Client;
}

export interface IPosponeRenovation {
    data: {
        client: string;
        posponeInDays: string;
    };
}

export interface IClientUpdateParams {
    clientId: string;
    data: {
        storeImage: string;
        fullName: string;
        phoneNumber: string;
        address: string;
        comment: string;
        email: string;
        zone: string;
        district: string;
        ciFrontImage: string;
        ciBackImage: string;
        location: {
            latitude: string;
            longitude: string;
        };
        renewInDays: string;
        averageRenewal: boolean;
    };
}
