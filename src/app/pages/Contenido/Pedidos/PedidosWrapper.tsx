import { FC } from "react";
import { PedidosProvider } from "./PedidosContext";
import { Pedidos } from "./Pedidos";
import { Navigate, Route, Routes } from "react-router-dom";
import { RegistrarVenta } from "./RegistrarVenta/RegistrarVenta";
import { RegistrarPedido } from "./RegistrarPedido/RegistrarPedido";

const PedidosWrapper: FC = () => {
  return (
    <>
      <PedidosProvider>
        <Routes>
          <Route path="/" element={<Navigate to={"/Pedidos/EnCurso"} replace- />} />
          <Route path="/:section/*" element={<Pedidos />} />
          <Route path="/RegistrarPedido" element={<RegistrarPedido />} />
          <Route path="/RegistrarVenta" element={<RegistrarVenta />} />
        </Routes>
      </PedidosProvider>
    </>
  );
};

export { PedidosWrapper };
