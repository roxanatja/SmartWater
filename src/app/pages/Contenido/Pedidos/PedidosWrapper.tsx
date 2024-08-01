import { FC } from "react";
import { PedidosProvider } from "./PedidosContext";
import { Pedidos } from "./Pedidos";
import { Route, Routes } from "react-router-dom";
import { RegistrarVenta } from "./RegistrarVenta/RegistrarVenta";

const PedidosWrapper: FC = () => {
  return (
    <>
      <PedidosProvider>
        <Routes>
          <Route path="/*" element={<Pedidos />} />
          <Route path="/RegistrarVenta" element={<RegistrarVenta />} />
        </Routes>
      </PedidosProvider>
    </>
  );
};

export { PedidosWrapper };
