import { FiltroPaginado } from "../../components/FiltroPaginado/FiltroPaginado";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import "./MapaClientes.css";
import { FC, useContext } from "react";
import { RegistrarNuevo } from "./RegistrarNuevo/RegistrarNuevo";
import { MapaClientesContext } from "./MapaClientesContext";
import { GoogleMaps } from "../../components/GoogleMaps/GoogleMaps";

const MapaClientes: FC = () => {

    const { showMiniModal ,setShowMiniModal } = useContext(MapaClientesContext);
    const api: string = "AIzaSyApnMcPn7E_7oPoQzelrTZX0OjDwrNbsco";

    const AddUbicacion = () => {
        setShowMiniModal(true)
    }

    return (
        <>
            <div>
                <PageTitle titulo="Mapa de clientes" icon="./ubicacion-icon.svg" />
                <FiltroPaginado filtro paginacion={false} add={true} exportar={false} onAdd={AddUbicacion} iconUbicacion>
                    <div className="Mapaclientes-googleubicacion">
                        <GoogleMaps apiKey={api}/>
                    </div>
                </FiltroPaginado>
            </div>
            {showMiniModal && <RegistrarNuevo/>}
        </>
    )
}

export { MapaClientes }