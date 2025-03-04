import React, { createContext, PropsWithChildren, useState } from 'react'
import { Comission } from '../../../../../type/Comission';

type ComisionesEspecificosContextType = {
    showModal: boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    showMiniModal: boolean;
    setShowMiniModal: React.Dispatch<React.SetStateAction<boolean>>;
    selectedOption: boolean;
    setSelectedOption: React.Dispatch<React.SetStateAction<boolean>>;
    showFiltro: boolean;
    setShowFiltro: React.Dispatch<React.SetStateAction<boolean>>;
    selectedInventario: Comission<'specific'>;
    setSelectedInvetario: React.Dispatch<React.SetStateAction<Comission<'specific'>>>;
};

export const ComisionesEspecificosContext =
    createContext<ComisionesEspecificosContextType>({} as ComisionesEspecificosContextType);

export const especificoMock: Comission<'specific'> = { _id: "", code: '', type: 'specific', endDate: "", initialDate: "", details: [], user: { _id: "", email: "", role: "user" } }

const ComisionesEspecificosProvider = ({ children }: PropsWithChildren) => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showMiniModal, setShowMiniModal] = useState<boolean>(false);
    const [selectedOption, setSelectedOption] = useState<boolean>(false);
    const [showFiltro, setShowFiltro] = useState<boolean>(false);
    const [selectedInventario, setSelectedInvetario] = useState<Comission<'specific'>>(especificoMock);

    return (
        <ComisionesEspecificosContext.Provider
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
        </ComisionesEspecificosContext.Provider>
    );
}

export default ComisionesEspecificosProvider