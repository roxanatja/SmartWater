import { FilteredSearch } from "./common";

export interface IRegistersGetParams extends FilteredSearch {
    filters?: {
        user?: string;
        year?: number;
        month?: number;
        hour?: string;
        open?: boolean;
        creationMethod?: "open-close" | 'create';
    }
}

export interface IRegistersReportGetParams extends FilteredSearch {
    filters?: {
        dataInit: string;
        dateEnd: string;
        hourOpen?: string;
        hourClose?: string;
        userId: string;
        initialMount: number;
    }
}

export interface IRegistersOpenBody {
    data: {
        startDate: string;
        initialAmount: number;
        user: string;
    }
}

export interface IRegistersOpenCloseBody {
    data: {
        startDate: string;
        endDate: string;
        initialAmount: number;
        user: string;
    }
}

export interface IRegistersCloseBody {
    data: {
        user: string;
        endDate: string;
        currentAccount: number;
        cash: number;
    }
}

export interface IRegistersFilter {
    registryId: string;
}