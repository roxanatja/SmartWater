export type PhysicalInitialBalace = {
    user: string;
    saldosIniciales: PhysicalBalace[]
}

export type PhysicalBalace = {
    code: string;
    saldo: {
        initialBalance: number;
        item?: {
            name: string;
            _id: string;
        };
        product?: {
            name: string;
            _id: string;
        };
        elementId: string;
        registerDate: string;
    }
}

export type PhysiscalPreviousReport = {
    user: string;
    role: 'admin' | 'user';
    name: string;
    initialBalance: number;
    returnDistributor: number;
    providerPurchase: number;
    deliveredDistributor: number;
    productionDelivered: number;
    returnClient: number;
    stockSale: number;
    stockLoan: number;
    ssg: number;
    diffReportDistrib: number;
    realBalance: number;
}

export type PhysiscalGeneratedReport = {
    _id: string;
    user: string;
    role: 'admin' | 'user';
    elements: {
        product?: string;
        item?: string;
        name: string;
        initialBalance: number;
        purchasedProvider: number;
        returnClient: number;
        stockSale: number;
        stockLoan: number;
        ssg: number;
        ssd: number;
        diff: number;
    }[];
    registerDate: string;
}