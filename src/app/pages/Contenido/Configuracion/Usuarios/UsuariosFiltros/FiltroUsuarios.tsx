import { useContext, useEffect } from "react";
import "./FiltroEgresosGastos.css";
import { useForm } from "react-hook-form";
import Input from "../../../../EntryComponents/Inputs";
import { IUsersGetParams } from "../../../../../../api/types/users";
import { UsuariosContext } from "../UsuariosContext";

interface IUserFilter {
    deactivated: boolean;
    date: string | null;
}

const initialState: IUserFilter = {
    deactivated: false,
    date: null
}

const FiltroUsuarios = ({
    onChange,
    initialFilters
}: {
    onChange: (filters: IUsersGetParams['filters']) => void;
    initialFilters: IUsersGetParams['filters'];
}) => {
    const { register, handleSubmit, setValue, watch } = useForm<IUserFilter>({
        defaultValues: initialState || {},
    });

    useEffect(() => {
        if (initialFilters) {
            if (initialFilters.hasOwnProperty('desactivated')) {
                setValue('deactivated', !!initialFilters.desactivated, { shouldValidate: true })
            }

            if (initialFilters.year && initialFilters.month) {
                setValue('date', `${initialFilters.year}-${String(initialFilters.month).padStart(2, "0")}`, { shouldValidate: true })
            }
        }
    }, [initialFilters, setValue])

    const { setShowFiltro } = useContext(UsuariosContext);

    const onSubmit = (data: IUserFilter) => {
        const filters = filterClients(data);
        onChange(filters);
        setShowFiltro(false);
    };

    const filterClients = (filters: IUserFilter): IUsersGetParams['filters'] => {
        const result: IUsersGetParams['filters'] = {}
        if (filters.deactivated) { result.desactivated = filters.deactivated }

        if (filters.date) {
            const splitted = filters.date.split("-")
            result.year = Number(splitted[0])
            result.month = Number(splitted[1])
        }

        return result
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="p-8 flex flex-col gap-8">
                <div className="flex-1">
                    <div className="FiltroClientes-Fechastitulo mb-2">
                        <span className="text-blue_custom font-semibold">Fechas</span>
                    </div>
                    <div className="flex gap-3 flex-wrap">
                        <Input
                            max={`${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`}
                            type="month"
                            label="Mes"
                            lang="es-ES"
                            name="date"
                            register={register}
                            iconContainerClassName="border-none flex items-center justify-center"
                            icon={<img src="/hasta.svg" alt="" className="w-[20px] h-[20px] invert-0 dark:invert" />}
                            className="border-0 rounded outline-none font-semibold w-full bg-transparent text-sm full-selector"
                        />
                    </div>
                </div>

                <div className="w-full flex justify-start items-center gap-2">
                    <span>Estado:</span>
                    <label className="ConfiguracionGeneral-switch-container">
                        <input className="inputSwitch" type="checkbox" checked={!watch('deactivated')} onChange={(e) => {
                            setValue('deactivated', !e.target.checked, { shouldValidate: true })
                        }} />
                        <span className="slider"></span>
                    </label>
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

export { FiltroUsuarios }