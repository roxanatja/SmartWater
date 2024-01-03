import { FC, useState } from "react";
import "./RegistrarVenta.css";
import { PageTitle } from "../../../components/PageTitle/PageTitle";
import { useNavigate } from "react-router-dom";
import { OptionScrooll } from "../../../components/OptionScrooll/OptionScrooll";

const RegistrarVenta: FC = () => {

    const [opcionesVisibles, setOpcionesVisibles] = useState<boolean>(true);
    const [checkbox1, setCheckbox1] = useState<boolean>(false);
    const [checkbox2, setCheckbox2] = useState<boolean>(false);
    const navigate = useNavigate();

    const Cantidad = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]
    const Producto = ["Botellón de 20 Lts", "Botellón de 10 Lts", "Botellón de 5 Lts"]
    const Precio = ["5000", "10000", "300", "4000", "20000"]

    const handleOpcionesClick = () => {
        setOpcionesVisibles(!opcionesVisibles);
    };

    const handleClick = () => {
        navigate('/Clientes');
    };

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

    return(
        <>
        <form>
            <div>
                <PageTitle titulo="Clientes" icon="../clientes-icon.svg" />
                <div className="RegistrarVenta-titulo">
                    <button className="RegistrarVenta-btn" onClick={handleClick}>
                        <span className="material-symbols-outlined">
                            arrow_back
                        </span>
                    </button>
                    <span>Registrar venta</span>
                </div>
                <div className="RegistrarVenta-NombreCliente">
                    <img src="../Cliente2.svg" alt="" />
                    <span>Daniela Ayala</span>
                </div>
                <div className="RegistrarVenta-AgregarProducto">
                    <div className="RegistrarVenta-AgregarProductoTitulo">
                        <span>Agregar producto</span>
                        <button onClick={handleOpcionesClick} className={opcionesVisibles ? "RegistrarVenta-btnAgregarProducto AgregarProductoactive-btn" : "RegistrarVenta-btnAgregarProducto"}>
                            <span className="material-symbols-outlined">
                                expand_more
                            </span>
                        </button>
                    </div>
                    <div className="lineagris"></div>
                    {
                        opcionesVisibles &&
                        <>
                            <div className="RegistrarVenta-opciones">
                                <span>Seleccione una opción</span>
                                <div className="RegistrarVenta-grupo-checbox">
                                    <div className="RegistrarVenta-grupo-check">
                                        <input
                                        className="input-check"
                                        type="checkbox"
                                        checked={checkbox1}
                                        onChange={handleCheckbox1Change}
                                        />
                                        <label className="text-check">Factura</label>
                                    </div>
                                    <div className="RegistrarVenta-grupo-check">
                                        <input
                                        className="input-check"
                                        type="checkbox"
                                        checked={checkbox2}
                                        onChange={handleCheckbox2Change}
                                        />
                                        <label className="text-check">Contado</label>
                                    </div>
                                </div>
                            </div>
                            <div style={{ width: "100%", marginTop: "25px" }}>
                                <table style={{ width: "100%", borderSpacing: "0px" }}>
                                    <thead>
                                        <tr>
                                            <div className="RegistrarVenta-TablaTitulo">
                                                <th>
                                                    <div className="RegistrarVenta-TablaTitulo2">
                                                        <span>Cantidad</span>
                                                    </div>
                                                </th>
                                                <th>
                                                    <div className="RegistrarVenta-TablaTitulo2">
                                                        <span>Producto</span>
                                                    </div>
                                                </th>
                                                <th>
                                                    <div className="RegistrarVenta-TablaTitulo2">
                                                        <span>Precio</span>
                                                    </div>
                                                </th>
                                            </div>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <div className="RegistrarVenta-TablaBody">
                                                <td>
                                                    <OptionScrooll options={Cantidad}/>
                                                </td>
                                                <td>
                                                    <OptionScrooll options={Producto}/>
                                                </td>
                                                <td>
                                                    <OptionScrooll options={Precio}/>
                                                </td>
                                            </div>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <button className="RegistrarVenta-agregarproducto">
                                <svg xmlns="http://www.w3.org/2000/svg" width="49" height="48" viewBox="0 0 49 48" fill="none">
                                    <g filter="url(#filter0_d_9_26327)">
                                        <circle cx="24.5" cy="20" r="20" fill="#1A3D7D"/>
                                        <circle cx="24.5" cy="20" r="19.5" stroke="#52A5F5"/>
                                    </g>
                                    <path d="M23.3182 28.2758V21.1822H16.2246V18.8177H23.3182V11.7241H25.6827V18.8177H32.7763V21.1822H25.6827V28.2758H23.3182Z" fill="white"/>
                                    <defs>
                                        <filter id="filter0_d_9_26327" x="0.5" y="0" width="48" height="48" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                                        <feOffset dy="4"/>
                                        <feGaussianBlur stdDeviation="2"/>
                                        <feComposite in2="hardAlpha" operator="out"/>
                                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_9_26327"/>
                                        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_9_26327" result="shape"/>
                                        </filter>
                                    </defs>
                                </svg>
                                <span>Agregar producto</span>
                            </button>
                        </>
                    }
                </div>
                <div className="RegistrarVenta-AgregarComentario">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="23" viewBox="0 0 24 23" fill="none">
                        <path d="M3 0C1.34531 0 0 1.23423 0 2.75229V15.1376C0 16.6557 1.34531 17.8899 3 17.8899H7.5V21.3303C7.5 21.5926 7.65938 21.8291 7.9125 21.9452C8.16563 22.0614 8.47031 22.0355 8.7 21.8807L14.4984 17.8899H21C22.6547 17.8899 24 16.6557 24 15.1376V2.75229C24 1.23423 22.6547 0 21 0H3Z" fill="#1A3D7D"/>
                    </svg>
                    <span>Agregar  comentario</span>
                </div>
                <div style={{width: "100%", textAlign: "end"}}>
                    <button className="RegistrarVenta-btnVender">
                        <span>Vender</span>
                    </button>
                </div>
            </div>
        </form>
        </>
    )
}

export{RegistrarVenta}