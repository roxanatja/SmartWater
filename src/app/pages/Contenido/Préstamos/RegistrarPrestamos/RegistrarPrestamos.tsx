import { FC, useContext, useEffect } from "react";
import "./RegistrarPrestamos.css";
import { PageTitle } from "../../../components/PageTitle/PageTitle";
import { useNavigate } from "react-router-dom";
import { client } from "../../Clientes/ClientesContext";
import { PrestamosContext } from "../PrestamosContext";
import RegisterPrestaForm from "../../../EntryComponents/RegisterPrestamo";

const RegistrarPrestamos: FC = () => {
    const { setSelectedClient, selectedClient } = useContext(PrestamosContext);
    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/Prestamos");
        setSelectedClient(client);
    };

    useEffect(() => {
        if (selectedClient._id === "") {
            navigate("/Prestamos")
        }
    }, [selectedClient, navigate])

    return (
        <>
            <div className="px-10 h-screen overflow-y-auto">
                <PageTitle titulo="Préstamos / Registrar préstamos" icon="../Prestamos-icon.svg" />
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
                <RegisterPrestaForm selectedClient={selectedClient} />
            </div>
        </>
    );
}

export { RegistrarPrestamos }