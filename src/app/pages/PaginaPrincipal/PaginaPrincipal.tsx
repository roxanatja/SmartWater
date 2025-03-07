import "./PaginaPrincipal.css";
import { FC } from "react";
import { Sidebar } from "../components/Sidebar/Sidebar";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { InicioWrapper } from "../Contenido/Inicio/InicioWrapper";
import { ClientesWrapper } from "../Contenido/Clientes/ClientesWrapper";
import { MapaClientesWrapper } from "../Contenido/MapaClientes/MapaClientesWrapper";
import { MonitoreoDistribuidoresWrapper } from "../Contenido/MonitoreoDistribuidores/MonitoreoDistribuidoresWrapper";
import { VentasWrapper } from "../Contenido/Ventas/VentasWrapper";
import { PedidosWrapper } from "../Contenido/Pedidos/PedidosWrapper";
import { PrestamosWrapper } from "../Contenido/Préstamos/PrestamosWrapper";
import { ArqueoDeCajaWrapper } from "../Contenido/Finanzas/ArqueoDeCaja/ArqueoDeCajaWrapper";
import { CuentasPorCobrarWrapper } from "../Contenido/Finanzas/CuentasPorCobrar/CuentasPorCobrarWrapper";
import { EgresosGastosWrapper } from "../Contenido/Finanzas/EgresosGastos/EgresosGastosWrapper";
import { ProveedoresWrapper } from "../Contenido/Finanzas/Proveedores/ProveedoresWrapper";
import { CuentasPorPagarWrapper } from "../Contenido/Finanzas/CuentasPorPagar/CuentasPorPagarWrapper";
import { ReportesIngresosWrapper } from "../Contenido/Reportes/ReportesIngresos/ReportesIngresosWrapper";
import { ReportesGraficosWrapper } from "../Contenido/Reportes/ReportesIngresos/ReportesGraficos/ReportesGraficosWrapper";
import { ReportesEgresosWrapper } from "../Contenido/Reportes/ReportesEgresos/ReportesEgresosWrapper";
import { ReportesEgresosGraficosWrapper } from "../Contenido/Reportes/ReportesEgresos/ReportesGraficos/ReportesEgresosGraficosWrapper";
import { ReportesResultadosWrapper } from "../Contenido/Reportes/ReportesResultados/ReportesResultadosWrapper";
import { ConfiguracionGeneralWrapper } from "../Contenido/Configuracion/ConfiguracionGeneral/ConfiguracionGeneralWrapper";
import { UsuariosWrapper } from "../Contenido/Configuracion/Usuarios/UsuariosWrapper";
import { BarriosWrapper } from "../Contenido/Configuracion/Barrios/BarriosWrapper";
import { ZonasWrapper } from "../Contenido/Configuracion/Zonas/ZonasWrapper";
import { ProductosWrapper } from "../Contenido/Configuracion/Productos/ProductosWrapper";
import { ItemsWrapper } from "../Contenido/Configuracion/Items/ItemsWrapper";
import LoginFormWrapper from "../Contenido/LoginForm/LoginPageWrapper";
import ProtectedRoute from "../EntryComponents/ProtectRouter";
import { HorariosWrapper } from "../Contenido/Configuracion/Horarios/HorariosWrapper";
import { CategoriesWrapper } from "../Contenido/Configuracion/Categorias/CategoriesWrapper";
import DatosEmpresa from "../Contenido/Configuracion/DatosEmpresa/DatosEmpresa";
import { PromocionesWrapper } from "../Contenido/Configuracion/Promociones/PromocionesWrapper";
import InventariosWrapper from "../Contenido/Inventarios/InventariosWrapper";
import ComisionesWrapper from "../Contenido/Comisiones/ComisionesWrapper";

