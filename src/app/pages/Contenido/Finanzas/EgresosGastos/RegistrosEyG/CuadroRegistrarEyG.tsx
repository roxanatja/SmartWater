import { useContext, useEffect, useRef, useState } from "react";
import { Account } from "../../../../../../type/AccountEntry";
import { Expense } from "../../../../../../type/Expenses";
import { Providers } from "../../../../../../type/providers";
import { User } from "../../../../../../type/User";
import "./RegistrosEyG.css";
import { EgresosGastosContext } from "../EgresosGastosContext";
import toast from "react-hot-toast";
import { ExpensesApiConector } from "../../../../../../api/classes";
import { Option } from "../../../../components/Option/Option";
import { formatDateTime } from "../../../../../../utils/helpers";

const CuadroRegistrarEyG = ({
  expense,
  users,
  accounts,
  providers,
  isPayment
}: {
  expense: Expense;
  users?: User[];
  providers?: Providers[];
  accounts?: Account[];
  isPayment?: boolean;
}) => {
  const user = users?.find((x) => x._id === expense.user);
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const { setSelectedExpense } = useContext(EgresosGastosContext);

  const optionsRef = useRef<HTMLDivElement>(null);

  const Opciones = () => {
    setShowOptions(!showOptions);
  };

  const Edit = () => {
    setSelectedExpense(expense);
    setShowOptions(false);
  };

  const Delete = async () => {
    toast.error(
      (t) => (
        <div>
          <p className="mb-4 text-center text-[#888]">
            Se <b>eliminará</b> este item, <br /> pulsa <b>Proceder</b> para continuar
          </p>
          <div className="flex justify-center">
            <button
              className="bg-red-500 px-3 py-1 rounded-lg ml-2 text-white"
              onClick={() => { toast.dismiss(t.id); }}
            >
              Cancelar
            </button>
            <button
              className="bg-blue_custom px-3 py-1 rounded-lg ml-2 text-white"
              onClick={async () => {
                toast.dismiss(t.id);
                const response = await ExpensesApiConector.delete({ expenseId: expense?._id || '' }) as any;
                if (!!response) {
                  if (response.mensaje) {
                    toast.success(response.mensaje, {
                      position: "top-center",
                      duration: 2000
                    });
                    window.location.reload();
                  } else if (response.error) {
                    toast.error(response.error, {
                      position: "top-center",
                      duration: 2000
                    });
                  }
                } else {
                  toast.error("Error al eliminar gasto", {
                    position: "top-center",
                    duration: 2000
                  });
                }
              }}
            >
              Proceder
            </button>
          </div>
        </div>
      ),
      {
        className: "shadow-md dark:shadow-slate-400 border border-slate-100 bg-main-background",
        icon: null,
        position: "top-center"
      }
    );
    setShowOptions(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        optionsRef.current &&
        !optionsRef.current.contains(event.target as Node)
      ) {
        setShowOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="CuadroRegistrarEyG-container relative w-full bg-blocks dark:border-blocks">
        <div className="CuadroVentaCliente-header relative w-full">
          <div className={`flex justify-between items-center ${!isPayment ? "w-[calc(100%_-_30px)]" : "w-full"}`}>
            <div className="flex gap-3 items-center">
              <div className="bg-blue_custom text-white px-3.5 py-1.5 rounded-full flex justify-center items-center relative z-0">
                <div className="opacity-0">.</div>
                <p className="absolute font-extrabold whitespace-nowrap">
                  {expense.provider?.fullName?.[0] || "S"}
                </p>
              </div>
              <span>{expense.provider?.fullName || "Proveedor desconocido"}</span>
            </div>

            <div className="border border-blue_custom rounded-md text-blue_custom px-3 py-1">
              {formatDateTime(expense.created, 'numeric', '2-digit', '2-digit')}
            </div>
          </div>

          {
            !isPayment &&
            <div className="absolute -right-2 rounded-full top-1 flex flex-col gap-6">
              <div className="relative" ref={optionsRef}>
                <button type="button" className="invert-0 dark:invert" onClick={() => Opciones()}>
                  <img src="/opcion-icon.svg" alt="" />
                </button>
                <Option
                  editAction={Edit}
                  visible={showOptions}
                  editar={true}
                  eliminar={true}
                  deleteAction={Delete}
                />
              </div>
            </div>
          }
        </div>

        <div className="flex flex-col w-full gap-2">
          <div className="RegistrosEyG-Cuadro1-text">
            <span>Tipo de gasto</span>
            <span>
              {accounts?.find((x) => x._id === expense.accountEntry)?.name ||
                "Cuenta no reconocida"}
            </span>
          </div>
          <div className="RegistrosEyG-Cuadro1-text">
            <span>Importe</span>
            <span>{expense.amount.toString().toLocaleString()} Bs.</span>
          </div>
          <div className="RegistrosEyG-Cuadro1-text">
            <span>Formas de pago</span>
            <span>
              {expense.paymentMethodCurrentAccount ? "Cta. Cte" : expense.creditBuy ? "Crédito" : "Contado"}
            </span>
          </div>
          <div className="RegistrosEyG-Cuadro1-text">
            <span>Documento</span>
            <span>{expense.documentNumber}</span>
          </div>
          <div className="RegistrosEyG-Cuadro1-text flex flex-col gap-4">
            <span>Comenatrios</span>
            <div className="CuadroRegistrarEyG-comentario">
              <span>{expense.comment || "Sin comentarios"}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export { CuadroRegistrarEyG };
