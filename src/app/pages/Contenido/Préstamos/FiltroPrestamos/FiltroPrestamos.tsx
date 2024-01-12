import { FC, useContext, useState } from "react";
import "./FiltroPrestamos.css";
import { PrestamosContext } from "../PrestamosContext";
import { Contador } from "../../../components/Contador/Contador";

const FiltroPrestamos: FC = () => {

    const { setShowFiltro } = useContext(PrestamosContext);
    const [opcionesVisibles, setOpcionesVisibles] = useState<boolean>(true);

    const handleCloseModal = () => {
        setShowFiltro(false);
    };

    const handleOpcionesClick = () => {
        setOpcionesVisibles(!opcionesVisibles);
    };

    const handleDecrementar = (cantidad: number) => {
        console.log(`Decrementar: ${cantidad}`);
    };

    const handleIncrementar = (cantidad: number) => {
        console.log(`Incrementar: ${cantidad}`);
    };

    return (
        <>
            <form onSubmit={(e) => e.preventDefault()}>
                <div className="modal-overlay">
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
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
                            <div className="FiltroClientes-Renovación">
                                <div className="FiltroClientes-RenovaciónTitulo">
                                    <span>Renovación</span>
                                    <button onClick={handleOpcionesClick} className={opcionesVisibles ? "FiltroClientes-btnAgregarProducto FiltroClientesactive-btn" : "FiltroClientes-btnAgregarProducto"}>
                                        <span className="material-symbols-outlined">
                                            expand_more
                                        </span>
                                    </button>
                                </div>
                                <div className="lineagris"></div>
                                {
                                    opcionesVisibles &&
                                    <>
                                        <div className="FiltroClientes-RenovaciónOption">
                                            <div className="FiltroClientes-Renovadoinicio">
                                                <span>Renovado hasta en</span>
                                                <Contador onIncrementar={handleDecrementar} onDecrementar={handleIncrementar} />
                                            </div>
                                            <div className="FiltroClientes-Renovadoinicio">
                                                <span>Renovado hasta en</span>
                                                <Contador onIncrementar={handleDecrementar} onDecrementar={handleIncrementar} />
                                            </div>
                                        </div>
                                    </>
                                }
                            </div>
                            <div className="FiltroPrestamos-FechaContainer">
                                <div className="FiltroVenta-titulos">
                                    <span>Fechas</span>
                                </div>
                                <div className="FiltroVenta-Fechascontainer">
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
                                </div>
                                <div className="FiltroPrestamos-container">
                                    <div className="FiltroPrestamos-containercheck">
                                        <div className="FiltroPrestamos-titulos">
                                            <span>Préstamos</span>
                                        </div>
                                        <div className="FiltroPrestamos-itemCheckContainerColum">
                                            <div className="FiltroVenta-itemCheck">
                                                <div className="FiltroVenta-item">
                                                    <input
                                                        className="input-check"
                                                        type="checkbox"
                                                    />
                                                    <img src="./ConContrato.svg" alt="" />
                                                    <span>Con contrato</span>
                                                </div>
                                            </div>
                                            <div className="FiltroVenta-itemCheck">
                                                <div className="FiltroVenta-item">
                                                    <input
                                                        className="input-check"
                                                        type="checkbox"
                                                    />
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="29" height="29" viewBox="0 0 29 29" fill="none">
                                                        <image xlinkHref="./ConContrato.svg" x="4" y="5" width="21" height="21" />
                                                        <circle cx="14.5" cy="14.5" r="13" stroke="#FF0000" strokeWidth="3" />
                                                        <path d="M7.0 22.9L23.1 6" stroke="#FF0000" strokeWidth="3" />
                                                    </svg>
                                                    <span>Sin contrato</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="FiltroPrestamos-containercheck">
                                        <div className="FiltroPrestamos-titulos">
                                            <span>Contratos</span>
                                        </div>
                                        <div className="FiltroPrestamos-itemCheckContainerColum">
                                            <div className="FiltroVenta-itemCheck">
                                                <div className="FiltroVenta-item">
                                                    <input
                                                        className="input-check"
                                                        type="checkbox"
                                                    />
                                                    <span>Contratos Vigentes</span>
                                                </div>
                                            </div>
                                            <div className="FiltroVenta-itemCheck">
                                                <div className="FiltroVenta-item">
                                                    <input
                                                        className="input-check"
                                                        type="checkbox"
                                                    />
                                                    <span>Contratos Vencidos</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="FiltroPrestamos-titulos">
                                    <span>Distribuidores</span>
                                </div>
                                <div className="FiltroPrestamos-itemCheckContainerColum">
                                    <div className="FiltroPrestamos-itemCheckColum">
                                        <div className="FiltroPrestamos-item">
                                            <input
                                                className="input-check"
                                                type="checkbox"
                                            />
                                            <span>Edilberto Parraga</span>
                                        </div>
                                        <div className="FiltroVenta-itemNumero">
                                            <span>22</span>
                                        </div>
                                    </div>
                                    <div className="FiltroPrestamos-itemCheckColum">
                                        <div className="FiltroPrestamos-item">
                                            <input
                                                className="input-check"
                                                type="checkbox"
                                            />
                                            <span>Caleb Zerraga</span>
                                        </div>
                                        <div className="FiltroVenta-itemNumero">
                                            <span>22</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="FiltroVenta-titulos">
                                    <span>Zonas</span>
                                </div>
                                <div className="FiltroVenta-itemCheckContainer">
                                    <div className="FiltroVenta-itemCheck">
                                        <div className="FiltroVenta-item">
                                            <input
                                                className="input-check"
                                                type="checkbox"
                                            />
                                            <span>Zona 1</span>
                                        </div>
                                        <div className="FiltroVenta-itemNumero">
                                            <span>22</span>
                                        </div>
                                    </div>
                                    <div className="FiltroVenta-itemCheck">
                                        <div className="FiltroVenta-item">
                                            <input
                                                className="input-check"
                                                type="checkbox"
                                            />
                                            <span>Zona 2</span>
                                        </div>
                                        <div className="FiltroVenta-itemNumero">
                                            <span>32</span>
                                        </div>
                                    </div>
                                    <div className="FiltroVenta-itemCheck">
                                        <div className="FiltroVenta-item">
                                            <input
                                                className="input-check"
                                                type="checkbox"
                                            />
                                            <span>Zona 3</span>
                                        </div>
                                        <div className="FiltroVenta-itemNumero">
                                            <span>32</span>
                                        </div>
                                    </div>
                                    <div className="FiltroVenta-itemCheck">
                                        <div className="FiltroVenta-item">
                                            <input
                                                className="input-check"
                                                type="checkbox"
                                            />
                                            <span>Zona 4</span>
                                        </div>
                                        <div className="FiltroVenta-itemNumero">
                                            <span>32</span>
                                        </div>
                                    </div>
                                </div>
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

export { FiltroPrestamos }