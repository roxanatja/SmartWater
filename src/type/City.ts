export interface City {
    _id: string;
    name: string;
    created: string;
    updated: string;
    districtsId: District[];
}

export interface District {
    _id: string;
    name: string;
    description: string;
    cityId?: string;
}

export interface Zone {
    _id: string;
    name: string;
    districts: District[];
}