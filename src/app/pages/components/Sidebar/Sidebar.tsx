import { AsideItem } from "../AsideMenu/AsideItem";
import { AsideSubMenu } from "../AsideSubMenu/AsideSubMenu";
import "./Sidebar.css";
import { FC, useEffect, useRef, useState } from "react"; // Importar useState
import { useNavigate } from "react-router-dom";
import { AuthService } from "../../../../api/services/AuthService";
import { OrdersApiConector } from "../../../../api/classes";
import millify from "millify";

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

  const [pedidosEnCurso, setPedidosEnCurso] = useState<number>(0)
  useEffect(() => {
    OrdersApiConector.get({ pagination: { page: 1, pageSize: 1 }, filters: { attended: false } }).then(res => {
      setPedidosEnCurso(res?.metadata.totalCount || 0)
    })
  }, [])

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
              notificacion={pedidosEnCurso > 0 ? `${millify(pedidosEnCurso, { precision: 1, locales: "es-AR" })}` : undefined}
            />
            <AsideItem
              tituloItem="Préstamos"
              to="/Prestamos"
              icon="../../../Prestamos-icon.svg"
            />
            <AsideSubMenu
              tituloItem="Finanzas"
              icon="../../../Finanzas-icon.svg"
              to="/Finanzas"
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
                {
                  titulo: "Inventarios",
                  to: "/Finanzas/Inventarios",
                  id: 4,
                  opciones: [
                    {
                      titulo: "Inventarios Físicos",
                      to: "/Finanzas/Inventarios/Fisicos",
                      id: 0,
                    },
                    {
                      titulo: "Inventarios Físicos valorados",
                      to: "/Finanzas/Inventarios/Valorados",
                      id: 1,
                    },
                    {
                      titulo: "Otros ingresos y salidas",
                      to: "/Finanzas/Inventarios/Otros",
                      id: 2,
                    },
                  ]
                },
                {
                  titulo: "Comisiones",
                  to: "/Finanzas/Comisiones",
                  id: 5,
                  opciones: [
                    {
                      titulo: "Porcentaje general",
                      to: "/Finanzas/Comisiones/General",
                      id: 0,
                    },
                    {
                      titulo: "Porcentaje por distruibuidor",
                      to: "/Finanzas/Comisiones/PorDistribuidor",
                      id: 1,
                    },
                    {
                      titulo: "Porcentajes específicos",
                      to: "/Finanzas/Comisiones/Especificos",
                      id: 2,
                    },
                  ]
                },
              ]}
            />
            <AsideSubMenu
              tituloItem="Reportes"
              icon="../../../Reportes-icon.svg"
              to="/Reportes"
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
              to="/Configuracion"
              opciones={[
                { titulo: "Configuración general", to: "/Configuracion/General", id: 0 },
                { titulo: "Datos de la empresa", to: "/Configuracion/DatosEmpresa", id: 1 },
                { titulo: "Usuarios", to: "/Configuracion/Usuarios", id: 2 },
                { titulo: "Horarios de trabajo", to: "/Configuracion/Horarios", id: 3 },
                { titulo: "Barrios", to: "/Configuracion/Barrios", id: 4 },
                { titulo: "Zonas", to: "/Configuracion/Zonas", id: 5 },
                { titulo: "Categorías de productos", to: "/Configuracion/CategoriasUnidades", id: 6 },
                { titulo: "Productos", to: "/Configuracion/Productos", id: 7 },
                { titulo: "Items", to: "/Configuracion/Items", id: 8 },
                { titulo: "Promociones", to: "/Configuracion/Promociones", id: 9 },
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
