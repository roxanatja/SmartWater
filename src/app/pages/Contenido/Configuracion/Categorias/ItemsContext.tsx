import { createContext, useState } from "react";
import { Item } from "../../../../../type/Item";

type ItemsContextType = {
    showModal: boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    showMiniModal: boolean;
    setShowMiniModal: React.Dispatch<React.SetStateAction<boolean>>;
    selectedOption: boolean;
    setSelectedOption: React.Dispatch<React.SetStateAction<boolean>>;
    selectedItem: Item;
    setSelectedItem: React.Dispatch<React.SetStateAction<Item>>;
}

export const ItemsContext = createContext<ItemsContextType>(
    {} as ItemsContextType
);

export const item: Item = { name: "", _id: "", description: "" }

export const ItemsProvider = ({ children }: any) => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showMiniModal, setShowMiniModal] = useState<boolean>(false);
    const [selectedOption, setSelectedOption] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState<Item>(item);

    return (
        <ItemsContext.Provider value={{
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
        </ItemsContext.Provider>
    );
}