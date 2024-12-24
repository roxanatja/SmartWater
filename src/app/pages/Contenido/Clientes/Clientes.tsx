import { FC, useCallback, useContext, useEffect, useState } from "react";
import moment from "moment";
import { FiltroPaginado } from "../../components/FiltroPaginado/FiltroPaginado";
import { InfoCliente } from "./InfoCliente/InfoCliente";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import { OpcionesClientes } from "./OpcionesClientes/OpcionesClientes";
import { ClientesContext, client } from "./ClientesContext";
import Modal from "../../EntryComponents/Modal";
import ClientForm from "../../EntryComponents/Client.form";
import FiltroClientes from "./FiltroClientes/FiltroClientes";
import { ClientsApiConector, ZonesApiConector } from "../../../../api/classes";
import { Client } from "../../../../type/Cliente/Client";
import { Zone } from "../../../../type/City";
import { useSearchParams } from "react-router-dom";
import { useGlobalContext } from "../../../SmartwaterContext";

const Clientes: FC = () => {
  const {
    showModal,
    setShowModal,
    showMiniModal,
    showFiltro,
    setShowFiltro,
    selectedClient,
    setShowMiniModal,
    setSelectedClient,
  } = useContext(ClientesContext);

  const { setLoading } = useGlobalContext()

  const [clients, setClients] = useState<Client[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [currentData, setCurrentData] = useState<Client[]>([]);
  const itemsPerPage: number = 10;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [savedFilters, setSavedFilters] = useState({});

  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    if (!searchParams.has('page')) {
      setCurrentPage(1)
    } else {
      setCurrentPage(Number(searchParams.get('page')))
    }
  }, [searchParams])

  const getClients = useCallback(async () => {
    setLoading(true)
    const datClients = await ClientsApiConector.getClients({ pagination: { page: currentPage, pageSize: itemsPerPage } });
    setZones((await ZonesApiConector.get({}))?.data || []);

    // const sortedClients = datClien.sort(
    //   (a: any, b: any) =>
    //     moment(b.lastSale).valueOf() - moment(a.lastSale).valueOf()
    // );

    setClients(datClients?.data || []);
    setCurrentData(datClients?.data || []);
    setTotalPage(Math.ceil((datClients?.metadata.totalCount || 0) / itemsPerPage)); // Update total pages
    setLoading(false)
  }, [currentPage, setLoading]);

  useEffect(() => {
    getClients();
  }, [getClients]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSearchParams((prev) => ({ ...prev, page }))
  };

  const orderClients = (orden: string) => {
    let clientesOrdenados: Client[] = [...currentData];

    if (orden === "new") {
      clientesOrdenados.sort(
        (a: Client, b: Client) =>
          moment(b.created).valueOf() - moment(a.created).valueOf()
      );
    } else if (orden === "older") {
      clientesOrdenados.sort(
        (a: Client, b: Client) =>
          moment(a.created).valueOf() - moment(b.created).valueOf()
      );
    }

    setCurrentPage(1);
    setCurrentData(clientesOrdenados.slice(0, itemsPerPage));
  };

  const handleSearchUser = (searchValue: string) => {
    const value: string = searchValue.trim().toLowerCase();
    const filteredClients: Client[] =
      value === ""
        ? clients
        : clients.filter(
          (client: Client) =>
            client.fullName?.toLowerCase().includes(value) ||
            client.phoneNumber.includes(value)
        );

    setCurrentData(filteredClients.slice(0, itemsPerPage));
    setCurrentPage(1);
    setTotalPage(Math.ceil(filteredClients.length / itemsPerPage));
  };

  const handleFilterChange = (filteredClients: Client[], filterdata: any) => {
    setCurrentData(filteredClients.slice(0, itemsPerPage));
    setCurrentPage(1);
    setTotalPage(Math.ceil(filteredClients.length / itemsPerPage));
    setSavedFilters(filterdata);
  };

  return (
    <div className="px-10">
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
        <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
          {currentData.map((client: Client) => (
            <InfoCliente key={client._id} client={client} zones={zones} />
          ))}
        </div>
      </FiltroPaginado>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <h2 className="text-blue_custom font-semibold p-6 pb-0 sticky top-0 z-30 bg-white">
          Registrar Cliente
        </h2>
        <ClientForm isOpen={showModal} onCancel={() => setShowModal(false)} />
      </Modal>

      <Modal
        isOpen={selectedClient._id !== "" && !showMiniModal}
        onClose={() => setSelectedClient(client)}
      >
        <h2 className="text-blue_custom font-semibold p-6 pb-0 sticky top-0 z-30 bg-white">
          Editar Cliente
        </h2>
        <ClientForm
          isOpen={
            selectedClient._id !== "" && showMiniModal === false ? true : false
          }
          onCancel={() => setSelectedClient(client)}
        />
      </Modal>

      <Modal
        isOpen={selectedClient._id !== "" && showMiniModal ? true : false}
        onClose={() => {
          setSelectedClient(client);
          setShowMiniModal(false);
        }}
        className="w-3/12"
      >
        <h2 className="text-blue_custom font-semibold p-6 pb-0 sticky top-0 z-30 bg-white">
          Opciones Cliente
        </h2>
        <div className="p-6">
          <OpcionesClientes
            onClose={() => {
              setSelectedClient(client);
              setShowMiniModal(false);
            }}
          />
        </div>
      </Modal>

      <Modal isOpen={showFiltro} onClose={() => setShowFiltro(false)}>
        <FiltroClientes
          clients={clients}
          onChange={handleFilterChange}
          initialFilters={savedFilters}
        />
      </Modal>
    </div>
  );
};

export { Clientes };
