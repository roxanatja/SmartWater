import { FC, useState } from "react";
import "./ItemsItem.css";
import { Option } from "../../../../components/Option/Option";


const ItemsItem: FC = () => {

    const [option, setOption] = useState<boolean>(false)
    
    return(
        <>
            <div className="Items-zonaItem">
                <div  className="Items-zonaItemGrup1">
                    <span>Agua botellón 20 lts</span>
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

export{ItemsItem}