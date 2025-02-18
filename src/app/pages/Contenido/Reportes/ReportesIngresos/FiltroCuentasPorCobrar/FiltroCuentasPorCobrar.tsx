import { useContext, useState } from "react";
import "./FiltroCuentasPorCobrar.css";
import { ReportesIngresosContext } from "../ReportesIngresosContext";
import { Zone } from "../../../../../../type/City";
import { User } from "../../../../../../type/User";
import { useGlobalContext } from "../../../../../SmartwaterContext";
import { useForm } from "react-hook-form";
import { ISalesGetParams } from "../../../../../../api/types/sales";
import { DevolutionsApiConector, ItemsApiConector, LoansApiConector, SalesApiConector } from "../../../../../../api/classes";
import { exportData, searchDistrict, searchUser, searchZone, setContract, setDetailClient, setDevolutions, setLoans } from "../../../../../../utils/export.utils";
import { Client } from "../../../../../../type/Cliente/Client";
import { formatDateTime } from "../../../../../../utils/helpers";
import { Contador } from "../../../../components/Contador/Contador";
import moment from "moment";

interface ISaleFilters {
    withContract: boolean;
    withoutContract: boolean;
    withExpiredContract: boolean;
    withoutExpiredContract: boolean;
    withLoan: boolean;
    withoutLoan: boolean;
    toDate: string | null;
    zones: Record<string, string>;
    distributor: Record<string, string>;
    daysToRenew: number;
    daysSinceRenewed: number;
}

const initialState: ISaleFilters = {
    withContract: false,
    withoutContract: false,
    withExpiredContract: false,
    withoutExpiredContract: false,
    withLoan: false,
    withoutLoan: false,
    toDate: null,
    daysToRenew: 0,
    daysSinceRenewed: 0,
    zones: {},
    distributor: {}
}

