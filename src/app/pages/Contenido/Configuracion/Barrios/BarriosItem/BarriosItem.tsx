import { FC, useState } from "react";
import "./BarriosItem.css";
import { Option } from "../../../../components/Option/Option";


const BarriosItem: FC = () => {

    const [option, setOption] = useState<boolean>(false)
    
    return(
        <>
            <div className="Barrios-zonaItem">
                <div className="Barrios-zonaItemGrup">
                    <div  className="Barrios-zonaItemGrup1">
                        <span>Salamanca</span>
                    </div>
                    <select name="" id="" className="Barrios-zonaItemGrup2">
                        <option value="Zona1">Zona 1</option>
                        <option value="Zona2">Zona 2</option>
                    </select>
                </div>
                <button className="btn" onClick={() => setOption(!option)} style={{width: "3%"}}>
                    <span className="material-symbols-outlined">
                        more_vert
                    </span>
                </button>
                <div style={{display: "flex", alignItems: "center", justifyContent: "right", width: "100%"}}>
                    <Option visible={option} editar eliminar/>
                </div>
            </div>
        </>
    )
}

export{BarriosItem}