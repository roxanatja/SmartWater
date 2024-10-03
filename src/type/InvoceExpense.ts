export type InvoceExpenseBody = {
  expense: string;
  user: string;
  provider: string;
  amount: number;
  date: string;
  cashPayment: boolean;
  paymentMethodCurrentAccount: boolean;
};

export type InvoceExpense = {
  cashPayment: boolean;
  paymentMethodCurrentAccount: boolean;
  _id: string;
  expense: string;
  amount: number;
  date: string;
  user: string;
  provider: string;
  desactivated: boolean | null;
  created: string;
  updated: string;
};
