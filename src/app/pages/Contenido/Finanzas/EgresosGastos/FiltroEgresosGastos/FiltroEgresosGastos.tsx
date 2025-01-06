import { useContext, useEffect } from "react";
import "./FiltroEgresosGastos.css";
import { EgresosGastosContext } from "../EgresosGastosContext";
import { Providers } from "../../../../../../type/providers";
import { Account } from "../../../../../../type/AccountEntry";
import { IExpensesGetParams } from "../../../../../../api/types/expenses";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import Input from "../../../../EntryComponents/Inputs";

interface IExpenseFilter {
    credit: boolean;
    currentAccount: boolean;

    withInvoice: boolean;
    withoutInvoice: boolean;

    provider: string | null;
    accountEntry: string | null;

    date: string | null;
}

const initialState: IExpenseFilter = {
    credit: false,
    currentAccount: false,
    withInvoice: false,
    withoutInvoice: false,
    accountEntry: null,
    provider: null,
    date: null
}

const FiltroEgresosGastos = ({
    onChange,
    initialFilters,
    accounts, providers
}: {
    providers: Providers[];
    accounts: Account[];
    onChange: (filters: IExpensesGetParams['filters']) => void;
    initialFilters: IExpensesGetParams['filters'];
}) => {
    const { register, handleSubmit, setValue } = useForm<IExpenseFilter>({
        defaultValues: initialState || {},
    });

    useEffect(() => {
        if (initialFilters) {
            if (initialFilters.hasOwnProperty('creditBuy')) {
                setValue('credit', !!initialFilters.creditBuy, { shouldValidate: true })
            }
            if (initialFilters.hasOwnProperty('paymentMethodCurrentAccount')) {
                setValue('currentAccount', !!initialFilters.paymentMethodCurrentAccount, { shouldValidate: true })
            }

            if (initialFilters.hasOwnProperty('hasInVoice')) {
                setValue('withInvoice', !!initialFilters.hasInVoice, { shouldValidate: true })
                setValue('withoutInvoice', !initialFilters.hasInVoice, { shouldValidate: true })
            }

            if (initialFilters.provider) {
                setValue('provider', initialFilters.provider, { shouldValidate: true })
            } else {
                setValue('provider', "", { shouldValidate: true })
            }

            if (initialFilters.accountEntry) {
                setValue('accountEntry', initialFilters.accountEntry, { shouldValidate: true })
            } else {
                setValue('accountEntry', "", { shouldValidate: true })
            }

            if (initialFilters.year && initialFilters.month) {
                setValue('date', `${initialFilters.year}-${String(initialFilters.month).padStart(2, "0")}`, { shouldValidate: true })
            }
        }
    }, [initialFilters, setValue])

    const { setShowFiltro } = useContext(EgresosGastosContext);

    const onSubmit = (data: IExpenseFilter) => {
        const filters = filterClients(data);
        onChange(filters);
        setShowFiltro(false);
    };

    const filterClients = (filters: IExpenseFilter): IExpensesGetParams['filters'] => {
        const result: IExpensesGetParams['filters'] = {}

        if (filters.provider && filters.provider !== "") { result.provider = filters.provider }
        if (filters.accountEntry && filters.accountEntry !== "") { result.accountEntry = filters.accountEntry }

        if (!((!!filters.credit && !!filters.currentAccount) || (!filters.credit && !filters.currentAccount))) {
            result.creditBuy = filters.credit
            result.paymentMethodCurrentAccount = filters.currentAccount
        }

        if (!((!!filters.withInvoice && !!filters.withoutInvoice) || (!filters.withInvoice && !filters.withoutInvoice))) {
            result.hasInVoice = filters.withInvoice
        }

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
                        />
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row mb-4 gap-8">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: 0.3 }}
                        className="w-full flex flex-col gap-2"
                    >
                        <label>Proveedor</label>
                        <select
                            {...register("provider")}
                            className="p-2 py-2.5 rounded-md font-pricedown focus:outline-4 bg-main-background outline outline-2 outline-black"
                        >
                            <option value="">
                                Sin selección
                            </option>
                            {
                                providers.map(p => <option key={p._id} value={p._id}>{p.fullName}</option>)
                            }
                        </select>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: 0.3 }}
                        className="w-full flex flex-col gap-2"
                    >
                        <label>Cuenta contable</label>
                        <select
                            {...register("accountEntry")}
                            className="p-2 py-2.5 rounded-md font-pricedown focus:outline-4 bg-main-background outline outline-2 outline-black"
                        >
                            <option value="">
                                Sin selección
                            </option>
                            {
                                accounts.map(p => <option key={p._id} value={p._id}>{p.name}</option>)
                            }
                        </select>
                    </motion.div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                    {/* Credit */}
                    <div className="">
                        <div className="FiltroClientes-RenovaciónTitulo mb-2">
                            <span className="text-blue_custom font-semibold">Medio de pago</span>
                        </div>
                        <div className="FiltroClientes-Cuentas flex flex-col">
                            <div className="flex flex-col gap-3 w-full">
                                <div className="flex flex-col w-full gap-2">
                                    <div className="flex gap-3 items-center">
                                        <input
                                            className="input-check accent-blue_custom"
                                            type="checkbox"
                                            id="check3"
                                            {...register("credit")}
                                        />
                                        <label htmlFor="check3" className="text-sm" >
                                            A crédito
                                        </label>
                                    </div>
                                    <div className="flex gap-3 items-center">
                                        <input
                                            className="input-check accent-blue_custom"
                                            type="checkbox"
                                            id="check4"
                                            {...register("currentAccount")}
                                        />
                                        <label htmlFor="check4" className="text-sm" >
                                            Cuenta corriente
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Factura */}
                    <div className="">
                        <div className="FiltroClientes-RenovaciónTitulo mb-2">
                            <span className="text-blue_custom font-semibold">Factura</span>
                        </div>
                        <div className="FiltroClientes-Cuentas flex flex-col">
                            <div className="flex flex-col gap-3 w-full">
                                <div className="flex flex-col w-full gap-2">
                                    <div className="flex gap-3 items-center">
                                        <input
                                            className="input-check accent-blue_custom"
                                            type="checkbox"
                                            id="check5"
                                            {...register("withInvoice")}
                                        />
                                        <label htmlFor="check5" className="text-sm" >
                                            Con factura
                                        </label>
                                    </div>
                                    <div className="flex gap-3 items-center">
                                        <input
                                            className="input-check accent-blue_custom"
                                            type="checkbox"
                                            id="check6"
                                            {...register("withoutInvoice")}
                                        />
                                        <label htmlFor="check6" className="text-sm" >
                                            Sin factura
                                        </label>
                                    </div>
                                </div>
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
        </>
    );
}

export { FiltroEgresosGastos }