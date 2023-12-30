import { FC, useState } from "react";
import "./ZonasItem.css";
import { Option } from "../../../../components/Option/Option";


const ZonasItem: FC = () => {

    const [option, setOption] = useState<boolean>(false)
    
    return(
        <>
            <div className="Zonas-zonaItem">
                <select name="" id="" className="Zonas-zonaItemGrup2">
                    <option value="Zona1">Zona 1</option>
                    <option value="Zona2">Zona 2</option>
                </select>
                <button className="btn" onClick={() => setOption(!option)}>
                    <span className="material-symbols-outlined">
                        more_vert
                    </span>
                    <Option visible={option} editar eliminar/>
                </button>
            </div>
        </>
    )
}

export{ZonasItem}