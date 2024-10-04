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

export type ExpensesBody = {
  amount: string;
  accountEntry: string;
  user: string;
  provider: string;
  creditBuy: boolean;
  paymentMethodCurrentAccount: boolean;
  hasInVoice: boolean;
  documentNumber: string;
  comment: string;
};

export type Expense = {
  _id: string;
  amount: number;
  accountEntry: string;
  user: string;
  provider: string;
  paymentMethodCurrentAccount: boolean;
  hasInVoice: boolean;
  documentNumber: string;
  comment: string;
  created: string;
  updated: string;
  creditBuy: boolean;
};
