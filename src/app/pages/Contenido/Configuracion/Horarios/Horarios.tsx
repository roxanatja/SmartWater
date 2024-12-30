import { FC, useCallback, useContext, useEffect, useState } from "react";
import "./Items.css";
import { PageTitle } from "../../../components/PageTitle/PageTitle";
import { useGlobalContext } from "../../../../SmartwaterContext";
import { schedule, HorarioContext } from "./HorarioContext";
import { SchedulesApiConector } from "../../../../../api/classes";
import { FiltroPaginado } from "../../../components/FiltroPaginado/FiltroPaginado";
import Modal from "../../../EntryComponents/Modal";
import HorariosForm from "./HorariosForm";
import { Schedule } from "../../../../../type/Schedule";
import { HorariosItem } from "./HorariosItem/HorariosItem";

const Horarios: FC = () => {

    const { setLoading } = useGlobalContext()
    const { setShowModal, showModal, setSelectedSchedule, selectedSchedule } = useContext(HorarioContext)

    const [searchParam, setSearchParam] = useState<string>('');

    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const ITEMS_PER_PAGE = 15

    const [schedulesToShow, setSchedulesToShow] = useState<Schedule[]>([])
    const [filteredItems, setFilteredItems] = useState<Schedule[]>([])
    const [schedules, setItems] = useState<Schedule[]>([])

    const fetchData = useCallback(async () => {
        setLoading(true)

        const res = await SchedulesApiConector.get()
        const prods = res || []
        setItems(prods)
        setTotalPages(Math.ceil(prods.length / ITEMS_PER_PAGE))

        setLoading(false)
    }, [setLoading])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    useEffect(() => {
        if (schedules) {
            const itms = schedules.filter(d => {
                const param = searchParam.toLowerCase()
                return d.startTime.toLowerCase().includes(param) || d.startTime.toLowerCase().includes(param) || d.days.some(day => day.toLowerCase().includes(param))
            })
            setFilteredItems(itms);
            setTotalPages(Math.ceil(itms.length / ITEMS_PER_PAGE))
            setPage(1);
        }
    }, [schedules, searchParam])

    useEffect(() => {
        if (filteredItems) {
            setSchedulesToShow(filteredItems.slice((page - 1) * ITEMS_PER_PAGE, (page * ITEMS_PER_PAGE)))
        }
    }, [filteredItems, page])

    return (
        <>
            <div className="px-10">
                <PageTitle titulo="Configuración / Items" icon="../../../Configuracion-icon.svg" />
                <FiltroPaginado add={true} paginacion={true} totalPage={totalPages} currentPage={page} handlePageChange={setPage}
                    onAdd={() => setShowModal(true)} resultados order={false} total={filteredItems.length} search={setSearchParam}>
                    <div className="w-full">
                        {

                            schedulesToShow.length > 0 &&
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {
                                    schedulesToShow.map(p => <HorariosItem key={p._id} schedule={p} />)
                                }
                            </div>
                        }
                        {
                            schedulesToShow.length === 0 &&
                            <div className="font-semibold text-xl min-h-[300px] flex items-center justify-center">
                                Sin resultados
                            </div>
                        }
                    </div>
                </FiltroPaginado >
            </div >

            <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                <h2 className="text-blue_custom font-semibold p-6 pb-0 sticky top-0 z-30 bg-main-background">
                    Registro de item
                </h2>
                <HorariosForm isOpen={showModal} onCancel={() => setShowModal(false)} />
            </Modal>

            <Modal
                isOpen={selectedSchedule._id !== ""}
                onClose={() => { setSelectedSchedule(schedule); setShowModal(false) }}
            >
                <h2 className="text-blue_custom font-semibold p-6 pb-0 sticky top-0 z-30 bg-main-background">
                    Editar item
                </h2>
                <HorariosForm
                    isOpen={
                        selectedSchedule._id !== "" ? true : false
                    }
                    onCancel={() => { setSelectedSchedule(schedule); setShowModal(false) }} />
            </Modal>
        </>
    )
}

export { Horarios }