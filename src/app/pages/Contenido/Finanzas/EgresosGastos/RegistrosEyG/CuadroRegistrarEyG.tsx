import { Account } from "../../../../../../type/AccountEntry";
import { User } from "../../../../../../type/User";
import "./RegistrosEyG.css";

const CuadroRegistrarEyG = ({
  expense,
  users,
  accounts,
}: {
  expense: any;
  users?: User[];
  accounts?: Account[];
}) => {
  const user = users?.find((x) => x._id === expense.user);
  return (
    <>
      <div className="CuadroRegistrarEyG-container w-full">
        <div className="CuadroVentaCliente-header">
          <img src="../../Cliente2.svg" alt="" />
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
            <span>Importe</span>
            <span>{expense.amount.toString().toLocaleString()} Bs.</span>
          </div>
          <div className="RegistrosEyG-Cuadro1-text">
            <span>Formas de pago</span>
            <span>
              {expense.paymentMethodCurrentAccount ? "Cta. Cte" : "Efectivo"}
            </span>
          </div>
          <div className="RegistrosEyG-Cuadro1-text">
            <span>Documento</span>
            <span>{expense.documentNumber}</span>
          </div>
          <div className="RegistrosEyG-Cuadro1-text flex flex-col gap-4">
            <span>Comenatrios</span>
            <div className="CuadroRegistrarEyG-comentario">
              <span>{expense.comment}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export { CuadroRegistrarEyG };
