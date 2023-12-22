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
                <FiltroPaginado paginacion={false} add={true} exportar={false} onAdd={AddUbicacion} iconUbicacion>
                    <div>

                    </div>
                </FiltroPaginado>
            </div>
            {showMiniModal && <RegistrarNuevo/>}
        </>
    )
}

export { MapaClientes }