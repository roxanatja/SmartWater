import { createContext, useState } from "react";
import { Client } from "../../../../type/Cliente/Client";

type ClientesContextType = {
    showModal: boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    showMiniModal: boolean;
    setShowMiniModal: React.Dispatch<React.SetStateAction<boolean>>;
    selectedOption: boolean;
    setSelectedOption: React.Dispatch<React.SetStateAction<boolean>>;
    showFiltro: boolean;
    setShowFiltro: React.Dispatch<React.SetStateAction<boolean>>;
    selectedClient: Client;
    setSelectedClient: React.Dispatch<React.SetStateAction<Client>>;
}

export const ClientesContext = createContext<ClientesContextType>(
    {} as ClientesContextType
);

export const ClientesProvider = ({ children }: any) => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showMiniModal, setShowMiniModal] = useState<boolean>(false);
    const [selectedOption, setSelectedOption] = useState<boolean>(false);
    const [showFiltro, setShowFiltro] = useState<boolean>(false);
    
    const client:Client = {
        "_id": "",
        "code": "",
        "user": "",
        "storeImage": "",
        "fullName": "",
        "phoneNumber": "",
        "address": "",
        "comment": "",
        "email": "",
        "ciFrontImage": "",
        "ciBackImage": "",
        "zone": "",
        "district": "",
        "location": {
          "latitude": "",
          "longitude": ""
        },
        "hasOrder": false,
        "hasLoan": true,
        "hasContract": false,
        "renewInDays": 1,
        "renewDate": "",
        "isClient": true,
        "isAgency": true,
        "billingInfo": {
          "NIT": "",
          "phoneNumber": ""
        },
        "averageRenewal": false,
        "contracts": [],
        "created": "",
        "updated": "",
        "lastSale": "",
        "hasExpiredContract": false,
        "credit": 1
      }
      const[selectedClient, setSelectedClient] = useState<Client>(client)

    return (
        <ClientesContext.Provider value={{
            showModal, 
            setShowModal,
            showMiniModal, 
            setShowMiniModal,
            selectedOption, 
            setSelectedOption,
            showFiltro,
            setShowFiltro,
            selectedClient,
            setSelectedClient
        }}>
            {children}
        </ClientesContext.Provider>
    );
}