export type InvoceExpenseBody = {
  expense: string;
  user: string;
  provider: string;
  amount: number;
  date: string;
  cashPayment: boolean;
  paymentMethodCurrentAccount: boolean;
};
