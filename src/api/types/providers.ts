import { Search } from "./common";

export interface IProvidersGetParams extends Search {
    filters?: {
        fullName?: string;
        email?: string;
        NIT?: string;
        year?: string;
        month?: string;
    }
}

export interface IProviderBody {
    data: {
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
