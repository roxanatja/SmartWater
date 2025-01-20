import { Bills } from "../../../../../../type/Bills";
import { Client } from "../../../../../../type/Cliente/Client";
import { formatDateTime } from "../../../../../../utils/helpers";
import "./CuadroCuentasPorCobrar.css";

const CobrosClientes = ({
  bill,
  client
}: {
  client?: Client;
  bill: Bills;
}) => {
  return (
    <>
      <div className="CuadroCuentasPorCobrar-container">
        <div className="flex justify-between items-center">
          <div className="CuadroVentaCliente-header">
            {client?.clientImage ? (
              <img
                src={client?.clientImage}
                alt=""
                className="infoClientes-imgStore"
              />
            ) : (
              <div className="bg-blue_custom text-white px-3.5 py-1.5 rounded-full flex justify-center items-center relative">
                <div className="opacity-0">.</div>
                <p className="absolute font-extrabold whitespace-nowrap">
                  {client?.fullName?.[0] || "S"}
                </p>
              </div>
            )}
            <span>
              {client?.fullName || "Sin nombre"}
            </span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="CuadroVentaCliente-text">
            <span>
              Fecha:{" "}
              <span className="text-blue_custom">
                {formatDateTime(bill.created, 'numeric', '2-digit', '2-digit', true)}
              </span>
            </span>
          </div>
          <div className="CobrosClientes-pago text-blue_custom">
            <span>
              {bill?.amount.toLocaleString()}{" "}
              <span className="font-normal">Bs.</span>
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export { CobrosClientes };
