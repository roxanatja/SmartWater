import { PhysicalInitialBalace, PhysiscalGeneratedReport, PhysiscalPreviousReport } from "../../type/PhysicalInventory";
import { FilteredSearch, Search } from "./common";

export interface IItemsGetParams extends Search {
    filters?: {
        year?: number;
        month?: number;
    }
}

export interface IPhysicalGetParams extends FilteredSearch {
    filters?: {
        intialDate?: string;
        endDate?: string;
        user?: string;
    }
}

export type PhysicalGetReturnMap = {
    'initial-balance': { balances: PhysicalInitialBalace[] | { message: string } };
    'prev-report': { balances: PhysiscalPreviousReport[] | { message: string } };
    'generated-report': { balances: PhysiscalGeneratedReport[] | { message: string } };
}

export interface IInitialBalanceBody {
    data: {
        users: {
            user: string;
            role: 'admin' | 'user';
            code?: string;  // For edit
            forceCreation?: boolean; // For create
            elements: {
                product?: string;
                item?: string;
                initialBalance: number;
            }
        }[];
        registerDate: string;
    }
}

export interface ISaveReportBody {
    data: {
        user: string;
        role: 'admin' | 'user';
        elements: {
            role: 'admin' | 'user';
            product?: string;
            item?: string;
            initialBalance: number;
            returnDistributor: number;
            providerPurchase: number;
            deliveredDistributor: number;
            productionDelivered: number;
            returnClient: number;
            stockSale: number;
            stockLoan: number;
            ssg: number;
            ssd: number;
            diffReportDistrib: number;
            diff: number;
            realBalance: number;
        }[];
        registerDate: string;
    }
}

export interface IInventoryFilter {
    inventoryId: string;
}

export interface IDeleteBody {
    data: {
        user: string;
        code: string;
        elements: {
            item?: string;
            product?: string;
        }[];
        registerDate: string;
    }
}