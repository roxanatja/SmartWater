import { FC, useContext, useEffect, useMemo, useRef, useState } from "react";
import "./CuadroPrestamo.css";
import { Option } from "../../../components/Option/Option";
import { PrestamosContext } from "../PrestamosContext";
import { Loans } from "../../../../../type/Loans/Loans";
import { formatDateTime } from "../../../../../utils/helpers";
import React from "react";
import toast from "react-hot-toast";
import { DevolutionsApiConector, LoansApiConector } from "../../../../../api/classes";
import { Client } from "../../../../../type/Cliente/Client";
import { Item } from "../../../../../type/Item";
import { useNavigate } from "react-router-dom";

type Prestamo = {
  estadoContrato: "Contrato Vencido" | "Sin Contrato" | "Con Contrato" | null;
  loan: Loans;
  productos: Array<Item>;
  info?: boolean;
};

const CuadroPrestamo: FC<Prestamo> = ({
  loan,
  productos,
  estadoContrato,
  info,
}) => {
  const { setShowModal, setSelectedClient, setSelectedLoan } = useContext(PrestamosContext);

  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [hasDevolution, setHasDevolutions] = useState<boolean>(true);
  const optionsRef = useRef<HTMLDivElement>(null);

  const Opciones = () => {
    setShowOptions(!showOptions);
  };
  const navigate = useNavigate()

  const Edit = () => {
    if (hasDevolution) {
      toast.error("Este préstamo ya tiene devoluciones registradas. No es posible editarlo.")
    } else {
      setSelectedClient(loan.client[0] as unknown as Client);
      setSelectedLoan(loan)
      navigate("/Prestamos/RegistrarPrestamo")
    }
    setShowOptions(false);
  };

  const Delete = async () => {
    if (hasDevolution) {
      toast.error("Este préstamo ya tiene devoluciones registradas. No es posible eliminar.")
    } else {
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
    }
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

  const detailsToShow = useMemo(() => loan.detail.filter(d => d.quantity > 0), [loan])

  useEffect(() => {
    if (loan) {
      DevolutionsApiConector.get({ filters: { loan: loan._id }, pagination: { page: 1, pageSize: 1 } }).then(res => {
        if (res && res.metadata.totalCount) {
          setHasDevolutions(res.metadata.totalCount > 0)
        } else {
          setHasDevolutions(false)
        }
      })
    }
  }, [loan])

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
            <div className={`flex items-center justify-between ${info ? "w-full" : "w-[calc(100%_-_30px)]"} overflow-hidden`}>
              <div className="w-full flex items-center justify-between gap-2">
                <div className="CuadroVentaCliente-header flex gap-4 items-center flex-[2] overflow-hidden">
                  {loan.client[0]?.clientImage ? (
                    <img
                      src={loan.client[0]?.clientImage}
                      alt=""
                      className="infoClientes-imgStore"
                    />
                  ) : (
                    <div className="bg-blue_custom text-white px-3.5 py-1.5 rounded-full flex justify-center items-center">
                      <div className="opacity-0">.</div>
                      <p className="absolute font-extrabold whitespace-nowrap">
                        {loan.client[0]?.fullName?.[0] || "S"}
                      </p>
                    </div>
                  )}
                  <span className="break-all">{loan.client[0]?.fullName || "Sin nombre"}</span>
                </div>
                <div className="flex gap-2 flex-1 justify-end w-fit">
                  <div className="infoClientes-ultimaventa border-blue_custom text-blue_custom">
                    <span>
                      {formatDateTime(
                        loan.created,
                        "numeric",
                        "2-digit",
                        "2-digit"
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {
              !info &&
              <div className="absolute right-0 p-4 rounded-full z-[35] top-0 flex flex-col gap-6">
                <button type="button" className="btn" onClick={() => {
                  setShowModal(true);
                  setSelectedClient(loan.client[0] as unknown as Client);
                }}>
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
              <span className="text-blue_custom">{loan.client[0]?.code || "Sin código"}</span>
            </span>
            <br />
            <span>
              Código:{" "}
              <span className="text-blue_custom">{loan.code || "Sin código"}</span>
            </span>
          </div>
        </div>
        <div className="flex flex-wrap CuadroVentaCliente-productos items-end justify-end">
          <div className="w-full min-h-28 max-h-28 overflow-y-auto">
            {
              detailsToShow.length > 0 ? (
                <div className="grid grid-cols-3 gap-4">
                  <div className="font-bold text-left sticky top-0 col-span-2">
                    <span>Items</span>
                  </div>
                  <div className="font-bold sticky top-0 text-center">
                    <span>Cantidad</span>
                  </div>
                  {detailsToShow.map((detail: any, index: number) => {
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
                        <div className="flex w-full justify-center">
                          <div className="CuadroVentaCliente-TextContainer font-semibold text-center !bg-transparent !border-blue_custom">
                            <span className="CuadroVentaCliente-text">
                              {detail.quantity}
                            </span>
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })}
                </div>
              ) : (
                <p className="w-full flex justify-center items-center min-h-16">Todos los items han sido devueltos</p>
              )}
          </div>

          <div className="PedidosCurso-Nota flex gap-3 border-b border-blue_bright/30 pb-2 relative mt-4 w-full">
            <i className="fa-solid fa-message text-xl text-blue_custom"></i>

            <div>
              {loan.comment || "Sin comentarios"}
            </div> {/* Comentario del pedido */}

          </div>
          <div className="w-full flex items-end flex-col">

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
      </div>
    </>
  );
};

export { CuadroPrestamo };
