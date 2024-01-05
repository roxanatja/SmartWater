import { FC, useContext } from "react";
import "./Usuarios.css";
import { PageTitle } from "../../../components/PageTitle/PageTitle";
import { FiltroPaginado } from "../../../components/FiltroPaginado/FiltroPaginado";
import { UsuariosContext } from "./UsuariosContext";
import { AddUsuario } from "./AddUsuario/AddUsuario";
import { CuadroUsuarios } from "./CuadroUsuarios/CuadroUsuarios";
import { AsignarPermisos } from "./AsignarPermisos/AsignarPermisos";

const Usuarios: FC = () => {

    const {showModal, setShowModal, showMiniModal} = useContext(UsuariosContext)

    const AgregarUsuario = () => {
        setShowModal(true)
    }

    return(
        <>
        <div>
            <PageTitle titulo="Configuración / Usuarios" icon="../../../Configuracion-icon.svg"/> 
            <FiltroPaginado filtro ={false} onAdd={AgregarUsuario} add>
                <div style={{display: "flex", flexWrap: "wrap", flexDirection: "row", gap: "24px"}}>
                    <CuadroUsuarios/>
                    <CuadroUsuarios/>
                </div>
            </FiltroPaginado>
        </div>
        {showModal && <AddUsuario/>}
        {showMiniModal && <AsignarPermisos/>}
        </>
    )
}

export{Usuarios}