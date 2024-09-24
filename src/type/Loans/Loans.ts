export type LoansBody = {
  user: string;
  client: string;
  contract: {
    link: string | null;
    validUntil: string;
  };
  comment: string;
  detail: {
    item: string;
    quantity: string;
  }[];
};

export type Loans = {
  _id: string;
  user: string;
  client: string;
  contract: {
    link: string;
    validUntil: string;
  };
  comment: string;
  detail: {
    item: string;
    quantity: number;
    name?: string;
  }[];
  status: string;
  created: string;
  updated: string;
  __v: number;
  hasContract: boolean;
  hasExpiredContract: boolean;
};
