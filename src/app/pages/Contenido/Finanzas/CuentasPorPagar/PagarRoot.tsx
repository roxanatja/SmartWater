import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PageTitle } from '../../../components/PageTitle/PageTitle'
import { CuentasPorPagar } from './CuentasPorPagar'
import PagosAProveedores from './PagosAProveedores'

const PagarRoot = () => {
    const params = useParams()
    const navigate = useNavigate()

    if (!params?.section) { return null }
    if (!["Cuentas", "Pagos"].includes(params.section)) { navigate("/Finanzas/CuentasPorPagar/Cuentas", { replace: true }) }

    return (
        <>
            <div className="px-10">
                <PageTitle
                    titulo="Cuentas por pagar / Pagos"
                    icon="../../Finanzas-icon.svg"
                />
                {params.section === "Cuentas" ? (
                    <CuentasPorPagar />
                ) : (
                    <PagosAProveedores />
                )
                }
            </div>
        </>
    )
}

export default PagarRoot