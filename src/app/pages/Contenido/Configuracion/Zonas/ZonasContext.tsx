import { createContext, useState } from "react";
import { Zone } from "../../../../../type/City";

type ZonasContextType = {
    showModal: boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    showMiniModal: boolean;
    setShowMiniModal: React.Dispatch<React.SetStateAction<boolean>>;
    selectedOption: boolean;
    setSelectedOption: React.Dispatch<React.SetStateAction<boolean>>;
    selectedZone: Zone;
    setSelectedZone: React.Dispatch<React.SetStateAction<Zone>>;
}

export const zone: Zone = { _id: "", districts: [], name: "" }

export const ZonasContext = createContext<ZonasContextType>(
    {} as ZonasContextType
);

export const ZonasProvider = ({ children }: any) => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showMiniModal, setShowMiniModal] = useState<boolean>(false);
    const [selectedOption, setSelectedOption] = useState<boolean>(false);
    const [selectedZone, setSelectedZone] = useState<Zone>(zone);

    return (
        <ZonasContext.Provider value={{
            showModal,
            setShowModal,
            showMiniModal,
            setShowMiniModal,
            selectedOption,
            setSelectedOption,
            selectedZone,
            setSelectedZone
        }}>
            {children}
        </ZonasContext.Provider>
    );
}