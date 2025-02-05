import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PageTitle } from '../../../components/PageTitle/PageTitle'
import SaldosIniciales from './SaldosIniciales'
import ReportesInventarios from './ReportesInventarios'

const InventariosValoradosRoot = () => {
    const params = useParams()
    const navigate = useNavigate()

    if (!params?.section) { return null }
    if (!["Saldos", "ReporteInventario"].includes(params.section)) { navigate("/Finanzas/Inventarios/Valorados/Saldos", { replace: true }) }

    return (
        <>
            <div className="px-10 h-full">
                <PageTitle
                    titulo="Inventarios / Físicos valorados"
                    icon="/Finanzas-icon.svg"
                />
                {params.section === "Saldos" ? (
                    <SaldosIniciales />
                ) : (
                    <ReportesInventarios />
                )
                }
            </div>
        </>
    )
}

export default InventariosValoradosRoot