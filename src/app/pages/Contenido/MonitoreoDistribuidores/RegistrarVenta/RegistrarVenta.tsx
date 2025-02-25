import { FC, useContext, useEffect } from "react";
import "./RegistrarVenta.css";
import { PageTitle } from "../../../components/PageTitle/PageTitle";
import { useNavigate } from "react-router-dom";
import { MonitoreoDistribuidoresContext } from "../MonitoreoDistribuidoresContext";
import RegistrarVentasPedidosForm from "../../Pedidos/RegistrarVenta/RegistrarVentasPedidosForm";
import { order } from "../../Pedidos/PedidosContext";
import RegisterSalesForm from "../../../EntryComponents/RegisterSalesForm";

const RegistrarVenta: FC = () => {
    const { selectedClient, selectedOrder, setSelectedOrder } = useContext(MonitoreoDistribuidoresContext);
    const navigate = useNavigate();

    const handleClick = () => {
        setSelectedOrder(order)
        navigate(-1)
    };

    useEffect(() => {
        if (selectedClient._id === "") {
            navigate("/MonitoreoDistribuidores")
        }
    }, [selectedClient, navigate])

    return (
        <>
            <div className="px-10 h-screen overflow-y-auto">
                <PageTitle titulo="Monitoreo de distribuidores / Registrar venta" icon="/Pedidos-icon.svg" />
                <div
                    className="RegistrarVenta-titulo flex items-start cursor-pointer"
                    onClick={handleClick}
                >
                    <button className="RegistrarVenta-btn">
                        <span className="material-symbols-outlined text-blue_custom translate-y-0.5">
                            arrow_back
                        </span>
                    </button>
                    <span className="text-blue_custom">Regresar</span>
                </div>

                {
                    selectedOrder._id !== "" &&
                    <RegistrarVentasPedidosForm selectedClient={selectedClient} selectedOrder={selectedOrder} />
                }
                {
                    selectedOrder._id === "" &&
                    <RegisterSalesForm selectedClient={selectedClient} />
                }
            </div>
        </>
    );
};

export { RegistrarVenta };
