import { FC, useCallback, useContext, useEffect, useState } from "react";
import "./Items.css";
import { PageTitle } from "../../../components/PageTitle/PageTitle";
import { PromotionsItem } from "./PromocionsItem/PromotionsItem";
import { useGlobalContext } from "../../../../SmartwaterContext";
import { promotion, PromocionesContext } from "./PromocionesContext";
import { PromotionApiConector } from "../../../../../api/classes";
import { FiltroPaginado } from "../../../components/FiltroPaginado/FiltroPaginado";
import Modal from "../../../EntryComponents/Modal";
import PromotionsForm from "./PromotionsForm";
import { Promotion } from "../../../../../type/Promotion";

const Promotions: FC = () => {

    const { setLoading } = useGlobalContext()
    const { setShowModal, showModal, setSelectedItem, selectedItem } = useContext(PromocionesContext)

    // const [searchParam, setSearchParam] = useState<string>('');

    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const ITEMS_PER_PAGE = 9

    const [itemsToShow, setItemsToShow] = useState<Promotion[]>([])
    const [filteredItems, setFilteredItems] = useState<Promotion[]>([])
    const [items, setItems] = useState<Promotion[]>([])

    const fetchData = useCallback(async () => {
        setLoading(true)

        const res = await PromotionApiConector.getPromotions()
        const prods = res || []
        setItems(prods)
        setTotalPages(Math.ceil(prods.length / ITEMS_PER_PAGE))

        setLoading(false)
    }, [setLoading])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    useEffect(() => {
        if (items) {
            console.log(items)
            // const itms = items.filter(d => d.name.toLowerCase().includes(searchParam.toLowerCase()))
            setFilteredItems(items || []);
            setTotalPages(Math.ceil(items.length / ITEMS_PER_PAGE))
            setPage(1);
        }
    }, [items])

    useEffect(() => {
        if (filteredItems) {
            console.log(filteredItems)
            setItemsToShow(filteredItems.slice((page - 1) * ITEMS_PER_PAGE, (page * ITEMS_PER_PAGE)))
        }
    }, [filteredItems, page])

    return (
        <>
            <div className="px-10">
                <PageTitle titulo="Configuración / Promociones" icon="../../../Configuracion-icon.svg" />
                <FiltroPaginado add={true} paginacion={true} totalPage={totalPages} currentPage={page} handlePageChange={setPage}
                    onAdd={() => setShowModal(true)} resultados={false} order={false} hasSearch={false} total={filteredItems.length}>
                    <div className="w-full">
                        {

                            itemsToShow.length > 0 &&
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {
                                    itemsToShow.map(p => <PromotionsItem key={p._id} promotion={p} />)
                                }
                            </div>
                        }
                        {
                            itemsToShow.length === 0 &&
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
                <PromotionsForm isOpen={showModal} onCancel={() => setShowModal(false)} />
            </Modal>

            <Modal
                isOpen={selectedItem._id !== ""}
                onClose={() => { setSelectedItem(promotion); setShowModal(false) }}
            >
                <h2 className="text-blue_custom font-semibold p-6 pb-0 sticky top-0 z-30 bg-main-background">
                    Editar item
                </h2>
                <PromotionsForm
                    isOpen={
                        selectedItem._id !== "" ? true : false
                    }
                    onCancel={() => { setSelectedItem(promotion); setShowModal(false) }} />
            </Modal>
        </>
    )
}

export { Promotions }