import { createContext, useState } from "react";

type ProductosContextType = {
    showModal: boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    showMiniModal: boolean;
    setShowMiniModal: React.Dispatch<React.SetStateAction<boolean>>;
    selectedOption: boolean;
    setSelectedOption: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ProductosContext = createContext<ProductosContextType>(
    {} as ProductosContextType
);

export const ProductosProvider = ({ children }: any) => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showMiniModal, setShowMiniModal] = useState<boolean>(false);
    const [selectedOption, setSelectedOption] = useState<boolean>(false);

    return (
        <ProductosContext.Provider value={{
            showModal, 
            setShowModal,
            showMiniModal, 
            setShowMiniModal,
            selectedOption, 
            setSelectedOption,
        }}>
            {children}
        </ProductosContext.Provider>
    );
}