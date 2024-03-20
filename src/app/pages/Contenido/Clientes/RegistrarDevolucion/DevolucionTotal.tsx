import { FC, useContext, useEffect, useState } from "react";
import "./RegistrarDevolucion.css";
import { ClientesContext } from "../ClientesContext";
import { GetLoansByClientId } from "../../../../../services/LoansService";
import { GetItems } from "../../../../../services/ItemsService";
import { registerDevolutions } from "../../../../../services/DevolutionsService";
import { useNavigate } from "react-router-dom";

const DevolucionTotal: FC = () => {

    const { selectedClient } = useContext(ClientesContext);
    const [loading, setLoading] = useState(true);
    const [loadingSave, setLoadingSave] = useState(false);
    const [items, setItems] = useState<Array<any>>([]);
    const [loans, setLoans] = useState<Array<any>>([]);
    const [selectedLoan, setSelectedLoan] = useState<Array<any>>([]);
    const [comment, setComment] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const getLoans = async () => {
            await GetLoansByClientId(selectedClient._id)
                    .then((resp) => {
                        setLoans(resp.data);
                        setLoading(false);
                    });
        };

        const getItems = async () => {
            const {data} = await GetItems();
            setItems(data);
        };
        
        if(loading){
            getLoans();
            getItems();
        };

    }, [selectedClient._id, loading]);

    if (loading) {
        return <p>Cargando</p>
    };

    const handleSwitchChange = (id: string) => {
        const loan = loans.find((loan) => loan._id === id);
        const isSelectedLoan = selectedLoan.find((item: any) => item._id === loan._id);
        
        if (isSelectedLoan) {
            setSelectedLoan(selectedLoan.filter((item: any) => item._id !== loan._id));
        } else {
            setSelectedLoan([...selectedLoan, loan]);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setComment(e.target.value);
    };

    const registerDevolution = () => {
        setLoadingSave(true);
        if (selectedLoan.length === 0) {
            setLoadingSave(false);
            return window.alert("Debes seleccionar al menos un préstamo paea devolver.");
        } else {
            selectedLoan.forEach(async (loan) => {
                const data = {
                    user: loan.user,
                    loan: loan._id,
                    comment: comment,
                    detail: loan.detail.map((detail: any) => {
                        return {
                            item: detail.item,
                            quantity: detail.quantity,
                        };
                    }),
                };

                const resp = await registerDevolutions(data);

                if (resp === 200) {
                    console.log("Devolución registrada");
                    window.alert("Devolución registrada.");
                    setLoadingSave(false);
                    navigate('/Clientes');
                } else {
                    console.log("Error al registrar devolución");
                    window.alert("Error al registrar devolución, intente de nuevo.");
                };
            });

            setLoadingSave(false);
        };
    };

    return (
        <>
            <form onSubmit={(e) => e.preventDefault()}>
                <div className="RegistrarDevolucion-scrooll">
                    <div className="RegistrarDevolucion-NombreCliente">
                        <div className="RegistrarDevolucion-Nombre">
                            <img src="../Cliente2.svg" alt="" />
                            <span>{selectedClient.fullName}</span>
                        </div>
                    </div>
                    {
                        loans.map((loan) => (
                            <div className="RegistrarDevolucion-ProductosAdevolver" key={loan.id}>
                                <div className="RegistrarDevolucion-Producto">
                                    {loan.detail.map((detailItem: any) => {
                                        const item = items.find((itemItem: any) => itemItem._id === detailItem.item);
                                        return (
                                            <div>
                                                {item && (
                                                    <div className="RegistrarDevolucion-Producto1">
                                                        <div className="RegistrarDevolucion-Producto2">
                                                            <span>{item.name}</span>
                                                        </div>
                                                        <div className="RegistrarDevolucion-Producto2">
                                                            <span>{detailItem.quantity}</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                                <div>
                                    <input type="checkbox" onChange={(e) => handleSwitchChange(loan._id)} className="RegistrarDevolucion-inputRadio" />
                                </div>
                            </div>
                        ))
                    }
                    <div className="RegistrarPedido-AgregarComentario">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="23" viewBox="0 0 24 23" fill="none">
                            <path d="M3 0C1.34531 0 0 1.23423 0 2.75229V15.1376C0 16.6557 1.34531 17.8899 3 17.8899H7.5V21.3303C7.5 21.5926 7.65938 21.8291 7.9125 21.9452C8.16563 22.0614 8.47031 22.0355 8.7 21.8807L14.4984 17.8899H21C22.6547 17.8899 24 16.6557 24 15.1376V2.75229C24 1.23423 22.6547 0 21 0H3Z" fill="#1A3D7D" />
                        </svg>
                        <input type="text"
                            placeholder="Agregar Comentario"
                            value={comment} 
                            onChange={handleInputChange} />
                    </div>
                </div>
                <div style={{ width: "100%", textAlign: "end", marginTop: "10px" }}>
                    <button className="RegistrarDevolucion-btnVender" onClick={registerDevolution}>
                        <span>{loadingSave ? 'Cargando' : 'Registrar devolución'}</span>
                    </button>
                </div>
            </form>
        </>
    )
}

export { DevolucionTotal }