import React, { createContext, PropsWithChildren, useState } from 'react'
import { PhysicalBalanceToShow, PhysiscalGeneratedReport, PhysiscalPreviousReport } from '../../../../../type/PhysicalInventory';
import moment from 'moment';

type InventariosFisicosContextType = {
    showModal: boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    showMiniModal: boolean;
    setShowMiniModal: React.Dispatch<React.SetStateAction<boolean>>;
    selectedOption: boolean;
    setSelectedOption: React.Dispatch<React.SetStateAction<boolean>>;
    showFiltro: boolean;
    setShowFiltro: React.Dispatch<React.SetStateAction<boolean>>;
    selectedBalance: PhysicalBalanceToShow;
    setSelectedBalance: React.Dispatch<React.SetStateAction<PhysicalBalanceToShow>>;
    selectedInventario: PhysiscalPreviousReport[];
    setSelectedInvetario: React.Dispatch<React.SetStateAction<PhysiscalPreviousReport[]>>;
    selectedReport: PhysiscalGeneratedReport;
    setSelectedReport: React.Dispatch<React.SetStateAction<PhysiscalGeneratedReport>>;
};

export const InventariosFisicosContext =
    createContext<InventariosFisicosContextType>({} as InventariosFisicosContextType);

export const balance: PhysicalBalanceToShow = {
    code: "",
    saldo: [],
    showDate: moment(),
    user: {
        _id: "",
        isAdmin: false,
        name: ""
    }
}

export const physicalReport: PhysiscalGeneratedReport = { _id: "", elements: [], registerDate: "", role: "user", user: "" }

const InventariosFisicosProvider = ({ children }: PropsWithChildren) => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showMiniModal, setShowMiniModal] = useState<boolean>(false);
    const [selectedOption, setSelectedOption] = useState<boolean>(false);
    const [showFiltro, setShowFiltro] = useState<boolean>(false);
    const [selectedInventario, setSelectedInvetario] = useState<PhysiscalPreviousReport[]>([]);
    const [selectedBalance, setSelectedBalance] = useState<PhysicalBalanceToShow>(balance);
    const [selectedReport, setSelectedReport] = useState<PhysiscalGeneratedReport>(physicalReport);

    return (
        <InventariosFisicosContext.Provider
            value={{
                showModal,
                setShowModal,
                showMiniModal,
                setShowMiniModal,
                selectedOption,
                setSelectedOption,
                showFiltro,
                setShowFiltro,
                selectedInventario,
                setSelectedInvetario,
                selectedBalance,
                setSelectedBalance,
                selectedReport,
                setSelectedReport,
            }}
        >
            {children}
        </InventariosFisicosContext.Provider>
    );
}

export default InventariosFisicosProvider