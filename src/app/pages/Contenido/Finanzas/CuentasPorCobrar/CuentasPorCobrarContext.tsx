import { createContext, useState } from "react";

type CuentasPorCobrarContextType = {
    showModal: boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    showMiniModal: boolean;
    setShowMiniModal: React.Dispatch<React.SetStateAction<boolean>>;
    selectedOption: boolean;
    setSelectedOption: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CuentasPorCobrarContext = createContext<CuentasPorCobrarContextType>(
    {} as CuentasPorCobrarContextType
);

export const CuentasPorCobrarProvider = ({ children }: any) => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showMiniModal, setShowMiniModal] = useState<boolean>(false);
    const [selectedOption, setSelectedOption] = useState<boolean>(false);

    return (
        <CuentasPorCobrarContext.Provider value={{
            showModal, 
            setShowModal,
            showMiniModal, 
            setShowMiniModal,
            selectedOption, 
            setSelectedOption,
        }}>
            {children}
        </CuentasPorCobrarContext.Provider>
    );
}