import React from 'react'
import InventariosLayout from '../InventariosLayout/InventariosLayout'

const ReportesInventarios = () => {
    return (
        <>
            <InventariosLayout filtro swith switchDetails={[
                {
                    isSelected: false,
                    text: "Saldos iniciales",
                    url: "/Finanzas/Inventarios/Valorados/Saldos"
                },
                {
                    isSelected: true,
                    text: "Reportes de inventario",
                    url: "/Finanzas/Inventarios/Valorados/ReporteInventario"
                },
            ]}>
                Reportes Inventarios
            </InventariosLayout>
        </>
    )
}

export default ReportesInventarios