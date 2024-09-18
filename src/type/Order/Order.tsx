type Order = {
  user: string;
  client: string;
  comment: string;
  deliverDate: string;
  detail: Array<{
    product: string;
    quantity: string;
  }>;
  clientNotRegistered?: {
    fullName: string;
    phoneNumber: string;
    address: string;
    district: string;
    zone: string;
    location: {
      latitude: string;
      longitude: string;
    };
  };
};

type OrdenBody = {
  user: string;
  client: string;
  comment: string;
  deliverDate: string;
  detail: {
    product: string;
    quantity: string;
  }[];
  clientNotRegistered: {
    fullName: string;
    phoneNumber: string;
    address: string;
    district: string;
    zone: string;
    location: {
      latitude: string;
      longitude: string;
    };
  };
};

export type { Order, OrdenBody };
