import React from 'react'
import ComisionesGeneralProvider from './ComisionesGeneralProvider'
import ComisionesGeneral from './ComisionesGeneral'

const ComisionesGeneralWrapper = () => {
    return (
        <ComisionesGeneralProvider>
            <ComisionesGeneral />
        </ComisionesGeneralProvider>
    )
}

export default ComisionesGeneralWrapper