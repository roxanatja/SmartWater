import { FiltroPaginado } from "../../components/FiltroPaginado/FiltroPaginado";
import { InfoCliente } from "./InfoCliente/InfoCliente";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import { AgregarCliente } from "./AgregarCliente/AgregarCliente";
import "./Clientes.css";
import { FC, useContext, useEffect, useState } from "react";
import { OpcionesClientes } from "./OpcionesClientes/OpcionesClientes";
import { ClientesContext } from "./ClientesContext";
import { FilterContext } from "../../components/FilterContexr/FilterContext";
import { FiltroClientes } from "./FiltroClientes/FiltroClientes";
import { loadClients } from "../../../../services/ClientsService";
import { Client } from '../../../../type/Cliente/Client';
import moment from "moment";

const Clientes: FC = () => {

    const { showModal, setShowModal, showMiniModal, showFiltro, setShowFiltro } = useContext(ClientesContext);
    const { applicatedFilters, notApplicatedFilters,fromDate, toDate, withLoans, withoutLoans, withCredit, withoutCredit, dealers, zone } = useContext(FilterContext);
    const [clients, setClients] = useState<Client[]>([]);
    const [clientsFiltered, setClientsFiltered] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentData, setCurrentData] = useState<Client[]>([]);
    const itemsPerPage = 10;
    const [totalPage, setTotalPage] = useState(0);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        let currentPage = page - 1;
        const startIndex = currentPage * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        setCurrentData(clientsFiltered.slice(startIndex, endIndex));
    };

    const orderArray = (orden: string) => {
        let clientesOrdenados = [...clientsFiltered];
        if (orden === 'new') {
            clientesOrdenados.sort((a, b) => moment(b.lastSale, 'YYYY-MM-DD').valueOf() - moment(a.lastSale, 'YYYY-MM-DD').valueOf());
        } else if (orden === 'older') {
            clientesOrdenados.sort((a, b) => moment(a.lastSale, 'YYYY-MM-DD').valueOf() - moment(b.lastSale, 'YYYY-MM-DD').valueOf());
        }
        setClients(clientesOrdenados);
        handlePageChange(1);
    };

    const getClient = async () => {
        try{
            await loadClients()
                    .then((resp) => {
                        setClients(resp.data);
                        setClientsFiltered(resp.data);
                        setLoading(false);
                        setPagesData();
                    });
            orderArray('new');
        } catch(e) {
            console.error(e);
            setError(true);
            setLoading(false);
        }
    };

    const setPagesData = () => {
        const pages = Math.ceil(clientsFiltered.length / itemsPerPage);
        setTotalPage(pages);
        setCurrentData(clients.slice(0, 10));
    };

    useEffect(() => {
        if(loading){
            getClient();
        };
        
        if (applicatedFilters) {
            console.log(applicatedFilters);
            console.log(fromDate, toDate, withLoans, withoutLoans, withCredit, withoutCredit, dealers, zone);
        };

        if (notApplicatedFilters) {
            console.log(notApplicatedFilters);
        };
    }, [applicatedFilters, notApplicatedFilters]);

    if (loading) {
        return <p>Cargando Clientes</p>
    }

    if (error) {
        return <p>Ha ocurrido un error en la carga, intentelo de nuevo en unos minutos</p>
    }

    

    //if(applicatedFilters){
    //    console.log(applicatedFilters);
    //    console.log(fromDate, toDate, withLoans, withoutLoans, withCredit, withoutCredit, dealers, zone);
    //};
    //if(notApplicatedFilters){
    //    console.log(notApplicatedFilters);
    //};

    const AddCliente = () => {
        setShowModal(true)
    }
    const Onfilter = () => {
        setShowFiltro(true)
    };

    const searchUser = (e: string) => {
        const value = e;
        
        if(value === ""){
            getClient();
            return;
        } else {
            let clientFilter = clients.filter(client => client.fullName?.toLowerCase().includes(value.toLowerCase()));
            setCurrentData(clientFilter);
        }
    };

    return (
        <>
            <div>
                <PageTitle titulo="Clientes" icon="./clientes-icon.svg" />
                <FiltroPaginado add={true} exportar={true} typeDataToExport="clients" paginacion={true} totalPage={totalPage} currentPage={currentPage} handlePageChange={handlePageChange} onAdd={AddCliente} resultados={true} filtro total={clients.length} search={searchUser} orderArray={orderArray} onFilter={Onfilter}>
                    <div style={{ display: "flex", gap: "20px", justifyContent: "start", flexWrap: "wrap"}}>
                        {currentData.map(client => {
                            return <InfoCliente {...client} key={client._id}/>
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