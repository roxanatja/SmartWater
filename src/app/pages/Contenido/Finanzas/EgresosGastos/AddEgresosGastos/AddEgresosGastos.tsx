import { FC, useContext, useState } from "react";
import "./AddEgresosGastos.css";
import { SmartwaterContext } from "../../../../../SmartwaterContext";

const AddEgresosGastos: FC = () => {
    const { setShowModal } = useContext(SmartwaterContext);

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const [checkbox1, setCheckbox1] = useState<boolean>(false);
    const [checkbox2, setCheckbox2] = useState<boolean>(false);
    
    const handleCheckbox1Change = () => {
        setCheckbox1(!checkbox1);
        if (checkbox2) {
        setCheckbox2(false);
        }
    };

    const handleCheckbox2Change = () => {
        setCheckbox2(!checkbox2);
        if (checkbox1) {
        setCheckbox1(false);
        }
    };

return (
    <>
        <form>
            <div className="modal-overlay">
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header" style={{height: "auto"}}>
                        <div className="Titulo-Modal">
                            <div>
                                <span>Registro de egresos y gastos</span>
                            </div>
                            <div>
                                <button type="button" className="btn" onClick={handleCloseModal}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="25" viewBox="0 0 21 25" fill="none">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M16.4034 6.91L15.186 5.5L10.3599 11.09L5.53374 5.5L4.31641 6.91L9.14256 12.5L4.31641 18.09L5.53374 19.5L10.3599 13.91L15.186 19.5L16.4034 18.09L11.5772 12.5L16.4034 6.91Z" fill="black" fill-opacity="0.87"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="modal-body">
                        <div className="grupo-input">
                            <div className="input-grup">
                                <label className="label-grup">Fecha</label>
                                <input type="date" className="input-text" style={{textAlign: "left"}}/>
                            </div>
                        </div>
                        <div className="grupo-input" style={{gap: "16px"}}>
                            <div className="input-grup">
                                <label className="label-grup">Importe</label>
                                <input type="number" className="input-text" style={{textAlign: "left"}}/>
                            </div>
                            <div className="input-grup">
                                <label className="label-grup">Medio de pago</label>
                                <select name="Pago" className="input-select">
                                    <option value="Efectivo">Efectivo</option>
                                    <option value="Transferencia">Transferencia</option>
                                </select>
                            </div>
                        </div>
                        <div className="grupo-input" style={{gap: "20px"}}>
                            <div className="input-grup">
                                <label className="label-grup">Proveedor</label>
                                <select name="Proveedor" className="input-select">
                                    <option value="Julia Galicia">Julia Galicia</option>
                                    <option value="Julia Galicia">Julia Galicia</option>
                                </select>
                            </div>
                            <div className="input-grup">
                                <label className="label-grup">Egreso o gasto </label>
                                <select name="zona" className="input-select">
                                    <option value="Egreso">Egreso</option>
                                    <option value="Ingreso">Ingreso</option>
                                </select>
                            </div>
                        </div>
                        <div className="label-grup" style={{width: "100%"}}>
                            <span>Tipo de compra</span>
                        </div>
                        <div className="grupo-checbox">
                            <div className="grupo-check">
                                <input
                                className="input-check"
                                type="checkbox"
                                checked={checkbox1}
                                onChange={handleCheckbox1Change}
                                />
                                <label className="text-check">Factura</label>
                            </div>
                            <div className="grupo-check">
                                <input
                                className="input-check"
                                type="checkbox"
                                checked={checkbox2}
                                onChange={handleCheckbox2Change}
                                />
                                <label className="text-check">Recibo</label>
                            </div>
                        </div>
                        <div className="grupo-input">
                            <div className="input-grup">
                                <label className="label-grup">N° de documento</label>
                                <input type="text" className="input-text" style={{textAlign: "left"}}/>
                            </div>
                        </div>
                        <div className="grupo-input">
                            <div className="input-grup">
                                <label className="label-grup">Comentario</label>
                                <textarea className="CrearCuente-Textarea" name="Comentario"></textarea>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn-cancelar" onClick={handleCloseModal}>Cancelar</button>
                        <button type="button" className="btn-registrar">Registrar</button>
                    </div>
                </div>
            </div>
        </form>
    </>
);
}

export{AddEgresosGastos}