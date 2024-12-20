import { Search } from "./common";

export interface IZonesGetParams extends Search {
    filters?: {
        year?: string;
        month?: string;
    }
}

export interface IZoneBody {
    data: {
        name: string;
        description: string;
        districts: string[]
    }
}

export interface IZoneUpdateBody {
    data: {
        name: string;
        description: string;
        districts?: string[]
    }
}

export interface IZoneAssignDistrictBody {
    data: {
        district: string;
        zoneId: string;
        cityId: string[]
    }
}

export interface IZoneFilter {
    zoneId: string;
}
