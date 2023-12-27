import { FC, useContext } from "react";
import { Link } from "react-router-dom";
import { PrestamosContext } from "../PrestamosContext";


const OpcionesPrestamo: FC = () => {

    const { setShowMiniModal } = useContext(PrestamosContext);

    const handleCloseModal = () => {
        setShowMiniModal(false);
    };

    return(
        <>
        <div className="modal-overlay" onClick={handleCloseModal}>
            <div className="OpcionesPedidos-modalContent" 
                onClick={(e) => e.stopPropagation()} 
                style={{gap: "10px", display: "flex", flexDirection: "column", padding: "25px 10px"}}
            >
                <div className="OpcionesPedidos-Item">
                    <div style={{display: "flex", alignItems: "center", gap: "10px"}}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="22" viewBox="0 0 25 22" fill="none">
                            <g clipPath="url(#clip0_1121_2214)">
                                <path d="M9.83333 1.50977V3.8431H7.5C6.94583 3.8431 6.5 4.28893 6.5 4.8431V6.8431C6.5 7.39727 6.94583 7.8431 7.5 7.8431H9.83333V10.1764C9.83333 10.7306 10.2792 11.1764 10.8333 11.1764H12.8333C13.3875 11.1764 13.8333 10.7306 13.8333 10.1764V7.8431H16.1667C16.7208 7.8431 17.1667 7.39727 17.1667 6.8431V4.8431C17.1667 4.28893 16.7208 3.8431 16.1667 3.8431H13.8333V1.50977C13.8333 0.955599 13.3875 0.509766 12.8333 0.509766H10.8333C10.2792 0.509766 9.83333 0.955599 9.83333 1.50977ZM23.8208 16.8514C24.5625 16.3056 24.7208 15.2639 24.175 14.5223C23.6292 13.7806 22.5875 13.6223 21.8458 14.1681L16.8583 17.8431H11.8333C11.4667 17.8431 11.1667 17.5431 11.1667 17.1764C11.1667 16.8098 11.4667 16.5098 11.8333 16.5098H12.5H15.1667C15.9042 16.5098 16.5 15.9139 16.5 15.1764C16.5 14.4389 15.9042 13.8431 15.1667 13.8431H12.5H11.8333H8.57083C7.35833 13.8431 6.18333 14.2556 5.2375 15.0098L3.36667 16.5098H1.83333C1.09583 16.5098 0.5 17.1056 0.5 17.8431V20.5098C0.5 21.2473 1.09583 21.8431 1.83333 21.8431H8.5H15.1875C16.3958 21.8431 17.575 21.4556 18.55 20.7389L23.825 16.8514H23.8208ZM8.52917 16.5098H8.56667C8.55417 16.5098 8.54167 16.5098 8.52917 16.5098Z" fill="#1A3D7D"/>
                            </g>
                            <defs>
                                <clipPath id="clip0_1121_2214">
                                <rect width="24" height="21.3333" fill="white" transform="translate(0.5 0.509766)"/>
                                </clipPath>
                            </defs>
                        </svg>
                        <span className="OpcionesPedidos-text">Registrar Ventas</span>
                    </div>
                    <Link to={"#"}>
                        <button type="button" className="btn" style={{marginTop: "5px"}}>
                            <span className="material-symbols-outlined" style={{color: "#1A3D7D"}}>
                                chevron_right
                            </span>
                        </button>
                    </Link>
                </div>
                <div className="OpcionesPedidos-Item">
                    <div style={{display: "flex", alignItems: "center", gap: "10px"}}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                            <path d="M1.52344 9.49985H1.125C0.501562 9.49985 0 8.99828 0 8.37485V2.37485C0 1.92016 0.271875 1.50766 0.69375 1.33422C1.11563 1.16078 1.59844 1.25453 1.92188 1.57797L3.87187 3.52797C7.97812 -0.526715 14.5922 -0.512652 18.675 3.57485C22.7766 7.67641 22.7766 14.3233 18.675 18.4248C14.5734 22.5264 7.92656 22.5264 3.825 18.4248C3.23906 17.8389 3.23906 16.8873 3.825 16.3014C4.41094 15.7155 5.3625 15.7155 5.94844 16.3014C8.87813 19.2311 13.6266 19.2311 16.5563 16.3014C19.4859 13.3717 19.4859 8.62328 16.5563 5.6936C13.6406 2.77797 8.92969 2.76391 5.99531 5.64672L7.92188 7.57797C8.24531 7.90141 8.33906 8.38422 8.16562 8.8061C7.99219 9.22797 7.57969 9.49985 7.125 9.49985H1.52344Z" fill="#1A3D7D"/>
                        </svg>
                        <span className="OpcionesPedidos-text">Registrar devolución</span>
                    </div>
                    <Link to={"#"}>
                        <button type="button" className="btn" style={{marginTop: "5px"}}>
                            <span className="material-symbols-outlined" style={{color: "#1A3D7D"}}>
                                chevron_right
                            </span>
                        </button>
                    </Link>
                </div>
            </div>
        </div>
        </>
    )
}

export { OpcionesPrestamo }