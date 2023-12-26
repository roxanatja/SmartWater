import { createContext, useState } from "react";

type ReportesIngresosContextType = {
    showModal: boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    showMiniModal: boolean;
    setShowMiniModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ReportesIngresosContext = createContext<ReportesIngresosContextType>(
    {} as ReportesIngresosContextType
);

export const ReportesIngresosProvider = ({ children }: any) => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showMiniModal, setShowMiniModal] = useState<boolean>(false);
    
    return (
        <ReportesIngresosContext.Provider value={{
            showModal, 
            setShowModal,
            showMiniModal, 
            setShowMiniModal,
        }}>
            {children}
        </ReportesIngresosContext.Provider>
    );
}