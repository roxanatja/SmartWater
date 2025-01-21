import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Transaction, CashClose } from "../../../../../../type/Cash";
import Input from "../../../../EntryComponents/Inputs";
import "./FinalizarArqueoCaja.css";
import { User } from "../../../../../../type/User";
import { CashRegisterApiConector } from "../../../../../../api/classes";
import moment from "moment-timezone";
import { formatDateTime } from "../../../../../../utils/helpers";
import { useGlobalContext } from "../../../../../SmartwaterContext";
import { generate } from "@pdfme/generator";
import { text } from "@pdfme/schemas";
import { pdfTemplate } from "./pdftemplate";
import { Buffer } from 'buffer'
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

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
  } = useForm<CashClose>();

  const { setLoading } = useGlobalContext()

  const onSubmit: SubmitHandler<CashClose> = async (data) => {
    const res = await CashRegisterApiConector.closeReport({
      data: {
        user: cash?.user || "",
        endDate: moment.tz("America/La_Paz").format(),
      }
    });

    if (res) {
      toast.success("Caja Cerrada");
      if (handleOnSubmit) handleOnSubmit();
    } else {
      toast.error("Upps error al cerrar caja");
    }
  };

  const save = async () => {
    setLoading(true)

    try {
      const inputs = [
        {
          "date": cash?.startDate
            ? formatDateTime(cash?.startDate, 'numeric', '2-digit', '2-digit', true, true)
            : "N/A",
          "distribuidor": distrib.find(d => d._id === cash?.user)?.fullName || "Distribuidor desconocido",
          "estado": !!cash?.state ? "Abierto" : "Cerrado",
          "monto": (cash?.initialAmount || 0).toLocaleString(),
          "ingresos": (cash?.incomeCashTotal || 0).toLocaleString(),
          "ingreso_efectivo": (cash?.incomeCashTotal || 0).toLocaleString(),
          "ingreso_cuenta": (cash?.incomeCurrentAccountTotal || 0).toLocaleString(),
          "egresos": (cash?.expenseCashTotal || 0).toLocaleString(),
          "egresos_efectivo": (cash?.expenseCashTotal || 0).toLocaleString(),
          "egresos_cuenta": (cash?.expenseCurrentAccountTotal || 0).toLocaleString(),
          "usuario_efectivo": (cash?.cashRendered || 0).toLocaleString(),
          "usuario_cuenta": (cash?.currentAccountRendered || 0).toLocaleString(),
          "diferencia": (cash?.difference || 0).toLocaleString(),
          "ingreso_efectivo_efectivo": (cash?.cashSales || 0).toLocaleString(),
          "ingreso_efectivo_credito": (cash?.creditBillsSales || 0).toLocaleString(),
          "ingreso_cuenta_efectivo": (cash?.cashCurrentAccount || 0).toLocaleString(),
          "ingreso_cuenta_credito": (cash?.creditBillsSalesCurrentAccount || 0).toLocaleString(),
          "egresos_efectivo_gastoscopy": (cash?.expenseCashTotal || 0).toLocaleString(),
          "egresos_efectivo_obligacionescopy": (cash?.expensePayObligations || 0).toLocaleString(),
          "egresos_cuenta_gastos": (cash?.expensePayCurrentAccount || 0).toLocaleString(),
          "egresos_cuenta_obligaciones": (cash?.expenseCurrentPayObligations || 0).toLocaleString(),
          "ventas_egresos_cuentapor_cobrar": "0",
          "gastos_por_pagar": "0",
          "saldo_en_caja": "0",
          "total_ingresos": (cash?.incomeCashTotal || 0).toLocaleString()
        }
      ]

      const pdf = await generate({ template: pdfTemplate, inputs, plugins: { Text: text } })
      const pdfBuffer = Buffer.from(pdf)

      const blob = new Blob([pdfBuffer])

      try {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        if (link.download !== undefined) { // feature detection
          link.setAttribute('href', url);
          link.setAttribute('download', "Resumen de Arqueo.pdf");
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      } catch (e) {
        toast.error('Error guardando el pdf');
      }
    } catch (error) {
      toast.error('Error generando el pdf');
    }

    setLoading(false)
  }

  const ref = useRef<HTMLDivElement>(null)
  const handlePrint = useReactToPrint({
    contentRef: ref,
    documentTitle: `Resumen de Arqueo`,
    onPrintError: () => alert("there is an error when printing"),
  });

  return (
    <div className="" ref={ref}>
      <form onSubmit={handleSubmit(onSubmit)} className="text-sm">
        <div className="w-full p-6 relative">
          <div className="flex gap-4 items-center justify-end absolute top-4 right-4 print:hidden">
            <button type="button" className="border-blue_bright border w-20 h-12 flex items-center justify-center rounded-[30px]" onClick={() => handlePrint()}>
              <img src="/print.svg" alt="" />
            </button>
            <button type="button" className="bg-blue_bright w-20 h-12 flex items-center justify-center rounded-[30px]" onClick={() => save()}>
              <img src="/document.svg" alt="" />
            </button>
          </div>

          <div id="printArea">
            <div className="FinalizarArqueoCaja-hora mb-6">
              <span>Hora de apertura</span>
              <span className="font-medium">
                {cash?.startDate
                  ? formatDateTime(cash?.startDate, 'numeric', '2-digit', '2-digit', true, true)
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
                <div className="grid grid-cols-3 gap-2 items-center w-full md:w-1/2">
                  <label className="FinalizarArqueoCaja-item">Monto</label>
                  <input
                    readOnly
                    className="FinalizarArqueoCaja-imput text-right col-span-2"
                    type="number"
                    value={(cash?.initialAmount || 0).toLocaleString()}
                  />
                </div>

                <div className="grid grid-cols-3 gap-2 items-center w-full md:w-1/2 mt-6">
                  <label className="FinalizarArqueoCaja-item">Ingresos</label>
                  <Input
                    readOnly
                    name="one"
                    register={register}
                    containerClassName="col-span-2"
                    className="text-right"
                    value={(cash?.incomeCashTotal || 0).toLocaleString()}
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
                        name="two"
                        register={register}
                        className="w-2/12 text-right"
                        value={(cash?.incomeCashTotal || 0).toLocaleString()}
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="pl-4">Ventas efectivo</p>
                      <p>{(cash?.cashSales || 0).toLocaleString()}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="pl-4">Cobro ventas. Crédito</p>
                      <p>{(cash?.creditBillsSales || 0).toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="min-w-[320px] max-w-[500px] bg-white shadow-md border flex flex-col gap-4 shadow-zinc-300 rounded-2xl p-6">
                    <div className="w-full flex justify-between items-center">
                      <div className="flex gap-2 items-center font-semibold w-[44rem]">
                        <i className="fa-solid fa-angle-right"></i>
                        <h2 className="font-bold">Cuenta Corriente</h2>
                      </div>
                      <Input readOnly
                        name="three"
                        register={register}
                        className="w-2/12 text-right"
                        value={(cash?.incomeCurrentAccountTotal || 0).toLocaleString()}
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="pl-4"> Ventas efectivo</p>
                      <p>{(cash?.cashCurrentAccount || 0).toLocaleString()}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="pl-4"> Cobro ventas. Crédito</p>
                      <p>{(cash?.creditBillsSalesCurrentAccount || 0).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                <strong className="text-gray-500">Ventas por cobrar: 0</strong>

                <div className="grid grid-cols-3 gap-2 items-center w-full md:w-1/2 mt-6">
                  <label className="FinalizarArqueoCaja-item w-full">
                    Egresos
                  </label>
                  <Input
                    readOnly
                    name="four"
                    register={register}
                    containerClassName="col-span-2"
                    className="text-right"
                    value={(cash?.expenseCashTotal || 0).toLocaleString()}
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
                        name="five"
                        register={register}
                        className="w-2/12 text-right"
                        value={(cash?.expenseCashTotal || 0).toLocaleString()}
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="pl-4"> Gastos</p>
                      <p>{(cash?.expenseCashTotal || 0).toLocaleString()}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="pl-4"> Pago de obligaciones</p>
                      <p>{(cash?.expensePayObligations || 0).toLocaleString()}</p>
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
                        name="six"
                        register={register}
                        className="w-2/12 text-right"
                        value={(cash?.expenseCurrentAccountTotal || 0).toLocaleString()}
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="pl-4"> Gastos</p>
                      <p>{(cash?.expensePayCurrentAccount || 0).toLocaleString()}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="pl-4"> Pago de obligaciones</p>
                      <p>{(cash?.expenseCurrentPayObligations || 0).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
              <strong className="text-gray-500">Gastos por pagar: 0</strong>
              <strong className="text-gray-500">Saldo en caja: 0</strong>

              <div className="FinalizarArqueoCaja-FormTitle mt-6">
                <span>Saldos según usuario</span>
              </div>
              <div className="flex flex-col gap-4 w-full md:w-1/2">
                <div className="flex justify-between items-center">
                  <p className="pl-4 font-semibold"> Total ingresos</p>
                  <p>{(cash?.incomeCashTotal || 0).toLocaleString()}</p>
                </div>

                <div className="w-full flex justify-between items-center pl-4">
                  <div className="flex gap-2 items-center w-full">
                    <h2>Efetivo</h2>
                  </div>
                  <Input
                    value={(cash?.cashRendered || 0).toLocaleString()}
                    name="cash"
                    register={register}
                    label="Efetivo"
                    isVisibleLable
                    className="w-2/12 text-right no-spinner"
                    type="number"
                    required
                    readOnly
                  />
                </div>

                <div className="w-full flex justify-between items-center pl-4">
                  <div className="flex gap-2 items-center w-full">
                    <h2>Cuenta Corriente</h2>
                  </div>
                  <Input
                    value={(cash?.currentAccountRendered || 0).toLocaleString()}
                    name="currentAccount"
                    register={register}
                    label="Cuenta Corriente"
                    isVisibleLable
                    type="number"
                    className="w-2/12 text-right no-spinner"
                    required
                    readOnly
                  />
                </div>

                <div className="flex justify-between items-center pl-4">
                  <div className="flex gap-2 items-center font-bold w-full">
                    <h2>Diferencia</h2>
                  </div>
                  <Input
                    name="seven"
                    register={register}
                    className="w-2/12 text-right no-spinner"
                    readOnly
                    value={(cash?.difference || 0).toLocaleString()}
                  />
                </div>
              </div>
            </div>
          </div>
          {
            cash?.state &&
            <div className="flex w-full sm:w-1/2 justify-center sm:justify-end items-center mt-6 print:hidden">
              <button type="submit" className="btn FinalizarArqueoCaja-btn disabled:bg-gray-400 disabled:border-none" disabled={!isValid}>
                Finalizar arqueo
              </button>
            </div>
          }
        </div>
      </form>
    </div>
  );
};

export { FinalizarArqueoCaja };
