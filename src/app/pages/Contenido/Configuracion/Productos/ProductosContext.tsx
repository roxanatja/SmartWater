import { createContext, useState } from "react";
import Product from "../../../../../type/Products/Products";

type ProductosContextType = {
    showModal: boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    showMiniModal: boolean;
    setShowMiniModal: React.Dispatch<React.SetStateAction<boolean>>;
    selectedOption: boolean;
    setSelectedOption: React.Dispatch<React.SetStateAction<boolean>>;
    selectedProduct: Product;
    setSelectedProduct: React.Dispatch<React.SetStateAction<Product>>;
}

export const product: Product = { _id: "", category: "", description: "", imageUrl: "", name: "", price: 0, priceBusiness: 0, unitMeasure: "" }

export const ProductosContext = createContext<ProductosContextType>(
    {} as ProductosContextType
);

export const ProductosProvider = ({ children }: any) => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showMiniModal, setShowMiniModal] = useState<boolean>(false);
    const [selectedOption, setSelectedOption] = useState<boolean>(false);
    const [selectedProduct, setSelectedProduct] = useState<Product>(product);

    return (
        <ProductosContext.Provider value={{
            showModal,
            setShowModal,
            showMiniModal,
            setShowMiniModal,
            selectedOption,
            setSelectedOption,
            selectedProduct,
            setSelectedProduct,
        }}>
            {children}
        </ProductosContext.Provider>
    );
}