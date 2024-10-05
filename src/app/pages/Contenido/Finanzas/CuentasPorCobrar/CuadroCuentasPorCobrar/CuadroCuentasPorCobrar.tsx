import { useContext } from "react";
import "./CuadroCuentasPorCobrar.css";
import { CuentasPorCobrarContext } from "../CuentasPorCobrarContext";
import { Sale } from "../../../../../../type/Sale/Sale";
import Input from "../../../../EntryComponents/Inputs";
import { BillBody } from "../../../../../../type/Bills";
import { SubmitHandler, useForm } from "react-hook-form";
import ApiMethodBills from "../../../../../../Class/api.bills";
import { toast } from "react-hot-toast";
import { UserData } from "../../../../../../type/UserData";
import AuthenticationService from "../../../../../../services/AuthenService";
import { Client } from "../../../../../../Class/types.data";

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
  } = useForm<BillBody>({
    defaultValues: {
      amount: "0",
      cashPayment: true,
      paymentMethodCurrentAccount: false,
    },
  });
  const onSubmit: SubmitHandler<BillBody> = async (data) => {
    const api = new ApiMethodBills();
    const auth = AuthenticationService;
    const userData: UserData = auth.getUser();
    try {
      await api.registerBill({
        ...data,
        user: userData._id,
        zone: sale.client[0].zone,
        sale: sale._id,
      });
      toast.success("Cobro registrado");
      reset();
      onSendBill();
    } catch (error) {
      console.error(error);
      toast.error("Uppss error al registrar el Cobro");
    }
  };

  const credi = sale.total;
  const validateAmount = (value: number) => {
    if (value <= 0) {
      return "El monto no puede ser menor que 0";
    }
    if (value > credi) {
      return `El monto no puede exceder el saldo de ${credi} Bs.`;
    }
    return true;
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="CuadroCuentasPorCobrar-container"
      >
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="CuadroVentaCliente-header">
              <img
                src={sale?.client?.[0]?.storeImage || "../Cliente2.svg"}
                className="w-8 h-8 rounded-full"
                alt=""
              />
              <span>{sale?.client?.[0]?.fullName || "N/A"}</span>
            </div>
            <div className="flex items-center">
              <button
                type="button"
                className="btn"
                onClick={() => {
                  setShowMiniModal(true);
                  setClientSelect(sale.client[0] as unknown as Client);
                }}
              >
                <img src="../Opciones-icon.svg" alt="" />
              </button>
            </div>
            <div className="CuadroCuentasPorCobrar-header">
              <span>Prestamos activos</span>
            </div>
          </div>
          <div className="flex justify-between items-start">
            <div className="CuadroVentaCliente-text">
              <span>
                No. Cliente:{" "}
                <span className="text-blue_custom">
                  {sale?.client?.[0]?.code || "N/A"}
                </span>
              </span>
            </div>
            <div className="moneda-clientes bg-blue_custom text-white gap-2 py-1 px-3 rounded-md flex items-center">
              <img src="../Moneda-icon.svg" alt="" />
              <div>
                <span className="text-sm">
                  {sale.total.toLocaleString()} Bs.
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-start flex-col items-start gap-0 -translate-y-3 w-full">
          <div className="flex justify-between items-center w-full">
            <p className="text-sm text-nowrap w-full">Total a Cobrar</p>
            <div className="input-container flex flex-col w-full">
              <div className="RegistrarVenta-grupo-checbox">
                <div className="RegistrarVenta-grupo-check">
                  <input
                    className="input-check cursor-pointer w-4 h-4"
                    type="checkbox"
                    id="checkbox1"
                    checked={watch("cashPayment")}
                    onChange={() => {
                      setValue("cashPayment", !watch("cashPayment"));
                      setValue("paymentMethodCurrentAccount", false);
                    }}
                  />
                  <label
                    htmlFor="checkbox1"
                    className="text-check cursor-pointer text-md"
                  >
                    Efectivo
                  </label>
                </div>
                <div className="RegistrarVenta-grupo-check">
                  <input
                    className="input-check cursor-pointer w-4 h-4"
                    type="checkbox"
                    id="checkbox2"
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
                    htmlFor="checkbox2"
                    className="text-check cursor-pointer text-md"
                  >
                    Cta. Cte
                  </label>
                </div>
              </div>
            </div>
          </div>
          <Input
            register={register}
            validateAmount={validateAmount}
            name="amount"
            type="number"
            placeholder="Monto a cobrar"
            min="0"
            step="0.01"
            errors={errors.amount}
            button={<span className="text-lg">Bs</span>}
          />
        </div>
        <div className="flex justify-center items-center w-full">
          <button
            type="submit"
            className="btn CuadroCuentasPorCobrar-btn -translate-y-2"
          >
            <span>Registrar Cobro</span>
          </button>
        </div>
      </form>
    </>
  );
};

export { CuadroCuentasPorCobrar };
