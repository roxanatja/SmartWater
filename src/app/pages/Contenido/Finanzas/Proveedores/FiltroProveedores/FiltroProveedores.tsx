import { useContext, useEffect } from "react";
import "./FiltroProveedores.css";
import { ProveedoresContext } from "../ProveedoresContext";
import { IProvidersGetParams } from "../../../../../../api/types/providers";
import { useForm } from "react-hook-form";
import moment from "moment";

interface IProviderFilter {
    fromDate: string | null;
    toDate: string | null;
}

const initialState: IProviderFilter = {
    fromDate: null,
    toDate: null,
}

const FiltroProveedores = ({
    onChange,
    initialFilters
}: {
    onChange: (filters: IProvidersGetParams['filters']) => void;
    initialFilters: IProvidersGetParams['filters'];
}) => {
    const { register, handleSubmit, setValue, watch } = useForm<IProviderFilter>({
        defaultValues: initialState || {},
    });

    useEffect(() => {
        if (initialFilters) {
            if (initialFilters.initialDate) {
                setValue('fromDate', initialFilters.initialDate, { shouldValidate: true })
            }
            if (initialFilters.finalDate) {
                setValue('toDate', initialFilters.finalDate, { shouldValidate: true })
            }
        }
    }, [initialFilters, setValue])

    const { setShowFiltro } = useContext(ProveedoresContext);

    const onSubmit = (data: IProviderFilter) => {
        const filters = filterClients(data);
        onChange(filters);
        setShowFiltro(false);
    };

    const filterClients = (filters: IProviderFilter): IProvidersGetParams['filters'] => {
        const result: IProvidersGetParams['filters'] = {}

        if (filters.fromDate) { result.initialDate = filters.fromDate.toString() }
        if (filters.toDate) { result.finalDate = filters.toDate.toString() }

        return result
    };

    return (
        <>
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
            </form>
        </>
    );
}

export { FiltroProveedores }