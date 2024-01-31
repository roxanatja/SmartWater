import { FiltroPaginado } from "../../components/FiltroPaginado/FiltroPaginado";
import { InfoCliente } from "./InfoCliente/InfoCliente";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import { AgregarCliente } from "./AgregarCliente/AgregarCliente";
import "./Clientes.css";
import { FC, useContext, useEffect, useState } from "react";
import { OpcionesClientes } from "./OpcionesClientes/OpcionesClientes";
import { ClientesContext } from "./ClientesContext";
import { FiltroClientes } from "./FiltroClientes/FiltroClientes";
import { loadClients } from "../../../../api/ClientsApi/ClientsApi";

const Clientes: FC = () => {

    const { showModal, setShowModal, showMiniModal, showFiltro, setShowFiltro } = useContext(ClientesContext);
    const [clients, setClients] = useState([]);

    useEffect(() => {
        const loadData = async () => {
            try{
                await loadClients().then((resp) => {
                    setClients(resp?.data.data);
                });
            } catch(e) {
                console.log(e);
            }
        }

        loadData();
    });

    const AddCliente = () => {
        setShowModal(true)
    }
    const Onfilter = () => {
        setShowFiltro(true)
    }

    return (
        <>
            <div>
                <PageTitle titulo="Clientes" icon="./clientes-icon.svg" />
                <FiltroPaginado add={true} exportar={true} paginacion={true} onAdd={AddCliente} resultados={true} filtro onFilter={Onfilter}>
                    <div style={{ display: "flex", gap: "20px", justifyContent: "start", flexWrap: "wrap"}}>
                        {clients.map(client => {
                            return <InfoCliente/>
                        })}
                    </div>
                </FiltroPaginado>
            </div>
            {showModal && <AgregarCliente/>}
            {showMiniModal && <OpcionesClientes/>}
            {showFiltro && <FiltroClientes/>}
        </>
    )
}

export { Clientes }