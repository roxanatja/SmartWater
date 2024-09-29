export type Bills = {
  _id: string;
  sale: string;
  amount: number;
  client: string;
  user: string;
  cashPayment: boolean;
  paymentMethodCurrentAccount: boolean;
  created: string;
  updated: string;
};

export type BillBody = {
  zone: string;
  user: string;
  sale: string;
  amount: string;
  client: string;
  cashPayment: boolean;
  paymentMethodCurrentAccount: boolean;
};
