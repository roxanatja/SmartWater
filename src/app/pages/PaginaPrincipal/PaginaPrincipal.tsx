import "./PaginaPrincipal.css";
import { FC } from "react";
import { Sidebar } from "../components/Sidebar/Sidebar";
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Clientes } from "../Contenido/Clientes/Clientes";
import { Inicio } from "../Contenido/Inicio/Inicio";
import { MapaClientes } from "../Contenido/MapaClientes/MapaClientes";
import { MonitoreoDistribuidores } from "../Contenido/MonitoreoDistribuidores/MonitoreoDistribuidores";
import { Ventas } from "../Contenido/Ventas/Ventas";
import { Pedidos } from "../Contenido/Pedidos/Pedidos";
import { Prestamos } from "../Contenido/Préstamos/Prestamos";

const PaginaPrincipal: FC = () => {

    return (
        <>
            <Router>
                <div style={{ display: "flex" }}>
                    <Sidebar />
                    <div className="Contenedor">
                        <Routes>
                            <Route path="" element={<Navigate to='/Inicio' />} />

                            <Route path='/Inicio' element={<Inicio />} />

                            <Route path='/Clientes' element={<Clientes />} />

                            <Route path='/MapaClientes' element={<MapaClientes />} />

                            <Route path='/MonitoreoDistribuidores' element={<MonitoreoDistribuidores />} />

                            <Route path='/Ventas' element={<Ventas />} />

                            <Route path='/Pedidos' element={<Pedidos />} />

                            <Route path='/Prestamos' element={<Prestamos />} />

                            <Route path="*" element={<Navigate to='/Inicio' />} />
                        </Routes>
                    </div>
                </div>
            </Router>
        </>
    )
}

export { PaginaPrincipal }