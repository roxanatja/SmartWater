import { FilteredSearch, Search } from "./common";

export interface IDistricsGetParams extends Search {
    filters?: {
        year?: string;
        month?: string;
    }
}

export interface IDistricSearchParams extends FilteredSearch {
    filters: {
        name: string;
        cityId: string;
    }
}

export interface IDistricBody {
    data: {
        name: string;
        description: string;
        cityId: string;
    }
}

export interface IDistricUpdateBody {
    data: {
        name: string;
        description: string;
    }
}

export interface IDistricFilter {
    districtId: string;
}
