import { createContext, useState } from "react";
import { User } from "../../../../../type/User";

type UsuariosContextType = {
    showModal: boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    showMiniModal: boolean;
    setShowMiniModal: React.Dispatch<React.SetStateAction<boolean>>;
    selectedOption: boolean;
    setSelectedOption: React.Dispatch<React.SetStateAction<boolean>>;
    selectedUser: User;
    setSelectedUser: React.Dispatch<React.SetStateAction<User>>;
    showFiltro: boolean;
    setShowFiltro: React.Dispatch<React.SetStateAction<boolean>>;
}

export const UsuariosContext = createContext<UsuariosContextType>(
    {} as UsuariosContextType
);

export const user: User = {
    _id: "",
    username: "",
    phoneNumber: "",
    password: "",
    role: "",
    fullName: "",
    email: "",
    updated: "",
    zones: [],
    permissions: [],
    tokenFCM: "",
    schedules: [],
    identification: ""
}

export const UsuariosProvider = ({ children }: any) => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showMiniModal, setShowMiniModal] = useState<boolean>(false);
    const [selectedOption, setSelectedOption] = useState<boolean>(false);
    const [showFiltro, setShowFiltro] = useState<boolean>(false);
    const [selectedUser, setSelectedUser] = useState<User>(user);

    return (
        <UsuariosContext.Provider value={{
            showModal,
            setShowModal,
            showMiniModal,
            setShowMiniModal,
            selectedOption,
            setSelectedOption,
            showFiltro,
            setShowFiltro,
            selectedUser,
            setSelectedUser
        }}>
            {children}
        </UsuariosContext.Provider>
    );
}