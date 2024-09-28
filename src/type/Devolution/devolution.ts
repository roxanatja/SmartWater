export type DevolutionBody = {
  user: string;
  loan: string;
  client: string;
  comment: string;
  detail: {
    item: string;
    quantity: string;
  }[];
};

export type Devolution = {
  _id: string;
  user: string;
  loan: string;
  client: string;
  comment: string;
  detail: {
    item: string;
    quantity: number;
    _id: string;
  }[];
  created: string;
  updated: string;
};
