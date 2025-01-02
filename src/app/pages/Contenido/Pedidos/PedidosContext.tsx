import { createContext, useState } from "react";
import { Client } from "../../../../type/Cliente/Client";
import { client } from "../Clientes/ClientesContext";

type PedidosContextType = {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  showMiniModal: boolean;
  setShowMiniModal: React.Dispatch<React.SetStateAction<boolean>>;
  showFiltro: boolean;
  setShowFiltro: React.Dispatch<React.SetStateAction<boolean>>;
  selectedClient: Client;
  setSelectedClient: React.Dispatch<React.SetStateAction<Client>>;
};

export const PedidosContext = createContext<PedidosContextType>(
  {} as PedidosContextType
);

export const PedidosProvider = ({ children }: any) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showMiniModal, setShowMiniModal] = useState<boolean>(false);
  const [showFiltro, setShowFiltro] = useState<boolean>(false);
  const [selectedClient, setSelectedClient] = useState<Client>(client);

  return (
    <PedidosContext.Provider
      value={{
        showModal,
        setShowModal,
        showMiniModal,
        setShowMiniModal,
        showFiltro,
        setShowFiltro,
        selectedClient,
        setSelectedClient,
      }}
    >
      {children}
    </PedidosContext.Provider>
  );
};
