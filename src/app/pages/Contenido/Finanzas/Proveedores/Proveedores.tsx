import { FC, useContext } from "react";
import "./Proveedores.css";
import { PageTitle } from "../../../components/PageTitle/PageTitle";
import { FiltroPaginado } from "../../../components/FiltroPaginado/FiltroPaginado";
import { AgregarProveedor } from "./AgregarProveedor/AgregarProveedor";
import { CuadroProveedor } from "./CuadroProveedor/CuadroProveedor";
import { ProveedoresContext } from "./ProveedoresContext";
import { FiltroProveedores } from "./FiltroProveedores/FiltroProveedores";

const Proveedores: FC = () => {
    
    const { showModal, setShowModal, showFiltro, setShowFiltro } = useContext(ProveedoresContext);

    const Onfilter = () => {
        setShowFiltro(true)
    }

    const handleModal = () => {
        setShowModal(true)
    }

    return(
        <>
        <div>
            <PageTitle titulo="Proveedores" icon="../../Finanzas-icon.svg"/>
            <FiltroPaginado filtro resultados add onAdd={handleModal} onFilter={Onfilter}>
                <div style={{display:"flex", flexWrap: "wrap", gap: "16px"}}>
                    <CuadroProveedor/>
                    <CuadroProveedor/>
                    <CuadroProveedor/>
                </div>
            </FiltroPaginado>
        </div>
        {showFiltro && <FiltroProveedores/>}
        {showModal && <AgregarProveedor/>}
        </>
    )
}

export{ Proveedores }