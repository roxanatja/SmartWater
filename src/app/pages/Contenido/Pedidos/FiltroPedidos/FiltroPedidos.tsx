import { FC, useContext, useEffect } from "react";
import "./FiltroPedidos.css";
import { PedidosContext } from "../PedidosContext";
import { Zone } from "../../../../../type/City";
import { IOrdersGetParams } from "../../../../../api/types/orders";
import { useForm } from "react-hook-form";
import { User } from "../../../../../type/User";

interface IOrderFilters {
    fromDate: string | null;
    toDate: string | null;
    attendedDate: string | null;
    fromDateDeliver: string | null;
    toDateDeliver: string | null;

    distrib: { [key: string]: string };
    zones: { [key: string]: string };
}

const initialState: IOrderFilters = {
    fromDate: null,
    toDate: null,
    fromDateDeliver: null,
    attendedDate: null,
    toDateDeliver: null,
    zones: {},
    distrib: {},
}

const FiltroPedidos: FC<{
    isAttended: boolean;
    distribuidores: User[];
    zones: Zone[];
    onChange: (filters: IOrdersGetParams['filters']) => void;
    initialFilters: IOrdersGetParams['filters'];
}> = ({ isAttended, initialFilters, onChange, zones, distribuidores }) => {
    const { register, handleSubmit, setValue, watch } = useForm<IOrderFilters>({
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
            if (initialFilters.deliverDateInit) {
                setValue('fromDateDeliver', initialFilters.deliverDateInit, { shouldValidate: true })
            }
            if (initialFilters.deliverDateEnd) {
                setValue('toDateDeliver', initialFilters.deliverDateEnd, { shouldValidate: true })
            }
            if (initialFilters.attendedDate) {
                setValue('attendedDate', initialFilters.attendedDate, { shouldValidate: true })
            }
            if (initialFilters.zone) {
                initialFilters.zone.split(",").forEach((z) => {
                    setValue(`zones.${z}`, z, { shouldValidate: true })
                })
            }
            if (initialFilters.distributorRedirectId) {
                initialFilters.distributorRedirectId.split(",").forEach((z) => {
                    setValue(`distrib.${z}`, z, { shouldValidate: true })
                })
            }
        }
    }, [initialFilters, setValue])

    const { setShowFiltro } = useContext(PedidosContext);

    const onSubmit = (data: IOrderFilters) => {
        const filters = filterClients(data);
        onChange(filters);
        setShowFiltro(false);
    };

    const filterClients = (filters: IOrderFilters): IOrdersGetParams['filters'] => {
        const result: IOrdersGetParams['filters'] = {}

        if (filters.fromDate) { result.initialDate = filters.fromDate.toString() }
        if (filters.toDate) { result.finalDate = filters.toDate.toString() }
        if (filters.fromDateDeliver) { result.deliverDateInit = filters.fromDateDeliver.toString() }
        if (filters.toDateDeliver) { result.deliverDateEnd = filters.toDateDeliver.toString() }
        if (filters.attendedDate) { result.attendedDate = filters.attendedDate.toString() }

        if (filters.zones) {
            const zones = Object.values(filters.zones).filter(z => !!z).join(',')
            if (zones !== "") { result.zone = zones }
        }
        if (filters.distrib) {
            const dists = Object.values(filters.distrib).filter(z => !!z).join(',')
            if (dists !== "") { result.distributorRedirectId = dists }
        }

        return result
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="p-8 flex flex-col gap-8">
                <div className="flex flex-col sm:flex-row mb-4">
                    <div className="flex-1">
                        <div className="FiltroClientes-Fechastitulo mb-2">
                            <span className="text-blue_custom font-semibold">Fechas</span>
                        </div>
                        <div className="flex gap-3 flex-wrap">
                            <div className="shadow-xl rounded-3xl px-4 py-2 border-gray-100 border flex-1">
                                <span className="text-left text-sm">De</span>
                                <input
                                    max={watch('toDate')?.toString() || new Date().toISOString().split("T")[0]}
                                    type="date"
                                    {...register("fromDate")}
                                    className="border-0 rounded outline-none font-semibold w-full bg-transparent"
                                />
                            </div>
                            <div className="shadow-xl rounded-3xl px-4 py-2 border-gray-100 border flex-1">
                                <span className="text-left text-sm">A</span>
                                <input
                                    min={watch('fromDate')?.toString()}
                                    max={new Date().toISOString().split("T")[0]}
                                    type="date"
                                    {...register("toDate")}
                                    className="border-0  rounded outline-none font-semibold w-full bg-transparent"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                {
                    !isAttended &&
                    <div className="flex flex-col sm:flex-row mb-4">
                        <div className="flex-1">
                            <div className="FiltroClientes-Fechastitulo mb-2">
                                <span className="text-blue_custom font-semibold">Fecha de entrega</span>
                            </div>
                            <div className="flex gap-3 flex-wrap">
                                <div className="shadow-xl rounded-3xl px-4 py-2 border-gray-100 border flex-1">
                                    <span className="text-left text-sm">De</span>
                                    <input
                                        max={watch('toDateDeliver')?.toString()}
                                        type="date"
                                        {...register("fromDateDeliver")}
                                        className="border-0 rounded outline-none font-semibold w-full bg-transparent"
                                    />
                                </div>
                                <div className="shadow-xl rounded-3xl px-4 py-2 border-gray-100 border flex-1">
                                    <span className="text-left text-sm">A</span>
                                    <input
                                        min={watch('fromDateDeliver')?.toString()}
                                        type="date"
                                        {...register("toDateDeliver")}
                                        className="border-0  rounded outline-none font-semibold w-full bg-transparent"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                }
                {
                    isAttended &&
                    <div className="flex flex-col sm:flex-row mb-4">
                        <div className="flex-1">
                            <div className="FiltroClientes-Fechastitulo mb-2">
                                <span className="text-blue_custom font-semibold">Fecha de atención</span>
                            </div>
                            <div className="flex gap-3 flex-wrap">
                                <div className="shadow-xl rounded-3xl px-4 py-2 border-gray-100 border flex-1">
                                    <span className="text-left text-sm">De</span>
                                    <input
                                        max={new Date().toISOString().split("T")[0]}
                                        type="date"
                                        {...register("attendedDate")}
                                        className="border-0 rounded outline-none font-semibold w-full bg-transparent"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                }

                <div className="w-full flex flex-col gap-2 mb-8">
                    <label className="font-semibold text-blue_custom">Zonas</label>
                    <div className="flex flex-wrap gap-x-6 gap-y-4">
                        {zones.map((zone, index) => (
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
                                    {...register(`distrib.${dists._id}`)}
                                    value={dists._id}
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
        </>
    );
}

export { FiltroPedidos }