import { createContext, useState } from "react";

type PedidosContextType = {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  showMiniModal: boolean;
  setShowMiniModal: React.Dispatch<React.SetStateAction<boolean>>;
  showFiltro: boolean;
  setShowFiltro: React.Dispatch<React.SetStateAction<boolean>>;
};

export const PedidosContext = createContext<PedidosContextType>(
  {} as PedidosContextType
);

export const PedidosProvider = ({ children }: any) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showMiniModal, setShowMiniModal] = useState<boolean>(false);
  const [showFiltro, setShowFiltro] = useState<boolean>(false);

  return (
    <PedidosContext.Provider
      value={{
        showModal,
        setShowModal,
        showMiniModal,
        setShowMiniModal,
        showFiltro,
        setShowFiltro,
      }}
    >
      {children}
    </PedidosContext.Provider>
  );
};
