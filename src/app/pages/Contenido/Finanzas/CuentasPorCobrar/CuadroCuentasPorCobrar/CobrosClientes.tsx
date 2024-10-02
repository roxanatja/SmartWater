import { Client } from "../../../../../../Class/types.data";
import "./CuadroCuentasPorCobrar.css";

const CobrosClientes = ({
  sale,
  onSendBill,
}: {
  sale: Client;
  onSendBill: () => void;
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
            <span>{sale?.fullName || "N/A"}</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="CuadroVentaCliente-text">
            <span>
              Fecha:{" "}
              <span style={{ color: "#1A3D7D" }}>
                {new Date(sale.created).toLocaleString()}
              </span>
            </span>
          </div>
          <div className="CobrosClientes-pago">
            <span>
              {sale.credit.toLocaleString()}{" "}
              <span className="font-normal">Bs.</span>
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export { CobrosClientes };
