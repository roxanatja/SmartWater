import { useContext, useEffect, useState } from "react";
import "./FiltroCuentasPorPagar.css";
import { CuentasPorPagarContext } from "../CuentasPorPagarContext";
import { Zone } from "../../../../../../type/City";
import { User } from "../../../../../../type/User";
import { IExpensesGetParams } from "../../../../../../api/types/expenses";
import { useForm } from "react-hook-form";
import moment from "moment";
import { motion } from "framer-motion";
import { Providers } from "../../../../../../type/providers";

interface IExpenseFilters {
    toDate: string | null;
    zones: Record<string, string>;
    distributor: Record<string, string>;
    provider: string | null;
}

const initialState: IExpenseFilters = {
    toDate: null,
    zones: {},
    distributor: {},
    provider: null
}
const FiltroCuentasPorPagar = ({
    onChange,
    initialFilters,
    zones,
    distribuidores,
    providers,
    isPayment
}: {
    providers: Providers[];
    zones: Zone[];
    distribuidores: User[];
    onChange: (filters: IExpensesGetParams['filters']) => void;
    initialFilters: IExpensesGetParams['filters'];
    isPayment?: boolean;
}) => {
    const { register, handleSubmit, setValue } = useForm<IExpenseFilters>({
        defaultValues: initialState || {},
    });

    const [selectedDists, setSelectedDists] = useState<User[]>([])

    useEffect(() => {
        if (initialFilters) {
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
            if (initialFilters.provider) {
                setValue(`provider`, initialFilters.provider, { shouldValidate: true })
            }
        }
    }, [initialFilters, setValue, distribuidores])

    const { setShowFiltro } = useContext(CuentasPorPagarContext);

    const onSubmit = (data: IExpenseFilters) => {
        const filters = filterClients(data);
        onChange(filters);
        setShowFiltro(false);
    };

    const filterClients = (filters: IExpenseFilters): IExpensesGetParams['filters'] => {
        const result: IExpensesGetParams['filters'] = {}

        if (filters.provider) { result.provider = filters.provider }
        if (filters.toDate) { result.finalDate = filters.toDate.toString() }

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

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="p-8 flex flex-col gap-2">
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

            {
                !isPayment &&
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: 0.3 }}
                        className="w-full sm:w-1/2 flex flex-col gap-2 my-4"
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
                </>
            }

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
}

export { FiltroCuentasPorPagar }