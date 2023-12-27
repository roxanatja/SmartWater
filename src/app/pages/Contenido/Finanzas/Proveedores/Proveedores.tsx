import { FC, useContext } from "react";
import "./Proveedores.css";
import { PageTitle } from "../../../components/PageTitle/PageTitle";
import { FiltroPaginado } from "../../../components/FiltroPaginado/FiltroPaginado";
import { AgregarProveedor } from "./AgregarProveedor/AgregarProveedor";
import { CuadroProveedor } from "./CuadroProveedor/CuadroProveedor";
import { ProveedoresContext } from "./ProveedoresContext";

const Proveedores: FC = () => {
    
    const { showModal, setShowModal } = useContext(ProveedoresContext);

    const handleModal = () => {
        setShowModal(true)
    }

    return(
        <>
        <div>
            <PageTitle titulo="Proveedores" icon="../../Finanzas-icon.svg"/>
            <FiltroPaginado resultados add onAdd={handleModal}>
                <div style={{display:"flex", flexWrap: "wrap", gap: "16px"}}>
                    <CuadroProveedor/>
                    <CuadroProveedor/>
                    <CuadroProveedor/>
                </div>
            </FiltroPaginado>
        </div>
        {showModal && <AgregarProveedor/>}
        </>
    )
}

export{ Proveedores }