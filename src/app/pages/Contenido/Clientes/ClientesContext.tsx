import { createContext, useState } from "react";
import { Client } from "../../../../type/Cliente/Client";

type ClientesContextType = {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  showMiniModal: boolean;
  setShowMiniModal: React.Dispatch<React.SetStateAction<boolean>>;
  selectedOption: boolean;
  setSelectedOption: React.Dispatch<React.SetStateAction<boolean>>;
  showFiltro: boolean;
  setShowFiltro: React.Dispatch<React.SetStateAction<boolean>>;
  selectedClient: Client;
  setSelectedClient: React.Dispatch<React.SetStateAction<Client>>;
  fromDate: Date | null; // Nueva propiedad
  setFromDate: React.Dispatch<React.SetStateAction<Date | null>>; // Nueva función
  toDate: Date | null; // Nueva propiedad
  setToDate: React.Dispatch<React.SetStateAction<Date | null>>; // Nueva función
  registerSale: boolean;
  setRegisterSale: React.Dispatch<React.SetStateAction<boolean>>;
};

export const client: Client = {
  // Tu objeto de cliente
  _id: "",
  code: "",
  user: "",
  storeImage: "",
  fullName: "",
  phoneNumber: "",
  address: "",
  comment: "",
  email: "",
  ciFrontImage: "",
  ciBackImage: "",
  zone: "",
  district: "",
  location: {
    latitude: "",
    longitude: "",
  },
  hasOrder: false,
  hasLoan: true,
  hasContract: false,
  renewInDays: 1,
  renewDate: "",
  isClient: true,
  isAgency: true,
  billingInfo: {
    NIT: "",
    name: "",
  },
  averageRenewal: false,
  contracts: [],
  created: "",
  updated: "",
  lastSale: "",
  hasExpiredContract: false,
  credit: 1,
};

export const ClientesContext = createContext<ClientesContextType>(
  {} as ClientesContextType
);

export const ClientesProvider = ({ children }: any) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showMiniModal, setShowMiniModal] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<boolean>(false);
  const [registerSale, setRegisterSale] = useState<boolean>(false);
  const [showFiltro, setShowFiltro] = useState<boolean>(false);
  const [fromDate, setFromDate] = useState<Date | null>(null); // Inicialización de estado
  const [toDate, setToDate] = useState<Date | null>(null);

  const [selectedClient, setSelectedClient] = useState<Client>(client);

  return (
    <ClientesContext.Provider
      value={{
        showModal,
        setShowModal,
        showMiniModal,
        setShowMiniModal,
        selectedOption,
        setSelectedOption,
        showFiltro,
        setShowFiltro,
        selectedClient,
        setSelectedClient,
        fromDate,
        setFromDate,
        toDate,
        setToDate,
        registerSale,
        setRegisterSale,
      }}
    >
      {children}
    </ClientesContext.Provider>
  );
};
