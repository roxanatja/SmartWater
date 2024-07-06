import { AsideItem } from "../AsideMenu/AsideItem";
import { AsideSubMenu } from "../AsideSubMenu/AsideSubMenu";
import "./Sidebar.css";
import { FC } from "react";
import AuthenticationService from "../../../../services/AuthenService";
import { useNavigate } from "react-router-dom";

const Sidebar: FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    AuthenticationService.logout();
    navigate("users/login");
  };
  return (
    <>
      <div className="Sidebar scrool">
        <div className="Logo">
          <span className="smart">Smart</span>
          <span className="water">water</span>
        </div>
        <div>
          <ul style={{ display: "flex", flexDirection: "column", gap: "17px" }}>
            <AsideItem
              tituloItem="Inicio"
              to="/Inicio"
              icon="../../../home-icon.svg"
            />
            <AsideItem
              tituloItem="Clientes"
              to="/Clientes"
              icon="../../../clientes-icon.svg"
            />
            <AsideItem
              tituloItem="Mapa de clientes"
              to="/MapaClientes"
              icon="../../../ubicacion-icon.svg"
            />
            <AsideItem
              tituloItem="Monitoreo de Distribuidores"
              to="/MonitoreoDistribuidores"
              icon="../../../envio-cronometrado 1.png"
            />
            <AsideItem
              tituloItem="Ventas"
              to="/Ventas"
              icon="../../../Ventas-icon.svg"
            />
            <AsideItem
              tituloItem="Pedidos"
              to="/Pedidos"
              icon="../../../Pedidos-icon.svg"
              notificacion="1"
            />
            <AsideItem
              tituloItem="Préstamos"
              to="/Prestamos"
              icon="../../../Prestamos-icon.svg"
            />
            <AsideSubMenu
              tituloItem="Finanzas"
              icon="../../../Finanzas-icon.svg"
              to="/Finanzas/ArqueoDeCajas"
              opciones={[
                {
                  titulo: "Arqueo de cajas",
                  to: "/Finanzas/ArqueoDeCajas",
                  id: 0,
                },
                {
                  titulo: "Cuentas por cobrar - cobros",
                  to: "/Finanzas/CuentasPorCobrarCobros",
                  id: 1,
                },
                {
                  titulo: "Egresos y gastos (listado)",
                  to: "/Finanzas/EgresosGastos",
                  id: 2,
                },
                {
                  titulo: "Proveedores (listados)",
                  to: "/Finanzas/Proveedores",
                  id: 3,
                },
                {
                  titulo: "Cuentas por pagar",
                  to: "/Finanzas/CuentasPorPagar",
                  id: 4,
                },
              ]}
            />
            <AsideSubMenu
              tituloItem="Reportes"
              icon="../../../Reportes-icon.svg"
              to="/Reportes/Ingresos"
              opciones={[
                {
                  titulo: "Ingresos (cuentas por cobrar)",
                  to: "/Reportes/Ingresos",
                  id: 0,
                },
                {
                  titulo: "Egresos (cuentas por pagar)",
                  to: "/Reportes/Egresos",
                  id: 1,
                },
                { titulo: "Resultados", to: "/Reportes/Resultados", id: 2 },
              ]}
            />
            <AsideSubMenu
              tituloItem="Configuración"
              icon="../../../Configuracion-icon.svg"
              to="/Configuración/ConfiguraciónGeneral"
              opciones={[
                {
                  titulo: "Configuración general",
                  to: "/Configuracion/General",
                  id: 0,
                },
                { titulo: "Usuarios", to: "/Configuracion/Usuarios", id: 1 },
                { titulo: "Barrios", to: "/Configuracion/Barrios", id: 2 },
                { titulo: "Zonas", to: "/Configuracion/Zonas", id: 3 },
                { titulo: "Productos", to: "/Configuracion/Productos", id: 4 },
                { titulo: "Items", to: "/Configuracion/Items", id: 5 },
              ]}
            />
          </ul>
        </div>

        <div
          style={{
            width: "100%",
            display: "inline-flex",
            justifyContent: "center",
            alignItems: "end",
            marginTop: "120px",
            marginBottom: "30px",
          }}
        >
          <button className="btn-salir" onClick={handleLogout}>
            <div style={{ display: "inline-flex", justifyContent: "center" }}>
              <img src="../../../Salir-icon.svg" alt="" />
            </div>
            <span>Salir</span>
          </button>
        </div>
      </div>
    </>
  );
};

export { Sidebar };
