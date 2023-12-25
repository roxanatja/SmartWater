import { createContext, useState } from "react";

type PrestamosContextType = {
    showModal: boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    showMiniModal: boolean;
    setShowMiniModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const PrestamosContext = createContext<PrestamosContextType>(
    {} as PrestamosContextType
);

export const PrestamosProvider = ({ children }: any) => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showMiniModal, setShowMiniModal] = useState<boolean>(false);
    
    return (
        <PrestamosContext.Provider value={{
            showModal, 
            setShowModal,
            showMiniModal, 
            setShowMiniModal,
        }}>
            {children}
        </PrestamosContext.Provider>
    );
}