import { createContext, useState } from "react";

type ReportesResultadosContextType = {
    resultados: boolean;
    setResultados: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ReportesResultadosContext = createContext<ReportesResultadosContextType>(
    {} as ReportesResultadosContextType
);

export const ReportesResultadosProvider = ({ children }: any) => {
    const [resultados, setResultados] = useState<boolean>(false);

    return (
        <ReportesResultadosContext.Provider value={{
            resultados,
            setResultados,
        }}>
            {children}
        </ReportesResultadosContext.Provider>
    );
}