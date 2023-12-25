import "./PaginaPrincipal.css";
import { FC } from "react";
import { Sidebar } from "../components/Sidebar/Sidebar";
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Prestamos } from "../Contenido/Préstamos/Prestamos";
import { ArqueoDeCaja } from "../Contenido/Finanzas/ArqueoDeCaja/ArqueoDeCaja";
import { CuentasPorCobrar } from "../Contenido/Finanzas/CuentasPorCobrar/CuentasPorCobrar";
import { Historial } from "../Contenido/Finanzas/Historial/Historial";
import { EgresosGastos } from "../Contenido/Finanzas/EgresosGastos/EgresosGastos";
import { Proveedores } from "../Contenido/Finanzas/Proveedores/Proveedores";
import { CuentasPorPagar } from "../Contenido/Finanzas/CuentasPorPagar/CuentasPorPagar";
import { HistorialCuentas } from "../Contenido/Finanzas/CuentasPorPagar/HistorialCuentasPorPagar/HistorialCuentas";
import { InicioWrapper } from "../Contenido/Inicio/InicioWrapper";
import { ClientesWrapper } from "../Contenido/Clientes/ClientesWrapper";
import { MapaClientesWrapper } from "../Contenido/MapaClientes/MapaClientesWrapper";
import { MonitoreoDistribuidoresWrapper } from "../Contenido/MonitoreoDistribuidores/MonitoreoDistribuidoresWrapper";
import { VentasWrapper } from "../Contenido/Ventas/VentasWrapper";
import { PedidosWrapper } from "../Contenido/Pedidos/PedidosWrapper";
import { PrestamosWrapper } from "../Contenido/Préstamos/PrestamosWrapper";

const PaginaPrincipal: FC = () => {

    return (
        <>
            <Router>
                <div style={{ display: "flex" }}>
                    <Sidebar />
                    <div className="Contenedor">
                        <Routes>
                            <Route path="" element={<Navigate to='/Inicio' />} />

                            <Route path='/Inicio' element={<InicioWrapper />} />

                            <Route path='/Clientes' element={<ClientesWrapper />} />

                            <Route path='/MapaClientes' element={<MapaClientesWrapper />} />

                            <Route path='/MonitoreoDistribuidores' element={<MonitoreoDistribuidoresWrapper />} />

                            <Route path='/Ventas' element={<VentasWrapper />} />

                            <Route path='/Pedidos' element={<PedidosWrapper />} />

                            <Route path='/Prestamos' element={<PrestamosWrapper />} />

                            <Route path='/Finanzas/ArqueoDeCajas' element={<ArqueoDeCaja/>} />

                            <Route path='/Finanzas/CuentasPorCobrarCobros' element={<CuentasPorCobrar/>} />

                            <Route path='/Finanzas/CuentasPorCobrarCobros/Historial' element={<Historial/>} />

                            <Route path='/Finanzas/EgresosGastos' element={<EgresosGastos/>} />

                            <Route path='/Finanzas/Proveedores' element={<Proveedores/>} />

                            <Route path='/Finanzas/CuentasPorPagar' element={<CuentasPorPagar/>} />

                            <Route path='/Finanzas/CuentasPorPagar/Historial' element={<HistorialCuentas/>} />

                            <Route path="*" element={<Navigate to='/Inicio' />} />
                        </Routes>
                    </div>
                </div>
            </Router>
        </>
    )
}

export { PaginaPrincipal }