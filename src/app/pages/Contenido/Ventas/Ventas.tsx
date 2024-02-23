import { CuadroVentaCliente } from "./CuadroVentaCliente/CuadroVentaCliente";
import { FiltroPaginado } from "../../components/FiltroPaginado/FiltroPaginado";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import { OpcionesVentas } from "./OpcionesVentas/OpcionesVentas";
import "./Ventas.css";
import { FC, useContext, useEffect, useState } from "react";
import moment from "moment";
import { VentasContext } from "./VentasContext";
import { FiltroVenta } from "./FiltroVenta/FiltroVenta";
import { Sale } from "../../../../type/Sale/Sale";
import { GetSales } from "../../../../services/SaleService";
import { loadClients } from "../../../../services/ClientsService";

const Ventas: FC = () => {

    const { showModal, setShowFiltro, showFiltro } = useContext(VentasContext);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [sales, setSales] = useState<Array<Sale>>([]);
    const [clients, setClients] = useState<Array<any>>([]);

    const getSales = async () => {
        try{
            await GetSales()
                .then((resp) => {
                    setSales(resp.data);
                    setLoading(false);
                });
        }catch(e){
            console.error(e);
            setLoading(false);
            setError(true);
        };
    };
    
    const getClients = async () => {
        try{
            await loadClients()
                .then((resp) => {
                    setClients(resp.data);
                });
        }catch(e){
            console.error(e);
        };
    };

    const orderArray = (orden: string) => {
        let salesOrdenadas = [...sales];
        if (orden === 'new') {
            salesOrdenadas.sort((a, b) => moment(b.updated, 'YYYY-MM-DD').valueOf() - moment(a.updated, 'YYYY-MM-DD').valueOf());
        } else if (orden === 'older') {
            salesOrdenadas.sort((a, b) => moment(a.updated, 'YYYY-MM-DD').valueOf() - moment(b.updated, 'YYYY-MM-DD').valueOf());
        }
        setSales(salesOrdenadas);
    };

    useEffect(() => {
            getSales();
            getClients();
    }, []);

    if (loading) {
        return <p>Cargando Ventas</p>
    };

    if (error) {
        return <p>Ocurrio un error en la carga de datos, intentelo de nuevo en unos minutos</p>
    };

    const Onfilter = () => {
        setShowFiltro(true)
    };

    const serchSale = (e: string) => {
        const value = e;
        
        if(value === ""){
            getSales();
            getClients();
            return;
        } else {
            let clientFilter = clients.filter(client => client.fullName?.toLowerCase().includes(value.toLowerCase()));
            let saleFilter = clientFilter.flatMap((client) => {
                return sales.filter(sale => sale.client === client._id);
            });
            setSales(saleFilter);
        }
    };

    return (
        <>
            <div>
                <PageTitle titulo="Ventas" icon="./Ventas-icon.svg" />
                <FiltroPaginado filtro exportar={true} typeDataToExport={'sales'} search={serchSale} add={false} paginacion={false} infoPedidos={true} resultados={true} total={sales.length} orderArray={orderArray} onFilter={Onfilter}>
                    <div style={{ display: "flex", gap: "20px", justifyContent: "start", flexWrap: "wrap"}}>
                        {sales.map((sale) =>{
                            return <CuadroVentaCliente {...sale} key={sale._id}/>
                        })}
                    </div>
                </FiltroPaginado>
            </div>
            {showModal && <OpcionesVentas/>}
            {showFiltro && <FiltroVenta/>}
        </>
    )
}

export { Ventas }