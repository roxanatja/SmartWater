import { createContext } from "react";

type InicioContextType = {

}

export const InicioContext = createContext<InicioContextType>(
    {} as InicioContextType
);

export const InicioProvider = ({ children }: any) => {
    

    return (
        <InicioContext.Provider value={{
            
        }}>
            {children}
        </InicioContext.Provider>
    );
}