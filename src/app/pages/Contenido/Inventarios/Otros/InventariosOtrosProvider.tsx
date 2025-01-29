import React, { createContext, PropsWithChildren, useState } from 'react'
import { IMockInOuts } from '../mock-data';

type InventariosOtrosContextType = {
    showModal: boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    showMiniModal: boolean;
    setShowMiniModal: React.Dispatch<React.SetStateAction<boolean>>;
    selectedOption: boolean;
    setSelectedOption: React.Dispatch<React.SetStateAction<boolean>>;
    showFiltro: boolean;
    setShowFiltro: React.Dispatch<React.SetStateAction<boolean>>;
    selectedInventario: IMockInOuts;
    setSelectedInvetario: React.Dispatch<React.SetStateAction<IMockInOuts>>;
};

export const InventariosOtrosContext =
    createContext<InventariosOtrosContextType>({} as InventariosOtrosContextType);

export const otroInventario: IMockInOuts = { _id: "", comment: "", initialDate: "", quantity: 0, type: "production" }

const InventariosOtrosProvider = ({ children }: PropsWithChildren) => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showMiniModal, setShowMiniModal] = useState<boolean>(false);
    const [selectedOption, setSelectedOption] = useState<boolean>(false);
    const [showFiltro, setShowFiltro] = useState<boolean>(false);
    const [selectedInventario, setSelectedInvetario] = useState<IMockInOuts>(otroInventario);

    return (
        <InventariosOtrosContext.Provider
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
        </InventariosOtrosContext.Provider>
    );
}

export default InventariosOtrosProvider