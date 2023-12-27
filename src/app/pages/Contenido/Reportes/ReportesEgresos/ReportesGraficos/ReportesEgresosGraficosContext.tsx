import { createContext, useState } from "react";

type ReportesEgresosGraficosContextType = {
    showModal: boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    showMiniModal: boolean;
    setShowMiniModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ReportesEgresosGraficosContext = createContext<ReportesEgresosGraficosContextType>(
    {} as ReportesEgresosGraficosContextType
);

export const ReportesEgresosGraficosProvider = ({ children }: any) => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showMiniModal, setShowMiniModal] = useState<boolean>(false);
    
    return (
        <ReportesEgresosGraficosContext.Provider value={{
            showModal, 
            setShowModal,
            showMiniModal, 
            setShowMiniModal,
        }}>
            {children}
        </ReportesEgresosGraficosContext.Provider>
    );
}