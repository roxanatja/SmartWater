import { useContext, useState } from "react";
import "./FiltroPrestamos.css";
import { ReportesIngresosContext } from "../ReportesIngresosContext";
import { Contador } from "../../../../components/Contador/Contador";
import { Zone } from "../../../../../../type/City";
import { User } from "../../../../../../type/User";
import { useForm } from "react-hook-form";
import moment from "moment";
import { useGlobalContext } from "../../../../../SmartwaterContext";
import { exportData, searchDistrict, searchUser, searchZone, setContract, setContractLoan, setDetailClient, setDevolutions, setLoans } from "../../../../../../utils/export.utils";
import { ILoansGetParams } from "../../../../../../api/types/loans";
import { DevolutionsApiConector, ItemsApiConector, LoansApiConector } from "../../../../../../api/classes";
import { formatDateTime } from "../../../../../../utils/helpers";

interface ILoanFilters {
    withContract: boolean;
    withoutContract: boolean;
    withExpiredContract: boolean;
    withoutExpiredContract: boolean;
    fromDate: string | null;
    toDate: string | null;
    daysToRenew: number;
    daysSinceRenewed: number;

    distributor: Record<string, string>;
    zones: Record<string, string>;
}

const initialState: ILoanFilters = {
    withContract: false,
    withoutContract: false,
    withExpiredContract: false,
    withoutExpiredContract: false,
    fromDate: null,
    toDate: null,
    daysToRenew: 0,
    daysSinceRenewed: 0,

    distributor: {},
    zones: {},
}

