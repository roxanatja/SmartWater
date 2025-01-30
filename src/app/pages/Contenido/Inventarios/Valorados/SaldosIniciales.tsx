import React, { useContext, useEffect, useState } from 'react'
import InventariosLayout from '../InventariosLayout/InventariosLayout'
import { fisicos_saldos } from '../mock-data'
import TableValoradosSaldosIniciales from './Tables/TableValoradosSaldosIniciales'
import Modal from '../../../EntryComponents/Modal'
import { InventariosValoradosContext } from './InventariosValoradosProvider'
import { MatchedElement } from '../../../../../type/Kardex'
import { KardexApiConector } from '../../../../../api/classes/kardex'
import AddEditInitialBalances from './Modals/AddEditInitialBalances'

const SaldosIniciales = () => {
    const {
        showMiniModal, setShowMiniModal
    } = useContext(InventariosValoradosContext)

    const [elements, setElements] = useState<MatchedElement[]>([])

    useEffect(() => {
        KardexApiConector.getKardexElements().then(res => setElements(res?.elements || []))
    }, [])

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
            ]}
                add={elements.some(e => !e.hasKardex)}
                onAdd={() => setShowMiniModal(true)}>
                <TableValoradosSaldosIniciales data={fisicos_saldos} className='w-full lg:!w-3/4 no-inner-border border !border-font-color/20 !rounded-[10px]' />
            </InventariosLayout>

            <Modal isOpen={showMiniModal} onClose={() => setShowMiniModal(false)} className='!w-[95%] sm:!w-3/4'>
                <h2 className="text-blue_custom font-semibold p-6 pb-0 sticky top-0 z-30 bg-main-background">
                    Agregar saldos iniciales
                </h2>
                <AddEditInitialBalances onCancel={() => setShowMiniModal(false)} elemnts={elements.filter(e => !e.hasKardex)} />
            </Modal>
        </>
    )
}

export default SaldosIniciales