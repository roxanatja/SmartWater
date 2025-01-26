import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import moment from "moment";
import { CuentasPorCobrarContext } from "../CuentasPorCobrarContext";
import { Zone } from "../../../../../../type/City";
import { User } from "../../../../../../type/User";
import { IBillsGetParams } from "../../../../../../api/types/bills";

interface IBillsFilters {
    cash: boolean;
    contado: boolean;
    currentAccount: boolean;
    withBalance: boolean;
    withoutBalance: boolean;
    fromDate: string | null;
    toDate: string | null;
    zones: Record<string, string>;
    distributor: Record<string, string>;
}

const initialState: IBillsFilters = {
    cash: false,
    contado: false,
    currentAccount: false,
    withBalance: false,
    withoutBalance: false,
    fromDate: null,
    toDate: null,
    zones: {},
    distributor: {}
}

const FiltroCobros = ({
    onChange,
    initialFilters,
    zones,
    distribuidores
}: {
    zones: Zone[];
    distribuidores: User[];
    onChange: (filters: IBillsGetParams['filters']) => void;
    initialFilters: IBillsGetParams['filters'];
}) => {
    const { register, handleSubmit, setValue, watch } = useForm<IBillsFilters>({
        defaultValues: initialState || {},
    });

    const [selectedDists, setSelectedDists] = useState<User[]>([])

    useEffect(() => {
        if (initialFilters) {
            if (initialFilters.hasOwnProperty('hasBalance')) {
                setValue('withBalance', !!initialFilters.hasBalance, { shouldValidate: true })
                setValue('withoutBalance', !initialFilters.hasBalance, { shouldValidate: true })
            }

            if (initialFilters.hasOwnProperty('paymentMethodCurrentAccount') && initialFilters.hasOwnProperty('cashPayment')) {
                const cash = initialFilters.cashPayment
                const cta = initialFilters.paymentMethodCurrentAccount

                let is: "contado" | 'cta' | 'cash' | 'none' = 'none'

                if (!cash && !cta) { is = 'contado' }
                else if (!!cash && !cta) { is = 'cash' }
                else if (!cash && !!cta) { is = 'cta' }
                else { is = 'none' }

                setValue('contado', is === 'contado', { shouldValidate: true })
                setValue('currentAccount', is === 'cta', { shouldValidate: true })
                setValue('cash', is === 'cash', { shouldValidate: true })
            }

            if (initialFilters.initialDate) {
                setValue('fromDate', initialFilters.initialDate, { shouldValidate: true })
            }
            if (initialFilters.finalDate) {
                setValue('toDate', initialFilters.finalDate, { shouldValidate: true })
            }
            if (initialFilters.zone) {
                initialFilters.zone.split(",").forEach((z) => {
                    setValue(`zones.${z}`, z, { shouldValidate: true })
                })
            }
            if (initialFilters.user) {
                setSelectedDists(distribuidores.filter(d => initialFilters.user!.includes(d._id)))
            }
        }
    }, [initialFilters, setValue, distribuidores])

    const { setShowFiltro } = useContext(CuentasPorCobrarContext);

    const onSubmit = (data: IBillsFilters) => {
        const filters = filterClients(data);
        onChange(filters);
        setShowFiltro(false);
    };

    const filterClients = (filters: IBillsFilters): IBillsGetParams['filters'] => {
        const result: IBillsGetParams['filters'] = {}

        if (filters.fromDate) { result.initialDate = filters.fromDate.toString() }
        if (filters.toDate) { result.finalDate = filters.toDate.toString() }

        if (filters.zones) {
            const zones = Object.values(filters.zones).filter(z => !!z).join(',')
            if (zones !== "") { result.zone = zones }
        }

        if (filters.cash) { result.paymentMethodCurrentAccount = false; result.cashPayment = true }
        if (filters.currentAccount) { result.paymentMethodCurrentAccount = true; result.cashPayment = false }
        if (filters.contado) { result.paymentMethodCurrentAccount = false; result.cashPayment = false }

        if (!((!!filters.withBalance && !!filters.withoutBalance) || (!filters.withBalance && !filters.withoutBalance))) {
            result.hasBalance = filters.withBalance
        }

        if (selectedDists.length > 0) {
            const dists = selectedDists.map(z => z._id).join(',')
            if (dists !== "") { result.user = dists }
        }

        return result
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

            <div className="flex flex-col mb-4">
                <div className="FiltroClientes-RenovaciónTitulo mb-2">
                    <span className="text-blue_custom font-semibold">Cobros</span>
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
                    <span className="text-blue_custom font-semibold">Cuentas por cobrar</span>
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

            <div className="w-full flex flex-col gap-2 mb-8">
                <label className="font-semibold text-blue_custom">Distribuidores</label>
                <div className="flex flex-wrap gap-x-6 gap-y-4">
                    {distribuidores.map((dists, index) => (
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
                        setShowFiltro(false);
                        onChange({});
                    }}
                    className="mt-4 border-blue-500 border-2 rounded-full px-4 py-2.5 shadow-xl text-blue-500 font-bold w-full"
                >
                    Quitar Filtros
                </button>
                <button
                    type="submit"
                    className="mt-4 bg-blue-500 border-2 border-blue-500 shadow-xl text-white rounded-full px-4 py-2.5 w-full font-bold"
                >
                    Aplicar Filtros
                </button>
            </div>
        </form >
    );
};

export default FiltroCobros;
