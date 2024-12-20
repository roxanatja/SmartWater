import { FilteredSearch } from "./common";

export interface IRegistersGetParams extends FilteredSearch {
    filters?: {
        user?: string;
        year?: string;
        month?: string;
        hour?: string;
        open?: boolean;
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
        initialMount: number;
        user: string;
        startTime?: string;
    }
}

export interface IRegistersCloseBody {
    data: {
        user: string;
        endDate: string;
        cash: number;
        currentAccount: number;
    }
}