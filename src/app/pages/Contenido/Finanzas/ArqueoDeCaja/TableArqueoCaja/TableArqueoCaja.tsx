import { Transaction } from "../../../../../../type/Cash";
import "./TableArqueoCaja.css";

const TableArqueoCaja = ({ cash }: { cash?: Transaction[] }) => {
  return (
    <>
      <div>
        <table style={{ width: "65%" }}>
          <thead>
            <tr className="TableArqueoCaja-titulos">
              <th>
                <span>Hora de apertura</span>
              </th>
              <th>
                <span>Hora de cierre</span>
              </th>
              <th>
                <span>Distribuidor </span>
              </th>
              <th>
                <span>Sistema</span>
              </th>
              <th>
                <span>Diferencia</span>
              </th>
              <th>
                <span>Estado</span>
              </th>
            </tr>
          </thead>
          <tbody className="max-h-56 overflow-y-scroll">
            {cash &&
              cash.map((row, index) => (
                <tr className="TableArqueoCaja-body" key={index}>
                  <td>
                    <div style={{ marginTop: "16px" }}>
                      <span>
                        {row?.startDate
                          ? new Date(row?.startDate).toLocaleString()
                          : "N/A"}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div style={{ marginTop: "16px" }}>
                      <span>
                        {row?.endDate
                          ? new Date(row?.endDate).toLocaleString()
                          : "N/A"}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div style={{ marginTop: "16px" }}>
                      <span>Alberto</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ marginTop: "16px" }}>
                      <span>
                        {row?.initialAmount.toLocaleString() || "N/A"}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div style={{ marginTop: "16px" }}>
                      <span>{row?.difference.toLocaleString() || "N/A"}</span>
                    </div>
                  </td>
                  <td>
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
