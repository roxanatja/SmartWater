import { useContext } from "react";
import "./AddEgresosGastos.css";
import { EgresosGastosContext } from "../EgresosGastosContext";
import { useForm, SubmitHandler } from "react-hook-form";
import { ExpensesBody } from "../../../../../../type/InvoceExpense";
import Input from "../../../../EntryComponents/Inputs";
import { Account } from "../../../../../../type/AccountEntry";
import { Providers } from "../../../../../../type/providers";
import { UserData } from "../../../../../../type/UserData";
import AuthenticationService from "../../../../../../services/AuthenService";
import { toast } from "react-hot-toast";
import ApiMethodInvoceExpense from "../../../../../../Class/api.invoceexpe";

const AddEgresosGastos = ({
  data,
  handleOnsubmit,
}: {
  data?: {
    accounts?: Account[];
    providers?: Providers[];
  };
  handleOnsubmit: () => void;
}) => {
  const { setShowModal } = useContext(EgresosGastosContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<ExpensesBody>({
    defaultValues: {
      hasInVoice: true,
      creditBuy: false,
      paymentMethodCurrentAccount: false,
    },
  });

  const onSubmit: SubmitHandler<ExpensesBody> = async (data) => {
    const user: UserData = AuthenticationService.getUser();
    const api = new ApiMethodInvoceExpense();
    try {
      await api.saveExpense({
        ...data,
        paymentMethodCurrentAccount: data.user === "1" ? false : true,
        user: user._id,
      });
      toast.success("Registro registrado exitosamente");
      reset();
      handleOnsubmit();
    } catch (error) {
      console.log(error);
      toast.error("Upps error al hacer el registro");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="p-6">
          <h2 className="Titulo-Modal mb-4">Registro de egresos y gastos</h2>
          <div className="flex flex-col gap-4 mb-10">
            <Input
              register={register}
              name="date"
              label="Fecha"
              className="text-right"
              value={new Date().toLocaleDateString()}
              readOnly
            />
            <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-4">
              <Input
                register={register}
                name="amount"
                label="Importe"
                type="number"
                errors={errors.amount}
                button={"Bs"}
                required
              />
              <div className="input-grup w-full relative top-1">
                <label className="label-grup mb-1.5">Medio de pago</label>
                <select
                  {...register("user", { required: true })}
                  className="p-2 py-2.5 rounded-md focus:outline-4 bg-transparent outline outline-2 outline-black text-black w-full text-sm "
                >
                  <option value="1">Efectivo</option>
                  <option value="2">Cta. Cte</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-4">
              <div className="input-grup w-full relative top-1">
                <label className="label-grup mb-1.5">Provedor</label>
                <select
                  {...register("provider", { required: true })}
                  className="p-2 py-2.5 rounded-md focus:outline-4 bg-transparent outline outline-2 outline-black text-black w-full text-sm "
                >
                  {data?.providers &&
                    data.providers.map((provider, index) => (
                      <option key={index} value={provider._id}>
                        {provider.fullName}
                      </option>
                    ))}
                </select>
              </div>
              <div className="input-grup w-full relative top-1">
                <label className="label-grup mb-1.5">Egreso o gasto </label>
                <select
                  {...register("accountEntry")}
                  className="p-2 py-2.5 rounded-md focus:outline-4 bg-transparent outline outline-2 outline-black text-black w-full text-sm "
                >
                  {data?.accounts &&
                    data.accounts.map((account, index) => (
                      <option key={index} value={account._id}>
                        {account.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="label-grup" style={{ width: "100%" }}>
              <span>Tipo de compra</span>
            </div>
            <div className="grupo-checbox">
              <div className="grupo-check">
                <input
                  className="input-check cursor-pointer"
                  type="checkbox"
                  id="hasInVoice"
                  checked={watch("hasInVoice")}
                  onChange={() => {
                    setValue("hasInVoice", true);
                    setValue("creditBuy", false);
                  }}
                />
                <label
                  htmlFor="hasInVoice"
                  className="text-check cursor-pointer"
                >
                  Factura
                </label>
              </div>
              <div className="grupo-check">
                <input
                  className="input-check cursor-pointer"
                  type="checkbox"
                  id="creditBuy"
                  checked={watch("creditBuy")}
                  onChange={() => {
                    setValue("creditBuy", true);
                    setValue("hasInVoice", false);
                  }}
                />
                <label
                  htmlFor="creditBuy"
                  className="text-check cursor-pointer"
                >
                  Credito
                </label>
              </div>
            </div>
            <Input
              name="documentNumber"
              label="N° de documento"
              register={register}
              errors={errors.documentNumber}
              required
            />
            <Input
              name="documentNumber"
              label="Comentario"
              register={register}
              errors={errors.documentNumber}
              required
              textarea
            />
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn-cancelar"
              onClick={() => setShowModal(false)}
            >
              Cancelar
            </button>
            <button type="submit" className="btn-registrar">
              Registrar
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export { AddEgresosGastos };
