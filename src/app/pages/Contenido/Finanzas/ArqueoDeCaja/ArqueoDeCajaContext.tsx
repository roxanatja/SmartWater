import { createContext, useState } from "react";
import { Transaction } from "../../../../../type/Cash";

type ArqueoDeCajaContextType = {
    showModal: boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    showMiniModal: boolean;
    setShowMiniModal: React.Dispatch<React.SetStateAction<boolean>>;
    selectedOption: boolean;
    setSelectedOption: React.Dispatch<React.SetStateAction<boolean>>;
    selectedTransaction: Transaction | undefined;
    setSelectedTransaction: React.Dispatch<React.SetStateAction<Transaction | undefined>>;
}

export const ArqueoDeCajaContext = createContext<ArqueoDeCajaContextType>(
    {} as ArqueoDeCajaContextType
);

export const ArqueoDeCajaProvider = ({ children }: any) => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showMiniModal, setShowMiniModal] = useState<boolean>(false);
    const [selectedOption, setSelectedOption] = useState<boolean>(false);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | undefined>(undefined)

    return (
        <ArqueoDeCajaContext.Provider value={{
            showModal,
            setShowModal,
            showMiniModal,
            setShowMiniModal,
            selectedOption,
            setSelectedOption,
            selectedTransaction,
            setSelectedTransaction,
        }}>
            {children}
        </ArqueoDeCajaContext.Provider>
    );
}