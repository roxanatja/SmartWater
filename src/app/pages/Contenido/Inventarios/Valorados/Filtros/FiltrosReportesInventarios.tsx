import { useForm } from "react-hook-form";
import { useContext, useEffect } from "react";
import moment from "moment";
import { motion } from "framer-motion";
import { InventariosValoradosContext } from "../InventariosValoradosProvider";
import Input from "../../../../EntryComponents/Inputs";

export interface IInitialBalancesFilters {
    toDate: string | null;
    type: string | null
}

const initialState: IInitialBalancesFilters = {
    toDate: null,
    type: null
}

const FiltrosReportesInventarios = ({
    onChange,
    initialFilters
}: {
    onChange: (filters: IInitialBalancesFilters) => void;
    initialFilters: any;
}) => {
    const { register, handleSubmit, setValue, formState: { isValid }, reset } = useForm<IInitialBalancesFilters>({
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

    const { setShowFiltro } = useContext(InventariosValoradosContext);

    const onSubmit = (data: IInitialBalancesFilters) => {
        onChange(data);
        setShowFiltro(false);
        reset()
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="px-3 py-1 flex gap-8 flex-col sm:flex-row items-center mb-6">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.3 }}
                className="w-full sm:w-1/3 flex flex-col gap-2"
            >
                <select {...register("type", {
                    required: "Seleccione un tipo"
                })} className="p-2 py-2.5 rounded-md font-pricedown focus:outline-4 bg-main-background outline outline-2 outline-black">
                    <option value="">Seleccione un tipo</option>
                    <option value="entry">Entradas físico valorado</option>
                    <option value="output">Salidas físico valorado</option>
                    <option value="balance">Saldos físicos valorados</option>
                </select>
            </motion.div>

            <Input
                required
                max={moment().format("YYYY-MM-DD")}
                type="date"
                label="Fecha de apertura"
                isVisibleLable
                containerClassName="flex-1"
                iconContainerClassName="!border-0 !ps-1"
                name="toDate"
                register={register}
                className="full-selector bg-transparent w-full h-[45px]"
                icon={<img src="/desde.svg" alt="" className="w-[20px] h-[20px] absolute bottom-3 left-4 invert-0 dark:invert" />}
            />


            <button
                type="submit"
                disabled={!isValid}
                className="bg-blue-500 shadow-xl text-white rounded-full px-4 py-2.5 w-full font-bold flex-1 disabled:bg-gray-400"
            >
                Generar
            </button>
        </form >
    )
}

export default FiltrosReportesInventarios