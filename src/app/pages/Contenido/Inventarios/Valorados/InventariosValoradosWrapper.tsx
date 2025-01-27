import React from 'react'
import InventariosValoradosProvider from './InventariosValoradosProvider'
import { Navigate, Route, Routes } from 'react-router-dom'
import InventariosValoradosRoot from './InventariosValoradosRoot'

const InventariosValoradosWrapper = () => {
    return (
        <InventariosValoradosProvider>
            <Routes>
                <Route path="/" element={<Navigate to={"/Finanzas/Inventarios/Valorados/Saldos"} replace />} />
                <Route path='/:section' element={<InventariosValoradosRoot />} />
            </Routes>
        </InventariosValoradosProvider>
    )
}

export default InventariosValoradosWrapper