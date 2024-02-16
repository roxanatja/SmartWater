type Sale = {
    _id: string,
    client: string,
    user: string,
    zone: string,
    comment: string,
    detail: Array<{
        product: string,
        quantity: number,
        price: number,
        _id: string
    }>,
    total: number,
    creditSale: boolean,
    created: string,
    updated: string
};

export type { Sale };