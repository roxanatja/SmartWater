import React from 'react'
import { Route, Routes } from 'react-router-dom';
import InventariosFisicosWrapper from './Fisicos/InventariosFisicosWrapper';
import InventariosValoradosWrapper from './Valorados/InventariosValoradosWrapper';
import InventariosOtrosWrapper from './Otros/InventariosOtrosWrapper';

const InventariosWrapper = () => {
    return <Routes>
        <Route path='/Fisicos/*' element={<InventariosFisicosWrapper />} />
        <Route path='/Valorados/*' element={<InventariosValoradosWrapper />} />
        <Route path='/Otros/*' element={<InventariosOtrosWrapper />} />
    </Routes>
}

export default InventariosWrapper