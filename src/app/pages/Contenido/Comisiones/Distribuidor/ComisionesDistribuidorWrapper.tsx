import React from 'react'
import ComisionesDistribuidorProvider from './ComisionesDistribuidorProvider'
import ComisionesDistribuidor from './ComisionesDistribuidor'

const ComisionesDistribuidorWrapper = () => {
    return (
        <ComisionesDistribuidorProvider>
            <ComisionesDistribuidor />
        </ComisionesDistribuidorProvider>
    )
}

export default ComisionesDistribuidorWrapper