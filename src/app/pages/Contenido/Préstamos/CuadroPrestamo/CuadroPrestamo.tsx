import { FC, useContext, useEffect, useRef, useState } from "react";
import "./CuadroPrestamo.css";
import { Option } from "../../../components/Option/Option";
import { PrestamosContext } from "../PrestamosContext";
import Product from "../../../../../type/Products/Products";
import { Loans } from "../../../../../type/Loans/Loans";
import { formatDateTime } from "../../../../../utils/helpers";
import React from "react";
import toast from "react-hot-toast";
import { LoansApiConector } from "../../../../../api/classes";

type Prestamo = {
  estadoContrato: "Contrato Vencido" | "Sin Contrato" | "Con Contrato" | null;
  loan: Loans;
  productos: Array<Product>;
  info?: boolean;
};

const CuadroPrestamo: FC<Prestamo> = ({
  loan,
  productos,
  estadoContrato,
  info,
}) => {
  const { setShowMiniModal } = useContext(PrestamosContext);

  const [showOptions, setShowOptions] = useState<boolean>(false);
  const optionsRef = useRef<HTMLDivElement>(null);

  const Opciones = () => {
    setShowOptions(!showOptions);
  };

  const Edit = () => {
    setShowOptions(false);
  };

  const Delete = async () => {
    toast.error(
      (t) => (
        <div>
          <p className="mb-4 text-center text-[#888]">
            Se <b>eliminará</b> este prestamo <br /> pulsa <b>Proceder</b> para continuar
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
                const response = await LoansApiConector.delete({ loanId: loan._id });
                if (!!response) {
                  toast.success(response.mensaje, {
                    position: "top-center",
                  });
                  window.location.reload();
                } else {
                  toast.error("Error al eliminar prestamo", {
                    position: "top-center",
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
      <div className="CuadroPrestamo-container relative w-full bg-blocks dark:border-blocks shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] dark:shadow-slate-200/25">
        <div className="flex flex-col gap-4">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div className={`flex items-center justify-between ${info ? "w-full" : "w-[calc(100%_-_60px)]"}`}>
              <div className="CuadroVentaCliente-header flex gap-4 items-center">
                <img
                  src={
                    loan.client[0]?.storeImage
                      ? loan.client[0]?.storeImage
                      : info
                        ? "../Cliente2.svg"
                        : "./Cliente2.svg"
                  }
                  alt=""
                  className="w-8 h-8 rounded-full"
                />
                <span>{loan.client[0]?.fullName}</span>
              </div>
              <div className="infoClientes-ultimaventa border-blue_custom text-blue_custom">
                <span>
                  {formatDateTime(
                    loan.created,
                    "numeric",
                    "numeric",
                    "numeric"
                  )}
                </span>
              </div>
            </div>
            {
              !info &&
              <div className="absolute right-0 p-4 rounded-full z-[35] top-0 flex flex-col gap-6">
                <button type="button" className="btn" onClick={() => setShowMiniModal(true)}>
                  <img src={info ? "../Opciones-icon.svg" : "./Opciones-icon.svg"} alt="" className="invert-0 dark:invert" />
                </button>

                <div className="relative" ref={optionsRef}>
                  <button type="button" className="btn" onClick={() => Opciones()}>
                    <img src="../opcion-icon.svg" alt="" className="invert-0 dark:invert" />
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
          <div className="CuadroVentaCliente-text mb-4">
            <span>
              No. Cliente:{" "}
              <span className="text-blue_custom">{loan.client[0]?.code}</span>
            </span>
          </div>
        </div>
        <div className="flex flex-wrap CuadroVentaCliente-productos items-end justify-end">
          <div className="w-full min-h-28 max-h-28 overflow-y-auto">
            {loan.detail.length > 0 ? (
              <div className="grid grid-cols-3 gap-4">
                <div className="font-bold text-left sticky top-0 col-span-2">
                  <span>Productos</span>
                </div>
                <div className="font-bold sticky top-0 text-center">
                  <span>Cantidad</span>
                </div>
                {loan.detail.map((detail: any, index: number) => {
                  let product = productos.find(
                    (product) => product._id === detail.item
                  );
                  return (
                    <React.Fragment key={index}>
                      <div className="flex items-center gap-2 col-span-2">
                        <img
                          src={
                            product?.imageUrl ||
                            "https://imgs.search.brave.com/cGS0E8gPAr04hSRQFlmImRAbRRWldP32Qfu_0atMNyQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMudmV4ZWxzLmNv/bS9tZWRpYS91c2Vy/cy8zLzE1NjkyOC9p/c29sYXRlZC9wcmV2/aWV3LzZjNjVjMTc3/ZTk0ZTc1NTRlMWZk/YjBhZjMwMzhhY2I3/LWljb25vLWN1YWRy/YWRvLWRlLXNpZ25v/LWRlLWludGVycm9n/YWNpb24ucG5n"
                          }
                          alt=""
                          className="w-7 h-7 rounded-full"
                        />
                        <span className="CuadroVentaCliente-text">
                          {product ? product.name : "Producto no encontrado"}
                        </span>
                      </div>
                      <div className="CuadroVentaCliente-TextContainer font-semibold text-center">
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
              <img
                src={info ? "../ConContrato.svg" : "./ConContrato.svg"}
                alt=""
                className="w-5 h-5"
              />
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
                  xlinkHref={info ? "../ConContrato.svg" : "./ConContrato.svg"}
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
              <img
                src={info ? "../ContratoVencido.svg" : "./ContratoVencido.svg"}
                alt=""
                className="w-5 h-5"
              />
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
