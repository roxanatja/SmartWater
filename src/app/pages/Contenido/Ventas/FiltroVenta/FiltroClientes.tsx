import { FC, useContext, useState } from "react";
import "./FiltroVenta.css";
import { Contador } from "../../../components/Contador/Contador";
import { VentasContext } from "../VentasContext";

const FiltroVenta: FC = () => {
    const { setShowFiltro } = useContext(VentasContext);
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
        // Aquí puedes colocar la lógica adicional si es necesario
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
                            <div className="FiltroVenta-FechaContainer">
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
                                <div className="FiltroVenta-titulos">
                                    <span>Ventas</span>
                                </div>
                                <div className="FiltroVenta-itemCheckContainer">
                                    <div className="FiltroVenta-itemCheck">
                                        <div className="FiltroVenta-item">
                                            <input
                                                className="input-check"
                                                type="checkbox"
                                            />
                                            <span>A crédito</span>
                                        </div>
                                        <div className="FiltroVenta-itemNumero">
                                            <span>3</span>
                                        </div>
                                    </div>
                                    <div className="FiltroVenta-itemCheck">
                                        <div className="FiltroVenta-item">
                                            <input
                                                className="input-check"
                                                type="checkbox"
                                            />
                                            <span>De contado</span>
                                        </div>
                                        <div className="FiltroVenta-itemNumero">
                                            <span>3</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="FiltroVenta-titulos">
                                    <span>Factura</span>
                                </div>
                                <div className="FiltroVenta-itemCheckContainer">
                                    <div className="FiltroVenta-itemCheck">
                                        <div className="FiltroVenta-item">
                                            <input
                                                className="input-check"
                                                type="checkbox"
                                            />
                                            <img src="./archivo-factura-dolar.svg" alt="" />
                                            <span>Con Factura</span>
                                        </div>
                                    </div>
                                    <div className="FiltroVenta-itemCheck">
                                        <div className="FiltroVenta-item">
                                            <input
                                                className="input-check"
                                                type="checkbox"
                                            />
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                <circle cx="12" cy="12" r="11" stroke="#F40101" strokeWidth="2" />
                                                <image xlinkHref="./archivo-factura-dolar-mini.svg" x="6" y="5" width="14" height="14" />
                                                <line x1="6" y1="6" x2="18" y2="18" stroke="#FF0000" strokeWidth="3" />
                                            </svg>
                                            <span>Sin Factura </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="FiltroVenta-titulos">
                                    <span>De Clientes</span>
                                </div>
                                <div className="FiltroVenta-itemCheckContainer">
                                    <div className="FiltroVenta-itemCheck">
                                        <div className="FiltroVenta-item">
                                            <input
                                                className="input-check"
                                                type="checkbox"
                                            />
                                            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="24" viewBox="0 0 11 24" fill="none">
                                                <g clip-path="url(#clip0_718_4260)">
                                                    <rect width="10.757" height="24" fill="#1A3D7D" />
                                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M2.10189 12.8194H8.65518C8.70444 12.8194 8.75321 12.8291 8.79871 12.8479C8.84421 12.8668 8.88556 12.8944 8.92039 12.9292C8.95521 12.9641 8.98284 13.0054 9.00169 13.0509C9.02053 13.0964 9.03023 13.1452 9.03023 13.1944V19.6804C9.03023 19.7296 9.02053 19.7784 9.00169 19.8239C8.98284 19.8694 8.95521 19.9107 8.92039 19.9456C8.88556 19.9804 8.84421 20.008 8.79871 20.0269C8.75321 20.0457 8.70444 20.0554 8.65518 20.0554H2.10203C2.05278 20.0554 2.00401 20.0457 1.95851 20.0269C1.913 20.008 1.87166 19.9804 1.83683 19.9456C1.802 19.9107 1.77438 19.8694 1.75553 19.8239C1.73668 19.7784 1.72698 19.7296 1.72698 19.6804V13.1944C1.72698 13.1452 1.73668 13.0964 1.75553 13.0509C1.77438 13.0054 1.802 12.9641 1.83683 12.9292C1.87166 12.8944 1.913 12.8668 1.95851 12.8479C2.00401 12.8291 2.05278 12.8194 2.10203 12.8194H2.10189ZM0.877185 10.459C0.644744 10.4594 0.421951 10.552 0.25759 10.7163C0.0932295 10.8807 0.000693849 11.1035 0.000244141 11.3359V21.6659H10.7571V11.3359C10.7567 11.1035 10.6641 10.8807 10.4998 10.7163C10.3354 10.552 10.1126 10.4594 9.88017 10.459H0.877185ZM6.86432 12.0244C6.86432 11.9515 6.88594 11.8802 6.92646 11.8196C6.96697 11.7589 7.02456 11.7117 7.09193 11.6838C7.15931 11.6559 7.23345 11.6486 7.30497 11.6628C7.3765 11.677 7.44219 11.7121 7.49376 11.7637C7.54533 11.8153 7.58045 11.881 7.59467 11.9525C7.6089 12.024 7.6016 12.0982 7.57369 12.1655C7.54578 12.2329 7.49852 12.2905 7.43789 12.331C7.37725 12.3715 7.30596 12.3931 7.23304 12.3931C7.13525 12.3931 7.04146 12.3543 6.97232 12.2851C6.90317 12.216 6.86432 12.1222 6.86432 12.0244ZM3.15546 12.0244C3.15546 11.9515 3.17708 11.8802 3.2176 11.8196C3.25811 11.7589 3.3157 11.7117 3.38308 11.6838C3.45045 11.6559 3.52459 11.6486 3.59611 11.6628C3.66764 11.677 3.73334 11.7121 3.7849 11.7637C3.83647 11.8153 3.87159 11.881 3.88582 11.9525C3.90004 12.024 3.89274 12.0982 3.86483 12.1655C3.83693 12.2329 3.78966 12.2905 3.72903 12.331C3.66839 12.3715 3.59711 12.3931 3.52418 12.3931C3.42639 12.3931 3.33261 12.3543 3.26346 12.2851C3.19431 12.216 3.15546 12.1222 3.15546 12.0244Z" fill="#F0F4FD" />
                                                    <path d="M1.84467 1.51563H8.8242C8.87345 1.51562 8.92222 1.52532 8.96773 1.54417C9.01323 1.56302 9.05457 1.59064 9.0894 1.62547C9.12423 1.6603 9.15185 1.70164 9.1707 1.74715C9.18955 1.79265 9.19925 1.84142 9.19925 1.89067V5.1065C8.26577 5.26456 6.60963 5.45877 5.43878 5.11325C4.15248 4.7337 2.46075 5.003 1.46962 5.22659V1.89081C1.46962 1.84156 1.47932 1.79279 1.49817 1.74729C1.51702 1.70178 1.54464 1.66044 1.57947 1.62561C1.61429 1.59078 1.65564 1.56316 1.70114 1.54431C1.74665 1.52546 1.79542 1.51576 1.84467 1.51577V1.51563ZM9.19925 5.86152V6.54383C9.19719 7.30822 8.89262 8.04071 8.35212 8.58121C7.81161 9.12172 7.07912 9.42628 6.31473 9.42834H4.35413C3.5897 9.42632 2.85715 9.12175 2.31661 8.58121C1.77607 8.04067 1.47151 7.30813 1.46948 6.54369V5.99258C2.34741 5.7808 4.01719 5.47353 5.2277 5.83072C6.4787 6.19986 8.16326 6.02886 9.19911 5.86138L9.19925 5.86152Z" fill="#F0F4FD" />
                                                    <path d="M8.81128 2.26604H1.85763C1.55743 2.26507 1.26981 2.14539 1.05753 1.93312C0.845259 1.72084 0.725577 1.43322 0.724609 1.13302C0.724609 0.511033 1.2348 0 1.85763 0H8.81128C9.43327 0 9.9443 0.51019 9.9443 1.13302C9.94348 1.43326 9.82384 1.72097 9.61154 1.93328C9.39923 2.14558 9.11152 2.26522 8.81128 2.26604Z" fill="#F0F4FD" />
                                                    <path d="M6.37182 11.209H4.38506C4.33581 11.209 4.28704 11.1993 4.24153 11.1804C4.19603 11.1616 4.15468 11.134 4.11985 11.0991C4.08503 11.0643 4.0574 11.023 4.03856 10.9775C4.01971 10.932 4.01001 10.8832 4.01001 10.8339V9.05349C4.01001 9.00423 4.01971 8.95546 4.03856 8.90996C4.0574 8.86445 4.08503 8.82311 4.11985 8.78828C4.15468 8.75346 4.19603 8.72583 4.24153 8.70698C4.28704 8.68814 4.33581 8.67844 4.38506 8.67844H6.31472V8.67942C6.32203 8.67886 6.32935 8.67858 6.33666 8.67844V8.67942C6.34819 8.67844 6.35986 8.67773 6.37168 8.67773C6.42093 8.67773 6.4697 8.68743 6.5152 8.70628C6.56071 8.72513 6.60205 8.75275 6.63688 8.78758C6.67171 8.82241 6.69933 8.86375 6.71818 8.90926C6.73703 8.95476 6.74673 9.00353 6.74672 9.05278V10.8339C6.74673 10.8832 6.73703 10.932 6.71818 10.9775C6.69933 11.023 6.67171 11.0643 6.63688 11.0991C6.60205 11.134 6.56071 11.1616 6.5152 11.1804C6.4697 11.1993 6.42093 11.209 6.37168 11.209H6.37182Z" fill="#F0F4FD" />
                                                    <path d="M4.15424 17.5459H6.60239C6.65164 17.5459 6.70042 17.5556 6.74592 17.5744C6.79142 17.5933 6.83277 17.6209 6.8676 17.6557C6.90242 17.6906 6.93005 17.7319 6.9489 17.7774C6.96774 17.8229 6.97744 17.8717 6.97744 17.9209C6.97745 17.9497 6.9742 17.9783 6.96774 18.0063L6.59494 20.1598L6.59522 20.1608C6.58013 20.2479 6.53478 20.3269 6.46717 20.3838C6.39956 20.4407 6.31403 20.4719 6.22566 20.4719H4.53084C4.43895 20.4718 4.35028 20.4381 4.28163 20.377C4.21297 20.316 4.1691 20.2318 4.15832 20.1406L3.7851 17.9846L3.78454 17.9848C3.76759 17.8868 3.79027 17.7861 3.84758 17.7048C3.90488 17.6235 3.99213 17.5683 4.09012 17.5514C4.11125 17.5478 4.13266 17.5459 4.1541 17.5459H4.15424Z" fill="#F0F4FD" />
                                                    <path d="M5.00356 14.3919V14.5718C5.00356 14.6713 5.04307 14.7667 5.11341 14.837C5.18374 14.9073 5.27914 14.9468 5.37861 14.9468C5.47808 14.9468 5.57347 14.9073 5.64381 14.837C5.71414 14.7667 5.75366 14.6713 5.75366 14.5718V14.3919H6.07709C6.12635 14.3919 6.17512 14.3822 6.22062 14.3634C6.26613 14.3445 6.30747 14.3169 6.3423 14.2821C6.37713 14.2473 6.40475 14.2059 6.4236 14.1604C6.44245 14.1149 6.45215 14.0661 6.45214 14.0169V12.6514C6.45215 12.6022 6.44245 12.5534 6.4236 12.5079C6.40475 12.4624 6.37713 12.421 6.3423 12.3862C6.30747 12.3514 6.26613 12.3238 6.22062 12.3049C6.17512 12.2861 6.12635 12.2764 6.07709 12.2764H4.67998C4.63073 12.2764 4.58196 12.2861 4.53645 12.3049C4.49095 12.3238 4.44961 12.3514 4.41478 12.3862C4.37995 12.421 4.35232 12.4624 4.33348 12.5079C4.31463 12.5534 4.30493 12.6022 4.30493 12.6514V14.0169C4.30493 14.0661 4.31463 14.1149 4.33348 14.1604C4.35232 14.2059 4.37995 14.2473 4.41478 14.2821C4.44961 14.3169 4.49095 14.3445 4.53645 14.3634C4.58196 14.3822 4.63073 14.3919 4.67998 14.3919H5.00356Z" fill="#F0F4FD" />
                                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M10.7569 22.416H2.63692e-10V23.625C-1.84658e-06 23.6742 0.00969753 23.723 0.0285448 23.7685C0.0473921 23.814 0.075018 23.8554 0.109845 23.8902C0.144672 23.925 0.186018 23.9526 0.231521 23.9715C0.277025 23.9903 0.325796 24 0.375048 24H10.3818C10.4311 24 10.4798 23.9903 10.5253 23.9715C10.5709 23.9526 10.6122 23.925 10.647 23.8902C10.6819 23.8554 10.7095 23.814 10.7283 23.7685C10.7472 23.723 10.7569 23.6742 10.7569 23.625V22.416Z" fill="#F0F4FD" />
                                                </g>
                                                <defs>
                                                    <clipPath id="clip0_718_4260">
                                                        <rect width="10.757" height="24" fill="white" />
                                                    </clipPath>
                                                </defs>
                                            </svg>
                                            <span>Con préstamo</span>
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
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                <circle cx="12" cy="12" r="11" stroke="#F40101" strokeWidth="2" />
                                                <image xlinkHref="./Dispensador-iconsvg.svg" x="5" y="6" width="14" height="14" />
                                                <line x1="6" y1="6" x2="18" y2="18" stroke="#FF0000" strokeWidth="3" />
                                            </svg>
                                            <span>Sin Prestamo</span>
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
                                            <img src="./ConContrato.svg" alt="" />
                                            <span>Con contrato</span>
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
                                            <svg xmlns="http://www.w3.org/2000/svg" width="29" height="29" viewBox="0 0 29 29" fill="none">
                                                <image xlinkHref="./ConContrato.svg" x="4" y="5" width="21" height="21" />
                                                <circle cx="14.5" cy="14.5" r="13" stroke="#FF0000" strokeWidth="3" />
                                                <path d="M7.0 22.9L23.1 6" stroke="#FF0000" strokeWidth="3" />
                                            </svg>
                                            <span>Sin contrato</span>
                                        </div>
                                        <div className="FiltroVenta-itemNumero">
                                            <span>22</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="FiltroVenta-titulos">
                                    <span>Distribuidores</span>
                                </div>
                                <div className="FiltroVenta-itemCheckContainer">
                                    <div className="FiltroVenta-itemCheck">
                                        <div className="FiltroVenta-item">
                                            <input
                                                className="input-check"
                                                type="checkbox"
                                            />
                                            <span>Distribuidor 1</span>
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
                                            <span>Distribuidor 2</span>
                                        </div>
                                        <div className="FiltroVenta-itemNumero">
                                            <span>32</span>
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
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn-cancelar" onClick={handleCloseModal}>Cancelar</button>
                            <button type="button" className="btn-registrar">Filtrar</button>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
}

export { FiltroVenta }