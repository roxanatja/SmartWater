import { FC, useState } from "react";
import "./ProductosItem.css";
import { Option } from "../../../../components/Option/Option";


const ProductosItem: FC = () => {

    const [option, setOption] = useState<boolean>(false)
    
    return(
        <>
            <div className="Productos-zonaItem">
                <div  className="Productos-zonaItemGrup1">
                    <span>Distensador</span>
                </div>
                <button className="btn" onClick={() => setOption(!option)} style={{width: "3%"}}>
                    <span className="material-symbols-outlined">
                        more_vert
                    </span>
                    <Option visible={option} editar eliminar/><Option visible={option} editar eliminar/>
                </button>
            </div>
        </>
    )
}

export{ProductosItem}