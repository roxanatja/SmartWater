import React from 'react'
import InventariosFisicosProvider from './InventariosFisicosProvider'
import { Navigate, Route, Routes } from 'react-router-dom'
import InventariosFisicosRoot from './InventariosFisicosRoot'

const InventariosFisicosWrapper = () => {
    return (
        <InventariosFisicosProvider>
            <Routes>
                <Route path="/" element={<Navigate to={"/Finanzas/Inventarios/Fisicos/Saldos"} replace />} />
                <Route path='/:section' element={<InventariosFisicosRoot />} />
            </Routes>
        </InventariosFisicosProvider>
    )
}

export default InventariosFisicosWrapper