import { createContext, useState } from "react";
import { client } from "../Clientes/ClientesContext";
import { Client } from "../../../../type/Cliente/Client";

type PrestamosContextType = {
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
}

export const PrestamosContext = createContext<PrestamosContextType>(
    {} as PrestamosContextType
);

export const PrestamosProvider = ({ children }: any) => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showMiniModal, setShowMiniModal] = useState<boolean>(false);
    const [selectedOption, setSelectedOption] = useState<boolean>(false);
    const [showFiltro, setShowFiltro] = useState<boolean>(false);
    const [selectedClient, setSelectedClient] = useState<Client>(client);

    return (
        <PrestamosContext.Provider value={{
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
        }}>
            {children}
        </PrestamosContext.Provider>
    );
}