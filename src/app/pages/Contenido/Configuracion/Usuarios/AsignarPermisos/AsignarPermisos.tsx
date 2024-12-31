import { useContext, useEffect, useState } from "react";
import "./AsignarPermisos.css";
import { UsuariosContext } from "../UsuariosContext";
import { Permission } from "../../../../../../type/User";
import { Zone } from "../../../../../../type/City";
import { UsersApiConector } from "../../../../../../api/classes";
import toast from "react-hot-toast";

interface Props {
    onCancel?: () => void;
    permisos: Permission[];
    zonas: Zone[];
}

const AsignarPermisos = ({ onCancel, permisos, zonas }: Props) => {
    const { selectedUser } = useContext(UsuariosContext);
    const [active, setActive] = useState<boolean>(false);

    const [checkedPermissions, setCheckedPermissions] = useState<string[]>([]);
    const [checkedZones, setCheckedZonaes] = useState<string[]>([]);

    const handleZonesChange = (zone: string) => {
        if (checkedZones.includes(zone)) {
            setCheckedZonaes((prev) => prev.filter(z => z !== zone))
        } else {
            setCheckedZonaes((prev) => [...prev, zone])
        }
    }

    const handlePermissionsChange = (perm: string) => {
        if (checkedPermissions.includes(perm)) {
            setCheckedPermissions((prev) => prev.filter(z => z !== perm))
        } else {
            setCheckedPermissions((prev) => [...prev, perm])
        }
    }

    useEffect(() => {
        if (selectedUser) {
            setCheckedPermissions(selectedUser.permissions || [])
            setCheckedZonaes(selectedUser.zones || [])
        } else {
            setCheckedZonaes([])
            setCheckedPermissions([])
        }
    }, [selectedUser])

    const handleSubmit = async () => {
        setActive(true)
        const promises = [
            UsersApiConector.updateUserPermissions({ data: { permissions: checkedPermissions }, userId: selectedUser._id }),
            UsersApiConector.updateUser({
                data: {
                    email: selectedUser.email,
                    fullName: selectedUser.fullName,
                    phoneNumber: selectedUser.phoneNumber,
                    role: selectedUser.role,
                    username: selectedUser.username,
                    zones: checkedZones
                }, userId: selectedUser._id
            })
        ]

        const res = await Promise.all(promises)

        res.forEach((r, index) => {
            if (!!r && r.mensaje) {
                toast.success(r.mensaje, { position: "bottom-center" });
            } else {
                toast.error(`Error al actualizar ${index === 0 ? "los permisos" : "las zonas"} del usuario.`, { position: "bottom-center" });
            }
        })

        window.location.reload()
        setActive(false)
    }

    return (
        <>
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit() }}
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
                                    checked={checkedZones.includes(z._id)}
                                    onChange={() => handleZonesChange(z._id)}
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
                                    checked={checkedPermissions.includes(perm._id)}
                                    onChange={() => handlePermissionsChange(perm._id)}
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
                            disabled={active}
                            className="disabled:bg-gray-400 w-full outline outline-2 outline-blue-500 bg-blue-500 py-2 rounded-full text-white font-black shadow-xl truncate"
                        >
                            {
                                active ?
                                    <i className="fa-solid fa-spinner animate-spin"></i> :
                                    <span>Actualizar</span>
                            }
                        </button>
                    </div>
                </div>
            </form >
        </>
    )
}

export { AsignarPermisos }