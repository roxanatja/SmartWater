import { Search } from "./common";

export interface IUnitGetParams extends Search {
    filters?: {
        measureId?: string;
    }
}

export interface IUnitBody {
    data: {
        name: string;
        description: string;
    }
}

export interface IUnitFilter {
    unitId: string;
}
