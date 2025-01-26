export interface Client {
  _id: string;
  user: string;
  isClient: boolean;
  storeImage: string;
  clientImage?: string;
  code: string;
  fullName: string;
  phoneNumber: string;
  address: string;
  comment: string;
  reference?: string;
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
  renewInDays: number;
  renewDate: string;
  isAgency: boolean;
  billingInfo: {
    NIT: string;
    name: string;
  };
  averageRenewal: boolean;
  contracts: {
    link: string;
    validUntil: string;
    _id: string;
  }[];
  created: string;
  updated: string;
  lastSale: string;
  hasExpiredContract: boolean;
  credit: number;
  lastPostponed?: string;
}

export interface ReportClient {
  nombre: string;
  telefono: string;
  codigo: string;
  direccion: string;
  referencia: string;
  zona: string;
  barrio: string;
  renovacion: number;
  fecharegistro: string;
  contratos: string;
  devoluciones: any | null;
  prestamos: any | null;
  saldos: any | null;
}
