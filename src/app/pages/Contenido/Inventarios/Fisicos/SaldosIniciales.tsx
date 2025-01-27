import React from 'react'
import InventariosLayout from '../InventariosLayout/InventariosLayout'

const SaldosIniciales = () => {
    return (
        <>
            <InventariosLayout filtro swith switchDetails={[
                {
                    isSelected: true,
                    text: "Saldos iniciales diarios",
                    url: "/Finanzas/Inventarios/Fisicos/Saldos"
                },
                {
                    isSelected: false,
                    text: "Reportes de inventario",
                    url: "/Finanzas/Inventarios/Fisicos/ReporteInventario"
                },
            ]} add onAdd={() => {alert("OnAdd")}}>
                Saldos iniciales
            </InventariosLayout>
        </>
    )
}

export default SaldosIniciales