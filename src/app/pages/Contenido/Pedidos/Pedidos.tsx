import { FiltroPaginado } from "../../components/FiltroPaginado/FiltroPaginado";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import "./Pedidos.css";
import { FC, useContext, useEffect } from "react";
import { PedidosContext } from "./PedidosContext";
import PedidosCurso from "./CuadroPedidos/PedidosCurso";
import { PedidosAtendidos } from "./CuadroPedidos/PedidosAtendidos";
import { OpcionesPedidos } from "./CuadroPedidos/OpcionesPedidos/OpcionesPedidos";
import { SmartwaterContext } from "../../../SmartwaterContext";
import { FiltroPedidos } from "./FiltroPedidos/FiltroPedidos";

const Pedidos: FC = () => {
  const { showMiniModal, showFiltro, setShowFiltro } =
    useContext(PedidosContext);
  const { selectedOption, setSelectedOption } = useContext(SmartwaterContext);

  const Onfilter = () => {
    setShowFiltro(true);
  };

  useEffect(() => {
    setSelectedOption(false);
  }, [setSelectedOption]);

  return (
    <>
      <div>
        <PageTitle titulo="Pedidos" icon="./Pedidos-icon.svg" />
        <FiltroPaginado
          filtro
          swith={true}
          opcionesSwitch1="En curso"
          opcionesSwitch2="Atendidos"
          onFilter={Onfilter}
        >
          {selectedOption === false ? (
            <div className="grid grid-cols-2 w-full gap-4">
              <PedidosCurso />
            </div>
          ) : (
            <div className="grid grid-cols-2 w-full gap-4">
              <PedidosAtendidos />
            </div>
          )}
        </FiltroPaginado>
      </div>
      {showFiltro && <FiltroPedidos />}
      {showMiniModal && <OpcionesPedidos />}
    </>
  );
};

export { Pedidos };
