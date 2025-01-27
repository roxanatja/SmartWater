import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PageTitle } from '../../../components/PageTitle/PageTitle'
import SaldosIniciales from './SaldosIniciales'
import ReportesInventarios from './ReportesInventarios'

const InventariosFisicosRoot = () => {
    const params = useParams()
    const navigate = useNavigate()

    if (!params?.section) { return null }
    if (!["Saldos", "ReporteInventario"].includes(params.section)) { navigate("/Finanzas/Inventarios/Fisicos/Saldos", { replace: true }) }

    return (
        <>
            <div className="px-10 h-full">
                <PageTitle
                    titulo="Invetarios / Físicos"
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

export default InventariosFisicosRoot