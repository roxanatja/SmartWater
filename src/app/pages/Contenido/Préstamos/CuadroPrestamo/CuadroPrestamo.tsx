import { FC, useContext, useState } from "react";
import "./CuadroPrestamo.css";
import { Option } from "../../../components/Option/Option";
import { PrestamosContext } from "../PrestamosContext";
import Product from "../../../../../type/Products/Products";
import { DeleteLoan } from "../../../../../services/LoansService";
import { Loans } from "../../../../../type/Loans/Loans";
import { formatDateTime } from "../../../../../utils/helpers";
import React from "react";

type Prestamo = {
  estadoContrato: "Contrato Vencido" | "Sin Contrato" | "Con Contrato" | null;
  loan: Loans;
  productos: Array<Product>;
};

const CuadroPrestamo: FC<Prestamo> = ({ loan, productos, estadoContrato }) => {
  const { setShowMiniModal } = useContext(PrestamosContext);

  const [showOptions, setShowOptions] = useState<boolean>(false);

  const Opciones = () => {
    setShowOptions(!showOptions);
  };

  const Edit = () => {
    setShowOptions(false);
  };

  const Delete = async () => {
    const response = await DeleteLoan(loan._id);

    if (response === 200) {
      console.log("Préstamo devuelto con éxito");
      window.alert("Préstamo devuelto con éxito");
      window.location.reload();
    } else {
      console.error("ERROR: ", response.statusText);
    }
  };
  return (
    <>
      <div className="CuadroPrestamo-container relative w-full">
        <div className="flex flex-col gap-4">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div className="CuadroVentaCliente-header">
              <img
                src={loan.client[0]?.storeImage || "./Cliente2.svg"}
                alt=""
                className="w-8 h-8 rounded-full"
              />
              <span>{loan.client[0]?.fullName}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <button
                type="button"
                className="btn"
                onClick={() => setShowMiniModal(true)}
              >
                <img src="./Opciones-icon.svg" alt="" />
              </button>
            </div>
            <div className="infoClientes-ultimaventa">
              <span>
                {formatDateTime(
                  loan.client[0]?.lastSale,
                  "numeric",
                  "numeric",
                  "numeric"
                )}
              </span>
            </div>
          </div>
          <div className="CuadroVentaCliente-text">
            <span>
              No. Cliente:{" "}
              <span style={{ color: "#1A3D7D" }}>{loan.client[0]?.code}</span>
            </span>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "end",
          }}
        >
          <div>
            <span className="CuadroPrestamo-texto">ítems</span>
          </div>
          <div>
            <button type="button" className="btn" onClick={() => Opciones()}>
              <img src="./opcion-icon.svg" alt="" />
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
        <div className="flex flex-wrap CuadroVentaCliente-productos items-end justify-end">
          <div className="w-full min-h-28 max-h-28 overflow-y-auto">
            {loan.detail.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="font-bold text-left sticky top-0 bg-white">
                  <span>Productos</span>
                </div>
                <div className="font-bold text-left sticky top-0 bg-white">
                  <span>Cantidad</span>
                </div>
                {loan.detail.map((detail: any, index: number) => {
                  let product = productos.find(
                    (product) => product._id === detail.item
                  );
                  return (
                    <React.Fragment key={index}>
                      <div className="flex items-center gap-2">
                        <img
                          src="./Botella-icon.svg"
                          alt=""
                          className="w-8 h-8"
                        />
                        <span className="CuadroVentaCliente-text">
                          {product ? product.name : "Producto no encontrado"}
                        </span>
                      </div>
                      <div className="CuadroVentaCliente-TextContainer font-semibold">
                        <span className="CuadroVentaCliente-text">
                          {detail.quantity}
                        </span>
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>
            ) : (
              <p>No hay items para mostrar</p>
            )}
          </div>

          {estadoContrato === "Con Contrato" ? (
            <div className="flex items-center gap-2 mt-4">
              <img src="./ConContrato.svg" alt="" className="w-5 h-5" />
              <span className="CuadroPrestamo-texto text-xs font-medium">
                Contrato
              </span>
            </div>
          ) : estadoContrato === "Sin Contrato" ? (
            <div className="flex items-center gap-2 mt-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="29"
                height="29"
                viewBox="0 0 29 29"
                fill="none"
              >
                <image
                  xlinkHref="./ConContrato.svg"
                  x="4"
                  y="5"
                  width="21"
                  height="21"
                />
                <circle
                  cx="14.5"
                  cy="14.5"
                  r="13"
                  stroke="#FF0000"
                  strokeWidth="3"
                />
                <path d="M7.0 22.9L23.1 6" stroke="#FF0000" strokeWidth="3" />
              </svg>
              <span className="CuadroPrestamo-texto text-xs font-medium">
                Sin Contrato
              </span>
            </div>
          ) : estadoContrato === "Contrato Vencido" ? (
            <div className="flex items-center gap-2 mt-4">
              <img src="./ContratoVencido.svg" alt="" className="w-5 h-5" />
              <span className="CuadroPrestamo-texto text-xs font-medium">
                Contrato Vencido
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};

export { CuadroPrestamo };
