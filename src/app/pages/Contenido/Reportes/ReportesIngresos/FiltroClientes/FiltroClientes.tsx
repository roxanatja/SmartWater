import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { Contador } from "../../../../components/Contador/Contador";
import { ReportesIngresosContext } from "../ReportesIngresosContext";
import { Zone } from "../../../../../../type/City";
import { User } from "../../../../../../type/User";
import { IClientGetParams } from "../../../../../../api/types/clients";
import { useGlobalContext } from "../../../../../SmartwaterContext";
import moment from "moment";
import { ClientsApiConector, DevolutionsApiConector, ItemsApiConector, LoansApiConector } from "../../../../../../api/classes";
import { exportData, searchDistrict, searchUser, searchZone, setContract, setDetailClient, setDevolutions, setLoans } from "../../../../../../utils/export.utils";
import { formatDateTime } from "../../../../../../utils/helpers";

interface IClientFilters {
  withOrder: boolean;
  withoutOrder: boolean;
  withLoans: boolean;
  withoutLoans: boolean;
  withContract: boolean;
  withoutContract: boolean;
  withExpiredContract: boolean;
  withoutExpiredContract: boolean;
  withCredit: boolean;
  withoutCredit: boolean;
  daysToRenew: number;
  daysSinceRenewed: number;
  zones: Record<string, string>;
  fromDate: string | null;
  toDate: string | null;
  distributor: Record<string, string>;
}

const initialState: IClientFilters = {
  withOrder: false,
  withoutOrder: false,
  withLoans: false,
  withoutLoans: false,
  withContract: false,
  withoutContract: false,
  withExpiredContract: false,
  withoutExpiredContract: false,
  withCredit: false,
  withoutCredit: false,
  daysToRenew: 0,
  daysSinceRenewed: 0,
  zones: {},
  fromDate: null,
  toDate: null,
  distributor: {}
}

