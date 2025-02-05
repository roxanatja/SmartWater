import { FC, useCallback, useContext, useEffect, useState } from "react";
import "./Zonas.css";
import { PageTitle } from "../../../components/PageTitle/PageTitle";
import { ZonasItem } from "./ZonasItem/ZonasItem";
import { ZonesApiConector } from "../../../../../api/classes";
import { Zone } from "../../../../../type/City";
import Modal from "../../../EntryComponents/Modal";
import { ZonasContext, zone } from "./ZonasContext";
import ZonasForm from "./Zonas.form";
import { useGlobalContext } from "../../../../SmartwaterContext";
import { FiltroPaginado } from "../../../components/FiltroPaginado/FiltroPaginado";

const Zonas: FC = () => {

    const { setLoading } = useGlobalContext()
    const { showModal, selectedZone, setShowModal, setSelectedZone } = useContext(ZonasContext)

    const [searchParam, setSearchParam] = useState<string>('');

    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const ITEMS_PER_PAGE = 15

    const [zonasToShow, setZonasToShow] = useState<Zone[]>([])
    const [filteredZonas, setFilteredZonas] = useState<Zone[]>([])
    const [zonas, setZonas] = useState<Zone[]>([])

    const fetchZones = useCallback(async () => {
        setLoading(true)

        const res = await ZonesApiConector.get({ pagination: { page: 1, pageSize: 30000 } })
        setZonas(res?.data || [])
        setTotalPages(Math.ceil((res?.data || []).length / ITEMS_PER_PAGE))

        setLoading(false)
    }, [setLoading])

    useEffect(() => {
        fetchZones()
    }, [fetchZones])

    useEffect(() => {
        if (zonas) {
            const itms = zonas.filter(d => d.name.toLowerCase().includes(searchParam.toLowerCase()))
            setFilteredZonas(itms);
            setTotalPages(Math.ceil(itms.length / ITEMS_PER_PAGE))
            setPage(1);
        }
    }, [zonas, searchParam])

    useEffect(() => {
        if (filteredZonas) {
            setZonasToShow(filteredZonas.slice((page - 1) * ITEMS_PER_PAGE, (page * ITEMS_PER_PAGE)))
        }
    }, [filteredZonas, page])

    return (
        <>
            <div className="px-10">
                <PageTitle titulo="Configuración / Zonas" icon="../../../Configuracion-icon.svg" />

                <FiltroPaginado add={true} paginacion={totalPages > 1} totalPage={totalPages} currentPage={page} handlePageChange={setPage}
                    onAdd={() => setShowModal(true)} resultados order={false} total={filteredZonas.length} search={setSearchParam}>
                    <div className="w-full">
                        {

                            zonasToShow.length > 0 &&
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {
                                    zonasToShow.map(p => <ZonasItem key={p._id} zone={p} />)
                                }
                            </div>
                        }
                        {
                            zonasToShow.length === 0 &&
                            <div className="font-semibold text-xl min-h-[300px] flex items-center justify-center">
                                Sin resultados
                            </div>
                        }
                    </div>
                </FiltroPaginado >
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