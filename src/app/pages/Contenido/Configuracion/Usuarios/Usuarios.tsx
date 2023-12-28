import { FC, useContext } from "react";
import "./Usuarios.css";
import { PageTitle } from "../../../components/PageTitle/PageTitle";
import { FiltroPaginado } from "../../../components/FiltroPaginado/FiltroPaginado";
import { UsuariosContext } from "./UsuariosContext";
import { AddUsuario } from "./AddUsuario/AddUsuario";

const Usuarios: FC = () => {

    const {showModal, setShowModal} = useContext(UsuariosContext)

    const AgregarUsuario = () => {
        setShowModal(true)
    }

    return(
        <>
        <div>
            <PageTitle titulo="Configuración / Usuarios" icon="../../../Configuracion-icon.svg"/> 
            <FiltroPaginado filtro ={false} onAdd={AgregarUsuario} add>
                
            </FiltroPaginado>
        </div>
        {showModal && <AddUsuario/>}
        </>
    )
}

export{Usuarios}