const FiltroClientes = ({ distribuidores, zones }: {
  zones: Zone[];
  distribuidores: User[];
}) => {
  const { setClientes } = useContext(ReportesIngresosContext);
  const { setLoading } = useGlobalContext()

  const { register, handleSubmit, setValue, watch } = useForm<IClientFilters>({
    defaultValues: initialState,
  });

  const [selectedDists, setSelectedDists] = useState<User[]>([])

  const onSubmit = async (data: any) => {
    setLoading(true)

    const fileName = "ReporteClientes.xlsx";
    const dat = await getDataClients(filterClients(data));
    exportData(fileName, dat);

    setLoading(false)
    setClientes(false);
  };

  const filterClients = (filters: IClientFilters): IClientGetParams['filters'] => {
    const result: IClientGetParams['filters'] = {}

    if (filters.fromDate) { result.initialDate = filters.fromDate.toString() }
    if (filters.toDate) { result.finalDate = filters.toDate.toString() }

    if (filters.zones) {
      const zones = Object.values(filters.zones).filter(z => !!z).join(',')
      if (zones !== "") { result.zone = zones }
    }

    if (filters.daysSinceRenewed > 0) { result.renewedAgo = filters.daysSinceRenewed }
    if (filters.daysToRenew > 0) { result.renewedIn = filters.daysToRenew }

    if (!((!!filters.withContract && !!filters.withoutContract) || (!filters.withContract && !filters.withoutContract))) {
      result.hasContract = filters.withContract
    }

    if (!((!!filters.withCredit && !!filters.withoutCredit) || (!filters.withCredit && !filters.withoutCredit))) {
      result.hasCredit = filters.withCredit
    }

    if (!((!!filters.withExpiredContract && !!filters.withoutExpiredContract) || (!filters.withExpiredContract && !filters.withoutExpiredContract))) {
      result.hasExpiredContracts = filters.withExpiredContract
    }

    if (!((!!filters.withLoans && !!filters.withoutLoans) || (!filters.withLoans && !filters.withoutLoans))) {
      result.hasLoan = filters.withLoans
    }

    if (!((!!filters.withOrder && !!filters.withoutOrder) || (!filters.withOrder && !filters.withoutOrder))) {
      result.hasOrder = filters.withOrder
    }

    if (selectedDists.length > 0) {
      const dists = selectedDists.map(z => z._id).join(',')
      if (dists !== "") { result.user = dists }
    }

    return result
  };

  const getDataClients = async (filters: IClientGetParams['filters']) => {

    let datClients = await ClientsApiConector.getClients({ pagination: { page: 1, pageSize: 3000 }, filters });

    // Cargar datos
    const data = datClients?.data || [];
    const items = (await ItemsApiConector.get({ pagination: { page: 1, pageSize: 3000 } }))?.data || [];
    const loans = (await LoansApiConector.get({ pagination: { page: 1, pageSize: 3000 } }))?.data || []
    const devolutions = (await DevolutionsApiConector.get({ pagination: { page: 1, pageSize: 3000 } }))?.data || []

    // Mapeo de datos
    const dataClientToExport: any[] = [];

    for (const client of data) {
      const filteredLoans = loans.filter(l => l.client.some(c => c._id === client._id))
      const zone = searchZone(client.zone, zones)

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
            USUARIO: searchUser(client.user, distribuidores), // Buscar usuario asociado
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
          USUARIO: searchUser(client.user, distribuidores), // Buscar usuario asociado
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-8 flex flex-col gap-8">
      <div className="flex-1 flex flex-col">
        <div className="FiltroClientes-RenovaciónTitulo mb-2">
          <span className="text-blue_custom font-semibold">Renovación</span>
        </div>
        <div className="flex flex-col gap-3 w-full">
          <div className="flex items-center gap-3 justify-between">
            <span className="text-sm">Se renovarán hasta en</span>
            <div>
              <Contador
                initialValue={watch('daysToRenew')}
                min={0}
                onIncrementar={(count) => setValue("daysToRenew", count, { shouldValidate: true })}
                onDecrementar={(count) => setValue("daysToRenew", count, { shouldValidate: true })}
                iconsClassname="text-blue_bright"
                numberClassname="border border-blue_bright px-4 rounded-md tabular-nums text-sm"
              />
            </div>
            <input
              type="hidden"
              {...register("daysToRenew")}
              defaultValue={0}
            />
          </div>
          <div className="flex items-center gap-3 justify-between">
            <span className="text-sm">Renovado hace más de</span>
            <div>
              <Contador
                initialValue={watch('daysSinceRenewed')}
                min={0}
                onIncrementar={(count) => setValue("daysSinceRenewed", count, { shouldValidate: true })}
                onDecrementar={(count) => setValue("daysSinceRenewed", count, { shouldValidate: true })}
                iconsClassname="text-blue_bright"
                numberClassname="border border-blue_bright px-4 rounded-md tabular-nums text-sm"
              />
            </div>
            <input
              type="hidden"
              {...register("daysSinceRenewed")}
              defaultValue={0}
            />
          </div>
        </div>
      </div>

      <div className="flex-1">
        <div className="FiltroClientes-Fechastitulo mb-2">
          <span className="text-blue_custom font-semibold">Fechas</span>
        </div>
        <div className="flex gap-3 w-full">
          <div className="shadow-xl rounded-3xl px-4 py-2 border-gray-100 border flex-1 relative">
            <span className="text-left text-sm">De</span>
            <img src="/desde.svg" alt="" className="w-[20px] h-[20px] absolute bottom-3 left-4 invert-0 dark:invert" />
            <input
              max={watch('toDate')?.toString() || moment().format("YYYY-MM-DD")}
              type="date"
              {...register("fromDate")}
              className="border-0 rounded outline-none font-semibold w-full bg-transparent text-sm full-selector pl-10"
            />
          </div>
          <div className="shadow-xl rounded-3xl px-4 py-2 border-gray-100 border flex-1 relative">
            <span className="text-left text-sm">A</span>
            <img src="/hasta.svg" alt="" className="w-[20px] h-[20px] absolute bottom-3 left-4 invert-0 dark:invert" />
            <input
              min={watch('fromDate')?.toString()}
              max={moment().format("YYYY-MM-DD")}
              type="date"
              {...register("toDate")}
              className="border-0  rounded outline-none font-semibold w-full bg-transparent text-sm full-selector pl-10"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 ml-4">
        <p className="font-semibold text-blue_custom -ml-4">Prestamos y contratos</p>

        <div className="flex gap-3 items-center">
          <input
            className="input-check accent-blue_custom"
            type="checkbox"
            id="check1"
            checked={watch('withLoans')}
            onChange={() => {
              const credit = watch("withLoans")
              setValue("withLoans", !credit);
              setValue("withoutLoans", false);

              setValue("withContract", false);
              setValue("withoutContract", false);
              setValue("withExpiredContract", false);
              setValue("withoutExpiredContract", false);
            }}
          />
          <img src="/ConContrato.svg" alt="" />
          <label htmlFor="check1" className="text-sm" >
            Con préstamo
          </label>
        </div>
        <div className="flex flex-col gap-3 ml-6">
          <div className="flex gap-3 items-center">
            <input
              className="input-check accent-blue_custom"
              type="checkbox"
              id="check7"
              checked={watch('withContract')}
              onChange={() => {
                const credit = watch("withContract")
                setValue("withContract", !credit);
                setValue("withoutContract", false);
                setValue("withLoans", true);
                setValue("withoutLoans", false);
                setValue("withExpiredContract", false);
                setValue("withoutExpiredContract", false);
              }}
            />
            <img src="/ConContrato.svg" alt="" />
            <label htmlFor="check7" className="text-sm" >
              Con contratos
            </label>
          </div>

          <div className="flex flex-col gap-3 ml-6">
            <div className="flex gap-3 items-center">
              <input
                className="input-check accent-blue_custom"
                type="checkbox"
                id="check9"
                checked={watch('withExpiredContract')}
                onChange={() => {
                  const expired = watch("withExpiredContract")
                  setValue("withContract", true);
                  setValue("withoutContract", false);
                  setValue("withLoans", true);
                  setValue("withoutLoans", false);
                  setValue("withExpiredContract", !expired);
                  setValue("withoutExpiredContract", false);
                }}
              />
              <img src="/ContratoVencido.svg" alt="" />
              <label htmlFor="check9" className="text-sm" >
                Vencidos
              </label>
            </div>
            <div className="flex gap-3 items-center">
              <input
                className="input-check accent-blue_custom"
                type="checkbox"
                id="check10"
                checked={watch('withoutExpiredContract')}
                onChange={() => {
                  const expired = watch("withoutExpiredContract")
                  setValue("withContract", true);
                  setValue("withoutContract", false);
                  setValue("withLoans", true);
                  setValue("withoutLoans", false);
                  setValue("withoutExpiredContract", !expired);
                  setValue("withExpiredContract", false);
                }}
              />
              <img src="/ConContrato.svg" alt="" />
              <label htmlFor="check10" className="text-sm" >
                Vigentes
              </label>
            </div>
          </div>

          <div className="flex gap-3 items-center">
            <input
              className="input-check accent-blue_custom"
              type="checkbox"
              id="check8"
              checked={watch('withoutContract')}
              onChange={() => {
                const credit = watch("withoutContract")
                setValue("withoutContract", !credit);
                setValue("withLoans", true);
                setValue("withoutLoans", false);

                setValue("withContract", false);
                setValue("withoutExpiredContract", false);
                setValue("withExpiredContract", false);
              }}
            />
            <img src="/SinContrato.svg" alt="" />
            <label htmlFor="check8" className="text-sm" >
              Sin contratos
            </label>
          </div>
        </div>
        <div className="flex gap-3 items-center">
          <input
            className="input-check accent-blue_custom"
            type="checkbox"
            id="check2"
            checked={watch('withoutLoans')}
            onChange={() => {
              const credit = watch("withoutLoans")
              setValue("withoutLoans", !credit);
              setValue("withLoans", false);
              setValue("withContract", false);
              setValue("withoutContract", false);
              setValue("withoutExpiredContract", false);
              setValue("withExpiredContract", false);
            }}
          />
          <img src="/SinContrato.svg" alt="" />
          <label htmlFor="check2" className="text-sm" >
            Sin préstamo
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <p className="font-semibold text-blue_custom">Cuentas por cobrar</p>
        <div className="flex flex-wrap gap-6">
          <div className="flex gap-3 items-center">
            <input
              className="input-check accent-blue_custom"
              type="checkbox"
              id="check19"
              checked={watch('withCredit')}
              onChange={() => {
                const expired = watch("withCredit")
                setValue("withCredit", !expired);
                setValue("withoutCredit", false);
              }}
            />
            <img src="/Moneda-icon-blue.svg" alt="" />
            <label htmlFor="check19" className="text-sm" >
              Con saldos
            </label>
          </div>
          <div className="flex gap-3 items-center">
            <input
              className="input-check accent-blue_custom"
              type="checkbox"
              id="check20"
              checked={watch('withoutCredit')}
              onChange={() => {
                const expired = watch("withoutCredit")
                setValue("withoutCredit", !expired);
                setValue("withCredit", false);
              }}
            />
            <img src="/nosaldo.svg" alt="" />
            <label htmlFor="check20" className="text-sm" >
              Sin saldos
            </label>
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col gap-2">
        <label className="font-semibold text-blue_custom">Distribuidores</label>
        <div className="flex flex-wrap gap-x-6 gap-y-4">
          {distribuidores.filter(d => d.role === 'user').map((dists, index) => (
            <div
              key={index}
              className="flex items-center gap-3"
            >
              <input
                className="input-check accent-blue_custom"
                type="checkbox"
                onChange={() => {
                  if (selectedDists.some(s => s._id === dists._id)) {
                    setSelectedDists(prev => prev.filter(s => s._id !== dists._id))
                  } else {
                    setSelectedDists(prev => [...prev, dists])
                  }

                  zones.forEach(z => setValue(`zones.${z._id}`, "", { shouldValidate: true }))
                }}
                checked={selectedDists.some(sd => sd._id === dists._id)}
                id={`distrib-${dists._id}`}
              />
              <label
                htmlFor={`distrib-${dists._id}`}
                className="text-sm"
              >
                {dists.fullName || "Sin nombre"}
              </label>
            </div>
          ))}
        </div>
        <label className="text-blue_custom mt-2">Administradores</label>
        <div className="flex flex-wrap gap-x-6 gap-y-4">
          {distribuidores.filter(d => d.role === 'admin').map((dists, index) => (
            <div
              key={index}
              className="flex items-center gap-3"
            >
              <input
                className="input-check accent-blue_custom"
                type="checkbox"
                onChange={() => {
                  if (selectedDists.some(s => s._id === dists._id)) {
                    setSelectedDists(prev => prev.filter(s => s._id !== dists._id))
                  } else {
                    setSelectedDists(prev => [...prev, dists])
                  }

                  zones.forEach(z => setValue(`zones.${z._id}`, "", { shouldValidate: true }))
                }}
                checked={selectedDists.some(sd => sd._id === dists._id)}
                id={`distrib-${dists._id}`}
              />
              <label
                htmlFor={`distrib-${dists._id}`}
                className="text-sm"
              >
                {dists.fullName || "Sin nombre"}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full flex flex-col gap-2 mb-8">
        <label className="font-semibold text-blue_custom">Zonas</label>
        <div className="flex flex-wrap gap-x-6 gap-y-4">
          {zones
            .filter(zone => selectedDists.length > 0 ? selectedDists.some(d => d.zones?.includes(zone._id)) : true)
            .map((zone, index) => (
              <div
                key={index}
                className="flex items-center gap-3"
              >
                <input
                  className="input-check accent-blue_custom"
                  type="checkbox"
                  {...register(`zones.${zone._id}`)}
                  value={zone._id}
                  id={`zone-${zone._id}`}
                />
                <label
                  htmlFor={`zone-${zone._id}`}
                  className="text-sm"
                >
                  {zone.name}
                </label>
              </div>
            ))}
        </div>
      </div>

      <div className="flex justify-between w-full items-center gap-3 px-4">
        <button
          type="button"
          onClick={() => {
            setClientes(false)
          }}
          className="mt-4 border-blue-500 border-2 rounded-full px-4 py-2.5 shadow-xl text-blue-500 font-bold w-full"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="mt-4 bg-blue-500 border-2 border-blue-500 shadow-xl text-white rounded-full px-4 py-2.5 w-full font-bold"
        >
          Generar reporte
        </button>
      </div>
    </form >
  );
};

export default FiltroClientes;
