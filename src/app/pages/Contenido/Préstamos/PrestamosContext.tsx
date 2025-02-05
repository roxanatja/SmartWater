import { createContext, useEffect, useState } from "react";
import { client } from "../Clientes/ClientesContext";
import { Client } from "../../../../type/Cliente/Client";
import { Loans } from "../../../../type/Loans/Loans";

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
    selectedLoan: Loans;
    setSelectedLoan: React.Dispatch<React.SetStateAction<Loans>>;
}

export const PrestamosContext = createContext<PrestamosContextType>(
    {} as PrestamosContextType
);

export const loan: Loans = {
    _id: "",
    __v: 0,
    client: [],
    comment: "",
    contract: { link: "", validUntil: "" },
    created: "",
    detail: [],
    hasContract: false,
    hasExpiredContract: false,
    status: "",
    updated: "",
    user: "",
    code: ""
}

export const PrestamosProvider = ({ children }: any) => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showMiniModal, setShowMiniModal] = useState<boolean>(false);
    const [selectedOption, setSelectedOption] = useState<boolean>(false);
    const [showFiltro, setShowFiltro] = useState<boolean>(false);
    const [selectedClient, setSelectedClient] = useState<Client>(client);
    const [selectedLoan, setSelectedLoan] = useState<Loans>(loan);

    useEffect(() => {
        if (selectedClient._id === "" && selectedLoan._id !== "") {
            setSelectedLoan(loan)
        }
    }, [selectedClient, selectedLoan])

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
            selectedLoan,
            setSelectedLoan,
        }}>
            {children}
        </PrestamosContext.Provider>
    );
}