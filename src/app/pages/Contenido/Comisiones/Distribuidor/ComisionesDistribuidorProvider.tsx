import React, { createContext, PropsWithChildren, useState } from 'react'
import { Comission } from '../../../../../type/Comission';

type ComisionesDistribuidorContextType = {
    showModal: boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    showMiniModal: boolean;
    setShowMiniModal: React.Dispatch<React.SetStateAction<boolean>>;
    selectedOption: boolean;
    setSelectedOption: React.Dispatch<React.SetStateAction<boolean>>;
    showFiltro: boolean;
    setShowFiltro: React.Dispatch<React.SetStateAction<boolean>>;
    selectedInventario: Comission<'byuser'>;
    setSelectedInvetario: React.Dispatch<React.SetStateAction<Comission<'byuser'>>>;
};

export const ComisionesDistribuidorContext =
    createContext<ComisionesDistribuidorContextType>({} as ComisionesDistribuidorContextType);

export const distribuidorMock: Comission<'byuser'> = { _id: "", type: 'byuser', endDate: "", initialDate: "", percentage: 0, totalAfter: 0, totalBefore: 0, user: { _id: "", email: "", role: "user" } }

const ComisionesDistribuidorProvider = ({ children }: PropsWithChildren) => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showMiniModal, setShowMiniModal] = useState<boolean>(false);
    const [selectedOption, setSelectedOption] = useState<boolean>(false);
    const [showFiltro, setShowFiltro] = useState<boolean>(false);
    const [selectedInventario, setSelectedInvetario] = useState<Comission<'byuser'>>(distribuidorMock);

    return (
        <ComisionesDistribuidorContext.Provider
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
        </ComisionesDistribuidorContext.Provider>
    );
}

export default ComisionesDistribuidorProvider