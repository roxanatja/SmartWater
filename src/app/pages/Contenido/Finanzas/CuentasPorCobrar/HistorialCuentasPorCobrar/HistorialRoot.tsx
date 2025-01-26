import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PageTitle } from '../../../../components/PageTitle/PageTitle'
import { Client } from '../../../../../../type/Cliente/Client'
import { ClientsApiConector } from '../../../../../../api/classes'
import toast from 'react-hot-toast'
import { CobrosAClientes } from '../CobrosAClientes'
import { HistorialCuentasPorCobrar } from './HistorialCuentasPorCobrar'
import { useSessionStorage } from '@uidotdev/usehooks'

const HistorialRoot = () => {
    const params = useParams()
    const navigate = useNavigate()
    const [returnUrl, setReturnUrl] = useSessionStorage("returnUrl", "")

    const [client, setClient] = useState<Client | null>(null)

    useEffect(() => {
        if (!!params.client) {
            ClientsApiConector.getClient({ clientId: params.client }).then(c => {
                if (c) {
                    setClient(c)
                } else {
                    toast.error("No se encuentra el cliente seleccionado")
                    navigate(-1)
                }
            })
        }
    }, [params.client, navigate])

    const goBack = () => {
        if (returnUrl) {
            navigate(returnUrl)
            setReturnUrl("")
        } else {
            navigate("/Finanzas/CuentasPorCobrarCobros/Cuentas")
        }
    }

    useEffect(() => {
        if (!params?.section || !["VentaCredito", "Cobros"].includes(params.section)) {
            navigate(`/Finanzas/CuentasPorCobrarCobros/Historial/${params.client}/VentaCredito`, { replace: true })
        }
    }, [params, navigate])

    if (!params?.client) { navigate(-1); return null }


    return (
        <>
            <div className="px-10">
                <PageTitle
                    hasBack
                    onBack={goBack}
                    titulo={`Historial - ${client?.fullName || "Sin nombre"}`}
                    icon="/Finanzas-icon.svg"
                />
                {params.section === "VentaCredito" ? (
                    <>
                        {
                            client &&
                            <HistorialCuentasPorCobrar client={client?._id} />
                        }
                    </>
                ) : (
                    <CobrosAClientes client={client?._id} />
                )
                }
            </div>
        </>
    )
}

export default HistorialRoot