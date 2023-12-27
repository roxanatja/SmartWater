import { createContext, useState } from "react";

type ReportesResultadosGraficosContextType = {
    showModal: boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    showMiniModal: boolean;
    setShowMiniModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ReportesResultadosGraficosContext = createContext<ReportesResultadosGraficosContextType>(
    {} as ReportesResultadosGraficosContextType
);

export const ReportesResultadosGraficosProvider = ({ children }: any) => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showMiniModal, setShowMiniModal] = useState<boolean>(false);
    
    return (
        <ReportesResultadosGraficosContext.Provider value={{
            showModal, 
            setShowModal,
            showMiniModal, 
            setShowMiniModal,
        }}>
            {children}
        </ReportesResultadosGraficosContext.Provider>
    );
}