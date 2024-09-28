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
