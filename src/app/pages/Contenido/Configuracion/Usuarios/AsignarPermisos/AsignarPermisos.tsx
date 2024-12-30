import { useContext, useState } from "react";
import "./AsignarPermisos.css";
import { UsuariosContext } from "../UsuariosContext";
import { Permission } from "../../../../../../type/User";
import { Zone } from "../../../../../../type/City";

interface Props {
    onCancel?: () => void;
    permisos: Permission[];
    zonas: Zone[];
}

const AsignarPermisos = ({ onCancel, permisos, zonas }: Props) => {
    const { selectedUser } = useContext(UsuariosContext);

    const [checkbox1, setCheckbox1] = useState<boolean>(false);

    const handleCheckbox1Change = () => {
        setCheckbox1(!checkbox1);
    };

    return (
        <>
            <form onSubmit={(e) => e.preventDefault()}
                className="flex flex-col gap-6 justify-center items-center w-full">
                <div className="AsignarPermisos-tituloinput bg-blue_custom">
                    <span>Zonas</span>
                    <button className="AsignarPermisos-tituloinput-btn">
                        <span className="material-symbols-outlined">
                            expand_less
                        </span>
                    </button>
                </div>
                <div className="grid grid-cols-2 w-full px-4 gap-2">
                    {
                        zonas.map(z =>
                            <div key={z._id} className="AsignarPermisos-grupo-check">
                                <input
                                    className="input-check accent-blue_custom"
                                    type="checkbox"
                                    id={z._id}
                                    checked={checkbox1}
                                    onChange={handleCheckbox1Change}
                                />
                                <label htmlFor={z._id} className="AsignarPermisos-text-check text-font-color">{z.name}</label>
                            </div>
                        )
                    }
                </div>
                <div className="AsignarPermisos-tituloinput bg-blue_custom">
                    <span>Permisos</span>
                    <button className="AsignarPermisos-tituloinput-btn">
                        <span className="material-symbols-outlined">
                            expand_less
                        </span>
                    </button>
                </div>
                <div className="grid grid-cols-2 w-full px-4 gap-2">
                    {
                        permisos.map(perm =>
                            <div key={perm._id} className="AsignarPermisos-grupo-check">
                                <input
                                    id={perm._id}
                                    className="input-check accent-blue_custom"
                                    type="checkbox"
                                    checked={checkbox1}
                                    onChange={handleCheckbox1Change}
                                />
                                <label htmlFor={perm._id} className="AsignarPermisos-text-check text-font-color">{perm.name}</label>
                            </div>
                        )
                    }
                </div>

                <div className="w-full  sticky bottom-0 bg-main-background h-full z-50">
                    <div className="py-4 flex flex-row gap-4 items-center justify-center px-6">
                        <button
                            onClick={onCancel}
                            className="w-full outline outline-2 outline-blue-500 py-2 rounded-full text-blue-600 font-black shadow-xl"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="w-full outline outline-2 outline-blue-500 bg-blue-500 py-2 rounded-full text-white font-black shadow-xl truncate"
                        >
                            Actualizar
                        </button>
                    </div>
                </div>
            </form >
        </>
    )
}

export { AsignarPermisos }