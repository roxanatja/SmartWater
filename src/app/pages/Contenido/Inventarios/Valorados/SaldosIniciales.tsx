import React from 'react'
import InventariosLayout from '../InventariosLayout/InventariosLayout'
import { fisicos_saldos } from '../mock-data'
import TableValoradosSaldosIniciales from './Tables/TableValoradosSaldosIniciales'

const SaldosIniciales = () => {
    return (
        <>
            <InventariosLayout swith switchDetails={[
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
            ]} add onAdd={() => { alert("OnAdd") }}>
                <TableValoradosSaldosIniciales data={fisicos_saldos} className='w-full lg:!w-3/4 no-inner-border border !border-font-color/20 !rounded-[10px]' />
            </InventariosLayout>
        </>
    )
}

export default SaldosIniciales