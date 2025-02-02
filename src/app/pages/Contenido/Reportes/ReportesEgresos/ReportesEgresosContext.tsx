import { createContext, useState } from "react";

type ReportesEgresosContextType = {
    proveedores: boolean;
    setProveedores: React.Dispatch<React.SetStateAction<boolean>>
    egresosGastos: boolean;
    setEgresosGastos: React.Dispatch<React.SetStateAction<boolean>>
    cuentasPorPagar: boolean;
    setCuentasPorPagar: React.Dispatch<React.SetStateAction<boolean>>
    pagos: boolean;
    setpagos: React.Dispatch<React.SetStateAction<boolean>>
}

export const ReportesEgresosContext = createContext<ReportesEgresosContextType>(
    {} as ReportesEgresosContextType
);

export const ReportesEgresosProvider = ({ children }: any) => {
    const [proveedores, setProveedores] = useState<boolean>(false);
    const [egresosGastos, setEgresosGastos] = useState<boolean>(false);
    const [cuentasPorPagar, setCuentasPorPagar] = useState<boolean>(false);
    const [pagos, setpagos] = useState<boolean>(false);

    return (
        <ReportesEgresosContext.Provider value={{
            egresosGastos,
            setEgresosGastos,
            cuentasPorPagar,
            pagos,
            proveedores,
            setCuentasPorPagar,
            setpagos,
            setProveedores
        }}>
            {children}
        </ReportesEgresosContext.Provider>
    );
}