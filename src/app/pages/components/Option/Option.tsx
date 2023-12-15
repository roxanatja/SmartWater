import { FC } from "react";
import "./Option.css";

interface OptionsMenuProps {
    visible: boolean;
    editar?: boolean,
    eliminar?: boolean,
    editAction?: () => void;
    deleteAction?: () => void;
}

const Option: FC<OptionsMenuProps> = ({ visible, editar, editAction, eliminar, deleteAction }) => {

    return (
    <>
        {visible && (
            <div className="options-menu">
                {
                    editar &&
                    <div onClick={editAction} className="option-item">
                        <img src="./Editar-icon.svg" alt="" />
                        <span>Editar</span>
                    </div>
                }  
                {
                    editar &&
                    <div onClick={editAction} className="option-item">
                        <img src="./Eliminar-icon.svg" alt="" />
                        <span>Eliminar</span>
                    </div>
                }   
            </div>
        )}
    </>
    );
};

export{ Option };