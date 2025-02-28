import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import moment from "moment";
import { Zone } from "../../../../../../../type/City";
import { User } from "../../../../../../../type/User";
import { ISalesGetParams } from "../../../../../../../api/types/sales";
import { CuentasPorCobrarContext } from "../../CuentasPorCobrarContext";

interface ISaleFilters {
    withInvoice: boolean;
    withoutInvoice: boolean;
    fromDate: string | null;
    toDate: string | null;
    zones: Record<string, string>;
    distributor: Record<string, string>;
}

const initialState: ISaleFilters = {
    withInvoice: false,
    withoutInvoice: false,
    fromDate: null,
    toDate: null,
    zones: {},
    distributor: {}
}

const FiltroHistorialCuentasPorCobrar = ({
    onChange,
    initialFilters,
    zones,
    distribuidores
}: {
    zones: Zone[];
    distribuidores: User[];
    onChange: (filters: ISalesGetParams['filters']) => void;
    initialFilters: ISalesGetParams['filters'];
}) => {
    const { register, handleSubmit, setValue, watch } = useForm<ISaleFilters>({
        defaultValues: initialState || {},
    });

    const [selectedDists, setSelectedDists] = useState<User[]>([])

    useEffect(() => {
        if (initialFilters) {
            if (initialFilters.hasOwnProperty('hasInvoice')) {
                setValue('withInvoice', !!initialFilters.hasInvoice, { shouldValidate: true })
                setValue('withoutInvoice', !initialFilters.hasInvoice, { shouldValidate: true })
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

    const onSubmit = (data: ISaleFilters) => {
        const filters = filterClients(data);
        onChange(filters);
        setShowFiltro(false);
    };

    const filterClients = (filters: ISaleFilters): ISalesGetParams['filters'] => {
        const result: ISalesGetParams['filters'] = {}

        if (filters.fromDate) { result.initialDate = filters.fromDate.toString() }
        if (filters.toDate) { result.finalDate = filters.toDate.toString() }

        if (filters.zones) {
            const zones = Object.values(filters.zones).filter(z => !!z).join(',')
            if (zones !== "") { result.zone = zones }
        }

        if (!((!!filters.withInvoice && !!filters.withoutInvoice) || (!filters.withInvoice && !filters.withoutInvoice))) {
            result.hasInvoice = filters.withInvoice
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

export default FiltroHistorialCuentasPorCobrar;
