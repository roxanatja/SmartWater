import { FC, useCallback, useContext, useEffect, useRef, useState } from "react";
import "./Barrios.css";
import { PageTitle } from "../../../components/PageTitle/PageTitle";
import { BarriosItem } from "./BarriosItem/BarriosItem";
import { District, Zone } from "../../../../../type/City";
import { DistrictsApiConector, ZonesApiConector } from "../../../../../api/classes";
import { useGlobalContext } from "../../../../SmartwaterContext";
import { FiltroPaginado } from "../../../components/FiltroPaginado/FiltroPaginado";
import { BarriosContext, district } from "./BarriosContext";
import Modal from "../../../EntryComponents/Modal";
import BarrioForm from "./BarrioForm";

const Barrios: FC = () => {
    const { setLoading } = useGlobalContext()
    const { setShowModal, showModal, setSelectedDistrict, selectedDistrict } = useContext(BarriosContext)

    const [filtro, setFiltro] = useState<boolean>(false)
    const [searchParam, setSearchParam] = useState<string>('');

    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const ITEMS_PER_PAGE = 15

    const [districtsToShow, setDistrictsToShow] = useState<District[]>([])
    const [filteredDistricts, setFilteredDistricts] = useState<District[]>([])
    const [districts, setDistricts] = useState<District[]>([])

    const [zones, setZones] = useState<Zone[]>([])
    const [checkedZones, setCheckedZones] = useState<string[]>([])

    const optionsRef = useRef<HTMLDivElement>(null);

    const fetchZones = useCallback(async () => {
        setLoading(true)

        const res = await ZonesApiConector.get({ pagination: { page: 1, pageSize: 3000 } })
        setZones(res?.data || [])
        setCheckedZones(res?.data?.map(z => z._id) || [])

        const resD = await DistrictsApiConector.get({ pagination: { page: 1, pageSize: 3000 } })
        const dists = resD?.data || []
        setDistricts(dists)
        setTotalPages(Math.ceil(dists.length / ITEMS_PER_PAGE))

        setLoading(false)
    }, [setLoading])

    useEffect(() => {
        fetchZones()
    }, [fetchZones])

    useEffect(() => {
        if (districts) {
            const dis = districts.filter(d => {
                const filteredZones = zones.filter(z => checkedZones.includes(z._id))
                return filteredZones.some(z => z.districts.some(di => d._id === di._id))
            }).filter(d => d.name.toLowerCase().includes(searchParam.toLowerCase()))
            setFilteredDistricts(dis);
            setTotalPages(Math.ceil(dis.length / ITEMS_PER_PAGE))
            setPage(1);
        }
    }, [districts, searchParam, checkedZones, zones])

    useEffect(() => {
        if (filteredDistricts) {
            setDistrictsToShow(filteredDistricts.slice((page - 1) * ITEMS_PER_PAGE, (page * ITEMS_PER_PAGE)))
        }
    }, [filteredDistricts, page])


    const handleCheckbox1Change = (zoneId: string) => {
        if (checkedZones.includes(zoneId)) {
            setCheckedZones((prev) => prev.filter(p => p !== zoneId))
        } else {
            setCheckedZones([...checkedZones, zoneId])
        }
    };

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
                <PageTitle titulo="Configuración / Barrios" icon="../../../Configuracion-icon.svg" />
                <FiltroPaginado add={true} paginacion={true} totalPage={totalPages} currentPage={page} handlePageChange={setPage}
                    filtro={true} onAdd={() => setShowModal(true)} resultados total={filteredDistricts.length} onFilter={() => setFiltro(true)}
                    hasFilter={!!checkedZones && checkedZones.length !== zones.length} order={false} search={setSearchParam}
                    filterInject={<>
                        {
                            filtro &&
                            <div ref={optionsRef} className="z-[30] border border-[#f2f2f2] dark:border-blocks shadow-md dark:shadow-slate-200/25 absolute top-8 left-0 min-w-[148px] h-auto rounded-[20px] flex items-center justify-center flex-col bg-blocks">
                                <div className="w-full flex flex-col gap-2 py-3 px-5">
                                    {
                                        zones.map(z => (
                                            <div key={z._id} className="Barrios-grupo-check">
                                                <input
                                                    className="input-check accent-blue_custom"
                                                    type="checkbox"
                                                    checked={checkedZones.includes(z._id)}
                                                    onChange={() => handleCheckbox1Change(z._id)}
                                                />
                                                <label className="AsignarPermisos-text-check text-font-color">{z.name}</label>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        }
                    </>}>
                    <div className="w-full">
                        {
                            districtsToShow.length > 0 &&
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {
                                    districtsToShow.map(d => <BarriosItem key={d._id} district={{ ...d, zones: zones.filter(z => z.districts.some(di => di._id === d._id)) }} />)
                                }
                            </div>
                        }
                        {
                            districtsToShow.length === 0 &&
                            <div className="font-semibold text-xl min-h-[300px] flex items-center justify-center">
                                Sin resultados
                            </div>
                        }
                    </div>

                </FiltroPaginado >
            </div >

            <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                <h2 className="text-blue_custom font-semibold p-6 pb-0 sticky top-0 z-30 bg-main-background">
                    Registrar Barrio
                </h2>
                <BarrioForm isOpen={showModal} onCancel={() => setShowModal(false)} zonas={zones} />
            </Modal>

            <Modal
                isOpen={selectedDistrict._id !== ""}
                onClose={() => { setSelectedDistrict(district); setShowModal(false) }}
            >
                <h2 className="text-blue_custom font-semibold p-6 pb-0 sticky top-0 z-30 bg-main-background">
                    Editar Barrio
                </h2>
                <BarrioForm
                    isOpen={
                        selectedDistrict._id !== "" ? true : false
                    }
                    onCancel={() => { setSelectedDistrict(district); setShowModal(false) }} zonas={zones}
                />
            </Modal>
        </>
    )
}

export { Barrios }