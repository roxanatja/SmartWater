import { CategoryProduct } from "./Products/Category";
import { UnitMeasure } from "./Products/UnitMeasure";
import { User } from "./User";

export type BalanceReport = {
    elements: KardexElement[];
    totalGeneral: string;
}

export type EntrysReport = {
    count: number;
    data: {
        _id: string;
        elementName: string;
        unitMeasure: string,
        totalQuantitys: number;
        totalImports: number;
        initialBalance: {
            quantity: number;
            import: number;
        },
        inputReturnClients: {
            quantity: number;
            import: number;
        },
        inputReceivedProvider: {
            quantity: number;
            import: number;
        },
        inputReceivedProduction: {
            quantity: number;
            import: number;
        },
        inputAdjustment: {
            quantity: number;
            import: number;
        }
    }[];
}

export type OutputsReport = {
    count: number;
    data: {
        _id: string;
        elementName: string;
        unitMeasure: string,
        totalQuantitys: number;
        totalImports: number;
        outputProduction: {
            quantity: number;
            import: number;
        },
        outputSales: {
            quantity: number;
            import: number;
        },
        outputLoans: {
            quantity: number;
            import: number;
        },
        outputAdjustment: {
            quantity: number;
            import: number;
        }
    }[];
}

export type KardexElement = {
    nro: number;
    elementId: string;
    kardexId: string;
    name: string;
    unit: string;
    quantity: number;
    weightedAverageCost: string;
    totalAmount: string;
}

export type KardexDetail = {
    _id: string;
    movements: KardexMovement[];
    element: string;
    totalInputs: number;
    totalOutputs: number;
    finalBalance: number;
}

export type KardexMovement = {
    _id: string,
    type: string,
    registerDate: string,
    documentNumber: string,
    detail: string,
    comment: string,
    code?: string,
    inputQuantity: number,
    unitPriceInput: string,
    inputImport: string,
    outputQuantity: number,
    unitPriceOutput: string,
    outputImport: string,
    balanceAmount: string,
    weightedAverageCost: string,
    balanceImport: string
}

export type MatchedElement = {
    _id: string;
    name: string;
    description: string;
    imageUrl?: string;
    price?: string | number;
    priceBusiness?: string | number;
    category?: CategoryProduct;
    unitMeasure?: UnitMeasure;
    matchingItems?: {
        _id: string;
        name: string;
        description?: string;
        imageUrl?: string;
        updated?: string;
        category?: string;
        unitMeasure?: string;
    }[];
    isProduct: boolean | null;
    hasItemMatch?: boolean;
    type: "product" | "item";
    isItem: boolean | null;
    canSellAndLend: boolean;

    productKardex?: ProductKardex[];
    itemKardex?: ItemKardex[];
    hasKardex: boolean;
    allKardexes?: (ItemKardex | ProductKardex)[];
    initialBalanceTransactions: {
        _id: string;
        user: string;
        kardex: string;
        type: string;
        comment: string;
        quantity: number,
        balance: {
            _id: string,
            user: string,
            registerDate: string,
            inputQuantity: number,
            unitPriceInput: string,
            inputImport: string,
            outputQuantity: number,
            unitPriceOutput: number,
            outputImport: number,
            balanceAmount: number,
            weightedAverageCost: number,
            balanceImport: number
        }
        registerDate: string;
        documentNumber: string;
    }[];
    initialBalance: number;
}

type ItemKardex = {
    _id: string;
    user: string;
    item: string;
}
type ProductKardex = {
    _id: string;
    user: string;
    product: string;
}

export type EntryItemBody = {
    product?: string;
    item?: string;
    quantity: number;
    // unitPrice: number;
    inputType: 'production_received' | 'adjustment_entry';
}

export type OutputItemBody = {
    product?: string;
    item?: string;
    quantity: number;
    // unitPrice: number;
    outputType: 'production_delivered' | 'adjustment_exit';
}

export type OtherEntry = {
    _id: string;
    user: User;
    code?: string;
    quantity: number;
    balance: {
        inputQuantity: number;
        inputImport: number;
        balanceAmount: number;
        cpp: number;
        balanceImport: number;
    };
    registerDate: string;
    documentNumber: string;
    type: 'production_received' | 'adjustment_entry';
    detail: string,
    elementName: string;
}

export type OtherOutput = {
    _id: string;
    user: User;
    code?: string;
    quantity: number;
    balance: {
        inputQuantity: number;
        inputImport: number;
        balanceAmount: number;
        cpp: number;
        balanceImport: number;
    };
    registerDate: string;
    documentNumber: string;
    type: 'production_delivered' | 'adjustment_exit';
    detail: string,
    elementName: string;
}