import { Comission } from "../../type/Comission";
import { FilteredSearch } from "./common";

export interface IComissionGetParams extends FilteredSearch {
    filters?: {
        user?: string;
        comissionId?: string;
        initialDate?: string;
        endDate?: string;
        percentage?: number;
    }
}

export type ComissionGetReturnMap = {
    general: Comission<'general'>[];
    byuser: Comission<'byuser'>[];
    specific: Comission<'specific'>[];
}

export interface IComissionGeneralBody {
    data: {
        initialDate: string;
        endDate: string;
        percentage: number;
    }
}

export interface IComissionUserBody {
    data: {
        users: {
            user: string;
            initialDate: string;
            endDate: string;
            percentage: number;
        }[]
    }
}

export interface IComissionSpecificBody {
    data: {
        users: {
            user: string;
            initialDate: string;
            endDate: string;
            elements: {
                product: string;
                percentage: number;
            }[]
        }[]
    }
}

export interface IComissionFilter {
    comissionId: string;
}

export interface IComissionByUserUpdateBody {
    data: {
        percentage: number;
    }
}

export interface IComissionSpecificUpdateBody {
    data: {
        elements: {
            product: string;
            percentageElem: number;
        }[];
    }
}
