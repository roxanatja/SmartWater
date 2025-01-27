import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PageTitle } from '../../../components/PageTitle/PageTitle'
import Ingresos from './Ingresos'
import Salidas from './Salidas'

const InventariosOtrosRoot = () => {
    const params = useParams()
    const navigate = useNavigate()

    if (!params?.section) { return null }
    if (!["Ingresos", "Salidas"].includes(params.section)) { navigate("/Finanzas/Inventarios/Otros/Ingresos", { replace: true }) }

    return (
        <>
            <div className="px-10 h-full">
                <PageTitle
                    titulo="Inventarios / Otros ingresos y salidas"
                    icon="/Finanzas-icon.svg"
                />
                {params.section === "Ingresos" ? (
                    <Ingresos />
                ) : (
                    <Salidas />
                )
                }
            </div>
        </>
    )
}

export default InventariosOtrosRoot