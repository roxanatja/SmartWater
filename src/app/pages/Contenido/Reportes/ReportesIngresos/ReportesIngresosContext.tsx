import { createContext, useState } from "react";

type ReportesIngresosContextType = {
    showModal: boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    showMiniModal: boolean;
    setShowMiniModal: React.Dispatch<React.SetStateAction<boolean>>;
    clientes: boolean;
    setClientes: React.Dispatch<React.SetStateAction<boolean>>
    ventas: boolean;
    setVentas: React.Dispatch<React.SetStateAction<boolean>>
    cuentasPorCobrarCobros: boolean;
    setCuentasPorCobrarCobros: React.Dispatch<React.SetStateAction<boolean>>
    prestamos: boolean;
    setPrestamos: React.Dispatch<React.SetStateAction<boolean>>
    egresosGastos: boolean;
    setEgresosGastos: React.Dispatch<React.SetStateAction<boolean>>
}

export const ReportesIngresosContext = createContext<ReportesIngresosContextType>(
    {} as ReportesIngresosContextType
);

export const ReportesIngresosProvider = ({ children }: any) => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showMiniModal, setShowMiniModal] = useState<boolean>(false);
    const [ clientes, setClientes ] = useState<boolean>(false);
    const [ ventas, setVentas ] = useState<boolean>(false);
    const [ cuentasPorCobrarCobros, setCuentasPorCobrarCobros ] = useState<boolean>(false);
    const [ prestamos, setPrestamos ] = useState<boolean>(false);
    const [ egresosGastos, setEgresosGastos ] = useState<boolean>(false);

    
    return (
        <ReportesIngresosContext.Provider value={{
            showModal, 
            setShowModal,
            showMiniModal, 
            setShowMiniModal,
            clientes,
            setClientes,
            ventas,
            setVentas,
            cuentasPorCobrarCobros, 
            setCuentasPorCobrarCobros,
            prestamos, 
            setPrestamos,
            egresosGastos,
            setEgresosGastos,
        }}>
            {children}
        </ReportesIngresosContext.Provider>
    );
}