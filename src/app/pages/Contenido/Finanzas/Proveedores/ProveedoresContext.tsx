import { createContext, useState } from "react";
import { Providers } from "../../../../../type/providers";

type ProveedoresContextType = {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  showMiniModal: boolean;
  setShowMiniModal: React.Dispatch<React.SetStateAction<boolean>>;
  selectedOption: boolean;
  setSelectedOption: React.Dispatch<React.SetStateAction<boolean>>;
  showFiltro: boolean;
  setShowFiltro: React.Dispatch<React.SetStateAction<boolean>>;
  setProvider: React.Dispatch<React.SetStateAction<Providers | null>>;
  provider: Providers | null;
};

export const ProveedoresContext = createContext<ProveedoresContextType>(
  {} as ProveedoresContextType
);

export const ProveedoresProvider = ({ children }: any) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showMiniModal, setShowMiniModal] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<boolean>(false);
  const [showFiltro, setShowFiltro] = useState<boolean>(false);
  const [provider, setProvider] = useState<Providers | null>(null);

  return (
    <ProveedoresContext.Provider
      value={{
        showModal,
        setShowModal,
        showMiniModal,
        setShowMiniModal,
        selectedOption,
        setSelectedOption,
        showFiltro,
        setShowFiltro,
        setProvider,
        provider,
      }}
    >
      {children}
    </ProveedoresContext.Provider>
  );
};
