import { createContext, useState } from "react";

type BarriosContextType = {
    showModal: boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    showMiniModal: boolean;
    setShowMiniModal: React.Dispatch<React.SetStateAction<boolean>>;
    selectedOption: boolean;
    setSelectedOption: React.Dispatch<React.SetStateAction<boolean>>;
}

export const BarriosContext = createContext<BarriosContextType>(
    {} as BarriosContextType
);

export const BarriosProvider = ({ children }: any) => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showMiniModal, setShowMiniModal] = useState<boolean>(false);
    const [selectedOption, setSelectedOption] = useState<boolean>(false);

    return (
        <BarriosContext.Provider value={{
            showModal, 
            setShowModal,
            showMiniModal, 
            setShowMiniModal,
            selectedOption, 
            setSelectedOption,
        }}>
            {children}
        </BarriosContext.Provider>
    );
}