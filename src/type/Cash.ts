import { User } from "./User";

export type CashOpen = {
  startDate: string;
  endDate?: string;
  initialAmount: number;
  user: string;
};

export type CashClose = {
  user: string;
  endDate: string;
  cash: number;
  currentAccount: number;
};

export type Transaction = {
  _id: string;
  startDate: string;
  user: string;
  initialAmount: number;
  endDate: string | null;
  state: boolean;
  difference: number;
  incomeCashTotal: number;
  cashSales: number;
  creditBillsSales: number;
  incomeCurrentAccountTotal: number;
  cashCurrentAccount: number;
  creditBillsSalesCurrentAccount: number;
  expenseCashTotal: number;
  cashExpenses: number;
  expensePayObligations: number;
  expenseCurrentAccountTotal: number;
  expensePayCurrentAccount: number;
  expenseCurrentPayObligations: number;
  cashRendered: number;
  currentAccountRendered: number;
  currentExpenses: number;
  accountsReceivable: number;
  created: string;
  updated: string;
  userDetails: User;
  creationMethod?: "create" | "open-close";
};

export type CashReport = {
  initialMount: number;
  finalMount: number;
  incomes: {
    cash: {
      cashSales: number;
      creditBillSales: number;
      total: number;
    };
    currentAccount: {
      cash: number;
      creditBillSales: number;
      total: number;
    };
    billPending: number;
  };
  expenses: {
    cash: {
      cashExpense: number;
      expensespayobligations: number;
      total: number;
    };
    currentAccount: {
      expenseCurrentAccount: number;
      expensespayobligations: number;
      total: number;
    };
    expensesToPayPending: number;
  }
};
