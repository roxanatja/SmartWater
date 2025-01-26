import { Search } from "./common";

export interface IZonesGetParams extends Search {
    filters?: {
        year?: number;
        month?: number;
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
        districtName: string;
        zoneId: string;
        cityId: string
    }
}

export interface IZoneFilter {
    zoneId: string;
}
