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
import { Client } from '../../../../type/Cliente/Client';
import { click } from "@testing-library/user-event/dist/click";

const Clientes: FC = () => {

    const { showModal, setShowModal, showMiniModal, showFiltro, setShowFiltro } = useContext(ClientesContext);
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        getClient();
    }, []);

    const getClient = async () => {
        try{
            await loadClients()
                    .then((resp) => {
                        setClients(resp.data)
                        setLoading(false);
                    })
        } catch(e) {
            console.error(e);
            setError(true);
            setLoading(false);
        }
    }

    if (loading) {
        return <p>Cargando Clientes</p>
    }

    if (error) {
        return <p>Ha ocurrido un error en la carga, intentelo de nuevo en unos minutos</p>
    }

    const AddCliente = () => {
        setShowModal(true)
    }
    const Onfilter = () => {
        setShowFiltro(true)
    }

    const selectClient = ( id:String ) => {
        console.log(id)
    }

    return (
        <>
            <div>
                <PageTitle titulo="Clientes" icon="./clientes-icon.svg" />
                <FiltroPaginado add={true} exportar={true} paginacion={true} onAdd={AddCliente} resultados={true} filtro onFilter={Onfilter}>
                    <div style={{ display: "flex", gap: "20px", justifyContent: "start", flexWrap: "wrap"}}>
                        {clients.map(client => { 
                            return <InfoCliente {...client}/>
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