import { createContext, useState } from "react";
import { Client } from "../../../../../type/Cliente/Client";
import { client } from "../../Clientes/ClientesContext";

type CuentasPorCobrarContextType = {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  showMiniModal: boolean;
  setShowMiniModal: React.Dispatch<React.SetStateAction<boolean>>;
  selectedOption: boolean;
  setSelectedOption: React.Dispatch<React.SetStateAction<boolean>>;
  showFiltro: boolean;
  setShowFiltro: React.Dispatch<React.SetStateAction<boolean>>;
  clientselect: Client;
  setClientSelect: React.Dispatch<React.SetStateAction<Client>>;
};

export const CuentasPorCobrarContext =
  createContext<CuentasPorCobrarContextType>({} as CuentasPorCobrarContextType);

export const CuentasPorCobrarProvider = ({ children }: any) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showMiniModal, setShowMiniModal] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<boolean>(false);
  const [showFiltro, setShowFiltro] = useState<boolean>(false);
  const [clientselect, setClientSelect] = useState<Client>(client);

  return (
    <CuentasPorCobrarContext.Provider
      value={{
        showModal,
        setShowModal,
        showMiniModal,
        setShowMiniModal,
        selectedOption,
        setSelectedOption,
        showFiltro,
        setShowFiltro,
        clientselect,
        setClientSelect,
      }}
    >
      {children}
    </CuentasPorCobrarContext.Provider>
  );
};
