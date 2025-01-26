import { createContext, useState } from "react";
import { Providers } from "../../../../../type/providers";
import { providerBlank } from "../Proveedores/ProveedoresContext";

type CuentasPorPagarContextType = {
    showModal: boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    showMiniModal: boolean;
    setShowMiniModal: React.Dispatch<React.SetStateAction<boolean>>;
    selectedOption: boolean;
    setSelectedOption: React.Dispatch<React.SetStateAction<boolean>>;
    showFiltro: boolean;
    setShowFiltro: React.Dispatch<React.SetStateAction<boolean>>;
    providerSelect: Providers;
    setProviderSelected: React.Dispatch<React.SetStateAction<Providers>>;
}

export const CuentasPorPagarContext = createContext<CuentasPorPagarContextType>(
    {} as CuentasPorPagarContextType
);

export const CuentasPorPagarProvider = ({ children }: any) => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showMiniModal, setShowMiniModal] = useState<boolean>(false);
    const [selectedOption, setSelectedOption] = useState<boolean>(false);
    const [showFiltro, setShowFiltro] = useState<boolean>(false);
    const [providerSelect, setProviderSelected] = useState<Providers>(providerBlank);

    return (
        <CuentasPorPagarContext.Provider value={{
            showModal,
            setShowModal,
            showMiniModal,
            setShowMiniModal,
            selectedOption,
            setSelectedOption,
            showFiltro,
            setShowFiltro,
            providerSelect,
            setProviderSelected,
        }}>
            {children}
        </CuentasPorPagarContext.Provider>
    );
}