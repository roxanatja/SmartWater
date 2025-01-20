import { Transaction } from "../../../../../../type/Cash";
import { User } from "../../../../../../type/User";
import { formatDateTime } from "../../../../../../utils/helpers";
import "./TableArqueoCaja.css";

const TableArqueoCaja = ({ cash, distrib }: {
  cash?: Transaction[];
  distrib: User[]
}) => {
  return (
    <>
      <div className="text-font-color">
        <table style={{ width: "80%" }}>
          <thead>
            <tr className="TableArqueoCaja-titulos">
              <th className="px-2">
                <span>Hora de apertura</span>
              </th>
              <th className="px-2">
                <span>Hora de cierre</span>
              </th>
              <th className="px-2">
                <span>Distribuidor </span>
              </th>
              <th className="px-2">
                <span>Sistema</span>
              </th>
              <th className="px-2">
                <span>Diferencia</span>
              </th>
              <th className="px-2">
                <span>Estado</span>
              </th>
            </tr>
          </thead>
          <tbody className="max-h-56 overflow-y-scroll">
            {cash &&
              cash.map((row, index) => (
                <tr className="TableArqueoCaja-body" key={index}>
                  <td className="px-2">
                    <div style={{ marginTop: "16px" }}>
                      <span className="whitespace-nowrap">
                        {row?.startDate
                          ? formatDateTime(row?.startDate, 'numeric', '2-digit', '2-digit', true, true)
                          : "N/A"}
                      </span>
                    </div>
                  </td>
                  <td className="px-2">
                    <div style={{ marginTop: "16px" }}>
                      <span className="whitespace-nowrap">
                        {row?.endDate
                          ? formatDateTime(row?.endDate, 'numeric', '2-digit', '2-digit', true, true)
                          : "N/A"}
                      </span>
                    </div>
                  </td>
                  <td className="px-2">
                    <div style={{ marginTop: "16px" }}>
                      <span>{distrib.find(d => d._id === row.user)?.fullName || "Distribuidor desconocido"}</span>
                    </div>
                  </td>
                  <td className="px-2">
                    <div style={{ marginTop: "16px" }}>
                      <span>
                        {row?.initialAmount.toLocaleString() || "N/A"}
                      </span>
                    </div>
                  </td>
                  <td className="px-2">
                    <div style={{ marginTop: "16px" }}>
                      <span>{row?.difference.toLocaleString() || "N/A"}</span>
                    </div>
                  </td>
                  <td className="px-2">
                    <div style={{ marginTop: "16px" }}>
                      <span>{row?.state ? "Abierto" : "Cerrado" || "N/A"}</span>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export { TableArqueoCaja };
