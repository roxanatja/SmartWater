export interface Location {
  latitude: string;
  longitude: string;
}

export interface BillingInfo {
  NIT: string;
  name: string;
}

export interface Client {
  user: string;
  isClient: boolean;
  storeImage: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  address: string;
  comment: string;
  ciFrontImage: string;
  ciBackImage: string;
  zone: string;
  district: string | null;
  location: Location;
  clientImage: string;
  deliverDate: string;
  lastPostponedInDays: string;
  lastPostponed: string;
  renewDate: string;
  renewInDaysNumber: string;
  deactivated: string;
  reference: string;
  lastSale: string;
  hasLoan: boolean;
  hasOrder: boolean;
  hasContract: boolean;
  lastAttenderOrder: string;
  renewInDays: string;
  credit: string;
  billingInfo: BillingInfo;
  whatsAppNumber: string;
  isAgency: boolean;
}

export interface District {
  _id: string;
  name: string;
  description: string;
  cityId: string;
  created: string;
  updated: string;
  __v: number;
}

export interface City {
  _id: string;
  name: string;
  created: string;
  updated: string;
  __v: number;
  districtsId: District[];
}
