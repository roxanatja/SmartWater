import { useContext } from "react";
import "./CuadroCuentasPorCobrar.css";
import { CuentasPorCobrarContext } from "../CuentasPorCobrarContext";
import { Sale } from "../../../../../../type/Sale/Sale";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { UserData } from "../../../../../../type/UserData";
import { Client } from "../../../../../../type/Cliente/Client";
import { IBillsBody } from "../../../../../../api/types/bills";
import { AuthService } from "../../../../../../api/services/AuthService";
import { BillsApiConector } from "../../../../../../api/classes";
import Input from "../../../../EntryComponents/Inputs";
import { formatDateTime } from "../../../../../../utils/helpers";

const CuadroCuentasPorCobrar = ({
  sale,
  onSendBill,
}: {
  sale: Sale;
  onSendBill: () => void;
}) => {
  const { setShowMiniModal, setClientSelect } = useContext(
    CuentasPorCobrarContext
  );
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<IBillsBody['data']>({
    defaultValues: {
      cashPayment: true,
      paymentMethodCurrentAccount: false,
    },
    mode: 'all'
  });

  const onSubmit: SubmitHandler<IBillsBody['data']> = async (data) => {
    const userData: UserData | null = AuthService.getUser();
    const client = sale.client

    const response = await BillsApiConector.create({
      data: {
        ...data,
        client: client?._id || "",
        user: userData?._id || "",
        zone: client?.zone || "",
        amount: data.amount,
        cashPayment: data.cashPayment,
        paymentMethodCurrentAccount: data.paymentMethodCurrentAccount,
        sale: sale._id
      }
    });

    if (response) {
      toast.success("Cobro registrado");
      reset();
      window.location.reload();
    } else {
      toast.error("Uppss error al registrar el Cobro");
    }
  };

  const validateAmount = (value: number) => {
    if (value < 0) {
      return "El monto no puede ser menor que 0";
    }
    if (value > sale.total) {
      return `El monto no puede exceder el saldo de ${sale.total} Bs.`;
    }
    return true;
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="CuadroCuentasPorCobrar-container bg-blocks dark:border-blocks"
      >
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <div className="CuadroVentaCliente-header">
              {sale?.client?.clientImage ? (
                <img
                  src={sale?.client?.clientImage}
                  alt=""
                  className="infoClientes-imgStore"
                />
              ) : (
                <div className="bg-blue_custom text-white px-3.5 py-1.5 rounded-full flex justify-center items-center relative">
                  <div className="opacity-0">.</div>
                  <p className="absolute font-extrabold whitespace-nowrap">
                    {sale?.client?.fullName?.[0] || "S"}
                  </p>
                </div>
              )}
              <span>{sale?.client?.fullName || "N/A"} {sale?.client?.deactivated && "- Cliente Eliminado"}</span>
            </div>
            <div className="flex items-center">
              <button
                type="button"
                className="btn"
                onClick={() => {
                  setShowMiniModal(true);
                  setClientSelect(sale.client as unknown as Client);
                }}
              >
                <img src="/Opciones-icon.svg" alt="" className="invert-0 dark:invert" />
              </button>
            </div>
            <div className="CuadroCuentasPorCobrar-header text-blue_custom text-end">
              <span>{!!sale?.client?.hasLoan ? "Prestamos activos" : "Sin prestamos activos"}</span>
            </div>
          </div>
          <div className="flex justify-between items-start">
            <div className="CuadroVentaCliente-text">
              <span>
                No. Cliente:{" "}
                <span className="text-blue_custom">
                  {sale?.client?.code || "N/A"}
                </span>
              </span>
            </div>
            <div className="moneda-clientes bg-blue_custom text-white gap-4 py-1 px-3 rounded-md flex items-center">
              <img src="/Moneda-icon.svg" alt="" />
              <div>
                <span className="text-sm">
                  {sale.total.toLocaleString()} Bs.
                </span>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-start -mt-4">
            <div className="CuadroVentaCliente-text">
              <span>
                Fecha:{" "}
                <span className="text-blue_custom">
                  {formatDateTime(sale.created, 'numeric', '2-digit', '2-digit', true, true) || "N/A"}
                </span>
              </span>
            </div>
          </div>
        </div>
        <div className="flex justify-start flex-col items-start gap-0 -translate-y-3 w-full">
          <div className="flex justify-between items-center w-full">
            <p className="text-sm text-nowrap w-full">Total a Cobrar</p>
            <div className="input-container flex flex-col w-full">
              <div className="RegistrarVenta-grupo-checbox flex justify-end">
                <div className="RegistrarVenta-grupo-check">
                  <input
                    className="input-check cursor-pointer w-4 h-4 accent-blue_custom"
                    type="checkbox"
                    id={`checkbox1_${sale._id}`}
                    checked={watch("cashPayment")}
                    onChange={() => {
                      setValue("cashPayment", !watch("cashPayment"));
                      setValue("paymentMethodCurrentAccount", false);
                    }}
                  />
                  <label
                    htmlFor={`checkbox1_${sale._id}`}
                    className="text-font-color cursor-pointer text-md"
                  >
                    Efectivo
                  </label>
                </div>
                <div className="RegistrarVenta-grupo-check">
                  <input
                    className="input-check cursor-pointer w-4 h-4 accent-blue_custom"
                    type="checkbox"
                    id={`checkbox2_${sale._id}`}
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
                    htmlFor={`checkbox2_${sale._id}`}
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
            max={sale.total}
            step="1"
            className="no-spinner"
            errors={errors.amount}
            button={<span className="text-lg">Bs</span>}
          />
        </div>
        <div className="flex justify-center items-center w-full">
          <button
            disabled={!watch('amount') || watch('amount') <= 0 || watch('amount') > sale.total || (!watch('cashPayment') && !watch('paymentMethodCurrentAccount'))}
            type="submit"
            className="btn CuadroCuentasPorCobrar-btn -translate-y-2 disabled:border-none disabled:bg-gray-400"
          >
            <span>Registrar Cobro</span>
          </button>
        </div>
      </form>
    </>
  );
};

export { CuadroCuentasPorCobrar };
