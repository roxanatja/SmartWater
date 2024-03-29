import { FC, useContext } from "react";
import "./FiltroHistorialCuentasPorPagar.css";
import { SmartwaterContext } from "../../../../../../SmartwaterContext";
import { CuentasPorPagarContext } from "../../CuentasPorPagarContext";

const FiltroHistorialCuentasPorPagar: FC = () => {

    const { setShowFiltro } = useContext(CuentasPorPagarContext);
    const { selectedOption } = useContext(SmartwaterContext);

    const handleCloseModal = () => {
        setShowFiltro(false);
    };

    return (
        <>
            <form onSubmit={(e) => e.preventDefault()}>
                <div className="modal-overlay">
                    <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{height: "auto"}}>
                        <div className="modal-header" style={{ height: "auto" }}>
                            <div className="Titulo-Modal">
                                <div>
                                    <span>Filtrar</span>
                                </div>
                                <div>
                                    <button type="button" className="btn" onClick={handleCloseModal}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="21" height="25" viewBox="0 0 21 25" fill="none">
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M16.4034 6.91L15.186 5.5L10.3599 11.09L5.53374 5.5L4.31641 6.91L9.14256 12.5L4.31641 18.09L5.53374 19.5L10.3599 13.91L15.186 19.5L16.4034 18.09L11.5772 12.5L16.4034 6.91Z" fill="black" fill-opacity="0.87" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="modal-body">
                            <div className="FiltroHistorialCuentasPorPagar-FechaContainer">
                                <div className="FiltroVenta-titulos">
                                    <span>Fechas</span>
                                </div>
                                <div className="FiltroVenta-Fechascontainer">
                                    {
                                        selectedOption === false ?
                                            <div className="FiltroVenta-Fecha">
                                                <span style={{ textAlign: "left", width: "100%" }}>A</span>
                                                <div className="FiltroVenta-FechaInput">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="24" viewBox="0 0 22 24" fill="none">
                                                        <path d="M19.2 2.4H18V0H15.6V2.4H6V0H3.6V2.4H2.4C1.068 2.4 0 3.468 0 4.8V21.6C0 22.2365 0.252856 22.847 0.702944 23.2971C1.15303 23.7471 1.76348 24 2.4 24H19.2C20.52 24 21.6 22.92 21.6 21.6V4.8C21.6 4.16348 21.3471 3.55303 20.8971 3.10294C20.447 2.65286 19.8365 2.4 19.2 2.4ZM19.2 21.6H2.4V8.4H19.2V21.6ZM10.8 10.8V13.2H15.6V16.8H10.8V19.2L6 15L10.8 10.8Z" fill="black" />
                                                    </svg>
                                                    <input type="date" />
                                                </div>
                                            </div>
                                            :
                                            <>
                                                <div className="FiltroVenta-Fecha">
                                                    <span style={{ textAlign: "left", width: "100%" }}>De</span>
                                                    <div className="FiltroVenta-FechaInput">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="24" viewBox="0 0 22 24" fill="none">
                                                            <path d="M19.2 2.4H18V0H15.6V2.4H6V0H3.6V2.4H2.4C1.068 2.4 0 3.468 0 4.8V21.6C0 22.2365 0.252856 22.847 0.702944 23.2971C1.15303 23.7471 1.76348 24 2.4 24H19.2C20.52 24 21.6 22.92 21.6 21.6V4.8C21.6 4.16348 21.3471 3.55303 20.8971 3.10294C20.447 2.65286 19.8365 2.4 19.2 2.4ZM19.2 21.6H2.4V8.4H19.2V21.6ZM10.8 19.2V16.8H6V13.2H10.8V10.8L15.6 15L10.8 19.2Z" fill="black" />
                                                        </svg>
                                                        <input type="date" />
                                                    </div>
                                                </div>
                                                <div className="FiltroVenta-Fecha">
                                                    <span style={{ textAlign: "left", width: "100%" }}>A</span>
                                                    <div className="FiltroVenta-FechaInput">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="24" viewBox="0 0 22 24" fill="none">
                                                            <path d="M19.2 2.4H18V0H15.6V2.4H6V0H3.6V2.4H2.4C1.068 2.4 0 3.468 0 4.8V21.6C0 22.2365 0.252856 22.847 0.702944 23.2971C1.15303 23.7471 1.76348 24 2.4 24H19.2C20.52 24 21.6 22.92 21.6 21.6V4.8C21.6 4.16348 21.3471 3.55303 20.8971 3.10294C20.447 2.65286 19.8365 2.4 19.2 2.4ZM19.2 21.6H2.4V8.4H19.2V21.6ZM10.8 10.8V13.2H15.6V16.8H10.8V19.2L6 15L10.8 10.8Z" fill="black" />
                                                        </svg>
                                                        <input type="date" />
                                                    </div>
                                                </div>
                                            </>
                                    }
                                </div>
                            </div>
                            <div>

                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn-cancelar" onClick={handleCloseModal}>Quitar filtros</button>
                            <button type="button" className="btn-registrar">Aplicar filtros</button>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
}

export { FiltroHistorialCuentasPorPagar }