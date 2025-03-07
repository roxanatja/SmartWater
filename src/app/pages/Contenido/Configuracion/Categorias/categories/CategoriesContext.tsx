import { createContext, useState } from "react";
import { CategoryProduct } from "../../../../../../type/Products/Category";

type CategoriesContextType = {
    showModal: boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    showMiniModal: boolean;
    setShowMiniModal: React.Dispatch<React.SetStateAction<boolean>>;
    selectedOption: boolean;
    setSelectedOption: React.Dispatch<React.SetStateAction<boolean>>;
    selectedCategory: CategoryProduct;
    setSelectedCategory: React.Dispatch<React.SetStateAction<CategoryProduct>>;
}

export const CategoriesContext = createContext<CategoriesContextType>(
    {} as CategoriesContextType
);

export const category: CategoryProduct = { _id: "", description: "", name: "", desactivated: false, hiddenClient: false }

export const CategoriesProvider = ({ children }: any) => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showMiniModal, setShowMiniModal] = useState<boolean>(false);
    const [selectedOption, setSelectedOption] = useState<boolean>(false);
    const [selectedCategory, setSelectedCategory] = useState<CategoryProduct>(category);

    return (
        <CategoriesContext.Provider value={{
            showModal,
            setShowModal,
            showMiniModal,
            setShowMiniModal,
            selectedOption,
            setSelectedOption,
            selectedCategory,
            setSelectedCategory,
        }}>
            {children}
        </CategoriesContext.Provider>
    );
}