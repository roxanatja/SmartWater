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

const Ventas: FC = () => {

    const { showModal, setShowFiltro, showFiltro } = useContext(VentasContext);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [sales, setSales] = useState<Array<Sale>>([]);

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
    }, []);

    if (loading) {
        return <p>Cargando Ventas</p>
    }

    if (error) {
        return <p>Ocurrio un error en la carga de datos, intentelo de nuevo en unos minutos</p>
    }

    const Onfilter = () => {
        setShowFiltro(true)
    }

    return (
        <>
            <div>
                <PageTitle titulo="Ventas" icon="./Ventas-icon.svg" />
                <FiltroPaginado filtro exportar={true} typeDataToExport={'sales'} add={false} paginacion={false} infoPedidos={true} resultados={true} total={sales.length} orderArray={orderArray} onFilter={Onfilter}>
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