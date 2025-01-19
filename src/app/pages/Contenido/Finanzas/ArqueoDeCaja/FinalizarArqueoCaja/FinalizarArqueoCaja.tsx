import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Transaction, CashClose } from "../../../../../../type/Cash";
import Input from "../../../../EntryComponents/Inputs";
import "./FinalizarArqueoCaja.css";
import { User } from "../../../../../../type/User";
import { CashRegisterApiConector } from "../../../../../../api/classes";

const FinalizarArqueoCaja = ({
  cash,
  handleOnSubmit,
  distrib
}: {
  cash?: Transaction;
  distrib: User[]
  handleOnSubmit?: () => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<CashClose>({
    defaultValues: {
      cash: 0,
      currentAccount: 0,
      user: cash?.user
    }
  });

  const getFormattedDate = (): string => {
    const now = new Date();
    const date = now.toISOString().split("T")[0];
    const time = now.toTimeString().split(" ")[0].slice(0, 5);
    return `${date}T${time}:00.000Z`;
  };

  const onSubmit: SubmitHandler<CashClose> = async (data) => {
    const res = await CashRegisterApiConector.closeReport({
      data: {
        ...data,
        user: cash?.user || "",
        endDate: getFormattedDate(),
      }
    });

    if (res) {
      toast.success("Caja Cerrada");
      if (handleOnSubmit) handleOnSubmit();
    } else {
      toast.error("Upps error al cerrar caja");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="text-sm">
      <div className="w-full p-6">
        <div className="FinalizarArqueoCaja-hora mb-6">
          <span>Hora de apertura</span>
          <span className="font-medium">
            {cash?.startDate
              ? new Date(cash?.startDate).toLocaleString()
              : "N/A"}
          </span>
        </div>
        <div className="w-full sm:w-1/2 md:w-1/4">
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">Distribuidor</div>
              <div className="whitespace-normal md:whitespace-nowrap">{distrib.find(d => d._id === cash?.user)?.fullName || "Distribuidor desconocido"}</div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">Abierto</div>
              <div className="relative inline-block w-11 h-5">
                <input
                  id="switch-component"
                  type="checkbox"
                  readOnly
                  checked={!!cash?.state}
                  className="peer appearance-none w-16 h-5 bg-slate-300 rounded-full checked:bg-blue-900 cursor-pointer transition-colors duration-300"
                />
                <label
                  htmlFor="switch-component"
                  className="absolute top-0 left-0 w-5 h-5 bg-white rounded-full border border-slate-300 shadow-sm transition-transform duration-300 peer-checked:translate-x-12 peer-checked:border-blue-900 cursor-pointer"
                ></label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 pt-10">
          <div className="FinalizarArqueoCaja-FormTitle">
            <span>Saldos según sistema</span>
          </div>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-3 gap-2 items-center w-full md:w-4/12">
              <label className="FinalizarArqueoCaja-item">Monto</label>
              <input
                readOnly
                className="FinalizarArqueoCaja-imput text-right col-span-2"
                type="number"
                value={cash?.initialAmount}
              />
            </div>

            <div className="grid grid-cols-3 gap-2 items-center w-full md:w-4/12 mt-6">
              <label className="FinalizarArqueoCaja-item">Ingresos</label>
              <Input
                readOnly
                name="asdsa"
                register={register}
                containerClassName="col-span-2"
                className="text-right"
                value={cash?.incomeCashTotal}
              />
            </div>

            <div className="flex w-full flex-wrap gap-4">
              <div className="min-w-[320px] max-w-[500px] bg-white shadow-md border flex flex-col gap-4 shadow-zinc-300 rounded-2xl p-6">
                <div className="w-full flex justify-between items-center">
                  <div className="flex gap-2 items-center font-semibold w-[44rem]">
                    <i className="fa-solid fa-angle-right"></i>
                    <h2 className="font-bold">Efectivos</h2>
                  </div>
                  <Input
                    readOnly
                    name="asdsa"
                    register={register}
                    className="w-2/12 text-right"
                    value={cash?.incomeCashTotal}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <p className="pl-4">Ventas efectivo</p>
                  <p>{cash?.cashSales.toLocaleString()}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="pl-4">Cobro ventas. Crédito</p>
                  <p>{cash?.creditBillsSales.toLocaleString()}</p>
                </div>
              </div>

              <div className="min-w-[320px] max-w-[500px] bg-white shadow-md border flex flex-col gap-4 shadow-zinc-300 rounded-2xl p-6">
                <div className="w-full flex justify-between items-center">
                  <div className="flex gap-2 items-center font-semibold w-[44rem]">
                    <i className="fa-solid fa-angle-right"></i>
                    <h2 className="font-bold">Cuenta Corriente</h2>
                  </div>
                  <Input readOnly
                    name="asdsa"
                    register={register}
                    className="w-2/12 text-right"
                    value={cash?.incomeCurrentAccountTotal}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <p className="pl-4"> Ventas efectivo</p>
                  <p>{cash?.cashCurrentAccount.toLocaleString()}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="pl-4"> Cobro ventas. Crédito</p>
                  <p>{cash?.creditBillsSalesCurrentAccount.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <strong className="text-gray-500">Ventas por cobrar: 0</strong>

            <div className="grid grid-cols-3 gap-2 items-center w-full md:w-4/12 mt-6">
              <label className="FinalizarArqueoCaja-item w-full">
                Egresos
              </label>
              <Input
                readOnly
                name="asdsa"
                register={register}
                containerClassName="col-span-2"
                className="text-right"
                value={cash?.expenseCashTotal}
              />
            </div>

            <div className="flex w-full flex-wrap gap-4">
              <div className="min-w-[320px] max-w-[500px] bg-white shadow-md border flex flex-col gap-4 shadow-zinc-300 rounded-2xl p-6">
                <div className="w-full flex justify-between items-center">
                  <div className="flex gap-2 items-center font-semibold w-[44rem]">
                    <i className="fa-solid fa-angle-right"></i>
                    <h2 className="font-bold">Efectivos</h2>
                  </div>
                  <Input
                    readOnly
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

              <div className="min-w-[320px] max-w-[500px] bg-white shadow-md border flex flex-col gap-4 shadow-zinc-300 rounded-2xl p-6">
                <div className="w-full flex justify-between items-center">
                  <div className="flex gap-2 items-center font-semibold w-[44rem]">
                    <i className="fa-solid fa-angle-right"></i>
                    <h2 className="font-bold">Cuenta Corriente</h2>
                  </div>
                  <Input
                    readOnly
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
          </div>
          <strong className="text-gray-500">Gastos por pagar: 0</strong>

          <div className="FinalizarArqueoCaja-FormTitle mt-6">
            <span>Saldos según usuario</span>
          </div>
          <div className="flex flex-col gap-4 w-full md:w-4/12">
            <div className="flex justify-between items-center">
              <p className="pl-4 font-semibold"> Total ingresos</p>
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
                className="w-2/12 text-right no-spinner"
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
                className="w-2/12 text-right no-spinner"
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
                readOnly
                value={cash?.difference.toLocaleString()}
              />
            </div>
          </div>

          <div className="flex w-full sm:w-1/2 justify-center sm:justify-end items-center mt-6">
            <button type="submit" className="btn FinalizarArqueoCaja-btn disabled:bg-gray-400 disabled:border-none" disabled={!isValid}>
              Finalizar arqueo
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export { FinalizarArqueoCaja };
