import { createContext, useState } from "react";
import { Account } from "../../../../../type/AccountEntry";
import { Expense } from "../../../../../type/Expenses";

type EgresosGastosContextType = {
    showModal: boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    showMiniModal: boolean;
    setShowMiniModal: React.Dispatch<React.SetStateAction<boolean>>;
    selectedOption: boolean;
    setSelectedOption: React.Dispatch<React.SetStateAction<boolean>>;
    showFiltro: boolean;
    setShowFiltro: React.Dispatch<React.SetStateAction<boolean>>;

    selectedAccount: Account;
    setSelectedAccount: React.Dispatch<React.SetStateAction<Account>>;
    selectedExpense: Expense;
    setSelectedExpense: React.Dispatch<React.SetStateAction<Expense>>;
}

export const EgresosGastosContext = createContext<EgresosGastosContextType>(
    {} as EgresosGastosContextType
);

export const account: Account = { _id: "", created: "", desactivated: false, description: "", name: "", updated: "" }
export const expense: Expense = {
    _id: "",
    created: "",
    accountEntry: "",
    amount: 0,
    comment: "",
    creditBuy: false,
    documentNumber: "",
    hasInVoice: false,
    paymentMethodCurrentAccount: false,
    provider: "",
    updated: "",
    user: ""
}

export const EgresosGastosProvider = ({ children }: any) => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showMiniModal, setShowMiniModal] = useState<boolean>(false);
    const [selectedOption, setSelectedOption] = useState<boolean>(false);
    const [showFiltro, setShowFiltro] = useState<boolean>(false);
    const [selectedAccount, setSelectedAccount] = useState<Account>(account);
    const [selectedExpense, setSelectedExpense] = useState<Expense>(expense);

    return (
        <EgresosGastosContext.Provider value={{
            showModal,
            setShowModal,
            showMiniModal,
            setShowMiniModal,
            selectedOption,
            setSelectedOption,
            showFiltro,
            setShowFiltro,
            selectedAccount,
            setSelectedAccount,
            selectedExpense,
            setSelectedExpense,
        }}>
            {children}
        </EgresosGastosContext.Provider>
    );
}