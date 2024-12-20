export type AccountBody = {
  name: string;
  description: string;
};

export type Account = {
  _id: string;
  name: string;
  description: string;
  desactivated: boolean | null;
  created: string;
  updated: string;
};

