import React, { useContext } from 'react'
import { CuentasPorPagarContext } from './CuentasPorPagarContext';
import { Link, useLocation } from 'react-router-dom';
import { useSessionStorage } from '@uidotdev/usehooks';

const OpcionesCuentasPorPagar = ({ onClose }: { onClose: () => void }) => {
    const { setShowMiniModal, providerSelect } = useContext(CuentasPorPagarContext);
    const location = useLocation()
    const [returnUrl, setReturnUrl] = useSessionStorage("returnUrl", "")

    return (
        <>
            <Link
                to={`/Finanzas/CuentasPorPagar/Historial/${providerSelect._id}`}
                className="opcionesClientes-Item hover:bg-zinc-200 cursor-pointer"
                onClick={() => {
                    setReturnUrl(`${location.pathname}${location.search}`)
                    onClose();
                }}
            >
                <div className="flex gap-2 items-center">
                    <i className="fa-regular fa-clock text-xl text-blue_custom"></i>
                    <span className="text-base text-blue_custom">Historial</span>
                </div>
                <button type="button" className="btn" style={{ marginTop: "5px" }}>
                    <span
                        className="material-symbols-outlined"
                        style={{ color: "#1A3D7D" }}
                    >
                        chevron_right
                    </span>
                </button>
            </Link>

            <div
                style={{
                    width: "100%",
                    marginTop: "15px",
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <button
                    type="button"
                    className="opcionesClientes-Btn"
                    onClick={() => setShowMiniModal(false)}
                >
                    Cerrar
                </button>
            </div>
        </>
    );
};

export default OpcionesCuentasPorPagar