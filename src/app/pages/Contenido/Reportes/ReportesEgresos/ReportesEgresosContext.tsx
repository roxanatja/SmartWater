import { createContext, useState } from "react";

type ReportesEgresosContextType = {
    showModal: boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    showMiniModal: boolean;
    setShowMiniModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ReportesEgresosContext = createContext<ReportesEgresosContextType>(
    {} as ReportesEgresosContextType
);

export const ReportesEgresosProvider = ({ children }: any) => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showMiniModal, setShowMiniModal] = useState<boolean>(false);
    
    return (
        <ReportesEgresosContext.Provider value={{
            showModal, 
            setShowModal,
            showMiniModal, 
            setShowMiniModal,
        }}>
            {children}
        </ReportesEgresosContext.Provider>
    );
}