import { Client } from "../../../../../../Class/types.data";
import { Bills } from "../../../../../../type/Bills";
import { User } from "../../../../../../type/User";
import "./CuadroCuentasPorCobrar.css";

const CobrosClientes = ({
  sale,
  bill,
  user,
  onSendBill,
}: {
  sale?: Client;
  bill?: Bills;
  onSendBill: () => void;
  user?: User[];
}) => {
  return (
    <>
      <div className="CuadroCuentasPorCobrar-container">
        <div className="flex justify-between items-center">
          <div className="CuadroVentaCliente-header">
            <img
              src={sale?.storeImage || "../../Cliente2.svg"}
              alt=""
              className="w-8 h-8 rounded-full"
            />
            <span>
              {sale?.fullName ||
                user?.find((x) => x._id === bill?.user)?.fullName}
            </span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="CuadroVentaCliente-text">
            <span>
              Fecha:{" "}
              <span style={{ color: "#1A3D7D" }}>
                {new Date(
                  sale?.created || bill?.created || ""
                ).toLocaleString()}
              </span>
            </span>
          </div>
          <div className="CobrosClientes-pago">
            <span>
              {sale?.credit.toLocaleString() || bill?.amount.toLocaleString()}{" "}
              <span className="font-normal">Bs.</span>
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export { CobrosClientes };
