import { useNavigate, useParams } from 'react-router-dom'
import { PageTitle } from '../../../components/PageTitle/PageTitle'
import { CuentasPorCobrar } from './CuentasPorCobrar'
import { CobrosAClientes } from './CobrosAClientes'

const CobrarRoot = () => {
    const params = useParams()
    const navigate = useNavigate()

    if (!params?.section) { return null }
    if (!["Cuentas", "Cobros"].includes(params.section)) { navigate("/Finanzas/CuentasPorCobrarCobros/Cuentas", { replace: true }) }

    return (
        <>
            <div className="px-10">
                <PageTitle
                    titulo="Cuentas por cobrar / Cobros"
                    icon="../../Finanzas-icon.svg"
                />
                {params.section === "Cuentas" ? (
                    <CuentasPorCobrar />

                ) : (
                    <CobrosAClientes />
                )
                }
            </div>
        </>
    )
}

export default CobrarRoot