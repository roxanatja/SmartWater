import { Account } from "../../../../../../type/AccountEntry";
import { Expense } from "../../../../../../type/Expenses";
import { Providers } from "../../../../../../type/providers";
import { User } from "../../../../../../type/User";
import "./RegistrosEyG.css";

const CuadroRegistrarEyG = ({
  expense,
  users,
  accounts,
  providers
}: {
  expense: Expense;
  users?: User[];
  providers?: Providers[];
  accounts?: Account[];
}) => {
  const user = users?.find((x) => x._id === expense.user);

  return (
    <>
      <div className="CuadroRegistrarEyG-container w-full bg-blocks dark:border-blocks">
        <div className="CuadroVentaCliente-header">
          <div className="bg-blue_custom text-white px-3.5 py-1.5 rounded-full flex justify-center items-center relative z-0">
            <div className="opacity-0">.</div>
            <p className="absolute font-extrabold whitespace-nowrap">
              {user?.fullName?.[0] || "N"}
            </p>
          </div>
          <span>{user?.fullName || "N/A"}</span>
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
            <span>Proveedor</span>
            <span>
              {providers?.find((x) => x._id === expense.provider)?.fullName ||
                "proveedor no reconocido"}
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
