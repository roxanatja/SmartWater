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
    const [items, setItems] = useState<Promotion[]>([])

    const fetchData = useCallback(async () => {
        setLoading(true)

        const res = await PromotionApiConector.getPromotions()
        const prods = res || []
        setItems(prods)

        setLoading(false)
    }, [setLoading])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    return (
        <>
            <div className="px-10">
                <PageTitle titulo="Configuración / Promociones" icon="../../../Configuracion-icon.svg" />
                <FiltroPaginado add={items.length === 0}
                    onAdd={() => setShowModal(true)} resultados={false} order={false} hasSearch={false} total={items.length}>
                    <div className="w-full">
                        {

                            items.length > 0 &&
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {
                                    items.map(p => <PromotionsItem key={p._id} promotion={p} />)
                                }
                            </div>
                        }
                        {
                            items.length === 0 &&
                            <div className="font-semibold text-xl min-h-[300px] flex items-center justify-center">
                                Sin resultados
                            </div>
                        }
                    </div>
                </FiltroPaginado >
            </div >

            <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                <h2 className="text-blue_custom font-semibold p-6 pb-0 sticky top-0 z-30 bg-main-background">
                    Agregar promoción
                </h2>
                <PromotionsForm isOpen={showModal} onCancel={() => setShowModal(false)} />
            </Modal>

            <Modal
                isOpen={selectedItem._id !== ""}
                onClose={() => { setSelectedItem(promotion); setShowModal(false) }}
            >
                <h2 className="text-blue_custom font-semibold p-6 pb-0 sticky top-0 z-30 bg-main-background">
                    Editar promoción
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