import { createContext, useState } from "react";
import { Schedule } from "../../../../../type/Schedule";

type HorarioContextType = {
    showModal: boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    showMiniModal: boolean;
    setShowMiniModal: React.Dispatch<React.SetStateAction<boolean>>;
    selectedOption: boolean;
    setSelectedOption: React.Dispatch<React.SetStateAction<boolean>>;
    selectedSchedule: Schedule;
    setSelectedSchedule: React.Dispatch<React.SetStateAction<Schedule>>;
}

export const HorarioContext = createContext<HorarioContextType>(
    {} as HorarioContextType
);

export const schedule: Schedule = { days: [], _id: "", endTime: "", startTime: "" }

export const Horarioprovider = ({ children }: any) => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showMiniModal, setShowMiniModal] = useState<boolean>(false);
    const [selectedOption, setSelectedOption] = useState<boolean>(false);
    const [selectedSchedule, setSelectedSchedule] = useState<Schedule>(schedule);

    return (
        <HorarioContext.Provider value={{
            showModal,
            setShowModal,
            showMiniModal,
            setShowMiniModal,
            selectedOption,
            setSelectedOption,
            selectedSchedule,
            setSelectedSchedule,
        }}>
            {children}
        </HorarioContext.Provider>
    );
}