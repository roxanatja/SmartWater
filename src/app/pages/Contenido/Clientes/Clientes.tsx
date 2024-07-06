import { FC, useContext, useEffect, useState } from "react";
import moment from "moment";
import { FiltroPaginado } from "../../components/FiltroPaginado/FiltroPaginado";
import { InfoCliente } from "./InfoCliente/InfoCliente";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import { AgregarCliente } from "./AgregarCliente/AgregarCliente";
import { OpcionesClientes } from "./OpcionesClientes/OpcionesClientes";
import { ClientesContext } from "./ClientesContext";
import { FilterContext } from "../../components/FilterContexr/FilterContext";
import { FiltroClientes } from "./FiltroClientes/FiltroClientes";
import { loadClients } from "../../../../services/ClientsService";
import { Client } from "../../../../type/Cliente/Client";

/**
 * Componente funcional para gestionar la vista y lógica de la página de Clientes.
 */

const Clientes: FC = () => {
  // Contextos utilizados
  const { showModal, setShowModal, showMiniModal, showFiltro, setShowFiltro } =
    useContext(ClientesContext);
  const {
    applicatedFilters,
    notApplicatedFilters,
    fromDate,
    toDate,
    withLoans,
    withoutLoans,
    withCredit,
    withoutCredit,
    dealers,
    zone,
  } = useContext(FilterContext);

  // Estados locales
  const [clients, setClients] = useState<Client[]>([]);
  const [clientsFiltered, setClientsFiltered] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentData, setCurrentData] = useState<Client[]>([]);
  const itemsPerPage: number = 10;
  const [totalPage, setTotalPage] = useState<number>(0);

  /**
   * Efecto de lado para cargar los clientes al montar el componente.
   */
  useEffect(() => {
    let isMounted = true; // Variable para rastrear si el componente está montado

    const getClients = async () => {
      try {
        const response = await loadClients();
        if (isMounted) {
          // Verificar si el componente está montado antes de actualizar el estado
          if (response.data && response.data.length > 0) {
            // Ordenar los clientes por la fecha de la última venta
            const sortedClients = response.data.sort(
              (a: Client, b: Client) =>
                moment(b.lastSale).valueOf() - moment(a.lastSale).valueOf()
            );
            setClients(sortedClients);
            setClientsFiltered(sortedClients);
            setLoading(false);
            setTotalPage(Math.ceil(sortedClients.length / itemsPerPage));
            setCurrentData(sortedClients.slice(0, itemsPerPage));
          } else {
            setLoading(false);
            setError(true);
          }
        }
      } catch (e) {
        console.error("Error loading clients:", e);
        if (isMounted) {
          // Verificar si el componente está montado antes de actualizar el estado
          setError(true);
          setLoading(false);
        }
      }
    };

    getClients();

    // Función de limpieza al desmontar el componente
    return () => {
      isMounted = false;
    };
  }, []);

  /**
   * Maneja el cambio de página en la paginación.
   */
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const startIndex: number = (page - 1) * itemsPerPage;
    const endIndex: number = startIndex + itemsPerPage;
    setCurrentData(clientsFiltered.slice(startIndex, endIndex));
  };

  /**
   * Ordena los clientes según el criterio especificado.
   */
  const orderClients = (orden: string) => {
    // Ordena por fecha de última venta de más reciente a más antigua
    let clientesOrdenados: Client[] = [...clientsFiltered];
    console.log(
      "Antes de ordenar:",
      clientesOrdenados.map((client) => ({
        fullName: client.fullName,
        lastSale: client.lastSale,
      }))
    );

    if (orden === "new") {
      clientesOrdenados.sort(
        (a: Client, b: Client) =>
          moment(b.lastSale).valueOf() - moment(a.lastSale).valueOf()
      );
    } else if (orden === "older") {
      clientesOrdenados.sort(
        (a: Client, b: Client) =>
          moment(a.lastSale).valueOf() - moment(b.lastSale).valueOf()
      );
    }

    console.log(
      "Después de ordenar:",
      clientesOrdenados.map((client) => ({
        fullName: client.fullName,
        lastSale: client.lastSale,
      }))
    );

    // Actualiza el estado de clientes filtrados y la página actual
    setClientsFiltered(clientesOrdenados);
    setCurrentPage(1); // Vuelve a la primera página después de ordenar
    setCurrentData(clientesOrdenados.slice(0, itemsPerPage));
  };

  /**
   * Maneja la búsqueda de clientes por nombre.
   */
  const handleSearchUser = (searchValue: string) => {
    const value: string = searchValue.trim().toLowerCase();
    if (value === "") {
      setCurrentData(clientsFiltered.slice(0, itemsPerPage));
    } else {
      const filteredClients: Client[] = clients.filter((client: Client) =>
        client.fullName?.toLowerCase().includes(value)
      );
      setClientsFiltered(filteredClients);
      setCurrentData(filteredClients.slice(0, itemsPerPage));
    }
    setCurrentPage(1);
  };

  // Renderiza un mensaje de carga si los clientes están cargando
  if (loading) {
    return <p>Cargando Clientes...</p>;
  }

  // Renderiza un mensaje de error si hubo un problema en la carga de clientes
  if (error) {
    return (
      <p>
        Ha ocurrido un error en la carga, intentelo de nuevo en unos minutos.
      </p>
    );
  }

  return (
    <>
      <PageTitle titulo="Clientes" icon="./clientes-icon.svg" />
      <FiltroPaginado
        add={true}
        exportar={true}
        typeDataToExport="clients"
        paginacion={true}
        totalPage={totalPage}
        currentPage={currentPage}
        handlePageChange={handlePageChange}
        onAdd={() => setShowModal(true)}
        resultados={true}
        filtro
        total={clients.length}
        search={handleSearchUser}
        orderArray={orderClients}
        onFilter={() => setShowFiltro(true)}
      >
        <div
          style={{
            display: "flex",
            gap: "20px",
            justifyContent: "start",
            flexWrap: "wrap",
          }}
        >
          {/* Mapea y renderiza la información de cada cliente */}
          {currentData.map((client: Client) => (
            <InfoCliente key={client._id} {...client} />
          ))}
        </div>
      </FiltroPaginado>

      {/* Renderiza componentes modales según el estado */}
      {showModal && <AgregarCliente />}
      {showMiniModal && <OpcionesClientes />}
      {showFiltro && <FiltroClientes />}
    </>
  );
};

export { Clientes };
