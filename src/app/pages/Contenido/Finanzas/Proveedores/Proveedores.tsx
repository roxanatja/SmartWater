import { FC, useContext } from "react";
import "./Proveedores.css";
import { PageTitle } from "../../../components/PageTitle/PageTitle";
import { FiltroPaginado } from "../../../components/FiltroPaginado/FiltroPaginado";
import { SmartwaterContext } from "../../../../SmartwaterContext";
import { AgregarProveedor } from "./AgregarProveedor/AgregarProveedor";
import { CuadroProveedor } from "./CuadroProveedor/CuadroProveedor";

const Proveedores: FC = () => {
    
    const { showModal, setShowModal } = useContext(SmartwaterContext);

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