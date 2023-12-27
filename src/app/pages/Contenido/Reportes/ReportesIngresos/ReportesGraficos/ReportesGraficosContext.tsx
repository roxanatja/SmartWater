import { createContext, useState } from "react";

type ReportesGraficosContextType = {
    showModal: boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    showMiniModal: boolean;
    setShowMiniModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ReportesGraficosContext = createContext<ReportesGraficosContextType>(
    {} as ReportesGraficosContextType
);

export const ReportesGraficosProvider = ({ children }: any) => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showMiniModal, setShowMiniModal] = useState<boolean>(false);
    
    return (
        <ReportesGraficosContext.Provider value={{
            showModal, 
            setShowModal,
            showMiniModal, 
            setShowMiniModal,
        }}>
            {children}
        </ReportesGraficosContext.Provider>
    );
}