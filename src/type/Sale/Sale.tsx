export interface DetailData {
    product: string;
    quantity: string;
    price: string;
}

export interface Sale { 
    client: string; 
    user: string; 
    comment: string; 
    detail: Array<DetailData>;      
    creditSale: boolean;
}