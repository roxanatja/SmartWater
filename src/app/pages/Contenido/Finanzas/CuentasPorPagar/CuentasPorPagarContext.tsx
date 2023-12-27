import { createContext, useState } from "react";

type CuentasPorPagarContextType = {
    showModal: boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    showMiniModal: boolean;
    setShowMiniModal: React.Dispatch<React.SetStateAction<boolean>>;
    selectedOption: boolean;
    setSelectedOption: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CuentasPorPagarContext = createContext<CuentasPorPagarContextType>(
    {} as CuentasPorPagarContextType
);

export const CuentasPorPagarProvider = ({ children }: any) => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showMiniModal, setShowMiniModal] = useState<boolean>(false);
    const [selectedOption, setSelectedOption] = useState<boolean>(false);

    return (
        <CuentasPorPagarContext.Provider value={{
            showModal, 
            setShowModal,
            showMiniModal, 
            setShowMiniModal,
            selectedOption, 
            setSelectedOption,
        }}>
            {children}
        </CuentasPorPagarContext.Provider>
    );
}