export interface Client {
  _id: string;
  code: string;
  user: string;
  storeImage: string;
  fullName: string;
  phoneNumber: string;
  address: string;
  comment: string;
  email: string;
  phoneLandLine?: string;
  ciFrontImage: string;
  ciBackImage: string;
  zone: string;
  district: string;
  location: {
    latitude: string;
    longitude: string;
  };
  hasOrder: boolean;
  hasLoan: boolean;
  hasContract: boolean;
  renewInDays: Number;
  renewDate: string;
  isClient: boolean;
  isAgency: boolean;
  billingInfo: {
    NIT: string;
    name: string;
  };
  averageRenewal: boolean;
  contracts: [];
  created: string;
  updated: string;
  lastSale: string;
  hasExpiredContract: boolean;
  credit: number;
}
