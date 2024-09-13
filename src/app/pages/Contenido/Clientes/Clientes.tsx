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
import Modal from "../../EntryComponents/Modal";
import ClientForm from "../../EntryComponents/Client.form";

const Clientes: FC = () => {
  const { showModal, setShowModal, showMiniModal, showFiltro, setShowFiltro } =
    useContext(ClientesContext);
  const {
    applicatedFilters,
    fromDate,
    toDate,
    withLoans,
    withoutLoans,
    withCredit,
    withoutCredit,
    zone,
    daysToRenew,
    daysSinceRenewed,
  } = useContext(FilterContext);

  const [clients, setClients] = useState<Client[]>([]);
  const [clientsFiltered, setClientsFiltered] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentData, setCurrentData] = useState<Client[]>([]);
  const itemsPerPage: number = 10;
  const [totalPage, setTotalPage] = useState<number>(0);

  useEffect(() => {
    let isMounted = true;
    const getClients = async () => {
      try {
        const response = await loadClients();
        if (isMounted) {
          if (response.data && response.data.length > 0) {
            let sortedClients = response.data.sort(
              (a: Client, b: Client) =>
                moment(b.lastSale).valueOf() - moment(a.lastSale).valueOf()
            );

            const fromDateMoment = fromDate ? moment(fromDate) : null;
            const toDateMoment = toDate ? moment(toDate) : null;

            // Aplicar filtros
            if (applicatedFilters) {
              sortedClients = sortedClients.filter((client: Client) => {
                // Filtrar por préstamos
                if (
                  (withLoans && !client.hasLoan) ||
                  (withoutLoans && client.hasLoan)
                ) {
                  return false;
                }

                // Filtrar por crédito
                if (
                  (withCredit && !client.credit) ||
                  (withoutCredit && client.credit)
                ) {
                  return false;
                }

                // Filtrar por zona
                if (zone.length > 0 && !zone.includes(client.zone)) {
                  return false;
                }

                // Filtrar por fechas de creación
                if (fromDateMoment && toDateMoment) {
                  const createdDate = moment(client.created);
                  if (
                    createdDate.isBefore(fromDateMoment) ||
                    createdDate.isAfter(toDateMoment)
                  ) {
                    return false;
                  }
                } else if (fromDateMoment) {
                  const createdDate = moment(client.created);
                  if (createdDate.isBefore(fromDateMoment)) {
                    return false;
                  }
                } else if (toDateMoment) {
                  const createdDate = moment(client.created);
                  if (createdDate.isAfter(toDateMoment)) {
                    return false;
                  }
                }

                // Filtrar por fecha de renovación
                const today = moment();
                const renewDateMoment = moment(client.renewDate);
                if (daysToRenew != null) {
                  const daysUntilRenewal = renewDateMoment.diff(today, "days");
                  if (daysUntilRenewal > daysToRenew) {
                    return false;
                  }
                }
                if (daysSinceRenewed != null) {
                  const daysSinceRenewed = today.diff(renewDateMoment, "days");
                  if (daysSinceRenewed > daysSinceRenewed) {
                    return false;
                  }
                }

                return true;
              });
            }

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
          setError(true);
          setLoading(false);
        }
      }
    };

    getClients();

    return () => {
      isMounted = false;
    };
  }, [
    applicatedFilters,
    fromDate,
    toDate,
    withLoans,
    withoutLoans,
    withCredit,
    withoutCredit,
    zone,
    daysToRenew,
    daysSinceRenewed,
  ]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const startIndex: number = (page - 1) * itemsPerPage;
    const endIndex: number = startIndex + itemsPerPage;
    setCurrentData(clientsFiltered.slice(startIndex, endIndex));
  };

  const orderClients = (orden: string) => {
    let clientesOrdenados: Client[] = [...clientsFiltered];

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

    setClientsFiltered(clientesOrdenados);
    setCurrentPage(1);
    setCurrentData(clientesOrdenados.slice(0, itemsPerPage));
  };

  const handleSearchUser = (searchValue: string) => {
    const value: string = searchValue.trim().toLowerCase();
    if (value === "") {
      setCurrentData(clientsFiltered.slice(0, itemsPerPage));
    } else {
      const filteredClients: Client[] = clients.filter(
        (client: Client) =>
          client.fullName?.toLowerCase().includes(value) ||
          client.phoneNumber.includes(value)
      );

      setClientsFiltered(filteredClients);
      setCurrentData(filteredClients.slice(0, itemsPerPage));
    }
    setCurrentPage(1);
  };

  if (loading) {
    return <p>Cargando Clientes...</p>;
  }

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
          {currentData.map((client: Client) => (
            <InfoCliente key={client._id} {...client} />
          ))}
        </div>
      </FiltroPaginado>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <h2 className="text-blue-900 font-semibold p-6 pb-0 sticky top-0 z-30 bg-white">
          Registrar Cliente
        </h2>
        <ClientForm onCancel={() => setShowModal(false)} />
      </Modal>

      {showMiniModal && <OpcionesClientes />}
      {showFiltro && <FiltroClientes />}
    </>
  );
};

export { Clientes };
