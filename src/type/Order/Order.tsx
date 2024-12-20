type Order = {
  _id: string;
  user: string;
  client: string;
  comment: string;
  deliverDate: string;
  distributorRedirectId?: string;
  zone: string;
  district: string;
  detail: Array<{
    product: string;
    quantity: string;
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
};

export type { Order };