const FiltroPrestamos = ({ distribuidores, zones }: {
    zones: Zone[];
    distribuidores: User[];
}) => {
    const { setPrestamos } = useContext(ReportesIngresosContext);
    const { setLoading } = useGlobalContext()

    const { register, handleSubmit, setValue, watch } = useForm<ILoanFilters>({
        defaultValues: initialState || {},
    });

    const [selectedDists, setSelectedDists] = useState<User[]>([])

    const onSubmit = async (data: any) => {
        setLoading(true)

        const fileName = "ReporteClientes.xlsx";
        const dat = await getDataClients(filterClients(data));
        exportData(fileName, dat);

        setLoading(false)
        setPrestamos(false);
    };

    const filterClients = (filters: ILoanFilters): ILoansGetParams['filters'] => {
        const result: ILoansGetParams['filters'] = {}

        if (filters.fromDate) { result.initialDate = filters.fromDate.toString() }
        if (filters.toDate) { result.finalDate = filters.toDate.toString() }

        if (filters.daysSinceRenewed > 0) { result.renewedAgo = filters.daysSinceRenewed }
        if (filters.daysToRenew > 0) { result.renewedIn = filters.daysToRenew }

        if (!((!!filters.withContract && !!filters.withoutContract) || (!filters.withContract && !filters.withoutContract))) {
            result.hasContract = filters.withContract
        }

        if (!((!!filters.withExpiredContract && !!filters.withoutExpiredContract) || (!filters.withExpiredContract && !filters.withoutExpiredContract))) {
            result.hasExpiredContract = filters.withExpiredContract
        }

        if (filters.zones) {
            const zones = Object.values(filters.zones).filter(z => !!z).join(',')
            if (zones !== "") { result.zone = zones }
        }

        if (selectedDists.length > 0) {
            const dists = selectedDists.map(z => z._id).join(',')
            if (dists !== "") { result.user = dists }
        }

        return result
    };

    const getDataClients = async (filters: ILoansGetParams['filters']) => {

        let datClients = await LoansApiConector.get({ pagination: { page: 1, pageSize: 3000 }, filters: filters })

        // Cargar datos
        const data = datClients?.data || [];
        const items = (await ItemsApiConector.get({ pagination: { page: 1, pageSize: 3000 } }))?.data || [];
        const devolutions = (await DevolutionsApiConector.get({ pagination: { page: 1, pageSize: 3000 } }))?.data || []

        // Mapeo de datos
        const dataClientToExport: any[] = [];

        for (let idx = 0; idx < data.length; idx++) {
            const loan = data[idx]
            const client = loan.client[0]

            if (client) {
                const zone = searchZone(client.zone, zones)

                const loadsStr = setLoans(client._id, [loan], devolutions.filter(d => d.loan === loan._id), items)
                const devolStr = setDevolutions(client._id, devolutions.filter(d => d.loan === loan._id), items)
                const saldosStr = setDetailClient([loan], items)

                const filteredItems = items.filter(i =>
                    loadsStr.some(l => l.itemId === i._id)
                    || devolStr.some(l => l.itemId === i._id)
                    || saldosStr.some(l => l.itemId === i._id)
                )

                if (filteredItems.length > 0) {
                    filteredItems.forEach((item, index) => {
                        const loanZ = loadsStr.find(l => l.itemId === item._id)
                        const devol = devolStr.find(l => l.itemId === item._id)
                        const saldo = saldosStr.find(l => l.itemId === item._id)

                        const typeDataToExport = {
                            NRO: `${idx + 1}`,
                            USUARIO: searchUser(client.user, distribuidores), // Buscar usuario asociado
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
                            "TIEMPO DE RENOVACION": client.renewInDays !== null ? client.renewInDays : "", // Tiempo de renovación
                            "RENOVACION PROMEDIO": client.averageRenewal ? "SI" : "NO", // Tiempo de renovación
                            "DIAS RENOVACION PROMEDIO": (client.averageRenewal && client.lastSale && client.renewDate) ? Math.abs(moment(new Date(client.lastSale).toISOString().split("T")[0]).diff(new Date(client.renewDate).toISOString().split("T")[0], 'days')) : "", // Tiempo de renovación
                            "FECHA DE REGISTRO DEL PRESTAMO": formatDateTime(
                                loan.created,
                                "numeric",
                                "numeric",
                                "2-digit", false, true
                            ), // Formatear la fecha de registro
                            CONTRATOS: setContractLoan(!!loan.contract.link, loan.contract.validUntil) || "SIN CONTRATOS", // Estado de contratos
                            "FECHA VALIDEZ DEL CONTRATO": !!loan.contract.validUntil
                                ? formatDateTime(loan.contract.validUntil, "numeric", "numeric", "2-digit", false, true)
                                : "N/A",
                            PRESTAMOS: loanZ ? `${loanZ.quantity} ${loanZ.itemName}` : "SIN MOVIMIENTO", // Detalles de préstamos
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
                        };

                        if (index === 0) {
                            dataClientToExport.push(typeDataToExport)
                        } else {
                            dataClientToExport.push({
                                PRESTAMOS: loanZ ? `${loanZ.quantity} ${loanZ.itemName}` : "SIN MOVIMIENTO", // Detalles de préstamos
                                DEVOLUCIONES: devol ? `${devol.quantity} ${devol.itemName}` : "SIN MOVIMIENTO", // Detalles de devoluciones
                                SALDOS: saldo ? `${saldo.quantity} ${saldo.itemName}` : "SIN SALDOS", // Detalles de saldos
                            })
                        }
                    })
                } else {
                    const typeDataToExport = {
                        NRO: `${idx + 1}`,
                        USUARIO: searchUser(client.user, distribuidores), // Buscar usuario asociado
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
                        "TIEMPO DE RENOVACION": client.renewInDays !== null ? client.renewInDays : "", // Tiempo de renovación
                        "RENOVACION PROMEDIO": client.averageRenewal ? "SI" : "NO", // Tiempo de renovación
                        "DIAS RENOVACION PROMEDIO": (client.averageRenewal && client.lastSale && client.renewDate) ? Math.abs(moment(new Date(client.lastSale).toISOString().split("T")[0]).diff(new Date(client.renewDate).toISOString().split("T")[0], 'days')) : "", // Tiempo de renovación
                        "FECHA DE REGISTRO DEL PRESTAMO": formatDateTime(
                            loan.created,
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
                    };

                    dataClientToExport.push(typeDataToExport)
                }
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
                <p className="font-semibold text-blue_custom -ml-4">Préstamos y Contratos</p>

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
                        setPrestamos(false)
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

export { FiltroPrestamos }