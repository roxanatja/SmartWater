import { createContext, useEffect, useState } from "react";
import { Sale } from "../../../../type/Sale/Sale";
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
  selectedSale: Sale;
  setSelectedSale: React.Dispatch<React.SetStateAction<Sale>>;
};

export const VentasContext = createContext<VentasContextType>(
  {} as VentasContextType
);

const sale: Sale = {
  _id: "", client: [], comment: "", created: "", creditSale: false, detail: [], total: 0, updated: "", user: "", zone: "", hasInvoice: false
}

export const VentasProvider = ({ children }: any) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showMiniModal, setShowMiniModal] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<boolean>(false);
  const [showFiltro, setShowFiltro] = useState<boolean>(false);
  const [selectedSale, setSelectedSale] = useState<Sale>(sale);
  const [selectedClient, setSelectedClient] = useState<Client>(client);

  useEffect(() => {
    if (selectedClient._id === "" && selectedSale._id !== "") {
      setSelectedSale(sale)
    }
  }, [selectedClient, selectedSale])

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
        selectedSale,
        setSelectedSale,
        selectedClient,
        setSelectedClient,
      }}
    >
      {children}
    </VentasContext.Provider>
  );
};
