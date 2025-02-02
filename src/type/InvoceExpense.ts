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
  expenseDetails: {
    amount: number;
    comment: string;
    documentNumber: string;
    _id: string;
  };
  amount: number;
  date: string;
  user: string;
  provider: string;
  desactivated: boolean | null;
  created: string;
  updated: string;
  remainingBalance: number;
  userDetails: {
    _id: string;
    fullName: string;
    role: string;
    phoneNumber: string;
  }
  providerDetails: {
    _id: string;
    fullName: string;
    email: string;
    NIT: string;
  }
};