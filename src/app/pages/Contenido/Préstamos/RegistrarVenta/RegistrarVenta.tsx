import { FC, useContext } from "react";
import "./RegistrarVenta.css";
import { PageTitle } from "../../../components/PageTitle/PageTitle";
import { useNavigate } from "react-router-dom";
import RegisterSalesForm from "../../../EntryComponents/RegisterSalesForm";
import { client } from "../../Clientes/ClientesContext";
import { PrestamosContext } from "../PrestamosContext";

const RegistrarVenta: FC = () => {
    const { setSelectedClient, selectedClient } = useContext(PrestamosContext);
    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/Prestamos");
        setSelectedClient(client);
    };

    return (
        <>
            <div className="px-10">
                <PageTitle titulo="Préstamos / Registrar venta" icon="../Prestamos-icon.svg" />
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
                <RegisterSalesForm selectedClient={selectedClient} />
            </div>
        </>
    );
}

export { RegistrarVenta }