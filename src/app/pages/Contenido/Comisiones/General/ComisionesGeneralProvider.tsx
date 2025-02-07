import React, { createContext, PropsWithChildren, useState } from 'react'
import { IMockComissions } from '../mock-data';

type ComisionesGeneralContextType = {
    showModal: boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    showMiniModal: boolean;
    setShowMiniModal: React.Dispatch<React.SetStateAction<boolean>>;
    selectedOption: boolean;
    setSelectedOption: React.Dispatch<React.SetStateAction<boolean>>;
    showFiltro: boolean;
    setShowFiltro: React.Dispatch<React.SetStateAction<boolean>>;
    selectedInventario: IMockComissions;
    setSelectedInvetario: React.Dispatch<React.SetStateAction<IMockComissions>>;
};

export const ComisionesGeneralContext =
    createContext<ComisionesGeneralContextType>({} as ComisionesGeneralContextType);

export const generalMock: IMockComissions = { _id: "", commission: 0, finalDate: "", initialDate: "", name: "", percent: 0, sales: 0 }

const ComisionesGeneralProvider = ({ children }: PropsWithChildren) => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showMiniModal, setShowMiniModal] = useState<boolean>(false);
    const [selectedOption, setSelectedOption] = useState<boolean>(false);
    const [showFiltro, setShowFiltro] = useState<boolean>(false);
    const [selectedInventario, setSelectedInvetario] = useState<IMockComissions>(generalMock);

    return (
        <ComisionesGeneralContext.Provider
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
        </ComisionesGeneralContext.Provider>
    );
}

export default ComisionesGeneralProvider