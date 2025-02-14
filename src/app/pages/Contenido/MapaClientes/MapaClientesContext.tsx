import { createContext, useState } from "react";
import { Client } from "../../../../type/Cliente/Client";
import { ClientStatus } from "../../components/LeafletMap/constants";

type MapaClientesContextType = {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  showMiniModal: boolean;
  setShowMiniModal: React.Dispatch<React.SetStateAction<boolean>>;
  selectedOption: boolean;
  setSelectedOption: React.Dispatch<React.SetStateAction<boolean>>;
  showFiltro: boolean;
  setShowFiltro: React.Dispatch<React.SetStateAction<boolean>>;
  selectedClient: Client & { status: ClientStatus };
  setSelectedClient: React.Dispatch<React.SetStateAction<Client & { status: ClientStatus }>>;
};

export const MapaClientesContext = createContext<MapaClientesContextType>(
  {} as MapaClientesContextType
);


export const clientWithStatus: Client & { status: ClientStatus } = {
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
  status: "default",
};

export const MapaClientesProvider = ({ children }: any) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showMiniModal, setShowMiniModal] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<boolean>(false);
  const [showFiltro, setShowFiltro] = useState<boolean>(false);

  const [selectedClient, setSelectedClient] = useState<Client & { status: ClientStatus }>(clientWithStatus);

  return (
    <MapaClientesContext.Provider
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
      }}
    >
      {children}
    </MapaClientesContext.Provider>
  );
};
