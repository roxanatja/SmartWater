import React from 'react'
import ComisionesEspecificosProvider from './ComisionesEspecificosProvider'
import ComisionesEspecificos from './ComisionesEspecificos'

const ComisionesEspecificosWrapper = () => {
    return (
        <ComisionesEspecificosProvider>
            <ComisionesEspecificos />
        </ComisionesEspecificosProvider>
    )
}

export default ComisionesEspecificosWrapper