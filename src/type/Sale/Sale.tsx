import { Client } from "../Cliente/Client";

type Sale = {
  _id: string;
  client: Client;
  user: string;
  zone: string;
  code?: string;
  comment: string;
  detail: Array<{
    product: string;
    quantity: number;
    price: number;
    _id: string;
  }>;
  total: number;
  creditSale: boolean;
  paymentMethodCash?: boolean;
  paymentMethodCurrentAccount?: boolean;
  hasInvoice: boolean;
  created: string;
  updated: string;
};

type SaleProduct = {
  id: string;
  cant: number;
  prod: string;
  total: number;
}

type SaleConsolidatedItem = {
  productId: string;
  productName: string;
  quantity: number;
  total: number;
}

type SaleReport = {
  fecharegistro: string;
  nombre: string;
  codigo: string;
  detalles: {
    precio: number;
    cantidad: number;
    subtotal: number;
    producto: string;
  }[]
}

export type { Sale, SaleProduct, SaleConsolidatedItem, SaleReport };
