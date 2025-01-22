import { FC, useContext } from "react";
import "./CuadroCuentasPorPagar.css";
import { CuentasPorPagarContext } from "../CuentasPorPagarContext";
import { Expense } from "../../../../../../type/Expenses";
import { SubmitHandler, useForm } from "react-hook-form";
import { IInvExpensesBody } from "../../../../../../api/types/invoice-expenses";
import { AuthService } from "../../../../../../api/services/AuthService";
import { UserData } from "../../../../../../type/UserData";
import { InvoiceExpensesApiConector } from "../../../../../../api/classes";
import moment from "moment";
import toast from "react-hot-toast";
import { Providers } from "../../../../../../type/providers";
import { formatDateTime } from "../../../../../../utils/helpers";
import Input from "../../../../EntryComponents/Inputs";

interface Props {
    expense: Expense
}

const CuadroCuentasPorPagar = ({ expense }: Props) => {

    const { setShowMiniModal, setProviderSelected } = useContext(CuentasPorPagarContext)
    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors },
    } = useForm<IInvExpensesBody['data']>({
        defaultValues: {
            cashPayment: true,
            paymentMethodCurrentAccount: false,
        },
        mode: 'all'
    });

    const onSubmit: SubmitHandler<IInvExpensesBody['data']> = async (data) => {
        console.log("Submitting", data)

        const userData: UserData | null = AuthService.getUser();
        const provider = expense.provider

        const response = await InvoiceExpensesApiConector.create({
            data: {
                ...data,
                provider: provider?._id || "",
                user: userData?._id || "",
                amount: data.amount,
                cashPayment: data.cashPayment,
                paymentMethodCurrentAccount: data.paymentMethodCurrentAccount,
                expense: expense._id,
                date: moment().format("YYYY-MM-DD")
            }
        });

        if (response) {
            toast.success("Pago registrado");
            reset();
            window.location.reload();
        } else {
            toast.error("Uppss error al registrar el pago");
        }
    };

    const validateAmount = (value: number) => {
        if (value < 0) {
            return "El monto no puede ser menor que 0";
        }
        if (value > expense.amount) {
            return `El monto no puede exceder el saldo de ${expense.amount} Bs.`;
        }
        return true;
    };

    return (
        <>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="CuadroCuentasPorPagar-container bg-blocks dark:border-blocks">
                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-3">
                        <div className="CuadroVentaCliente-header">
                            <div className="bg-blue_custom text-white px-3.5 py-1.5 rounded-full flex justify-center items-center relative">
                                <div className="opacity-0">.</div>
                                <p className="absolute font-extrabold whitespace-nowrap">
                                    {expense?.provider?.fullName?.[0] || "S"}
                                </p>
                            </div>
                            <span className="whitespace-nowrap">{expense?.provider?.fullName || "N/A"}</span>
                        </div>
                        <div className="flex items-center">
                            <button
                                type="button"
                                className="btn"
                                onClick={() => {
                                    setShowMiniModal(true);
                                    setProviderSelected(expense.provider as unknown as Providers);
                                }}
                            >
                                <img src="/Opciones-icon.svg" alt="" className="invert-0 dark:invert" />
                            </button>
                        </div>
                    </div>
                    <div className="flex justify-between items-start">
                        <div className="CuadroVentaCliente-text">
                            <span>
                                Fecha:{" "}
                                <span className="text-blue_custom">
                                    {formatDateTime(expense.created, 'numeric', '2-digit', '2-digit', true, true) || "N/A"}
                                </span>
                            </span>
                        </div>
                    </div>
                    <div className="flex justify-between items-start">
                        <div className="CuadroVentaCliente-text flex gap-4 items-center">
                            <span className="text-blue_custom font-semibold">
                                Saldo a pagar
                            </span>
                            <div className="moneda-clientes bg-blue_custom text-white gap-4 py-1 px-3 rounded-md flex items-center">
                                <img src="/Moneda-icon.svg" alt="" />
                                <div>
                                    <span className="text-sm">
                                        {expense.amount.toLocaleString()} Bs.
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-start flex-col items-start gap-0 -translate-y-3 w-full">
                    <div className="flex justify-between items-center w-full">
                        <p className="text-sm text-nowrap w-full">Total a cuenta</p>
                        <div className="input-container flex flex-col w-full">
                            <div className="RegistrarVenta-grupo-checbox flex justify-end">
                                <div className="RegistrarVenta-grupo-check">
                                    <input
                                        className="input-check cursor-pointer w-4 h-4 accent-blue_custom"
                                        type="checkbox"
                                        id={`checkbox1_${expense._id}`}
                                        checked={watch("cashPayment")}
                                        onChange={() => {
                                            setValue("cashPayment", !watch("cashPayment"));
                                            setValue("paymentMethodCurrentAccount", false);
                                        }}
                                    />
                                    <label
                                        htmlFor={`checkbox1_${expense._id}`}
                                        className="text-font-color cursor-pointer text-md"
                                    >
                                        Efectivo
                                    </label>
                                </div>
                                <div className="RegistrarVenta-grupo-check">
                                    <input
                                        className="input-check cursor-pointer w-4 h-4 accent-blue_custom"
                                        type="checkbox"
                                        id={`checkbox2_${expense._id}`}
                                        checked={watch("paymentMethodCurrentAccount")}
                                        onChange={() => {
                                            setValue(
                                                "paymentMethodCurrentAccount",
                                                !watch("paymentMethodCurrentAccount")
                                            );
                                            setValue("cashPayment", false);
                                        }}
                                    />
                                    <label
                                        htmlFor={`checkbox2_${expense._id}`}
                                        className="text-font-color cursor-pointer text-md"
                                    >
                                        Cta. Cte
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Input
                        label="Pago a cuenta"
                        isVisibleLable
                        register={register}
                        validateAmount={validateAmount}
                        name="amount"
                        type="number"
                        placeholder="Monto a cobrar"
                        min="0"
                        max={expense.amount}
                        step="1"
                        className="no-spinner"
                        errors={errors.amount}
                        button={<span className="text-lg">Bs</span>}
                    />
                </div>
                <div className="flex justify-center items-center w-full">
                    <button
                        disabled={!watch('amount') || watch('amount') <= 0 || watch('amount') > expense.amount || (!watch('cashPayment') && !watch('paymentMethodCurrentAccount'))}
                        type="submit"
                        className="btn CuadroCuentasPorCobrar-btn -translate-y-2 disabled:border-none disabled:bg-gray-400"
                    >
                        <span>Registrar Pago</span>
                    </button>
                </div>
            </form>
        </>
    )
}

export { CuadroCuentasPorPagar }