import { FilteredSearch, Search } from "./common";

export interface IClientGetParams extends Search {
    filters?: {
        user?: string;
        hasOrder?: boolean;
        hasLoan?: boolean;
        hasExpiredContracts?: boolean;
        hasContract?: boolean;
        zone?: string;
        initialDate?: string;
        finalDate?: string;
        year?: number;
        month?: number;
        renewedAgo?: number;
        renewedIn?: number;
        hasCredit?: boolean;
        clientDeleted?: boolean;
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
        clientDeleted?: boolean;
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
    data: {
        user: string;
        isClient: boolean;
        storeImage: string;
        fullName: string;
        phoneNumber: string;
        email?: string;
        address?: string;
        comment: string;
        ciFrontImage?: string;
        ciBackImage?: string;
        zone: string;
        district: string;
        location: {
            latitude: string;
            longitude: string;
        };
        averageRenewal: boolean;
        clientImage?: string;
        renewInDays?: number;
        reference?: string;
        hasLoan: boolean;
        hasOrder: boolean;
        hasContract: boolean;
        credit: number;
        billingInfo: {
            NIT: string;
            name: string;
        };
        phoneLandLine?: string;
        isAgency: boolean;
    };
}

export interface IPosponeRenovation {
    data: {
        client: string;
        posponeInDays: number;
    };
}

export interface IClientUpdateParams {
    clientId: string;
    data: {
        storeImage?: string;
        billingInfo?: {
            NIT?: string;
            name?: string;
        };
        fullName?: string;
        phoneNumber?: string;
        email?: string;
        address?: string;
        reference?: string;
        comment: string;
        zone?: string;
        district: string;
        clientImage?: string;
        ciFrontImage?: string;
        ciBackImage?: string;
        location?: {
            latitude?: string;
            longitude?: string;
        };
        renewInDays?: number | null;
        averageRenewal?: boolean;
        isAgency?: boolean;
        isClient?: boolean;
        phoneLandLine?: string | null;
    };
}

export interface IClientForm {
    _id?: string;
    user: string;
    isClient: boolean;
    storeImage: string;
    fullName: string;
    phoneNumber: string;
    email?: string;
    address?: string;
    comment?: string;
    ciFrontImage?: string;
    ciBackImage?: string;
    zone: string;
    district: string;
    location: {
        latitude: string;
        longitude: string;
    };
    clientImage?: string;
    renewDate: string;
    reference?: string;
    hasLoan: boolean;
    hasOrder: boolean;
    hasContract: boolean;
    renewInDays: number;
    billingInfo: {
        NIT: string;
        name: string;
    };
    phoneLandLine?: string;
    isAgency: boolean;
    linkAddress?: string;
    dayrenew: boolean;
    code?: string;
    created: string;
    updated: string;
}