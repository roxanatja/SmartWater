import React, { createContext, PropsWithChildren, useState } from 'react'
import { PhysicalBalanceToShow, PhysiscalPreviousReport } from '../../../../../type/PhysicalInventory';
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


const InventariosFisicosProvider = ({ children }: PropsWithChildren) => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showMiniModal, setShowMiniModal] = useState<boolean>(false);
    const [selectedOption, setSelectedOption] = useState<boolean>(false);
    const [showFiltro, setShowFiltro] = useState<boolean>(false);
    const [selectedInventario, setSelectedInvetario] = useState<PhysiscalPreviousReport[]>([]);
    const [selectedBalance, setSelectedBalance] = useState<PhysicalBalanceToShow>(balance);

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
            }}
        >
            {children}
        </InventariosFisicosContext.Provider>
    );
}

export default InventariosFisicosProvider