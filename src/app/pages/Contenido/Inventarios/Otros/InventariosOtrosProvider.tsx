import React, { createContext, PropsWithChildren, useState } from 'react'
import { OtherEntry, OtherOutput } from '../../../../../type/Kardex';
import { user } from '../../Configuracion/Usuarios/UsuariosContext';

type InventariosOtrosContextType = {
    showModal: boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    showMiniModal: boolean;
    setShowMiniModal: React.Dispatch<React.SetStateAction<boolean>>;
    selectedOption: boolean;
    setSelectedOption: React.Dispatch<React.SetStateAction<boolean>>;
    showFiltro: boolean;
    setShowFiltro: React.Dispatch<React.SetStateAction<boolean>>;
    selectedEntry: OtherEntry;
    setSelectedEntry: React.Dispatch<React.SetStateAction<OtherEntry>>;
    selectedOutput: OtherOutput;
    setSelectedOutput: React.Dispatch<React.SetStateAction<OtherOutput>>;
};

export const InventariosOtrosContext =
    createContext<InventariosOtrosContextType>({} as InventariosOtrosContextType);

export const otroEntry: OtherEntry = { _id: "", balance: { balanceAmount: 0, balanceImport: 0, cpp: 0, inputImport: 0, inputQuantity: 0 }, detail: "", documentNumber: "", elementName: "", quantity: 0, registerDate: "", type: "production_received", user: user }
export const otroOutput: OtherOutput = { _id: "", balance: { balanceAmount: 0, balanceImport: 0, cpp: 0, inputImport: 0, inputQuantity: 0 }, detail: "", documentNumber: "", elementName: "", quantity: 0, registerDate: "", type: "production_delivered", user: user }

const InventariosOtrosProvider = ({ children }: PropsWithChildren) => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showMiniModal, setShowMiniModal] = useState<boolean>(false);
    const [selectedOption, setSelectedOption] = useState<boolean>(false);
    const [showFiltro, setShowFiltro] = useState<boolean>(false);
    const [selectedEntry, setSelectedEntry] = useState<OtherEntry>(otroEntry);
    const [selectedOutput, setSelectedOutput] = useState<OtherOutput>(otroOutput);

    return (
        <InventariosOtrosContext.Provider
            value={{
                showModal,
                setShowModal,
                showMiniModal,
                setShowMiniModal,
                selectedOption,
                setSelectedOption,
                showFiltro,
                setShowFiltro,
                selectedEntry,
                setSelectedEntry,
                selectedOutput,
                setSelectedOutput,
            }}
        >
            {children}
        </InventariosOtrosContext.Provider>
    );
}

export default InventariosOtrosProvider