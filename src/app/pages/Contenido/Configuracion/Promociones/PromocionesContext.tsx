import { createContext, useState } from "react";
import { Promotion } from "../../../../../type/Promotion";

type PromocionesContextType = {
    showModal: boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    showMiniModal: boolean;
    setShowMiniModal: React.Dispatch<React.SetStateAction<boolean>>;
    selectedOption: boolean;
    setSelectedOption: React.Dispatch<React.SetStateAction<boolean>>;
    selectedItem: Promotion;
    setSelectedItem: React.Dispatch<React.SetStateAction<Promotion>>;
}

export const PromocionesContext = createContext<PromocionesContextType>(
    {} as PromocionesContextType
);

export const promotion: Promotion = { _id: "", imageUrl: "" }

export const PromotionsProvider = ({ children }: any) => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showMiniModal, setShowMiniModal] = useState<boolean>(false);
    const [selectedOption, setSelectedOption] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState<Promotion>(promotion);

    return (
        <PromocionesContext.Provider value={{
            showModal,
            setShowModal,
            showMiniModal,
            setShowMiniModal,
            selectedOption,
            setSelectedOption,
            selectedItem,
            setSelectedItem,
        }}>
            {children}
        </PromocionesContext.Provider>
    );
}