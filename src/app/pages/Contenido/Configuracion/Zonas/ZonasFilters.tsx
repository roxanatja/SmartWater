import { useForm } from 'react-hook-form'
import { IZonesGetParams } from '../../../../../api/types/zones'

interface Props {
    active: IZonesGetParams['filters']
    changeFilters: (filters: IZonesGetParams['filters']) => void
}

const ZonasFilters = ({ active, changeFilters }: Props) => {
    const { register, watch, setValue } = useForm<{
        year?: number;
        month?: number;
    }>({
        defaultValues: active
    })

    return (
        <div>
            
        </div>
    )
}

export default ZonasFilters