const FiltroCuentasPorCobrar = ({ distribuidores, zones }: {
    zones: Zone[];
    distribuidores: User[];
}) => {
    const { setCuentasPorCobrarCobros } = useContext(ReportesIngresosContext);
    const { setLoading } = useGlobalContext()

    const { register, handleSubmit, setValue, watch } = useForm<ISaleFilters>({
        defaultValues: initialState,
    });

    const [selectedDists, setSelectedDists] = useState<User[]>([])

    const filterClients = (filters: ISaleFilters): ISalesGetParams['filters'] => {
        const result: ISalesGetParams['filters'] = {}

        if (filters.daysSinceRenewed > 0) { result.renewedAgo = filters.daysSinceRenewed }
        if (filters.daysToRenew > 0) { result.renewedIn = filters.daysToRenew }
        if (filters.toDate) { result.finalDate = filters.toDate.toString() }

        if (filters.zones) {
            const zones = Object.values(filters.zones).filter(z => !!z).join(',')
            if (zones !== "") { result.zone = zones }
        }

        if (!((!!filters.withContract && !!filters.withoutContract) || (!filters.withContract && !filters.withoutContract))) {
            result.hasClientContract = filters.withContract
        }

        if (!((!!filters.withExpiredContract && !!filters.withoutExpiredContract) || (!filters.withExpiredContract && !filters.withoutExpiredContract))) {
            result.hasClientExpiredContracts = filters.withExpiredContract
        }

        if (!((!!filters.withLoan && !!filters.withoutLoan) || (!filters.withLoan && !filters.withoutLoan))) {
            result.hasClientLoan = filters.withLoan
        }

        if (selectedDists.length > 0) {
            const dists = selectedDists.map(z => z._id).join(',')
            if (dists !== "") { result.user = dists }
        }

        return result
    };

    const onSubmit = async (data: any) => {
        setLoading(true)

        const fileName = "ReporteCuentasPorCobrar.xlsx";
        const dat = await getDataClients(filterClients(data));
        exportData(fileName, dat);

        setLoading(false)
        setCuentasPorCobrarCobros(false);
    };

    const getDataClients = async (filtersParam: ISalesGetParams['filters']) => {
        const filters = filtersParam || {}
        if (!filters.initialDate) {
            filters.initialDate = "2020-01-01"
        }

        if (!filters.finalDate) {
            filters.finalDate = moment().format("YYYY-MM-DD")
        }

        const datCuentas = (await SalesApiConector.get({ pagination: { page: 1, pageSize: 30000 }, filters: { ...filters, creditSale: true, pendingBalance: true } }))?.data || []
        const dataClientToExport: any[] = [];

        const items = (await ItemsApiConector.get({ pagination: { page: 1, pageSize: 30000 } }))?.data || [];
        const loans = (await LoansApiConector.get({ pagination: { page: 1, pageSize: 30000 } }))?.data || []
        const devolutions = (await DevolutionsApiConector.get({ pagination: { page: 1, pageSize: 30000 } }))?.data || []


        for (let index = 0; index < datCuentas.length; index++) {
            const sale = datCuentas[index]

            const client: Client | null = sale.client
            const zone = searchZone(sale.zone, zones)

            const filteredLoans = loans.filter(l => l.client.some(c => c._id === client._id))
            const loadsStr = setLoans(client._id, filteredLoans, devolutions, items)
            const devolStr = setDevolutions(client._id, devolutions, items)
            const saldosStr = setDetailClient(filteredLoans, items)

            const filteredItems = items.filter(i =>
                loadsStr.some(l => l.itemId === i._id)
                || devolStr.some(l => l.itemId === i._id)
                || saldosStr.some(l => l.itemId === i._id)
            )

            if (filteredItems.length > 0) {
                filteredItems.forEach((item, idx) => {
                    const loan = loadsStr.find(l => l.itemId === item._id)
                    const devol = devolStr.find(l => l.itemId === item._id)
                    const saldo = saldosStr.find(l => l.itemId === item._id)

                    const typeDataToExport = {
                        NRO: `${index + 1}`,
                        CODIGO: sale.code || "Sin codigo",
                        USUARIO: searchUser(sale.user, distribuidores),
                        "CODIGO CLIENTE": client.code ? client.code : "Sin codigo", // Código del cliente
                        "NOMBRE CLIENTE": client.fullName || "Sin nombre",
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
                        DIRECCION: client.address ? client.address : "Sin direccion", // Dirección
                        REFERENCIA: client.comment || "Sin referencia", // Comentario o referencia
                        ZONA: zone?.name || "Sin zona", // Buscar la zona
                        BARRIO: zone ? (searchDistrict(client.district, zone.districts)?.name || "Sin barrio") : "Sin barrio", // Buscar barrio
                        CONTRATOS: setContract(client) || "SIN CONTRATOS", // Estado de contratos
                        PRESTAMOS: loan ? `${loan.quantity} ${loan.itemName}` : "SIN MOVIMIENTO", // Detalles de préstamos
                        DEVOLUCIONES: devol ? `${devol.quantity} ${devol.itemName}` : "SIN MOVIMIENTO", // Detalles de devoluciones
                        "SALDO DE PRESTAMO EQUIPO": saldo ? `${saldo.quantity} ${saldo.itemName}` : "SIN SALDOS", // Detalles de saldos
                        "FECHA DE ULTIMA VENTA": client.lastSale
                            ? formatDateTime(client.lastSale, "numeric", "numeric", "2-digit", false, true)
                            : "Sin ventas", // Fecha de la última venta
                        "ULTIMA FECHA POSPUESTO": client.lastPostponed
                            ? formatDateTime(client.lastPostponed, "numeric", "numeric", "2-digit", false, true)
                            : "N/A", // Fecha de la última venta
                        "PROXIMA FECHA DE RENOVACION": client.renewDate
                            ? formatDateTime(client.renewDate, "numeric", "numeric", "2-digit", false, true)
                            : "N/A", // Fecha de la última venta
                        "FECHA REGISTRO CUENTA POR COBRAR": sale.created
                            ? formatDateTime(sale.created, "numeric", "numeric", "2-digit", false, true)
                            : "N/A", // Fecha de la última venta
                        "IMPORTE SALDO POR COBRAR BS": sale.total || 0,
                        "VENTA FAC/SIN FACT": sale.hasInvoice ? "FACTURA" : "SIN FACTURA",
                    };

                    if (idx === 0) {
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
                    NRO: `${index + 1}`,
                    USUARIO: searchUser(sale.user, distribuidores),
                    "CODIGO CLIENTE": client.code ? client.code : "Sin codigo", // Código del cliente
                    "NOMBRE CLIENTE": client.fullName || "Sin nombre",
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
                    DIRECCION: client.address ? client.address : "Sin direccion", // Dirección
                    REFERENCIA: client.comment || "Sin referencia", // Comentario o referencia
                    ZONA: zone?.name || "Sin zona", // Buscar la zona
                    BARRIO: zone ? (searchDistrict(client.district, zone.districts)?.name || "Sin barrio") : "Sin barrio", // Buscar barrio
                    CONTRATOS: setContract(client) || "SIN CONTRATOS", // Estado de contratos
                    PRESTAMOS: "SIN MOVIMIENTO", // Detalles de préstamos
                    DEVOLUCIONES: "SIN MOVIMIENTO", // Detalles de devoluciones
                    "SALDO DE PRESTAMO EQUIPO": "SIN SALDOS", // Detalles de saldos
                    "FECHA DE ULTIMA VENTA": client.lastSale
                        ? formatDateTime(client.lastSale, "numeric", "numeric", "2-digit", false, true)
                        : "Sin ventas", // Fecha de la última venta
                    "ULTIMA FECHA POSPUESTO": client.lastPostponed
                        ? formatDateTime(client.lastPostponed, "numeric", "numeric", "2-digit", false, true)
                        : "N/A", // Fecha de la última venta
                    "PROXIMA FECHA DE RENOVACION": client.renewDate
                        ? formatDateTime(client.renewDate, "numeric", "numeric", "2-digit", false, true)
                        : "N/A", // Fecha de la última venta
                    "FECHA REGISTRO CUENTA POR COBRAR": sale.created
                        ? formatDateTime(sale.created, "numeric", "numeric", "2-digit", false, true)
                        : "N/A", // Fecha de la última venta
                    "IMPORTE SALDO POR COBRAR BS": sale.total || 0,
                    "VENTA FAC/SIN FACT": sale.hasInvoice ? "FACTURA" : "SIN FACTURA",
                };

                dataClientToExport.push(typeDataToExport)
            }
        }

        return dataClientToExport
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="p-8 flex flex-col gap-2">
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

            <div className="flex flex-col sm:flex-row mb-4">
                <div className="flex-1">
                    <div className="FiltroClientes-Fechastitulo mb-2">
                        <span className="text-blue_custom font-semibold">Fechas</span>
                    </div>
                    <div className="flex gap-3 flex-wrap">
                        <div className="shadow-xl rounded-3xl px-4 py-2 border-gray-100 border flex-1 relative">
                            <span className="text-left text-sm">A</span>
                            <img src="/hasta.svg" alt="" className="w-[20px] h-[20px] absolute bottom-3 left-4 invert-0 dark:invert" />
                            <input
                                max={moment().format("YYYY-MM-DD")}
                                type="date"
                                {...register("toDate")}
                                className="border-0  rounded outline-none font-semibold w-full bg-transparent text-sm full-selector pl-10"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-3 ml-4">
                <p className="font-semibold text-blue_custom -ml-4">De clientes</p>

                <div className="flex gap-3 items-center">
                    <input
                        className="input-check accent-blue_custom"
                        type="checkbox"
                        id="check1"
                        checked={watch('withLoan')}
                        onChange={() => {
                            const credit = watch("withLoan")
                            setValue("withLoan", !credit);
                            setValue("withoutLoan", false);

                            setValue("withContract", false);
                            setValue("withoutContract", false);
                            setValue("withExpiredContract", false);
                            setValue("withoutExpiredContract", false);
                        }}
                    />
                    <img src="/with-loans.svg" alt="" />
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
                                setValue("withLoan", true);
                                setValue("withoutLoan", false);
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
                                    setValue("withLoan", true);
                                    setValue("withoutLoan", false);
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
                                    setValue("withLoan", true);
                                    setValue("withoutLoan", false);
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
                                setValue("withLoan", true);
                                setValue("withoutLoan", false);

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
                        checked={watch('withoutLoan')}
                        onChange={() => {
                            const credit = watch("withoutLoan")
                            setValue("withoutLoan", !credit);
                            setValue("withLoan", false);
                            setValue("withContract", false);
                            setValue("withoutContract", false);
                            setValue("withoutExpiredContract", false);
                            setValue("withExpiredContract", false);
                        }}
                    />
                    <img src="/without-loans.svg" alt="" />
                    <label htmlFor="check2" className="text-sm" >
                        Sin préstamo
                    </label>
                </div>
            </div>

            <div className="w-full flex flex-col gap-2 my-6">
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
                        setCuentasPorCobrarCobros(false)
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
}

export { FiltroCuentasPorCobrar }