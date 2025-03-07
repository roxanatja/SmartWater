import { Switch } from "../Switch/Switch";
import "./FiltroPaginado.css";
import { forwardRef, ReactNode, useImperativeHandle } from "react";
import * as XLSX from "xlsx";
import { formatDateTime } from "../../../../utils/helpers";
import { useForm } from "react-hook-form";
import Input from "../../EntryComponents/Inputs";
import { Client } from "../../../../type/Cliente/Client";
import { ClientsApiConector, DevolutionsApiConector, ItemsApiConector, LoansApiConector, ProductsApiConector, SalesApiConector, UsersApiConector, ZonesApiConector } from "../../../../api/classes";
import { District, Zone } from "../../../../type/City";
import { Sale } from "../../../../type/Sale/Sale";
import moment from "moment";
import { QueryMetadata } from "../../../../api/types/common";
import { Item } from "../../../../type/Item";
import { Devolution } from "../../../../type/Devolution/devolution";
import { Loans } from "../../../../type/Loans/Loans";
import { useGlobalContext } from "../../../SmartwaterContext";

type Componentes = {
  order?: boolean;
  hasSearch?: boolean;
  exportar?: boolean;
  typeDataToExport?: string;
  searchPlaceholder?: string;
  add?: boolean;
  paginacion?: boolean;
  totalPage?: number;
  currentPage?: number;
  handlePageChange?: (page: number) => void;
  infoPedidos?: boolean;
  infoPedidosData?: { text: string; value: string; }[];
  infoPedidosClass?: string;
  resultados?: boolean;
  resultadosPrestamo?: boolean;
  children?: ReactNode;
  swith?: boolean;
  opcionesSwitch1?: string;
  opcionesSwitch2?: string;
  onAdd?: () => void;
  onFilter?: () => void;
  finanzas?: boolean;
  iconUbicacion?: boolean;
  iconUbicacionInject?: ReactNode;
  filtro?: boolean;
  activeFilters?: any;
  total?: number;
  totalRealOrders?: number;
  orderArray?: (order: string) => void;
  search?: (e: string) => void;
  suggestions?: string[];
  hasFilter?: boolean;
  noContent?: boolean;
  filterInject?: ReactNode;
  otherResults?: { text: string; value: string; }[];
  sorted?: "new" | "older";
};

export interface IFiltroPaginadoReference {
  clearSearch: () => void
  setSearch: (val: string) => void
}

