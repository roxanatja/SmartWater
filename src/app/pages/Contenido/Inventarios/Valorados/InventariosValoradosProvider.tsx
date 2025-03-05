import React, { createContext, PropsWithChildren, useState } from 'react'
import { KardexInitialBalances } from '../../../../../type/Kardex';

type InventariosValoradosContextType = {
    showModal: boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    showMiniModal: boolean;
    setShowMiniModal: React.Dispatch<React.SetStateAction<boolean>>;
    selectedOption: boolean;
    setSelectedOption: React.Dispatch<React.SetStateAction<boolean>>;
    showFiltro: boolean;
    setShowFiltro: React.Dispatch<React.SetStateAction<boolean>>;
    selectedInventario: KardexInitialBalances;
    setSelectedInvetario: React.Dispatch<React.SetStateAction<KardexInitialBalances>>;
};

export const InventariosValoradosContext =
    createContext<InventariosValoradosContextType>({} as InventariosValoradosContextType);

export const initialBalanceMock: KardexInitialBalances = { detailsToElements: [], initialBalance: { code: "", registerDate: "", user: [], documentNumber: "" } }

const InventariosValoradosProvider = ({ children }: PropsWithChildren) => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showMiniModal, setShowMiniModal] = useState<boolean>(false);
    const [selectedOption, setSelectedOption] = useState<boolean>(false);
    const [showFiltro, setShowFiltro] = useState<boolean>(false);
    const [selectedInventario, setSelectedInvetario] = useState<KardexInitialBalances>(initialBalanceMock);

    return (
        <InventariosValoradosContext.Provider
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
            }}
        >
            {children}
        </InventariosValoradosContext.Provider>
    );
}

export default InventariosValoradosProvider