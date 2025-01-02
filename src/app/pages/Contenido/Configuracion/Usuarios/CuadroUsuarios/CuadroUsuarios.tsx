import { FC, useContext, useEffect, useRef, useState } from "react";
import "./CuadroUsuarios.css";
import { UsuariosContext } from "../UsuariosContext";
import { Option } from "../../../../components/Option/Option";
import { User } from "../../../../../../type/User";
import toast from "react-hot-toast";
import { UsersApiConector } from "../../../../../../api/classes";
import { formatIncompletePhoneNumber } from "libphonenumber-js";
import { Zone } from "../../../../../../type/City";

const CuadroUsuarios: FC<{ user: User, zones: Zone[] }> = ({ user, zones }) => {

    const { setShowMiniModal, setSelectedUser } = useContext(UsuariosContext);
    const [showOptions, setShowOptions] = useState<boolean>(false);

    const optionsRef = useRef<HTMLDivElement>(null);

    const Opciones = () => {
        setShowOptions(!showOptions);
    };

    const Edit = () => {
        setSelectedUser(user);
        setShowOptions(false);
    };

    const Delete = async () => {
        toast.error(
            (t) => (
                <div>
                    <p className="mb-4 text-center text-[#888]">
                        Se <b>eliminará</b> este usuario <br /> pulsa <b>Proceder</b> para continuar
                    </p>
                    <div className="flex justify-center">
                        <button
                            className="bg-red-500 px-3 py-1 rounded-lg ml-2 text-white"
                            onClick={() => { toast.dismiss(t.id); }}
                        >
                            Cancelar
                        </button>
                        <button
                            className="bg-blue_custom px-3 py-1 rounded-lg ml-2 text-white"
                            onClick={async () => {
                                toast.dismiss(t.id);
                                const response = await UsersApiConector.delete({ userId: user?._id || '' }) as any;
                                if (!!response) {
                                    if (response.mensaje) {
                                        toast.success(response.mensaje, {
                                            position: "top-center",
                                            duration: 2000
                                        });
                                        window.location.reload();
                                    } else if (response.error) {
                                        toast.error(response.error, {
                                            position: "top-center",
                                            duration: 2000
                                        });
                                    }
                                } else {
                                    toast.error("Error al eliminar cliente", {
                                        position: "top-center",
                                        duration: 2000
                                    });
                                }
                            }}
                        >
                            Proceder
                        </button>
                    </div>
                </div>
            ),
            {
                className: "shadow-md dark:shadow-slate-400 border border-slate-100 bg-main-background",
                icon: null,
                position: "top-center"
            }
        );
        setShowOptions(false);
    };

    const roleToShow = () => {
        if (user.role === "admin") {
            return "Administrador";
        } else if (user.role === "user") {
            return "Distribudor";
        }
    };

    const showMiniModal = () => {
        setShowMiniModal(true);
        setSelectedUser(user);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                optionsRef.current &&
                !optionsRef.current.contains(event.target as Node)
            ) {
                setShowOptions(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <>
            <div className="CuadroUsuarios-container relative bg-blocks dark:border-blocks">
                <div className="CuadroUsuarios-header">
                    <div className="flex justify-start gap-4 w-[calc(100%_-_30px)] flex-wrap">
                        <div className="CuadroUsuarios-header1 items-start justify-between w-full pr-4">
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                                {
                                    (user.zones && user.zones.length > 0) ?
                                        <>
                                            {
                                                zones.filter(z => (user.zones || []).some(zon => zon === z._id)).map(z =>
                                                    <div key={z._id} className="flex gap-2 items-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                                                            <path d="M10.8509 9.58464C10.2984 9.58464 9.76847 9.36514 9.37777 8.97444C8.98707 8.58374 8.76758 8.05384 8.76758 7.5013C8.76758 6.94877 8.98707 6.41886 9.37777 6.02816C9.76847 5.63746 10.2984 5.41797 10.8509 5.41797C11.4034 5.41797 11.9334 5.63746 12.3241 6.02816C12.7148 6.41886 12.9342 6.94877 12.9342 7.5013C12.9342 7.77489 12.8804 8.0458 12.7757 8.29856C12.671 8.55132 12.5175 8.78099 12.3241 8.97444C12.1306 9.1679 11.9009 9.32135 11.6482 9.42605C11.3954 9.53075 11.1245 9.58464 10.8509 9.58464ZM10.8509 1.66797C9.30382 1.66797 7.82008 2.28255 6.72612 3.37651C5.63216 4.47047 5.01758 5.95421 5.01758 7.5013C5.01758 11.8763 10.8509 18.3346 10.8509 18.3346C10.8509 18.3346 16.6842 11.8763 16.6842 7.5013C16.6842 5.95421 16.0697 4.47047 14.9757 3.37651C13.8817 2.28255 12.398 1.66797 10.8509 1.66797Z" fill="currentColor" />
                                                        </svg>
                                                        <span>
                                                            {z.name}
                                                        </span>
                                                    </div>
                                                )
                                            }
                                        </> :
                                        <div className="flex gap-">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                                                <path d="M10.8509 9.58464C10.2984 9.58464 9.76847 9.36514 9.37777 8.97444C8.98707 8.58374 8.76758 8.05384 8.76758 7.5013C8.76758 6.94877 8.98707 6.41886 9.37777 6.02816C9.76847 5.63746 10.2984 5.41797 10.8509 5.41797C11.4034 5.41797 11.9334 5.63746 12.3241 6.02816C12.7148 6.41886 12.9342 6.94877 12.9342 7.5013C12.9342 7.77489 12.8804 8.0458 12.7757 8.29856C12.671 8.55132 12.5175 8.78099 12.3241 8.97444C12.1306 9.1679 11.9009 9.32135 11.6482 9.42605C11.3954 9.53075 11.1245 9.58464 10.8509 9.58464ZM10.8509 1.66797C9.30382 1.66797 7.82008 2.28255 6.72612 3.37651C5.63216 4.47047 5.01758 5.95421 5.01758 7.5013C5.01758 11.8763 10.8509 18.3346 10.8509 18.3346C10.8509 18.3346 16.6842 11.8763 16.6842 7.5013C16.6842 5.95421 16.0697 4.47047 14.9757 3.37651C13.8817 2.28255 12.398 1.66797 10.8509 1.66797Z" fill="currentColor" />
                                            </svg>
                                            <span>
                                                Sin zonas asignadas
                                            </span>
                                        </div>
                                }
                            </div>
                            <span>
                                {roleToShow()}
                            </span>
                        </div>

                        <div className="absolute right-0 p-4 rounded-full z-[35] top-0 flex flex-col gap-4">
                            <button type="button" className="invert-0 dark:invert" onClick={showMiniModal}>
                                <img src="/Opciones-icon.svg" alt="" />
                            </button>

                            <div className="relative" ref={optionsRef}>
                                <button type="button" className="invert-0 dark:invert" onClick={() => Opciones()}>
                                    <img src="/opcion-icon.svg" alt="" />
                                </button>
                                <Option
                                    editAction={Edit}
                                    visible={showOptions}
                                    editar={true}
                                    eliminar={true}
                                    deleteAction={Delete}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }} className="w-[calc(100%_-_30px)]">
                    <div className="w-full flex gap-6 items-center flex-wrap">
                        <div className="CuadroUsuarios-header1">
                            <div className="flex items-center gap-3 font-[500]">
                                <div className="bg-blue_custom text-white px-3.5 py-1.5 rounded-full flex justify-center items-center">
                                    <div className="opacity-0">.</div>
                                    <p className="absolute font-extrabold whitespace-nowrap">
                                        {user.fullName?.[0] || "S"}
                                    </p>
                                </div>
                                <span>{user.fullName}</span>
                            </div>
                        </div>
                        <div className="CuadroUsuarios-header1">
                            <div className="infoClientes-datos relative z-10">
                                <a
                                    href={`https://wa.me/${user?.phoneNumber}`}
                                    className="btn-whatsapp flex items-center gap-1"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <img src="/whap-icon.svg" alt="Icono de WhatsApp" />
                                    <span className="whitespace-nowrap">{formatIncompletePhoneNumber(user.phoneNumber, "BO")}</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}

export { CuadroUsuarios }