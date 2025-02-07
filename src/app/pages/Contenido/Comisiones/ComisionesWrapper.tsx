import { Route, Routes } from 'react-router-dom'
import ComisionesGeneralWrapper from './General/ComisionesGeneralWrapper'
import ComisionesDistribuidorWrapper from './Distribuidor/ComisionesDistribuidorWrapper'
import ComisionesEspecificosWrapper from './Especificos/ComisionesEspecificosWrapper'

const ComisionesWrapper = () => {
    return (
        <Routes>
            <Route path='/General/*' element={<ComisionesGeneralWrapper />} />
            <Route path='/PorDistribuidor/*' element={<ComisionesDistribuidorWrapper />} />
            <Route path='/Especificos/*' element={<ComisionesEspecificosWrapper />} />
        </Routes>
    )
}

export default ComisionesWrapper