const PaginaPrincipal: FC = () => {
  return (
    <>
      <Router>
        <div className="flex">
          <Sidebar />
          <div className="Contenedor max-md:w-full relative bg-main-background overflow-hidden">
            <Routes>
              {/* Ruta de login */}
              <Route path="/users/login" element={<LoginFormWrapper />} />
              {/* Protege todas las rutas que necesitan autenticación */}
              <Route element={<ProtectedRoute />}>
                <Route path="" element={<Navigate to="/Inicio" />} />
                <Route path="/Inicio" element={<InicioWrapper />} />
                <Route path="/Clientes/*" element={<ClientesWrapper />} />
                <Route path="/Ventas/*" element={<VentasWrapper />} />
                <Route path="/Prestamos/*" element={<PrestamosWrapper />} />
                <Route path="/Pedidos/*" element={<PedidosWrapper />} />
                <Route
                  path="/Finanzas/ArqueoDeCajas"
                  element={<ArqueoDeCajaWrapper />}
                />
                <Route
                  path="/Finanzas/CuentasPorCobrarCobros/*"
                  element={<CuentasPorCobrarWrapper />}
                />
                <Route
                  path="/Finanzas/EgresosGastos/*"
                  element={<EgresosGastosWrapper />}
                />
                <Route
                  path="/Finanzas/Proveedores"
                  element={<ProveedoresWrapper />}
                />
                <Route
                  path="/Finanzas/CuentasPorPagar/*"
                  element={<CuentasPorPagarWrapper />}
                />
                <Route
                  path="/Finanzas/Inventarios/*"
                  element={<InventariosWrapper />}
                />
                <Route
                  path="/Finanzas/Comisiones/*"
                  element={<ComisionesWrapper />}
                />
                <Route
                  path="/Reportes/Ingresos/*"
                  element={<ReportesIngresosWrapper />}
                />
                <Route
                  path="/Reportes/Ingresos/Graficos/*"
                  element={<ReportesGraficosWrapper />}
                />
                <Route
                  path="/Reportes/Egresos/*"
                  element={<ReportesEgresosWrapper />}
                />
                <Route
                  path="/Reportes/Egresos/Graficos/*"
                  element={<ReportesEgresosGraficosWrapper />}
                />
                <Route
                  path="/Reportes/Resultados/*"
                  element={<ReportesResultadosWrapper />}
                />
                <Route
                  path="/MapaClientes/*"
                  element={<MapaClientesWrapper />}
                />
                <Route
                  path="/MonitoreoDistribuidores/*"
                  element={<MonitoreoDistribuidoresWrapper />}
                />
                <Route
                  path="/Configuracion/General"
                  element={<ConfiguracionGeneralWrapper />}
                />
                <Route
                  path="/Configuracion/DatosEmpresa"
                  element={<DatosEmpresa />}
                />
                <Route
                  path="/Configuracion/Usuarios"
                  element={<UsuariosWrapper />}
                />
                <Route
                  path="/Configuracion/Horarios"
                  element={<HorariosWrapper />}
                />
                <Route
                  path="/Configuracion/Barrios"
                  element={<BarriosWrapper />}
                />
                <Route path="/Configuracion/Zonas" element={<ZonasWrapper />} />
                <Route path="/Configuracion/Promociones" element={<PromocionesWrapper />} />
                <Route path="/Configuracion/CategoriasUnidades" element={<Navigate to={"/Configuracion/CategoriasUnidades/Categorias"} replace={true} />} />
                <Route path="/Configuracion/CategoriasUnidades/:section" element={<CategoriesWrapper />} />
                <Route
                  path="/Configuracion/Productos"
                  element={<ProductosWrapper />}
                />
                <Route path="/Configuracion/Items" element={<ItemsWrapper />} />
              </Route>
              {/* Redirige cualquier ruta desconocida a Inicio */}
              <Route path="*" element={<Navigate to="/Inicio" />} />
            </Routes>
          </div>
        </div>
      </Router>
    </>
  );
};

export { PaginaPrincipal };
