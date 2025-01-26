import { createContext, useEffect, useState } from "react";
import { Client } from "../../../../type/Cliente/Client";
import { client } from "../Clientes/ClientesContext";
import { Order } from "../../../../type/Order/Order";

type PedidosContextType = {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  showMiniModal: boolean;
  setShowMiniModal: React.Dispatch<React.SetStateAction<boolean>>;
  showFiltro: boolean;
  setShowFiltro: React.Dispatch<React.SetStateAction<boolean>>;
  selectedClient: Client;
  setSelectedClient: React.Dispatch<React.SetStateAction<Client>>;
  selectedOrder: Order;
  setSelectedOrder: React.Dispatch<React.SetStateAction<Order>>;
};

export const PedidosContext = createContext<PedidosContextType>(
  {} as PedidosContextType
);

export const order: Order = {
  _id: "",
  client: "",
  comment: "",
  created: "",
  deliverDate: "",
  detail: [],
  district: "",
  updated: "",
  user: "",
  zone: ""
}

export const PedidosProvider = ({ children }: any) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showMiniModal, setShowMiniModal] = useState<boolean>(false);
  const [showFiltro, setShowFiltro] = useState<boolean>(false);
  const [selectedClient, setSelectedClient] = useState<Client>(client);
  const [selectedOrder, setSelectedOrder] = useState<Order>(order);

  useEffect(() => {
    if (selectedClient._id === "" && selectedOrder._id !== "") {
      setSelectedOrder(order)
    }
  }, [selectedClient, selectedOrder])

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
        selectedOrder,
        setSelectedOrder,
      }}
    >
      {children}
    </PedidosContext.Provider>
  );
};
