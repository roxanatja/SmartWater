import React from 'react'
import InventariosLayout from '../InventariosLayout/InventariosLayout'

const SaldosIniciales = () => {
    return (
        <>
            <InventariosLayout filtro swith switchDetails={[
                {
                    isSelected: true,
                    text: "Saldos iniciales",
                    url: "/Finanzas/Inventarios/Valorados/Saldos"
                },
                {
                    isSelected: false,
                    text: "Reportes de inventario",
                    url: "/Finanzas/Inventarios/Valorados/ReporteInventario"
                },
            ]} add onAdd={() => {alert("OnAdd")}}>
                Saldos iniciales
            </InventariosLayout>
        </>
    )
}

export default SaldosIniciales