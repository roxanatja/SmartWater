import { useForm } from "react-hook-form";
import { useContext, useEffect } from "react";
import moment from "moment";
import { motion } from "framer-motion";
import { InventariosOtrosContext } from "../InventariosOtrosProvider";

interface IInitialBalancesFilters {
    fromDate: string | null;
    toDate: string | null;
    type: string | null
}

const initialState: IInitialBalancesFilters = {
    fromDate: null,
    toDate: null,
    type: null
}

const FiltrosEntradas = ({
    onChange,
    initialFilters
}: {
    onChange: (filters: any) => void;
    initialFilters: any;
}) => {
    const { register, handleSubmit, setValue, watch } = useForm<IInitialBalancesFilters>({
        defaultValues: initialState || {},
    });

    useEffect(() => {
        if (initialFilters) {
            if (initialFilters.finalDate) {
                setValue('toDate', initialFilters.finalDate, { shouldValidate: true })
            }
            if (initialFilters.type) {
                setValue('type', initialFilters.type, { shouldValidate: true })
            }
        }
    }, [initialFilters, setValue])

    const { setShowFiltro } = useContext(InventariosOtrosContext);

    const onSubmit = (data: IInitialBalancesFilters) => {
        const filters = filterClients(data);
        onChange(filters);
        setShowFiltro(false);
    };

    const filterClients = (filters: IInitialBalancesFilters): any => {
        const result: any = {}

        if (filters.toDate) { result.finalDate = filters.toDate.toString() }
        if (filters.type) { result.type = filters.type }

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

            {/* TODO: Change to checkboxes */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.3 }}
                className="w-full flex flex-col gap-2"
            >
                <label>Tipo de salida</label>
                <select {...register("type")} className="p-2 py-2.5 rounded-md font-pricedown focus:outline-4 bg-main-background outline outline-2 outline-black">
                    <option value="">Seleccione un tipo</option>
                    <option value="production">De producción</option>
                    <option value="fixing">Por ajuste</option>
                </select>
            </motion.div>

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
    )
}

export default FiltrosEntradas