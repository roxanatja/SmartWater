import { FC } from "react";
import { ClientesProvider } from "./ClientesContext";
import { FilterProvider } from "../../components/FilterContexr/FilterContext";
import { Clientes } from "./Clientes";
import { Route, Routes } from "react-router-dom";
import { RegistrarVenta } from "./RegistrarVenta/RegistrarVenta";
import { RegistrarPedido } from "./RegistrarPedido/RegistrarPedido";
import { RegistrarPrestamo } from "./RegistrarPrestamo/RegistrarPrestamo";
import { RegistrarDevolucion } from "./RegistrarDevolucion/RegistrarDevolucion";
import { ClientEdit } from "./EditClient/EditClient";

const ClientesWrapper: FC = () => {
  return (
    <>
      <ClientesProvider>
        <FilterProvider>
          <Routes>
            <Route path="/*" element={<Clientes />} />
            <Route path="/RegistrarVenta" element={<RegistrarVenta />} />
            <Route path="/RegistrarPedido" element={<RegistrarPedido />} />
            <Route path="/RegistrarPrestamo" element={<RegistrarPrestamo />} />
            <Route
              path="/RegistrarDevolucion/:parcial"
              element={<RegistrarDevolucion />}
            />
            <Route path="/EditarCliente" element={<ClientEdit />} />
          </Routes>
        </FilterProvider>
      </ClientesProvider>
    </>
  );
};

export { ClientesWrapper };
