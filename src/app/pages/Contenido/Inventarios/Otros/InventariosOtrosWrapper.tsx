import InventariosOtrosProvider from './InventariosOtrosProvider'
import { Navigate, Route, Routes } from 'react-router-dom'
import InventariosOtrosRoot from './InventariosOtrosRoot'

const InventariosOtrosWrapper = () => {
    return (
        <InventariosOtrosProvider>
            <Routes>
                <Route path="/" element={<Navigate to={"/Finanzas/Inventarios/Otros/Ingresos"} replace />} />
                <Route path='/:section' element={<InventariosOtrosRoot />} />
            </Routes>
        </InventariosOtrosProvider>
    )
}

export default InventariosOtrosWrapper