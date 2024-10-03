export type AccountBody = {
  name: string;
  description: string;
};

export type Account = {
  _id: string;
  name: string;
  description: string;
  desactivated: boolean;
  created: string;
  updated: string;
};
