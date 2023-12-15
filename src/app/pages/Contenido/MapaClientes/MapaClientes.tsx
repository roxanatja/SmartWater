import { SmartwaterContext } from "../../../SmartwaterContext";
import { FiltroPaginado } from "../../components/FiltroPaginado/FiltroPaginado";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import "./MapaClientes.css";
import { FC, useContext } from "react";
import { RegistrarNuevo } from "./RegistrarNuevo/RegistrarNuevo";

const MapaClientes: FC = () => {

    const { showMiniModal ,setShowMiniModal } = useContext(SmartwaterContext);

    const AddUbicacion = () => {
        setShowMiniModal(true)
    }

    return (
        <>
            <div>
                <PageTitle titulo="Mapa de clientes" icon="./ubicacion-icon.svg" />
                <FiltroPaginado paginacion={false} add={true} exportar={false} onAdd={AddUbicacion}>
                    <div style={{display: "flex", flexDirection: "column"}}>
                        <div style={{display: "flex", gap: "35px", marginBottom: "25px"}}>
                            <div className="Mapaclientes-ubicacion">
                                <svg xmlns="http://www.w3.org/2000/svg" width="31" height="47" viewBox="0 0 31 47" fill="#DD0000">
                                    <path d="M31 15.3918C31 23.8925 23.1159 33.807 15.5 47C6.78557 33.807 0 23.8925 0 15.3918C0 6.89115 6.93959 0 15.5 0C24.0604 0 31 6.89115 31 15.3918Z"/>
                                </svg>
                                <span>
                                    Clientes registrados
                                </span>
                            </div>
                            <div className="Mapaclientes-ubicacion">
                                <svg xmlns="http://www.w3.org/2000/svg" width="31" height="47" viewBox="0 0 31 47" fill="#FF5C00">
                                    <path d="M31 15.3918C31 23.8925 23.1159 33.807 15.5 47C6.78557 33.807 0 23.8925 0 15.3918C0 6.89115 6.93959 0 15.5 0C24.0604 0 31 6.89115 31 15.3918Z"/>
                                </svg>
                                <span>
                                    Clientes registrados
                                </span>
                            </div>
                            <div className="Mapaclientes-ubicacion">
                                <svg xmlns="http://www.w3.org/2000/svg" width="31" height="47" viewBox="0 0 31 47" fill="#960090">
                                    <path d="M31 15.3918C31 23.8925 23.1159 33.807 15.5 47C6.78557 33.807 0 23.8925 0 15.3918C0 6.89115 6.93959 0 15.5 0C24.0604 0 31 6.89115 31 15.3918Z"/>
                                </svg>
                                <span>
                                    Clientes registrados
                                </span>
                            </div>
                            <div className="Mapaclientes-ubicacion">
                                <svg xmlns="http://www.w3.org/2000/svg" width="31" height="47" viewBox="0 0 31 47" fill="#1FAF38">
                                    <path d="M31 15.3918C31 23.8925 23.1159 33.807 15.5 47C6.78557 33.807 0 23.8925 0 15.3918C0 6.89115 6.93959 0 15.5 0C24.0604 0 31 6.89115 31 15.3918Z"/>
                                </svg>
                                <span>
                                    Clientes registrados
                                </span>
                            </div>
                        </div>
                        <div>

                        </div>
                    </div>
                </FiltroPaginado>
            </div>
            {showMiniModal && <RegistrarNuevo/>}
        </>
    )
}

export { MapaClientes }