import React, { useContext, useState } from 'react'
import { Zone } from '../../../../../../type/City';
import { User } from '../../../../../../type/User';
import { Providers } from '../../../../../../type/providers';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { IInvExpensesGetParams } from '../../../../../../api/types/invoice-expenses';
import { ReportesEgresosContext } from '../ReportesEgresosContext';
import { useGlobalContext } from '../../../../../SmartwaterContext';
import { exportData } from '../../../../../../utils/export.utils';
import { InvoiceExpensesApiConector } from '../../../../../../api/classes';
import moment from 'moment';
import { formatDateTime } from '../../../../../../utils/helpers';
import { Expense } from '../../../../../../type/Expenses';

interface IExpenseFilters {
    fromDate: string | null;
    toDate: string | null;
    provider: string | null;
    zones: Record<string, string>;
    distributor: Record<string, string>;

    cash: boolean;
    contado: boolean;
    currentAccount: boolean;
    withBalance: boolean;
    withoutBalance: boolean;
}

const initialState: IExpenseFilters = {
    cash: false,
    contado: false,
    currentAccount: false,
    withBalance: false,
    withoutBalance: false,

    fromDate: null,
    toDate: null,
    zones: {},
    distributor: {},
    provider: null
}

const FiltroPagoProveedores = ({ distribuidores, providers, zones, expenses }: {
    zones: Zone[];
    distribuidores: User[];
    providers: Providers[];
    expenses: Expense[];
}) => {

    const { setpagos } = useContext(ReportesEgresosContext);
    const { setLoading } = useGlobalContext()

    const { register, handleSubmit, setValue, watch } = useForm<IExpenseFilters>({
        defaultValues: initialState || {},
    });

    const [selectedDists, setSelectedDists] = useState<User[]>([])

    const filterClients = (filters: IExpenseFilters): IInvExpensesGetParams['filters'] => {
        const result: IInvExpensesGetParams['filters'] = {}

        if (filters.fromDate) { result.initialDate = filters.fromDate.toString() }
        if (filters.toDate) { result.finalDate = filters.toDate.toString() }
        if (filters.provider) { result.provider = filters.provider }

        if (filters.zones) {
            const zones = Object.values(filters.zones).filter(z => !!z).join(',')
            if (zones !== "") { result.zone = zones }
        }

        if (!((!!filters.withBalance && !!filters.withoutBalance) || (!filters.withBalance && !filters.withoutBalance))) {
            result.hasBalance = filters.withBalance
        }

        if (filters.cash) { result.paymentMethodCurrentAccount = false; result.cashPayment = true }
        if (filters.currentAccount) { result.paymentMethodCurrentAccount = true; result.cashPayment = false }
        if (filters.contado) { result.paymentMethodCurrentAccount = false; result.cashPayment = false }

        if (selectedDists.length > 0) {
            const dists = selectedDists.map(z => z._id).join(',')
            if (dists !== "") { result.user = dists }
        }

        return result
    };

    const onSubmit = async (data: any) => {
        setLoading(true)

        const fileName = "ReportePagos.xlsx";
        const dat = await getDataWithClientNames(filterClients(data));
        exportData(fileName, dat);

        setLoading(false)
        setpagos(false);
    };

    const getDataWithClientNames = async (filtersParam: IInvExpensesGetParams['filters']) => {
        const filters = filtersParam || {}

        const data = (await InvoiceExpensesApiConector.get({ filters: { ...filters, sort: 'desc' } }))?.data || []

        const dataWithClientNames: any[] = []

        for (let idx = 0; idx < data.length; idx++) {
            const expense = data[idx];
            const provider = providers.find(p => p._id === expense.provider)
            const expen = expenses.find(e => e._id === expense.expense)

            const typeDataToExport = {
                NRO: `${idx + 1}`,
                USUARIO: `${expense.userDetails?.fullName || "Usuario desconocido"} ${expense.userDetails?.role === 'admin' ? "(Administrador)" : ""}`,
                "NOMBRE PROVEEDOR": provider?.fullName || "Proveedor desconocido",
                "TELEFONO": provider?.phoneNumber || "N/A",
                "CORREO ELECTRONICO": provider?.email || "N/A",
                "DIRECCION": provider?.address || "N/A",
                "NIT": provider?.NIT || "N/A",
                "FECHA DEL PAGO": formatDateTime(expense.date, "numeric", "2-digit", "2-digit", false, true),
                "TIPO DE GASTO O EGRESO": expen?.accountEntry.name || "N/A",
                "IMPORTE DEL PAGO": expense.amount || "N/A",
                "MEDIO DE PAGO": expense.paymentMethodCurrentAccount ? "CTA. CTE." : "EFECTIVO",
                "FAC/REC/SIN DOC": expen?.hasInVoice ? "FACTURA" : expen?.hasReceipt ? "RECIBO" : "SIN DOCUMENTO",
                "NRO. DOCUMENTO": expen?.documentNumber || "Sin número"
            };

            dataWithClientNames.push(typeDataToExport)
        }

        return dataWithClientNames;
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="p-8 flex flex-col gap-2">
            <div className="flex flex-col sm:flex-row mb-4">
                <div className="flex-1">
                    <div className="FiltroClientes-Fechastitulo mb-2">
                        <span className="text-blue_custom font-semibold">Fechas</span>
                    </div>
                    <div className="flex gap-3 flex-wrap">
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
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.3 }}
                className="w-full sm:w-1/2 flex flex-col gap-2"
            >
                <label>Proveedor o beneficiario</label>
                <select {...register("provider")} className="p-2 py-2.5 rounded-md font-pricedown focus:outline-4 bg-main-background outline outline-2 outline-black">
                    <option value="">Seleccione un proveedor</option>
                    {
                        providers.map((row, index) => (
                            <option value={row._id} key={index}>
                                {row.fullName || "Sin nombre"}
                            </option>
                        ))
                    }
                </select>
            </motion.div>


            <div className="flex flex-col mb-4">
                <div className="FiltroClientes-RenovaciónTitulo mb-2">
                    <span className="text-blue_custom font-semibold">Pagos</span>
                </div>

                <div className="flex flex-wrap gap-4">
                    <div className="flex gap-3 items-center">
                        <input
                            className="input-check accent-blue_custom"
                            type="checkbox"
                            id="check20"
                            checked={watch('cash')}
                            onChange={() => {
                                const credit = watch("cash")
                                setValue("cash", !credit);
                                setValue("currentAccount", false);
                                setValue("contado", false);
                            }}
                        />
                        <label htmlFor="check20" className="text-sm" >
                            Efectivo
                        </label>
                    </div>
                    <div className="flex gap-3 items-center">
                        <input
                            className="input-check accent-blue_custom"
                            type="checkbox"
                            id="check19"
                            checked={watch('currentAccount')}
                            onChange={() => {
                                const credit = watch("currentAccount")
                                setValue("currentAccount", !credit);
                                setValue("contado", false);
                                setValue("cash", false);
                            }}
                        />
                        <label htmlFor="check19" className="text-sm" >
                            Cta. Cte.
                        </label>
                    </div>
                </div>
            </div>

            <div className="flex flex-col mb-4">
                <div className="FiltroClientes-RenovaciónTitulo mb-2">
                    <span className="text-blue_custom font-semibold">Cuentas por pagar</span>
                </div>

                <div className="flex flex-wrap gap-4">
                    <div className="flex gap-3 items-center">
                        <input
                            className="input-check accent-blue_custom"
                            type="checkbox"
                            id="check5"
                            checked={watch('withBalance')}
                            onChange={() => {
                                const credit = watch("withBalance")
                                setValue("withBalance", !credit);
                                setValue("withoutBalance", false);
                            }}
                        />
                        <img src="/Moneda-icon-blue.svg" alt="" />
                        <label htmlFor="check5" className="text-sm" >
                            Con saldos
                        </label>
                    </div>
                    <div className="flex gap-3 items-center">
                        <input
                            className="input-check accent-blue_custom"
                            type="checkbox"
                            id="check6"
                            checked={watch('withoutBalance')}
                            onChange={() => {
                                const credit = watch("withoutBalance")
                                setValue("withoutBalance", !credit);
                                setValue("withBalance", false);
                            }}
                        />
                        <img src="/nosaldo.svg" alt="" />
                        <label htmlFor="check6" className="text-sm" >
                            Sin saldos
                        </label>
                    </div>
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
                        setpagos(false)
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
    )
}

export default FiltroPagoProveedores