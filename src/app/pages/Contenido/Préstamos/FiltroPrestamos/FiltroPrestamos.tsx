import { FC, useContext, useState } from "react";
import { useForm } from "react-hook-form";
import "./FiltroPrestamos.css";
import { PrestamosContext } from "../PrestamosContext";
import { Contador } from "../../../components/Contador/Contador";
import { Loans } from "../../../../../type/Loans/Loans";

interface FilterForm {
  fechaDesde: string;
  fechaHasta: string;
  hasContract: boolean;
  hasExpiredContract: boolean;
  renewDatefrom: number;
  renewDateTo: number;
}

const FiltroPrestamos = ({
  loans,
  onChange,
}: {
  onChange: (val: Loans[]) => void;
  loans: Loans[];
}) => {
  const { setShowFiltro } = useContext(PrestamosContext);
  const [opcionesVisibles, setOpcionesVisibles] = useState<boolean>(true);
  const { register, handleSubmit, setValue } = useForm<FilterForm>();

  const handleOpcionesClick = () => {
    setOpcionesVisibles(!opcionesVisibles);
  };

  const onSubmit = (data: FilterForm) => {
    const filteredLoans = loans.filter((loan) => {
      let matches = true;

      // Filtrar por fecha
      if (data.fechaDesde) {
        matches =
          matches && new Date(loan.created) >= new Date(data.fechaDesde);
      }
      if (data.fechaHasta) {
        matches =
          matches && new Date(loan.created) <= new Date(data.fechaHasta);
      }

      // Filtrar por contrato
      if (data.hasContract) {
        matches = matches && loan.hasContract;
      }

      if (data.hasExpiredContract) {
        matches = matches && loan.hasExpiredContract;
      }

      return matches;
    });

    onChange(filteredLoans);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="p-6">
        <h2 className="text-blue_custom font-bold">Filtrar</h2>
        <div>
          <div className="FiltroClientes-Renovación">
            <div className="FiltroClientes-RenovaciónTitulo">
              <span>Renovación</span>
              <button
                onClick={handleOpcionesClick}
                className={
                  opcionesVisibles
                    ? "FiltroClientes-btnAgregarProducto FiltroClientesactive-btn"
                    : "FiltroClientes-btnAgregarProducto"
                }
              >
                <span className="material-symbols-outlined">expand_more</span>
              </button>
            </div>
            <div className="lineagris"></div>
            {opcionesVisibles && (
              <>
                <div className="FiltroClientes-RenovaciónOption">
                  <div className="FiltroClientes-Renovadoinicio">
                    <span>Renovado desde</span>
                    <Contador
                      onIncrementar={(val) => setValue("renewDatefrom", val)}
                      onDecrementar={(val) => setValue("renewDatefrom", val)}
                    />
                  </div>
                  <div className="FiltroClientes-Renovadoinicio">
                    <span>Renovado hasta</span>
                    <Contador
                      onIncrementar={(val) => setValue("renewDateTo", val)}
                      onDecrementar={(val) => setValue("renewDateTo", val)}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="FiltroPrestamos-FechaContainer">
            <div className="FiltroVenta-titulos">
              <span>Fechas</span>
            </div>
            <div className="FiltroVenta-Fechascontainer">
              <div className="FiltroVenta-Fecha">
                <span style={{ textAlign: "left", width: "100%" }}>De</span>
                <div className="FiltroVenta-FechaInput">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="24"
                    viewBox="0 0 22 24"
                    fill="none"
                  >
                    <path
                      d="M19.2 2.4H18V0H15.6V2.4H6V0H3.6V2.4H2.4C1.068 2.4 0 3.468 0 4.8V21.6C0 22.2365 0.252856 22.847 0.702944 23.2971C1.15303 23.7471 1.76348 24 2.4 24H19.2C20.52 24 21.6 22.92 21.6 21.6V4.8C21.6 4.16348 21.3471 3.55303 20.8971 3.10294C20.447 2.65286 19.8365 2.4 19.2 2.4ZM19.2 21.6H2.4V8.4H19.2V21.6ZM10.8 19.2V16.8H6V13.2H10.8V10.8L15.6 15L10.8 19.2Z"
                      fill="black"
                    />
                  </svg>
                  <input type="date" {...register("fechaDesde")} />
                </div>
              </div>
              <div className="FiltroVenta-Fecha">
                <span style={{ textAlign: "left", width: "100%" }}>A</span>
                <div className="FiltroVenta-FechaInput">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="24"
                    viewBox="0 0 22 24"
                    fill="none"
                  >
                    <path
                      d="M19.2 2.4H18V0H15.6V2.4H6V0H3.6V2.4H2.4C1.068 2.4 0 3.468 0 4.8V21.6C0 22.2365 0.252856 22.847 0.702944 23.2971C1.15303 23.7471 1.76348 24 2.4 24H19.2C20.52 24 21.6 22.92 21.6 21.6V4.8C21.6 4.16348 21.3471 3.55303 20.8971 3.10294C20.447 2.65286 19.8365 2.4 19.2 2.4ZM19.2 21.6H2.4V8.4H19.2V21.6ZM10.8 10.8V13.2H15.6V16.8H10.8V19.2L6 15L10.8 10.8Z"
                      fill="black"
                    />
                  </svg>
                  <input type="date" {...register("fechaHasta")} />
                </div>
              </div>
            </div>
            <div className="FiltroPrestamos-container">
              <div className="FiltroPrestamos-containercheck">
                <div className="FiltroPrestamos-titulos">
                  <span>Préstamos</span>
                </div>
                <div className="FiltroPrestamos-itemCheckContainerColum text-nowrap">
                  <div className="FiltroVenta-itemCheck">
                    <div className="FiltroVenta-item">
                      <input
                        className="input-check w-4 h-4"
                        type="checkbox"
                        {...register("hasContract")}
                      />
                      <img src="./ConContrato.svg" alt="" />
                      <span>Con contrato</span>
                    </div>
                  </div>
                  <div className="FiltroVenta-itemCheck">
                    <div className="FiltroVenta-item text-nowrap">
                      <input
                        className="input-check w-4 h-4"
                        type="checkbox"
                        {...register("hasExpiredContract")}
                      />
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="29"
                        height="29"
                        viewBox="0 0 29 29"
                        fill="none"
                      >
                        <image
                          xlinkHref={"/ConContrato.svg"}
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
                        <path
                          d="M7.0 22.9L23.1 6"
                          stroke="#FF0000"
                          strokeWidth="3"
                        />
                      </svg>
                      <span>Con contrato expirado</span>
                    </div>
                  </div>
                </div>
              </div>
              <p></p>
            </div>
            <div className="flex justify-between w-full items-center">
              <button
                type="button"
                onClick={() => {
                  setShowFiltro(false);
                }}
                className="mt-4 border-blue-500 border-2 rounded-full px-4 py-2 text-blue_custom font-bold"
              >
                Quitar Filtros
              </button>
              <button
                type="submit"
                className="mt-4 bg-blue-500 text-white rounded-full px-4 py-2"
              >
                Aplicar Filtros
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default FiltroPrestamos;
