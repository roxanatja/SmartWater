import { FC, useContext} from "react";
import "./Switch.css";
import { SmartwaterContext } from "../../../SmartwaterContext";

type Opciones = {
    opcion1: string,
    opcion2: string,
}

const Switch: FC<Opciones> = ({opcion1, opcion2}) => {

    const {selectedOption, setSelectedOption} = useContext(SmartwaterContext);

    const handleOptionChange = () => {
        setSelectedOption(!selectedOption);
    };

return (
    <div className="switch-contenido">
        <div
            className={`switch-option ${selectedOption === false ? "selected" : ""}`}
            onClick={() => handleOptionChange()}
        >
            {opcion1}
        </div>
        <div
            className={`switch-option ${selectedOption === true ? "selected" : ""}`}
            onClick={() => handleOptionChange()}
        >
            {opcion2}
        </div>
    </div>
);
};

export {Switch};