import { FilteredSearch } from "./common";

export interface IKardexDetailGetParams extends FilteredSearch {
    filters?: {
        elementId: string;
    }
}

export interface IInitialBalanceBody {
    data: {
        user: string;
        documentNumber: string;
        openingDate: string;
        elements: {
            product?: string;
            item?: string;
            quantity: number;
            unitPrice: number;
            inputImport?: number;
        }[];
    }
}

export interface IItemFilter {
    productId: string;
}

export interface IOthersBody {
    user: string;
    comment: string;
    documentNumber: string;
    elements: {
        product?: string;
        item?: string;
        quantity: number;
        unitPrice: number;
    }[];
    registerDate: string;
}

export interface IOtherEntryBody extends IOthersBody {
    inputType: 'production_received' | 'adjustment_entry';
}

export interface IOtherOutputBody extends IOthersBody {
    outputType: 'production_delivered' | 'adjustment_exit';
    forceOut: boolean;
}

export interface IOthersEntryMoreBody {
    user: string;
    comment: string;
    documentNumber: string;
    elementsDetails: {
        elements: {
            product?: string;
            item?: string;
            quantity: number;
            unitPrice?: number;
        }[];
        inputType: 'production_received' | 'adjustment_entry';
    }[]
    registerDate: string;
}

export interface IOthersOutputMoreBody {
    user: string;
    comment: string;
    documentNumber: string;
    elementsDetails: {
        elements: {
            product?: string;
            item?: string;
            quantity: number;
            unitPrice?: number;
        }[];
        outputType: 'production_delivered' | 'adjustment_exit';
    }[]
    registerDate: string;
    forceOut: boolean;
}
