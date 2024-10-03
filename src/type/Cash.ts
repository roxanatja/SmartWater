export type CashOpen = {
  startDate: string;
  initialMount: number;
  user: string;
  startTime?: string;
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
  created: string;
  updated: string;
};
