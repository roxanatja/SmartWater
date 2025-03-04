import React, { createContext, PropsWithChildren, useState } from 'react'
import { Comission } from '../../../../../type/Comission';

type ComisionesGeneralContextType = {
    showModal: boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    showMiniModal: boolean;
    setShowMiniModal: React.Dispatch<React.SetStateAction<boolean>>;
    selectedOption: boolean;
    setSelectedOption: React.Dispatch<React.SetStateAction<boolean>>;
    showFiltro: boolean;
    setShowFiltro: React.Dispatch<React.SetStateAction<boolean>>;
    selectedInventario: Comission<'general'>;
    setSelectedInvetario: React.Dispatch<React.SetStateAction<Comission<'general'>>>;
};

export const ComisionesGeneralContext =
    createContext<ComisionesGeneralContextType>({} as ComisionesGeneralContextType);

export const generalMock: Comission<'general'> = { _id: "", code: "", type: 'general', endDate: "", initialDate: "", percentage: 0, totalAfter: 0, totalBefore: 0, user: { _id: "", email: "", role: "user" } }

const ComisionesGeneralProvider = ({ children }: PropsWithChildren) => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showMiniModal, setShowMiniModal] = useState<boolean>(false);
    const [selectedOption, setSelectedOption] = useState<boolean>(false);
    const [showFiltro, setShowFiltro] = useState<boolean>(false);
    const [selectedInventario, setSelectedInvetario] = useState<Comission<'general'>>(generalMock);

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