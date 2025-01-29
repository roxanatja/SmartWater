import { CategoryProduct } from "./Products/Category";
import { UnitMeasure } from "./Products/UnitMeasure";

export type BalanceReport = {
    elements: KardexElement[];
    totalGeneral: string;
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
    matchingItems?: any[];
    isProduct: boolean | null;
    hasItemMatch?: boolean;
    type: "product" | "item";
    isItem: boolean | null;
    canSellAndLend: boolean;
}