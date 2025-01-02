import { FC, useContext } from "react";
import "./RegistrarDevolucion.css";
import { PageTitle } from "../../../components/PageTitle/PageTitle";
import { useNavigate } from "react-router-dom";
import { PrestamosContext } from "../PrestamosContext";
import RegisterDevoluForm from "../../../EntryComponents/RegisterDevolu";
import { client } from "../../Clientes/ClientesContext";

const RegistrarDevolucion: FC = () => {
    const { setSelectedClient, selectedClient } = useContext(PrestamosContext);
    const navigate = useNavigate();
    const handleClick = () => {
        navigate("/Prestamos");
        setSelectedClient(client);
    };

    return (
        <>
            <div className="px-10">
                <PageTitle titulo="Préstamos / Registrar devolución" icon="/Prestamos-icon.svg" />
                <div
                    className="RegistrarVenta-titulo flex items-start cursor-pointer"
                    onClick={handleClick}
                >
                    <button className="RegistrarVenta-btn text-blue_custom">
                        <span className="material-symbols-outlined translate-y-0.5">
                            arrow_back
                        </span>
                    </button>
                    <span className="text-blue_custom">Regresar</span>
                </div>
                <RegisterDevoluForm selectedClient={selectedClient} />
            </div>
        </>
    );
}

export { RegistrarDevolucion }