import { Client } from "../Cliente/Client";

export type Loans = {
  _id: string;
  user: string;
  client: Client[];
  contract: {
    link: string;
    validUntil: string | null;
  };
  comment: string;
  detail: {
    item: string;
    quantity: number;
    name: string;
  }[];
  status: string;
  created: string;
  updated: string;
  code: string;
  __v: number;
  hasContract: boolean;
  hasExpiredContract: boolean;
};

export type LoanConsolidated = {
  itemId: string;
  itenName: string;
  quantity: number;
}