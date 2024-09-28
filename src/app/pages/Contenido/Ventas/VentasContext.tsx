import { createContext, useState } from "react";
import { Client } from "../../../../type/Cliente/Client";
import { client } from "../Clientes/ClientesContext";

type VentasContextType = {
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
};

export const VentasContext = createContext<VentasContextType>(
  {} as VentasContextType
);

export const VentasProvider = ({ children }: any) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showMiniModal, setShowMiniModal] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<boolean>(false);
  const [showFiltro, setShowFiltro] = useState<boolean>(false);
  const [selectedClient, setSelectedClient] = useState<Client>(client);

  return (
    <VentasContext.Provider
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
    </VentasContext.Provider>
  );
};
