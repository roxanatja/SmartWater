import { createContext, useState } from "react";
import { District } from "../../../../../type/City";

type BarriosContextType = {
    showModal: boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    showMiniModal: boolean;
    setShowMiniModal: React.Dispatch<React.SetStateAction<boolean>>;
    selectedOption: boolean;
    setSelectedOption: React.Dispatch<React.SetStateAction<boolean>>;
    selectedDistrict: District;
    setSelectedDistrict: React.Dispatch<React.SetStateAction<District>>;
}

export const district: District = { _id: "", description: "", name: "", cityId: "" }

export const BarriosContext = createContext<BarriosContextType>(
    {} as BarriosContextType
);

export const BarriosProvider = ({ children }: any) => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showMiniModal, setShowMiniModal] = useState<boolean>(false);
    const [selectedOption, setSelectedOption] = useState<boolean>(false);
    const [selectedDistrict, setSelectedDistrict] = useState<District>(district);

    return (
        <BarriosContext.Provider value={{
            showModal,
            setShowModal,
            showMiniModal,
            setShowMiniModal,
            selectedOption,
            setSelectedOption,
            selectedDistrict,
            setSelectedDistrict
        }}>
            {children}
        </BarriosContext.Provider>
    );
}