import { useSessionStorage } from "@uidotdev/usehooks"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Providers } from "../../../../../../type/providers"
import { ProvidersApiConector } from "../../../../../../api/classes"
import toast from "react-hot-toast"
import { PageTitle } from "../../../../components/PageTitle/PageTitle"
import PagosAProveedores from "../PagosAProveedores"
import { HistorialCuentas } from "./HistorialCuentas"

const HistorialRoot = () => {
    const params = useParams()
    const navigate = useNavigate()
    const [returnUrl, setReturnUrl] = useSessionStorage("returnUrl", "")

    const [provider, setProvider] = useState<Providers | null>(null)

    useEffect(() => {
        if (!!params.provider) {
            ProvidersApiConector.get({ filters: { provider: params.provider } }).then(c => {
                const data = c?.data || [];
                if (data.length > 0) {
                    setProvider(data[0])
                } else {
                    toast.error("No se encuentra el cliente seleccionado")
                    navigate(-1)
                }
            })
        }
    }, [params.provider, navigate])

    const goBack = () => {
        if (returnUrl) {
            navigate(returnUrl)
            setReturnUrl("")
        } else {
            navigate("/Finanzas/CuentasPorPagar/Cuentas")
        }
    }

    useEffect(() => {
        if (!params?.section || !["GastosCredito", "Pagos"].includes(params.section)) {
            navigate(`/Finanzas/CuentasPorPagar/Historial/${params.provider}/GastosCredito`, { replace: true })
        }
    }, [params, navigate])

    if (!params?.provider) { navigate(-1); return null }


    return (
        <>
            <div className="px-10">
                <PageTitle
                    hasBack
                    onBack={goBack}
                    titulo={`Historial - ${provider?.fullName || "Sin nombre"}`}
                    icon="/Finanzas-icon.svg"
                />
                {params.section === "GastosCredito" ? (
                    <>
                        {
                            provider &&
                            <HistorialCuentas provider={provider._id} />
                        }
                    </>
                ) : (
                    <PagosAProveedores proveedor={provider?._id} />
                )
                }
            </div>
        </>
    )
}

export default HistorialRoot