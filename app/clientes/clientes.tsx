// import { useEffect, useState } from "react";
// import { FiltroPaginado } from "../../components/FiltroPaginado/FiltroPaginado";
// import { InfoCliente } from "./InfoCliente/InfoCliente";
// import { PageTitle } from "../../components/PageTitle/PageTitle";
// import { AgregarCliente } from "./AgregarCliente/AgregarCliente";
// import { useClientesStore } from "../../../../store/clientesStore";
// import { loadClients } from "../../../../services/ClientsService";
// import { Client } from "../../../../type/Cliente/Client";
// import moment from "moment";
// import { toast } from "react-toastify";

// const Clientes = () => {
//   const { showModal, setShowModal, showFiltro, setShowFiltro } =
//     useClientesStore();
//   const {
//     applicatedFilters,
//     notApplicatedFilters,
//     fromDate,
//     toDate,
//     withLoans,
//     withoutLoans,
//     withCredit,
//     withoutCredit,
//     dealers,
//     zone,
//   } = useClientesStore();
//   const [clients, setClients] = useState<Client[]>([]);
//   const [clientsFiltered, setClientsFiltered] = useState<Client[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [currentData, setCurrentData] = useState<Client[]>([]);
//   const itemsPerPage = 10;
//   const [totalPage, setTotalPage] = useState(0);

//   const handlePageChange = (page: number) => {
//     setCurrentPage(page);
//     const startIndex = (page - 1) * itemsPerPage;
//     const endIndex = startIndex + itemsPerPage;
//     setCurrentData(clientsFiltered.slice(startIndex, endIndex));
//   };

//   const orderArray = (orden: string) => {
//     const clientesOrdenados = [...clientsFiltered];
//     if (orden === "new") {
//       clientesOrdenados.sort(
//         (a, b) =>
//           moment(b.lastSale, "YYYY-MM-DD").valueOf() -
//           moment(a.lastSale, "YYYY-MM-DD").valueOf()
//       );
//     } else if (orden === "older") {
//       clientesOrdenados.sort(
//         (a, b) =>
//           moment(a.lastSale, "YYYY-MM-DD").valueOf() -
//           moment(b.lastSale, "YYYY-MM-DD").valueOf()
//       );
//     }
//     setClients(clientesOrdenados);
//     handlePageChange(1);
//   };

//   const getClient = async () => {
//     try {
//       const resp = await loadClients();
//       setClients(resp.data);
//       setClientsFiltered(resp.data);
//       setLoading(false);
//       setPagesData();
//       orderArray("new");
//     } catch (e) {
//       console.error(e);
//       setError(true);
//       setLoading(false);
//       toast.error(
//         "Ha ocurrido un error en la carga, inténtelo de nuevo en unos minutos"
//       );
//     }
//   };

//   const setPagesData = () => {
//     const pages = Math.ceil(clientsFiltered.length / itemsPerPage);
//     setTotalPage(pages);
//     setCurrentData(clients.slice(0, 10));
//   };

//   useEffect(() => {
//     if (loading) {
//       getClient();
//     }

//     if (applicatedFilters) {
//       console.log(applicatedFilters);
//       console.log(
//         fromDate,
//         toDate,
//         withLoans,
//         withoutLoans,
//         withCredit,
//         withoutCredit,
//         dealers,
//         zone
//       );
//     }

//     if (notApplicatedFilters) {
//       console.log(notApplicatedFilters);
//     }
//   }, [applicatedFilters, notApplicatedFilters]);

//   if (loading) {
//     return <p>Cargando Clientes</p>;
//   }

//   if (error) {
//     return null;
//   }

//   const AddCliente = () => {
//     setShowModal(true);
//   };

//   const Onfilter = () => {
//     setShowFiltro(true);
//   };

//   const searchUser = (e: string) => {
//     const value = e;

//     if (value === "") {
//       getClient();
//       return;
//     } else {
//       const clientFilter = clients.filter((client) =>
//         client.fullName?.toLowerCase().includes(value.toLowerCase())
//       );
//       setCurrentData(clientFilter);
//     }
//   };

//   return (
//     <div>
//       <PageTitle titulo="Clientes" icon="./clientes-icon.svg" />
//       <FiltroPaginado
//         add={true}
//         exportar={true}
//         typeDataToExport="clients"
//         paginacion={true}
//         totalPage={totalPage}
//         currentPage={currentPage}
//         handlePageChange={handlePageChange}
//         onAdd={AddCliente}
//         resultados={true}
//         filtro
//         total={clients.length}
//         search={searchUser}
//         orderArray={orderArray}
//         onFilter={Onfilter}
//       >
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//           {currentData.map((client) => (
//             <InfoCliente key={client._id} {...client} />
//           ))}
//         </div>
//       </FiltroPaginado>
//       {showModal && <AgregarCliente />}
//       {showFiltro && <FiltroClientes />}
//     </div>
//   );
// };

// export default Clientes;
