import { SmartwaterContext } from "../../../SmartwaterContext";
import { FiltroPaginado } from "../../components/FiltroPaginado/FiltroPaginado";
import { InfoCliente } from "../../components/InfoCliente/InfoCliente";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import { AgregarCliente } from "./AgregarCliente/AgregarCliente";
import "./Clientes.css";
import { FC, useContext } from "react";
import { OpcionesClientes } from "./OpcionesClientes/OpcionesClientes";

const Clientes: FC = () => {

    const { showModal, setShowModal, showMiniModal } = useContext(SmartwaterContext);

    const AddCliente = () => {
        setShowModal(true)
    }

    return (
        <>
            <div>
                <PageTitle titulo="Clientes" icon="./clientes-icon.svg" />
                <FiltroPaginado add={true} exportar={true} paginacion={true} onAdd={AddCliente} resultados={true}>
                    <div style={{ display: "flex", gap: "20px", justifyContent: "start", flexWrap: "wrap"}}>
                        <InfoCliente/>
                        <InfoCliente/>
                        <InfoCliente/>
                        <InfoCliente/>
                    </div>
                </FiltroPaginado>
            </div>
            {showModal && <AgregarCliente/>}
            {showMiniModal && <OpcionesClientes/>}
        </>
    )
}

export { Clientes }