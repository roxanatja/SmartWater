import { AsideItem } from "../AsideMenu/AsideItem";
import { AsideSubMenu } from "../AsideSubMenu/AsideSubMenu";
import "./Sidebar.css";
import { FC, useEffect, useRef, useState } from "react"; // Importar useState
import { useNavigate } from "react-router-dom";
import { AuthService } from "../../../../api/services/AuthService";

const Sidebar: FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    AuthService.logout();
    navigate("users/login");
  };

  // Función para alternar el menú
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* Botón de toggle para pantallas móviles con Font Awesome */}
      <button
        className="md:hidden text-white bg-sidebarBackground py-2 z-50 px-4 m-2 fixed -top-2 -left-2"
        onClick={toggleMenu}
      >
        {/* Icono de hamburguesa de Font Awesome */}
        <i className={`fas ${isOpen ? "fa-times" : "fa-bars"} text-2xl`}></i>
      </button>

      {/* Menú lateral */}
      <div
        ref={menuRef}
        className={`Sidebar scrool bg-sidebarBackground text-white fixed z-50 inset-y-0 left-0 w-64 transform ${isOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out md:static md:translate-x-0`}
      >
        <div className="Logo">
          <span className="smart">Smart</span>
          <span className="water">water</span>
        </div>
        <div>
          <ul className="flex flex-col gap-4 py-4 w-full">
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

        <div className="flex justify-center items-end mt-24 mb-6">
          <button className="btn-salir" onClick={handleLogout}>
            <div className="inline-flex justify-center">
              <img src="../../../Salir-icon.svg" alt="Salir" />
            </div>
            <span>Salir</span>
          </button>
        </div>
      </div>
    </>
  );
};

export { Sidebar };
