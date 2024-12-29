import { FC, useCallback, useContext, useEffect, useRef, useState } from "react";
import "./Zonas.css";
import { PageTitle } from "../../../components/PageTitle/PageTitle";
import { ZonasItem } from "./ZonasItem/ZonasItem";
import { IZonesGetParams } from "../../../../../api/types/zones";
import { ZonesApiConector } from "../../../../../api/classes";
import { Zone } from "../../../../../type/City";
import Modal from "../../../EntryComponents/Modal";
import { ZonasContext, zone } from "./ZonasContext";
import ZonasForm from "./Zonas.form";
import ZonasFilters from "./ZonasFilters";
import { useGlobalContext } from "../../../../SmartwaterContext";

const Zonas: FC = () => {

    const { setLoading } = useGlobalContext()
    const { showModal, selectedZone, setShowModal, setSelectedZone } = useContext(ZonasContext)
    const [filtro, setFiltro] = useState<boolean>(false)
    const [filters, setFilters] = useState<IZonesGetParams['filters']>({})
    const optionsRef = useRef<HTMLDivElement>(null);

    const [zonas, setZonas] = useState<Zone[]>([])

    const fetchZones = useCallback(async () => {
        setLoading(true)
        const res = await ZonesApiConector.get({ pagination: { page: 1, pageSize: 3000 }, filters })
        setZonas(res?.data || [])
        setLoading(false)
    }, [filters, setLoading])

    useEffect(() => {
        fetchZones()
    }, [fetchZones])

    // const handleFilterChange = (filters: IZonesGetParams['filters']) => {
    //     setFilters(filters);
    // };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                optionsRef.current &&
                !optionsRef.current.contains(event.target as Node)
            ) {
                setFiltro(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <>
            <div className="px-10">
                <PageTitle titulo="Configuración / Zonas" icon="../../../Configuracion-icon.svg" />

                {/* TODO: What filters */}
                {/* <div className="relative" style={{ display: "flex", alignItems: "center", justifyContent: "right", width: "100%", marginTop: "25px" }} >
                    <div ref={optionsRef}>
                        <button className="Zonas-btn" onClick={() => setFiltro(!filtro)}>
                            <span>Filtrar</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <g clipPath="url(#clip0_49_14013)">
                                    <path d="M0 19.5C0 18.6703 0.670312 18 1.5 18H4.06406C4.64062 16.6734 5.9625 15.75 7.5 15.75C9.0375 15.75 10.3594 16.6734 10.9359 18H22.5C23.3297 18 24 18.6703 24 19.5C24 20.3297 23.3297 21 22.5 21H10.9359C10.3594 22.3266 9.0375 23.25 7.5 23.25C5.9625 23.25 4.64062 22.3266 4.06406 21H1.5C0.670312 21 0 20.3297 0 19.5ZM9 19.5C9 18.6703 8.32969 18 7.5 18C6.67031 18 6 18.6703 6 19.5C6 20.3297 6.67031 21 7.5 21C8.32969 21 9 20.3297 9 19.5ZM18 12C18 11.1703 17.3297 10.5 16.5 10.5C15.6703 10.5 15 11.1703 15 12C15 12.8297 15.6703 13.5 16.5 13.5C17.3297 13.5 18 12.8297 18 12ZM16.5 8.25C18.0375 8.25 19.3594 9.17344 19.9359 10.5H22.5C23.3297 10.5 24 11.1703 24 12C24 12.8297 23.3297 13.5 22.5 13.5H19.9359C19.3594 14.8266 18.0375 15.75 16.5 15.75C14.9625 15.75 13.6406 14.8266 13.0641 13.5H1.5C0.670312 13.5 0 12.8297 0 12C0 11.1703 0.670312 10.5 1.5 10.5H13.0641C13.6406 9.17344 14.9625 8.25 16.5 8.25ZM9 3C8.17031 3 7.5 3.67031 7.5 4.5C7.5 5.32969 8.17031 6 9 6C9.82969 6 10.5 5.32969 10.5 4.5C10.5 3.67031 9.82969 3 9 3ZM12.4359 3H22.5C23.3297 3 24 3.67031 24 4.5C24 5.32969 23.3297 6 22.5 6H12.4359C11.8594 7.32656 10.5375 8.25 9 8.25C7.4625 8.25 6.14062 7.32656 5.56406 6H1.5C0.670312 6 0 5.32969 0 4.5C0 3.67031 0.670312 3 1.5 3H5.56406C6.14062 1.67344 7.4625 0.75 9 0.75C10.5375 0.75 11.8594 1.67344 12.4359 3Z" fill="#1B1B1B" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_49_14013">
                                        <rect width="24" height="24" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>
                        </button>
                        {
                            filtro &&
                            <div className="z-[30] border border-[#f2f2f2] dark:border-blocks shadow-md dark:shadow-slate-200/25 absolute top-8 -right-2 min-w-[148px] h-[100px] rounded-[20px] flex items-center justify-center flex-col bg-blocks">
                                <ZonasFilters active={filters} changeFilters={handleFilterChange} />
                            </div>
                        }
                    </div>
                </div> */}

                <div className="w-full my-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                        {
                            zonas.map(z => <ZonasItem key={z._id} zone={z} />)
                        }
                    </div>
                </div>


                <div className="flex justify-between absolute right-0 bottom-0 px-5 w-full h-[130px] bg-main-background z-[40]">
                    <div className=""></div>
                    <div className="flex flex-col-reverse gap-4 justify-center items-center">
                        <div style={{ marginBottom: "1em" }}>
                            <button type="button" className="btn-agregar bg-blue_custom" onClick={() => setShowModal(true)}>
                                <span className="material-symbols-outlined">add</span>
                            </button>
                        </div>
                    </div>
                </div>
                {/* <div className="flex w-full sm:justify-end items-center gap-4 flex-wrap justify-center">
                    <button className="CuentasContables-btn" onClick={() => }>
                        <span>Crear</span>
                    </button>
                </div> */}
            </div>

            <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                <h2 className="text-blue_custom font-semibold p-6 pb-0 sticky top-0 z-30 bg-main-background">
                    Registrar Zona
                </h2>
                <ZonasForm isOpen={showModal} onCancel={() => setShowModal(false)} />
            </Modal>

            <Modal
                isOpen={selectedZone._id !== ""}
                onClose={() => { setSelectedZone(zone); setShowModal(false) }}
            >
                <h2 className="text-blue_custom font-semibold p-6 pb-0 sticky top-0 z-30 bg-main-background">
                    Editar Zona
                </h2>
                <ZonasForm
                    isOpen={
                        selectedZone._id !== "" ? true : false
                    }
                    onCancel={() => { setSelectedZone(zone); setShowModal(false) }}
                />
            </Modal>
        </>
    )
}

export { Zonas }