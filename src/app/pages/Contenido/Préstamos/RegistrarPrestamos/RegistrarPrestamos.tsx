import { FC, useContext, useEffect } from "react";
import "./RegistrarPrestamos.css";
import { PageTitle } from "../../../components/PageTitle/PageTitle";
import { useNavigate } from "react-router-dom";
import { client } from "../../Clientes/ClientesContext";
import { loan, PrestamosContext } from "../PrestamosContext";
import RegisterPrestaForm from "../../../EntryComponents/RegisterPrestamo";

const RegistrarPrestamos: FC = () => {
    const { setSelectedClient, selectedClient, selectedLoan, setSelectedLoan } = useContext(PrestamosContext);
    const navigate = useNavigate();

    const handleClick = () => {
        setSelectedClient(client);
        setSelectedLoan(loan);
    };

    useEffect(() => {
        if (selectedClient._id === "") {
            navigate(-1)
        }
    }, [selectedClient, navigate])

    return (
        <>
            <div className="px-10 h-screen overflow-y-auto">
                <PageTitle titulo={`Préstamos / ${selectedLoan._id === "" ? "Registrar" : "Editar"} préstamo`} icon="../Prestamos-icon.svg" />
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
                <RegisterPrestaForm selectedClient={selectedClient} selectedLoan={selectedLoan._id === "" ? undefined : selectedLoan} />
            </div>
        </>
    );
}

export { RegistrarPrestamos }