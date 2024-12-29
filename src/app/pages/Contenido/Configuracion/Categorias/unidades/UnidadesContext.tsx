import { createContext, useState } from "react";
import { CategoryProduct } from "../../../../../../type/Products/Category";

type UnidadesContextType = {
    showModal: boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    showMiniModal: boolean;
    setShowMiniModal: React.Dispatch<React.SetStateAction<boolean>>;
    selectedOption: boolean;
    setSelectedOption: React.Dispatch<React.SetStateAction<boolean>>;
    selectedItem: CategoryProduct;
    setSelectedItem: React.Dispatch<React.SetStateAction<CategoryProduct>>;
}

export const UnidadesContext = createContext<UnidadesContextType>(
    {} as UnidadesContextType
);

export const category: CategoryProduct = { _id: "", description: "", name: "", desactivated: false, hiddenClient: false }

export const UnidadesProvider = ({ children }: any) => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showMiniModal, setShowMiniModal] = useState<boolean>(false);
    const [selectedOption, setSelectedOption] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState<CategoryProduct>(category);

    return (
        <UnidadesContext.Provider value={{
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
        </UnidadesContext.Provider>
    );
}