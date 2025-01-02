type Order = {
  _id: string;
  user: string;
  client: string | any;
  comment: string;
  deliverDate: string;
  distributorRedirectId?: string;
  zone: string;
  district: string;
  detail: Array<{
    product: string;
    quantity: number;
  }>;
  clientNotRegistered?: {
    fullName?: string;
    phoneNumber?: string;
    address?: string;
    district?: string;
    zone?: string;
    location: {
      latitude: string;
      longitude: string;
    };
    hasOrder: boolean;
    isClient: boolean;
  };
  created: string;
  updated: string;
  attended?: string
};

export type { Order };
