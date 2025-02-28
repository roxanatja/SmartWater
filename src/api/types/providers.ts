import { Search } from "./common";

export interface IProvidersGetParams extends Search {
    filters?: {
        provider?: string;
        initialDate?: string;
        finalDate?: string;
        fullName?: string;
        email?: string;
        NIT?: string;
        year?: number;
        month?: number;
    }
}

export interface IProviderBody {
    data: {
        user: string;
        fullName: string;
        phoneNumber: string;
        address: string;
        email: string;
        NIT: string;
    };
}

export interface IProviderFilter {
    providerId: string;
}
