import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "react-hot-toast";
import ApiMethodCash from "../../../../../../Class/api.cash";
import AuthenticationService from "../../../../../../services/AuthenService";
import { Transaction, CashClose } from "../../../../../../type/Cash";
import { UserData } from "../../../../../../type/UserData";
import Input from "../../../../EntryComponents/Inputs";
import "./FinalizarArqueoCaja.css";

const FinalizarArqueoCaja = ({
  cash,
  handleOnSubmit,
}: {
  cash?: Transaction;
  handleOnSubmit?: () => void;
}) => {
  const [isChecked, setIsChecked] = useState<boolean>(false);

  useEffect(() => {
    if (cash?.state) {
      setIsChecked(cash?.state);
    }
  }, [cash?.state]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CashClose>();

  const getFormattedDate = (): string => {
    const now = new Date();
    const date = now.toISOString().split("T")[0];
    const time = now.toTimeString().split(" ")[0].slice(0, 5);
    return `${date}T${time}:00.000Z`;
  };

  const onSubmit: SubmitHandler<CashClose> = async (data) => {
    const api = new ApiMethodCash();
    const user: UserData = AuthenticationService.getUser();
    try {
      await api.closeCash({
        ...data,
        user: user._id,
        endDate: getFormattedDate(),
      });
      toast.success("Caja Cerrada");
      if (handleOnSubmit) handleOnSubmit();
    } catch (error) {
      toast.error("Upps error al cerrar caja");
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="w-full p-6">
        <div className="FinalizarArqueoCaja-hora">
          <span>Hora de apertura</span>
          <span className="font-medium">
            {cash?.startDate
              ? new Date(cash?.startDate).toLocaleString()
              : "N/A"}
          </span>
        </div>
        <div>
          <table style={{ width: "25%" }}>
            <thead>
              <tr className="FinalizarArqueoCaja-titulos">
                <th>
                  <span>Distribuidor 1</span>
                </th>
                <th>
                  <span>Abierto</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="FinalizarArqueoCaja-body">
                <td>
                  <div style={{ marginTop: "16px" }}>
                    <span>Alberto</span>
                  </div>
                </td>
                <td>
                  <div style={{ marginTop: "16px" }}>
                    <label className="switch-container">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => setIsChecked(!isChecked)}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="flex flex-col gap-6 pt-10">
          <div className="FinalizarArqueoCaja-FormTitle">
            <span>Saldos según sistema</span>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex gap-2 items-center w-3/12">
              <label className="FinalizarArqueoCaja-item pl-4">Monto</label>
              <input
                className="FinalizarArqueoCaja-imput text-right"
                type="number"
                value={cash?.initialAmount}
              />
            </div>
            <div className="flex gap-2 items-center w-3/12">
              <label className="FinalizarArqueoCaja-item">Ingresos</label>
              <input
                className="FinalizarArqueoCaja-imput text-right"
                type="number"
                value={cash?.incomeCurrentAccountTotal}
              />
            </div>
            <div className="w-4/12 bg-white shadow-md border flex flex-col gap-4 shadow-zinc-300 rounded-2xl p-6">
              <div className="w-full flex justify-between items-center">
                <div className="flex gap-2 items-center font-semibold w-[44rem]">
                  <i className="fa-solid fa-angle-right"></i>
                  <h2 className="font-bold">Efectivos</h2>
                </div>
                <Input
                  name="asdsa"
                  register={register}
                  className="w-2/12 text-right"
                  value={cash?.incomeCashTotal}
                />
              </div>
              <div className="flex justify-between items-center">
                <p className="pl-4"> Cobro ventas. Crédito</p>
                <p>{cash?.cashSales.toLocaleString()}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="pl-4"> Ventas por cobrar</p>
                <p>{cash?.creditBillsSales.toLocaleString()}</p>
              </div>
            </div>

            <div className="w-4/12 bg-white shadow-md border flex flex-col gap-4 shadow-zinc-300 rounded-2xl p-6">
              <div className="w-full flex justify-between items-center">
                <div className="flex gap-2 items-center font-semibold w-[44rem]">
                  <i className="fa-solid fa-angle-right"></i>
                  <h2 className="font-bold">Cuenta Corriente</h2>
                </div>
                <Input
                  name="asdsa"
                  register={register}
                  className="w-2/12 text-right"
                  value={cash?.incomeCurrentAccountTotal}
                />
              </div>
              <div className="flex justify-between items-center">
                <p className="pl-4"> Cobro ventas. Crédito</p>
                <p>{cash?.cashCurrentAccount.toLocaleString()}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="pl-4"> Ventas por cobrar</p>
                <p>{cash?.creditBillsSalesCurrentAccount.toLocaleString()}</p>
              </div>
            </div>

            <div className="w-5/12">
              <div className="flex gap-2 items-center justify-between w-full">
                <label className="FinalizarArqueoCaja-item w-full">
                  Egresos
                </label>
                <Input
                  name="asdsa"
                  register={register}
                  className="w-36 text-right"
                  value={cash?.expenseCashTotal}
                />
              </div>
            </div>

            <div className="w-4/12 bg-white shadow-md border flex flex-col gap-4 shadow-zinc-300 rounded-2xl p-6">
              <div className="w-full flex justify-between items-center">
                <div className="flex gap-2 items-center font-semibold w-[44rem]">
                  <i className="fa-solid fa-angle-right"></i>
                  <h2 className="font-bold">Efectivos</h2>
                </div>
                <Input
                  name="asdsa"
                  register={register}
                  className="w-2/12 text-right"
                  value={cash?.expenseCashTotal}
                />
              </div>
              <div className="flex justify-between items-center">
                <p className="pl-4"> Gastos</p>
                <p>{cash?.expenseCashTotal.toLocaleString()}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="pl-4"> Pago de obligaciones</p>
                <p>{cash?.expensePayObligations.toLocaleString()}</p>
              </div>
            </div>

            <div className="w-4/12 bg-white shadow-md border flex flex-col gap-4 shadow-zinc-300 rounded-2xl p-6">
              <div className="w-full flex justify-between items-center">
                <div className="flex gap-2 items-center font-semibold w-[44rem]">
                  <i className="fa-solid fa-angle-right"></i>
                  <h2 className="font-bold">Cuenta Corriente</h2>
                </div>
                <Input
                  name="asdsa"
                  register={register}
                  className="w-2/12 text-right"
                  value={cash?.expenseCurrentAccountTotal}
                />
              </div>
              <div className="flex justify-between items-center">
                <p className="pl-4"> Gastos</p>
                <p>{cash?.expensePayCurrentAccount.toLocaleString()}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="pl-4"> Pago de obligaciones</p>
                <p>{cash?.expenseCurrentPayObligations.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="FinalizarArqueoCaja-FormTitle">
            <span>Saldos según usuario</span>
          </div>
          <div className="flex flex-col gap-4 w-4/12">
            <div className="flex justify-between items-center">
              <p className="pl-4 font-bold"> Total ingresos</p>
              <p>{cash?.incomeCashTotal.toLocaleString()}</p>
            </div>

            <div className="w-full flex justify-between items-center pl-4">
              <div className="flex gap-2 items-center w-full">
                <h2>Efetivo</h2>
              </div>
              <Input
                name="cash"
                register={register}
                label="Efetivo"
                isVisibleLable
                className="w-2/12 text-right"
                type="number"
                errors={errors.cash}
                required
              />
            </div>

            <div className="w-full flex justify-between items-center pl-4">
              <div className="flex gap-2 items-center w-full">
                <h2>Cuenta Corriente</h2>
              </div>
              <Input
                name="currentAccount"
                register={register}
                label="Cuenta Corriente"
                isVisibleLable
                type="number"
                className="w-2/12 text-right"
                errors={errors.currentAccount}
                required
              />
            </div>

            <div className="flex justify-between items-center pl-4">
              <div className="flex gap-2 items-center w-screen font-bold">
                <h2>Diferencia</h2>
              </div>
              <Input
                name="asdsa"
                register={register}
                className="w-24 text-right"
                value={cash?.difference.toLocaleString()}
              />
            </div>
          </div>

          <div className="flex justify-center items-end">
            <button type="submit" className="btn FinalizarArqueoCaja-btn">
              Finalizar arqueo
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export { FinalizarArqueoCaja };
