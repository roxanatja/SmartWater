import React from 'react'
import InventariosLayout from '../InventariosLayout/InventariosLayout'

const ReportesInventarios = () => {
    return (
        <>
            <InventariosLayout filtro swith switchDetails={[
                {
                    isSelected: false,
                    text: "Saldos iniciales diarios",
                    url: "/Finanzas/Inventarios/Fisicos/Saldos"
                },
                {
                    isSelected: true,
                    text: "Reportes de inventario",
                    url: "/Finanzas/Inventarios/Fisicos/ReporteInventario"
                },
            ]} add onAdd={() => { alert("OnAdd") }}>
                Reportes Inventarios
            </InventariosLayout>
        </>
    )
}

export default ReportesInventarios