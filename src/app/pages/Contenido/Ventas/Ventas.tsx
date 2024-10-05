import { CuadroVentaCliente } from "./CuadroVentaCliente/CuadroVentaCliente";
import { FiltroPaginado } from "../../components/FiltroPaginado/FiltroPaginado";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import { OpcionesVentas } from "./OpcionesVentas/OpcionesVentas";
import "./Ventas.css";
import { FC, useContext, useEffect, useState } from "react";
import moment from "moment";
import { VentasContext } from "./VentasContext";
import FiltroVenta from "./FiltroVenta/FiltroVenta";
import { Sale } from "../../../../type/Sale/Sale";
import { GetSales } from "../../../../services/SaleService";
import Modal from "../../EntryComponents/Modal";
import { client } from "../Clientes/ClientesContext";

const Ventas: FC = () => {
  const {
    showModal,
    setShowModal,
    setShowFiltro,
    showFiltro,
    setSelectedClient,
  } = useContext(VentasContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [sales, setSales] = useState<Array<Sale>>([]);
  const [currenData, setCurrenData] = useState<Array<Sale>>([]);

  const getSales = async () => {
    try {
      const resp = await GetSales();
      setSales(resp.data);
      setLoading(false);
      setCurrenData(resp.data); // Almacenar datos originales
    } catch (e) {
      console.error(e);
      setLoading(false);
      setError(true);
    }
  };

  const orderArray = (orden: string) => {
    let salesOrdenadas = [...sales];
    if (orden === "new") {
      salesOrdenadas.sort(
        (a, b) =>
          moment(b.updated, "YYYY-MM-DD").valueOf() -
          moment(a.updated, "YYYY-MM-DD").valueOf()
      );
    } else if (orden === "older") {
      salesOrdenadas.sort(
        (a, b) =>
          moment(a.updated, "YYYY-MM-DD").valueOf() -
          moment(b.updated, "YYYY-MM-DD").valueOf()
      );
    }
    setSales(salesOrdenadas);
  };

  const Onfilter = (filteredSales: Array<Sale>) => {
    setSales(filteredSales);
  };

  useEffect(() => {
    getSales();
  }, []);

  if (loading) {
    return <p>Cargando Ventas</p>;
  }

  if (error) {
    return (
      <p>
        Ocurrio un error en la carga de datos, intentelo de nuevo en unos
        minutos
      </p>
    );
  }

  const serchSale = (e: string) => {
    const value = e;

    if (value === "") {
      setSales(currenData);
      return;
    } else {
      const clientFilter = sales.filter((sale: Sale) =>
        sale.client.some((client) =>
          client.fullName?.toLowerCase().includes(value.toLowerCase())
        )
      );
      setSales(clientFilter);
    }
  };

  return (
    <>
      <div>
        <PageTitle titulo="Ventas" icon="./Ventas-icon.svg" />
        <FiltroPaginado
          filtro
          exportar={true}
          typeDataToExport={"sales"}
          search={serchSale}
          add={false}
          paginacion={false}
          infoPedidos={true}
          resultados={true}
          total={sales.length}
          orderArray={orderArray}
          onFilter={() => setShowFiltro(true)}
        >
          <div className="grid grid-cols-4 max-sm:grid-cols-1 gap-4 pb-2 pt-2">
            {sales.map((sale) => {
              return <CuadroVentaCliente {...sale} key={sale._id} />;
            })}
          </div>
        </FiltroPaginado>
      </div>
      <Modal
        isOpen={showModal}
        onClose={() => {
          setSelectedClient(client);
          setShowModal(false);
        }}
        className="w-3/12"
      >
        <h2 className="text-blue_custom font-semibold p-6 pb-0 sticky top-0 z-30 bg-white">
          Opciones Cliente
        </h2>
        <div className="p-6">
          <OpcionesVentas
            onClose={() => {
              setShowModal(false);
              setSelectedClient(client);
            }}
          />
        </div>
      </Modal>
      <Modal isOpen={showFiltro} onClose={() => setShowFiltro(false)}>
        <FiltroVenta sales={currenData} onChange={Onfilter} />
      </Modal>
    </>
  );
};

export { Ventas };
