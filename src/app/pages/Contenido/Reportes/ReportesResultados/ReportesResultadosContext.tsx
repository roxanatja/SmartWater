import { createContext, useState } from "react";

type ReportesResultadosContextType = {
    showModal: boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    showMiniModal: boolean;
    setShowMiniModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ReportesResultadosContext = createContext<ReportesResultadosContextType>(
    {} as ReportesResultadosContextType
);

export const ReportesResultadosProvider = ({ children }: any) => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showMiniModal, setShowMiniModal] = useState<boolean>(false);
    
    return (
        <ReportesResultadosContext.Provider value={{
            showModal, 
            setShowModal,
            showMiniModal, 
            setShowMiniModal,
        }}>
            {children}
        </ReportesResultadosContext.Provider>
    );
}