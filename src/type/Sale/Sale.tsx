type Sale = {
  _id: string;
  client: string;
  user: string;
  zone: string;
  comment: string;
  detail: Array<{
    product: string;
    quantity: number;
    price: number;
    _id: string;
  }>;
  total: number;
  creditSale: boolean;
  created: string;
  updated: string;
};

type SaleBody = {
  client: string;
  user: string;
  comment: string;
  detail: {
    product: string;
    quantity: string;
    price: string;
  }[];
  creditSale: boolean;
  hasInvoice: boolean;
  paymentMethodCurrentAccount: boolean;
};

export type { Sale, SaleBody };