const FiltroPaginado = forwardRef<IFiltroPaginadoReference, Componentes>(({
  order = true,
  hasSearch = true,
  noContent,
  searchPlaceholder = "Buscar",
  exportar,
  typeDataToExport,
  add,
  paginacion,
  totalPage,
  currentPage,
  handlePageChange,
  children,
  onAdd,
  infoPedidos,
  infoPedidosData,
  infoPedidosClass,
  resultados,
  swith,
  opcionesSwitch1,
  opcionesSwitch2,
  resultadosPrestamo,
  finanzas,
  iconUbicacion,
  iconUbicacionInject,
  filtro,
  total,
  totalRealOrders,
  orderArray,
  onFilter,
  search,
  suggestions,
  hasFilter,
  filterInject,
  otherResults,
  sorted,
  activeFilters
}, ref) => {
  useImperativeHandle(ref, () => ({
    clearSearch() {
      setValue("search", "")
    },
    setSearch(val: string) {
      setValue("search", val)
    },
  }));

  const { setLoading } = useGlobalContext()

  const searchUser = (id: string, userList: any) => {
    //Busca el nombre del usuario
    const user = userList.find((user: any) => user._id === id);
    if (user) {
      return `${user.fullName} - ${user.phoneNumber}`;
    } else {
      return "Usuario no encontrado";
    }
  };

  const searchZone = (id: string, zones: Zone[]): Zone | undefined => {
    //Busca la zona del cliente
    const zone = zones.find((zone: any) => zone._id === id);
    return zone;
  };

  const searchDistrict = (id: string, districts: District[]): District | undefined => {
    //Busca el distrito del cliente
    const district = districts.find((district: any) => district._id === id);
    return district;
  };

  const setDetailClient = (loans: Array<Loans>, products: Array<Item>): { itemId: string; itemName: string; quantity: number }[] => {
    //Guarda los detalles del cliente
    if (loans.length > 0) {
      const prod: Array<string> = [];
      const dataToSend: { itemId: string; itemName: string; quantity: number }[] = [];
      loans.forEach((loan: any) => {
        loan.detail.forEach((detail: any) => {
          const product = products.find(
            (product: any) => product._id === detail.item
          );
          if (product === undefined) return;

          if (prod.includes(product.name)) {
            const existingProduct = dataToSend.find(
              (item) => item.itemName === product.name
            );
            if (existingProduct) {
              existingProduct.quantity += detail.quantity;
            } else {
              dataToSend.push({
                itemName: product.name,
                quantity: detail.quantity,
                itemId: product._id
              });
            }
          } else {
            prod.push(product.name);
            dataToSend.push({
              itemName: product.name,
              quantity: detail.quantity,
              itemId: product._id
            });
          }
        })
      });

      return dataToSend;
    } else {
      return [];
    }
  };

  const setContract = (client: Client) => {
    //Guarda los detalles del contrato
    if (client.hasContract) {
      if (client.hasExpiredContract) {
        return "CONTRATO VENCIDO";
      } else {
        return "CONTRATO VIGENTE";
      }
    } else {
      return "SIN CONTRATO";
    }
  };

  const setDevolutions = (
    id: string,
    devolutions: Array<Devolution>,
    products: Array<Item>
  ): { itemId: string; itemName: string; quantity: number }[] => {
    //Guarda los detalles de las devoluciones
    const devolution = devolutions.filter(
      (devolution) => devolution.client === id
    );

    if (devolution.length > 0) {
      const prod: Array<string> = [];
      const dataToSend: { itemId: string; itemName: string; quantity: number }[] = [];

      devolution.forEach(async (devolution: any) => {
        devolution.detail.forEach((detail: any) => {
          const product = products.find(
            (product: any) => product._id === detail.item
          );
          if (product === undefined) return;

          if (prod.includes(product.name)) {
            const existingProduct = dataToSend.find(
              (item) => item.itemName === product.name
            );
            if (existingProduct) {
              existingProduct.quantity += detail.quantity;
            } else {
              dataToSend.push({
                itemName: product.name,
                quantity: detail.quantity,
                itemId: product._id
              });
            }
          } else {
            prod.push(product.name);
            dataToSend.push({
              itemName: product.name,
              quantity: detail.quantity,
              itemId: product._id
            });
          }
        });
      })

      return dataToSend;
    } else {
      return [];
    }
  };

  const setLoans = (
    id: string,
    loans: Array<Loans>,
    devolutions: Array<Devolution>,
    products: Array<Item>
  ): { itemId: string; itemName: string; quantity: number }[] => {
    //Guarda los detalles de los prestamos
    let devolution = devolutions.filter(
      (devolution: any) => devolution.client === id
    );
    const prod: Array<string> = [];
    const dataToSend: Array<{ itemId: string; itemName: string; quantity: number }> = [];

    if (loans.length > 0 || devolution.length > 0) {
      if (loans.length > 0) {
        loans.forEach((loan: any) => {
          const devolutionFiltered = devolution.filter(
            (devolution: any) => devolution.loan === loan._id
          );
          devolution = devolution.filter(
            (devolution: any) => devolution.loan !== loan._id
          );

          loan.detail.forEach((detail: any) => {
            const product = products.find(
              (product) => product._id === detail.item
            );

            if (product) {
              if (prod.includes(product.name)) {
                const existingProduct = dataToSend.find(
                  (item) => item.itemName === product.name
                );
                if (existingProduct) {
                  existingProduct.quantity += detail.quantity;
                } else {
                  dataToSend.push({
                    itemName: product.name,
                    quantity: detail.quantity,
                    itemId: product._id
                  });
                }
              } else {
                prod.push(product.name);
                dataToSend.push({
                  itemName: product.name,
                  quantity: detail.quantity,
                  itemId: product._id
                });
              }
            }

            devolutionFiltered.forEach((devolution: any) => {
              devolution.detail.forEach((devolutionDetail: any) => {
                const item = products.find(
                  (product) => product._id === devolutionDetail.item
                );

                if (item) {
                  if (prod.includes(item.name)) {
                    const existingProduct = dataToSend.find(
                      (itemDats) => itemDats.itemName === item.name
                    );
                    if (existingProduct) {
                      existingProduct.quantity += devolutionDetail.quantity;
                    } else {
                      dataToSend.push({
                        itemName: item.name,
                        quantity: devolutionDetail.quantity,
                        itemId: item._id
                      });
                    }
                  } else {
                    prod.push(item.name);
                    dataToSend.push({
                      itemName: item.name,
                      quantity: devolutionDetail.quantity,
                      itemId: item._id
                    });
                  }
                }
              });
            });
          });
        });
      }

      if (devolution.length > 0) {
        devolution.forEach((devolution: any) => {
          devolution.detail.forEach((devolutionDetail: any) => {
            const item = products.find(
              (product: any) => product._id === devolutionDetail.item
            );

            if (item) {
              if (prod.includes(item.name)) {
                const existingProduct = dataToSend.find(
                  (itemDats) => itemDats.itemName === item.name
                );
                if (existingProduct) {
                  existingProduct.quantity += devolutionDetail.quantity;
                } else {
                  dataToSend.push({
                    itemName: item.name,
                    quantity: devolutionDetail.quantity,
                    itemId: item._id
                  });
                }
              } else {
                prod.push(item.name);
                dataToSend.push({
                  itemName: item.name,
                  quantity: devolutionDetail.quantity,
                  itemId: item._id
                });
              }
            }
          });
        });
      }

      return dataToSend;
    } else {
      return [];
    }
  };

  const getSaleClientContract = (client: Client | null) => {
    if (client) {
      if (!client.hasLoan) {
        return "SIN PRESTAMO"
      } else {
        if (client.hasExpiredContract) {
          return "PRESTAMO CON CONTRATO VENCIDO"
        } else {
          return client.hasContract ? "PRESTAMO CON CONTRATO VIGENTE" : "PRESTAMO SIN CONTRATO"
        }
      }
    } else {
      return "SIN CLIENTE"
    }
  }

  const getDataWithClientNames = async () => {
    const filters = activeFilters ? { ...activeFilters } : {}

    if (!filters.initialDate && !!filters.finalDate) {
      filters.initialDate = moment(filters.finalDate).startOf("week").toDate().toISOString().split("T")[0]
    }

    if (!!filters.initialDate && !filters.finalDate) {
      filters.finalDate = moment().format("YYYY-MM-DD")
    }

    const promises: Promise<{ data: Sale[] } & QueryMetadata | null>[] = []
    if (filters.clients) {
      filters.clients.forEach((cf: string) =>
        promises.push(SalesApiConector.get({ pagination: { page: 1, pageSize: 30000 }, filters: { ...filters, client: cf } }))
      )
    } else {
      promises.push(SalesApiConector.get({ pagination: { page: 1, pageSize: 30000 }, filters }))
    }

    const responses = await Promise.all(promises)
    const data: Sale[] = []
    responses.forEach(r => {
      data.push(...(r?.data || []))
    })

    const userList = (await UsersApiConector.get({ pagination: { page: 1, pageSize: 30000 } }))?.data || [];
    const zones = (await ZonesApiConector.get({ pagination: { page: 1, pageSize: 30000 } }))?.data || [];
    const products = (await ProductsApiConector.get({ pagination: { page: 1, pageSize: 30000 } }))?.data || [];

    const dataWithClientNames: any[] = []

    for (let idx = 0; idx < data.length; idx++) {
      const sale = data[idx]
      const client: Client | null = sale.client

      const zone = await searchZone(sale.zone, zones)

      sale.detail.forEach((det, index) => {
        const product = products.find((product: any) => product._id === det.product);

        const typeDataToExport = {
          NRO: `${idx + 1}`,
          CODIGO: sale.code || "Sin codigo",
          FECHA: formatDateTime(sale.created, "numeric", "2-digit", "2-digit", false, true),
          USUARIO: searchUser(sale.user, userList),
          "CODIGO CLIENTE": client?.code || "N/A",
          ZONA: zone?.name || "Sin zona",
          BARRIO: zone ? (searchDistrict(client?.district || "", zone.districts)?.name || "Sin barrio") : "Sin barrio", // Buscar barrio
          DIRECCION: client?.address || "N/A",
          NOMBRE: client?.fullName ? `${client.fullName || "Sin nombre"} ${!!client.deactivated ? "- Cliente Eliminado" : ""}` : "N/A",
          COMENTARIO: sale.comment ? sale.comment : "Sin comentario",
          PRODUCTOS: product?.name || "Producto no encontrado",
          CANTIDAD: det.quantity,
          PRECIO: det.price,
          SUBTOTAL: det.price * det.quantity,
          PAGO: sale.creditSale ? "Credito" : sale.paymentMethodCash ? "Efectivo" : sale.paymentMethodCurrentAccount ? "Cta. Cte." : "Sin definir",
          "FACTURA/SIN FACTURA": sale.hasInvoice ? "FACTURA" : "SIN FACTURA",
          "DE CLIENTES": getSaleClientContract(client)
        };

        if (index === 0) {
          dataWithClientNames.push(typeDataToExport);
        } else {
          dataWithClientNames.push({
            PRODUCTOS: product?.name || "Producto no encontrado",
            CANTIDAD: det.quantity,
            PRECIO: det.price,
            SUBTOTAL: det.price * det.quantity
          });
        }
      })
    }

    return dataWithClientNames;
  };

  const getDataClients = async () => {
    const filters = activeFilters ? { ...activeFilters, clientDeleted: false } : { clientDeleted: false }

    let datClients: { data: Client[] } & QueryMetadata | null = null
    if (filters) {
      if (filters.hasOwnProperty('text')) {
        datClients = await ClientsApiConector.searchClients({ pagination: { page: 1, pageSize: 30000 }, filters });
      } else {
        if (!filters?.finalDate && !!filters?.initialDate) {
          filters.finalDate = moment().format("YYYY-MM-DD")
        }
        if (!!filters?.finalDate && !filters?.initialDate) {
          filters.initialDate = "2020-01-01"
        }

        datClients = await ClientsApiConector.getClients({ pagination: { page: 1, pageSize: 30000 }, filters });
      }
    }

    // Cargar datos
    const data = datClients?.data || [];
    const userList = (await UsersApiConector.get({ pagination: { page: 1, pageSize: 30000 } }))?.data || [];
    const zones = (await ZonesApiConector.get({ pagination: { page: 1, pageSize: 30000 } }))?.data || [];
    const items = (await ItemsApiConector.get({ pagination: { page: 1, pageSize: 30000 } }))?.data || [];
    const loans = (await LoansApiConector.get({ pagination: { page: 1, pageSize: 30000 } }))?.data || []
    const devolutions = (await DevolutionsApiConector.get({ pagination: { page: 1, pageSize: 30000 } }))?.data || []

    // Mapeo de datos
    const dataClientToExport: any[] = [];

    for (let idx = 0; idx < data.length; idx++) {
      const client = data[idx]
      const filteredLoans = loans.filter(l => l.client.some(c => c._id === client._id))
      const zone = await searchZone(client.zone, zones)

      const loadsStr = setLoans(client._id, filteredLoans, devolutions, items)
      const devolStr = setDevolutions(client._id, devolutions, items)
      const saldosStr = setDetailClient(filteredLoans, items)

      const filteredItems = items.filter(i =>
        loadsStr.some(l => l.itemId === i._id)
        || devolStr.some(l => l.itemId === i._id)
        || saldosStr.some(l => l.itemId === i._id)
      )

      if (filteredItems.length > 0) {
        filteredItems.forEach((item, index) => {
          const loan = loadsStr.find(l => l.itemId === item._id)
          const devol = devolStr.find(l => l.itemId === item._id)
          const saldo = saldosStr.find(l => l.itemId === item._id)

          const typeDataToExport = {
            NRO: `${idx + 1}`,
            NOMBRE: client.fullName || "Sin nombre",
            "TIPO DE CLIENTE":
              client.isAgency
                ? "Agencia"
                : client.isClient
                  ? "Cliente habitual"
                  : "Desconocido", // Define el tipo de cliente
            WHATSAPP: client.phoneNumber ?? "S/Numero", // Si tiene número de WhatsApp
            "TELEFONO FIJO": client.phoneLandLine ? client.phoneLandLine : "S/Numero", // Número de teléfono
            "DATOS DE FACTURACION": client.billingInfo?.name ? client.billingInfo.name : "N/A",
            "CORREO ELECTRONICO": client.email ? client.email : "N/A",
            NIT: client.billingInfo?.NIT ? client.billingInfo.NIT : "N/A", // Código del cliente
            CODIGO: client.code ? client.code : "Sin codigo", // Código del cliente
            DIRECCION: client.address ? client.address : "Sin direccion", // Dirección
            REFERENCIA: client.comment || "Sin referencia", // Comentario o referencia
            USUARIO: searchUser(client.user, userList), // Buscar usuario asociado
            ZONA: zone?.name || "Sin zona", // Buscar la zona
            BARRIO: zone ? (searchDistrict(client.district, zone.districts)?.name || "Sin barrio") : "Sin barrio", // Buscar barrio
            "TIEMPO DE RENOVACION": client.renewInDays !== null ? client.renewInDays : "", // Tiempo de renovación
            "RENOVACION PROMEDIO": client.averageRenewal ? "SI" : "NO", // Tiempo de renovación
            "DIAS RENOVACION PROMEDIO": (client.averageRenewal && client.lastSale && client.renewDate) ? Math.abs(moment(new Date(client.lastSale).toISOString().split("T")[0]).diff(new Date(client.renewDate).toISOString().split("T")[0], 'days')) : "", // Tiempo de renovación
            "FECHA DE REGISTRO": formatDateTime(
              client.created,
              "numeric",
              "numeric",
              "2-digit", false, true
            ), // Formatear la fecha de registro
            CONTRATOS: setContract(client) || "SIN CONTRATOS", // Estado de contratos
            PRESTAMOS: loan ? `${loan.quantity} ${loan.itemName}` : "SIN MOVIMIENTO", // Detalles de préstamos
            DEVOLUCIONES: devol ? `${devol.quantity} ${devol.itemName}` : "SIN MOVIMIENTO", // Detalles de devoluciones
            SALDOS: saldo ? `${saldo.quantity} ${saldo.itemName}` : "SIN SALDOS", // Detalles de saldos
            "FECHA DE ULTIMA VENTA": client.lastSale
              ? formatDateTime(client.lastSale, "numeric", "numeric", "2-digit", false, true)
              : "Sin ventas", // Fecha de la última venta
            "ULTIMA FECHA POSPUESTO": client.lastPostponed
              ? formatDateTime(client.lastPostponed, "numeric", "numeric", "2-digit", false, true)
              : "N/A", // Fecha de la última venta
            "PROXIMA FECHA DE RENOVACION": client.renewDate
              ? formatDateTime(client.renewDate, "numeric", "numeric", "2-digit", false, true)
              : "N/A", // Fecha de la última venta
            "SALDOS POR COBRAR BS": client.credit || 0,
          };

          if (index === 0) {
            dataClientToExport.push(typeDataToExport)
          } else {
            dataClientToExport.push({
              PRESTAMOS: loan ? `${loan.quantity} ${loan.itemName}` : "SIN MOVIMIENTO", // Detalles de préstamos
              DEVOLUCIONES: devol ? `${devol.quantity} ${devol.itemName}` : "SIN MOVIMIENTO", // Detalles de devoluciones
              SALDOS: saldo ? `${saldo.quantity} ${saldo.itemName}` : "SIN SALDOS", // Detalles de saldos
            })
          }
        })
      } else {
        const typeDataToExport = {
          NRO: `${idx + 1}`,
          NOMBRE: client.fullName || "Sin nombre",
          "TIPO DE CLIENTE":
            client.isAgency
              ? "Agencia"
              : client.isClient
                ? "Cliente habitual"
                : "Desconocido", // Define el tipo de cliente
          WHATSAPP: client.phoneNumber ?? "S/Numero", // Si tiene número de WhatsApp
          "TELEFONO FIJO": client.phoneLandLine ? client.phoneLandLine : "S/Numero", // Número de teléfono
          "DATOS DE FACTURACION": client.billingInfo?.name ? client.billingInfo.name : "N/A",
          "CORREO ELECTRONICO": client.email ? client.email : "N/A",
          NIT: client.billingInfo?.NIT ? client.billingInfo.NIT : "N/A", // Código del cliente
          CODIGO: client.code ? client.code : "Sin codigo", // Código del cliente
          DIRECCION: client.address ? client.address : "Sin direccion", // Dirección
          REFERENCIA: client.comment || "Sin referencia", // Comentario o referencia
          USUARIO: searchUser(client.user, userList), // Buscar usuario asociado
          ZONA: zone?.name || "Sin zona", // Buscar la zona
          BARRIO: zone ? (searchDistrict(client.district, zone.districts)?.name || "Sin barrio") : "Sin barrio", // Buscar barrio
          "TIEMPO DE RENOVACION": client.renewInDays !== null ? client.renewInDays : "", // Tiempo de renovación
          "RENOVACION PROMEDIO": client.averageRenewal ? "SI" : "NO", // Tiempo de renovación
          "DIAS RENOVACION PROMEDIO": (client.averageRenewal && client.lastSale && client.renewDate) ? Math.abs(moment(new Date(client.lastSale).toISOString().split("T")[0]).diff(new Date(client.renewDate).toISOString().split("T")[0], 'days')) : "", // Tiempo de renovación
          "FECHA DE REGISTRO": formatDateTime(
            client.created,
            "numeric",
            "numeric",
            "2-digit", false, true
          ), // Formatear la fecha de registro
          CONTRATOS: setContract(client) || "SIN CONTRATOS", // Estado de contratos
          PRESTAMOS: "SIN MOVIMIENTO", // Detalles de préstamos
          DEVOLUCIONES: "SIN MOVIMIENTO", // Detalles de devoluciones
          SALDOS: "SIN SALDOS", // Detalles de saldos
          "FECHA DE ULTIMA VENTA": client.lastSale
            ? formatDateTime(client.lastSale, "numeric", "numeric", "2-digit", false, true)
            : "Sin ventas", // Fecha de la última venta
          "ULTIMA FECHA POSPUESTO": client.lastPostponed
            ? formatDateTime(client.lastPostponed, "numeric", "numeric", "2-digit", false, true)
            : "N/A", // Fecha de la última venta
          "PROXIMA FECHA DE RENOVACION": client.renewDate
            ? formatDateTime(client.renewDate, "numeric", "numeric", "2-digit", false, true)
            : "N/A", // Fecha de la última venta
          "SALDOS POR COBRAR BS": client.credit || 0,
        };

        dataClientToExport.push(typeDataToExport)
      }
    }

    return dataClientToExport;
  };

  const exportData = (fileName: string, data: any) => {
    //Exporta los datos a un archivo excel
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, fileName);
  };

  const exportToExcel = async () => {
    setLoading(true)
    if (typeDataToExport === "sales") {
      const fileName = "ReporteVenta.xlsx";
      const data = await getDataWithClientNames();
      exportData(fileName, data);
    } else if (typeDataToExport === "clients") {
      const fileName = "ReporteClientes.xlsx";
      const data = await getDataClients();
      exportData(fileName, data);
    }
    setLoading(false)
  };

  const { register, setValue, watch } = useForm();

  return (
    <>
      <div className="flex justify-center flex-col pt-4 w-full ">
        <div
          style={{ width: "100%", display: "flex" }}
          className="max-sm:flex-col"
        >
          <div className="w-full">
            {
              hasSearch &&
              <form className="" onSubmit={(e) => e.preventDefault()}>
                <div className="relative w-full">
                  <Input
                    className="rounded-xl py-3 outline-1 outline-zinc-300"
                    type="text"
                    name="search"
                    register={register}
                    placeholder={searchPlaceholder}
                    required
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      search && search(event.target.value)
                    }
                  />

                  <button type="submit" className="absolute right-3 top-2.5 flex gap-6 items-center">
                    {
                      watch('search') && watch('search').length > 0 &&
                      < button type="button" onClick={() => {
                        setValue("search", "");
                        if (search) {
                          search("")
                        }
                      }}>
                        <i className="fa fa-x text-sm"></i>
                      </button>
                    }
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M19.5 9.75C19.5 11.9016 18.8016 13.8891 17.625 15.5016L23.5594 21.4406C24.1453 22.0266 24.1453 22.9781 23.5594 23.5641C22.9734 24.15 22.0219 24.15 21.4359 23.5641L15.5016 17.625C13.8891 18.8062 11.9016 19.5 9.75 19.5C4.36406 19.5 0 15.1359 0 9.75C0 4.36406 4.36406 0 9.75 0C15.1359 0 19.5 4.36406 19.5 9.75ZM9.75 16.5C10.6364 16.5 11.5142 16.3254 12.3331 15.9862C13.1521 15.647 13.8962 15.1498 14.523 14.523C15.1498 13.8962 15.647 13.1521 15.9862 12.3331C16.3254 11.5142 16.5 10.6364 16.5 9.75C16.5 8.86358 16.3254 7.98583 15.9862 7.16689C15.647 6.34794 15.1498 5.60382 14.523 4.97703C13.8962 4.35023 13.1521 3.85303 12.3331 3.51381C11.5142 3.17459 10.6364 3 9.75 3C8.86358 3 7.98583 3.17459 7.16689 3.51381C6.34794 3.85303 5.60382 4.35023 4.97703 4.97703C4.35023 5.60382 3.85303 6.34794 3.51381 7.16689C3.17459 7.98583 3 8.86358 3 9.75C3 10.6364 3.17459 11.5142 3.51381 12.3331C3.85303 13.1521 4.35023 13.8962 4.97703 14.523C5.60382 15.1498 6.34794 15.647 7.16689 15.9862C7.98583 16.3254 8.86358 16.5 9.75 16.5Z"
                        fill="currentColor"
                      />
                    </svg>
                  </button>
                </div>
              </form>
            }
            {resultados && (
              <div className="flex justify-end items-center gap-4 py-3 pb-6 flex-wrap">
                <div className="resultado-busqueda">
                  <span>Resultados:</span>
                  <span className="text-blue_custom"> {total}</span>
                </div>
                {
                  (otherResults && otherResults.length > 0) &&
                  otherResults.map(res =>
                    <div className="resultado-busqueda">
                      <span>{res.text}</span>
                      <span className="text-blue_custom"> {res.value}</span>
                    </div>
                  )
                }
                {
                  order &&
                  < div className="resultado-busqueda">
                    <span>Ordenar por: </span>
                    <select
                      className="select-filtro text-blue_custom bg-main-background"
                      name="filter"
                      onChange={(event) =>
                        orderArray && orderArray(event.target.value)
                      }
                      value={sorted}
                    >
                      <option value="new">Más reciente</option>
                      <option value="older">Más antiguos</option>
                    </select>
                  </div>
                }
              </div>
            )}
            {resultadosPrestamo && (
              <div className="flex justify-end gap-4 py-2">
                <div className="resultado-busqueda">
                  <span>Resultados:</span>
                  <span className="text-blue_custom"> {total}</span>
                </div>
                <div className="resultado-busqueda">
                  <span>Dispensadores:</span>
                  <span className="text-blue_custom"> 52</span>
                </div>
                <div className="resultado-busqueda">
                  <span>Botellones:</span>
                  <span className="text-blue_custom"> 20</span>
                </div>
              </div>
            )}
          </div>
          <div className="flex w-4/12 items-center pt-2 justify-center h-full max-sm:flex-col max-sm:pb-4 max-sm:w-full">
            <div className="flex justify-between items-center w-full pl-4">
              {filtro && (
                <div className="w-full relative" >
                  {!!filterInject && filterInject}
                  <button
                    type="button"
                    className="boton-filtro relative"
                    onClick={onFilter}
                  >
                    {
                      hasFilter &&
                      <div className="bg-red-500 rounded-full p-[5px] absolute -top-1 -right-1" />
                    }
                    <span style={{ marginRight: "5px" }}>Filtrar</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <g clipPath="url(#clip0_35_4995)">
                        <path
                          d="M0 19.5C0 18.6703 0.670312 18 1.5 18H4.06406C4.64062 16.6734 5.9625 15.75 7.5 15.75C9.0375 15.75 10.3594 16.6734 10.9359 18H22.5C23.3297 18 24 18.6703 24 19.5C24 20.3297 23.3297 21 22.5 21H10.9359C10.3594 22.3266 9.0375 23.25 7.5 23.25C5.9625 23.25 4.64062 22.3266 4.06406 21H1.5C0.670312 21 0 20.3297 0 19.5ZM9 19.5C9 18.6703 8.32969 18 7.5 18C6.67031 18 6 18.6703 6 19.5C6 20.3297 6.67031 21 7.5 21C8.32969 21 9 20.3297 9 19.5ZM18 12C18 11.1703 17.3297 10.5 16.5 10.5C15.6703 10.5 15 11.1703 15 12C15 12.8297 15.6703 13.5 16.5 13.5C17.3297 13.5 18 12.8297 18 12ZM16.5 8.25C18.0375 8.25 19.3594 9.17344 19.9359 10.5H22.5C23.3297 10.5 24 11.1703 24 12C24 12.8297 23.3297 13.5 22.5 13.5H19.9359C19.3594 14.8266 18.0375 15.75 16.5 15.75C14.9625 15.75 13.6406 14.8266 13.0641 13.5H1.5C0.670312 13.5 0 12.8297 0 12C0 11.1703 0.670312 10.5 1.5 10.5H13.0641C13.6406 9.17344 14.9625 8.25 16.5 8.25ZM9 3C8.17031 3 7.5 3.67031 7.5 4.5C7.5 5.32969 8.17031 6 9 6C9.82969 6 10.5 5.32969 10.5 4.5C10.5 3.67031 9.82969 3 9 3ZM12.4359 3H22.5C23.3297 3 24 3.67031 24 4.5C24 5.32969 23.3297 6 22.5 6H12.4359C11.8594 7.32656 10.5375 8.25 9 8.25C7.4625 8.25 6.14062 7.32656 5.56406 6H1.5C0.670312 6 0 5.32969 0 4.5C0 3.67031 0.670312 3 1.5 3H5.56406C6.14062 1.67344 7.4625 0.75 9 0.75C10.5375 0.75 11.8594 1.67344 12.4359 3Z"
                          fill="currentColor"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_35_4995">
                          <rect width="24" height="24" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </button>
                </div>
              )}
              {(paginacion && totalPage && currentPage) ? (
                <div className="flex gap-2 w-full justify-end">
                  <>
                    <div>
                      <button
                        type="button"
                        className="bg-blue-600 shadow-xl disabled:bg-gray-500 disabled:cursor-not-allowed px-2 py-0.5 rounded-sm"
                        onClick={() =>
                          handlePageChange && handlePageChange(currentPage - 1)
                        }
                        disabled={currentPage === 1}
                      >
                        <i className="fa-solid fa-angle-left text-white"></i>
                      </button>
                    </div>
                    <div className="flex items-center">
                      <span className="text-paginado">{`${currentPage} de ${totalPage} `}</span>
                    </div>
                    <div>
                      <button
                        type="button"
                        className="bg-blue-600 shadow-xl disabled:bg-gray-500 disabled:cursor-not-allowed px-2 py-0.5 rounded-sm"
                        onClick={() =>
                          handlePageChange && handlePageChange(currentPage + 1)
                        }
                        disabled={currentPage === totalPage}
                      >
                        <i className="fa-solid fa-angle-right text-white"></i>
                      </button>
                    </div>
                  </>
                </div>
              ) : <></>}
            </div>
          </div>
          {infoPedidos && (
            <div className={`ml-6 infoPedidos-filtro bg-blocks dark:border-blocks overflow-auto text-xs ${infoPedidosClass ?? "mb-6"}`}>
              {
                (infoPedidosData && infoPedidosData.length > 0) ?
                  <>
                    {
                      infoPedidosData.map(dat => (
                        <div
                          style={{
                            display: "flex",
                            gap: "17px",
                            justifyContent: "space-between",
                          }}
                        >
                          <div className="infoPedidosLetras-filtro">
                            <span>{dat.text}</span>
                          </div>
                          <div className="infoPedidosLetras-filtro text-blue_custom font-[600] whitespace-nowrap">
                            <span>{dat.value}</span>
                          </div>
                        </div>
                      ))
                    }
                  </> : <div className="w-full h-full flex items-center justify-center">Sin data</div>
              }
            </div>
          )}
        </div>
        {iconUbicacion && !!iconUbicacionInject && iconUbicacionInject}
        {swith && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              width: "100%",
              alignItems: "center",
              marginBottom: "32px",
              marginTop: "20px",
            }}
          >
            <div style={{ width: "50%" }}>
              <Switch opcion1={opcionesSwitch1!} opcion2={opcionesSwitch2!} />
            </div>
            <div style={{ display: "flex", gap: "50px" }}>
              <div className="resultado-busqueda">
                <span>Resultados:</span>
                <span className="text-blue_custom">{totalRealOrders}</span>
              </div>
              <div className="resultado-busqueda">
                {finanzas ? (
                  <>
                    <span>Total: </span>
                    <span style={{ color: "#1A3D7D", fontWeight: "600" }}>
                      500 Bs
                    </span>
                  </>
                ) : (
                  <>
                    <span>Ordenar por: </span>
                    <select className="select-filtro" name="filter">
                      <option value="">Más reciente</option>
                      <option value="">Más antiguos</option>
                    </select>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {
          !noContent &&
          <div
            className={`${!resultadosPrestamo && "overflow-y-auto max-h-[70vh] pb-[50px]"
              } `}
          >
            {children}
          </div>
        }
        {
          !noContent &&
          <div className="flex justify-between sticky right-0 bottom-0 px-5 w-full h-[130px] bg-main-background z-[40]">
            {exportar ? (
              <div className="flex flex-col justify-center items-center">
                <button
                  type="button"
                  className="flex justify-center items-center bg-blue_custom hover:bg-blue-800 p-4 rounded-full"
                  onClick={exportToExcel}
                >
                  <img src="./IconDocumento.svg" className="w-8" alt="" />
                </button>
                <span className="text-center text-sm">Exportar</span>
              </div>
            ) : <div></div>}
            <div className="flex flex-col-reverse gap-4 justify-center items-end">
              {add && onAdd && (
                <div style={{ marginBottom: "1em" }}>
                  <button type="button" className="btn-agregar bg-blue_custom -translate-x-3" onClick={onAdd}>
                    <span className="material-symbols-outlined">add</span>
                  </button>
                </div>
              )}
              {(paginacion && totalPage && currentPage && !resultadosPrestamo) ? (
                <div
                  style={{
                    display: "flex",
                    gap: "15px",
                    width: "145px",
                    minWidth: "145px",
                  }}
                  className="py-2"
                >
                  <>
                    <div>
                      <button
                        type="button"
                        className="bg-blue-600 shadow-xl disabled:bg-gray-500 disabled:cursor-not-allowed px-2 py-0.5 rounded-sm"
                        onClick={() =>
                          handlePageChange && handlePageChange(currentPage - 1)
                        }
                        disabled={currentPage === 1}
                      >
                        <i className="fa-solid fa-angle-left text-white"></i>
                      </button>
                    </div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <span className="text-paginado">{`${currentPage} de ${totalPage} `}</span>
                    </div>
                    <div>
                      <button
                        type="button"
                        className="bg-blue-600 shadow-xl disabled:bg-gray-500 disabled:cursor-not-allowed px-2 py-0.5 rounded-sm"
                        onClick={() =>
                          handlePageChange && handlePageChange(currentPage + 1)
                        }
                        disabled={currentPage === totalPage}
                      >
                        <i className="fa-solid fa-angle-right text-white"></i>
                      </button>
                    </div>
                  </>
                </div>
              ) : <div></div>}
            </div>
          </div>
        }
      </div >
    </>
  );
});

FiltroPaginado.displayName = "FiltroPaginado"

export { FiltroPaginado };
