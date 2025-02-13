import React, { useContext, useEffect } from 'react'
import { clientWithStatus, MapaClientesContext } from './MapaClientesContext'
import { useNavigate } from 'react-router-dom';
import { PageTitle } from '../../components/PageTitle/PageTitle';
import { useSessionStorage } from '@uidotdev/usehooks';

const MapClientDetails = () => {
    const { selectedClient, setSelectedClient } = useContext(MapaClientesContext)
    const navigate = useNavigate();
    const [returnUrl, setReturnUrl] = useSessionStorage("returnUrl", "")

    const handleClick = () => {
        setSelectedClient(clientWithStatus);
    };

    useEffect(() => {
        if (selectedClient._id === "") {
            console.log(returnUrl)
            if (returnUrl) {
                navigate(returnUrl)
                setReturnUrl("")
            } else {
                navigate(-1)
            }
        }
    }, [selectedClient, navigate])

    return (
        <>
            <div className="px-10 h-screen overflow-y-auto">
                <PageTitle titulo="Mapa de clientes" icon="../clientes-icon.svg" />
                <div
                    className="RegistrarVenta-titulo flex items-start cursor-pointer text-blue_custom"
                    onClick={handleClick}
                >
                    <button className="RegistrarVenta-btn">
                        <span className="material-symbols-outlined translate-y-0.5 text-blue_custom">
                            arrow_back
                        </span>
                    </button>
                    <span>Regresar</span>
                </div>

                <pre>{JSON.stringify(selectedClient, null, 2)}</pre>
            </div>
        </>
    );
}

export default MapClientDetails