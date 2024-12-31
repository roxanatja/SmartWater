import { FC, useCallback, useContext, useEffect, useState } from "react";
import "./Items.css";
import { PageTitle } from "../../../../components/PageTitle/PageTitle";
import { useGlobalContext } from "../../../../../SmartwaterContext";
import { category, CategoriesContext } from "./CategoriesContext";
import { Item } from "../../../../../../type/Item";
import { CategoryProductApiConector } from "../../../../../../api/classes";
import { FiltroPaginado } from "../../../../components/FiltroPaginado/FiltroPaginado";
import Modal from "../../../../EntryComponents/Modal";
import CategoriesWrapper from "./CategoriesForm";
import { ItemsItem } from "./Categoriastem/CategoryItems";
import { useNavigate, useParams } from "react-router-dom";

const Categories: FC = () => {

    const { setLoading } = useGlobalContext()
    const { setShowModal, showModal, setSelectedCategory, selectedCategory } = useContext(CategoriesContext)

    const [searchParam, setSearchParam] = useState<string>('');

    const params = useParams();
    const navigate = useNavigate();

    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const ITEMS_PER_PAGE = 15

    const [itemsToShow, setItemsToShow] = useState<Item[]>([])
    const [filteredItems, setFilteredItems] = useState<Item[]>([])
    const [items, setItems] = useState<Item[]>([])

    const fetchData = useCallback(async () => {
        setLoading(true)

        const res = await CategoryProductApiConector.get()
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
            const itms = items.filter(d => d.name.toLowerCase().includes(searchParam.toLowerCase()) || d.description.toLowerCase().includes(searchParam.toLowerCase()))
            setFilteredItems(itms);
            setTotalPages(Math.ceil(itms.length / ITEMS_PER_PAGE))
            setPage(1);
        }
    }, [items, searchParam])

    useEffect(() => {
        if (filteredItems) {
            setItemsToShow(filteredItems.slice((page - 1) * ITEMS_PER_PAGE, (page * ITEMS_PER_PAGE)))
        }
    }, [filteredItems, page])

    return (
        <>
            <div className="px-10">
                <PageTitle titulo="Configuración / Categorías de productos" icon="../../../Configuracion-icon.svg" />


                <FiltroPaginado add={true} paginacion={true} totalPage={totalPages} currentPage={page} handlePageChange={setPage}
                    onAdd={() => setShowModal(true)} resultados order={false} total={filteredItems.length} search={setSearchParam}>
                    <div className="w-full sm:w-1/2 mb-10">
                        <div className="switch-contenido">
                            <div
                                className={`switch-option ${params.section === "Categorias" ? "selected" : ""}`}
                                onClick={() => navigate("/Configuracion/CategoriasUnidades/Categorias")}
                            >
                                Categorías
                            </div>
                            <div
                                className={`switch-option ${params.section === "Unidades" ? "selected" : ""}`}
                                onClick={() => navigate("/Configuracion/CategoriasUnidades/Unidades")}
                            >
                                Unidades
                            </div>
                        </div>
                    </div>
                    <div className="w-full">
                        {

                            itemsToShow.length > 0 &&
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {
                                    itemsToShow.map(p => <ItemsItem key={p._id} category={p} />)
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
                    Registro de categoría
                </h2>
                <CategoriesWrapper isOpen={showModal} onCancel={() => setShowModal(false)} />
            </Modal>

            <Modal
                isOpen={selectedCategory._id !== ""}
                onClose={() => { setSelectedCategory(category); setShowModal(false) }}
            >
                <h2 className="text-blue_custom font-semibold p-6 pb-0 sticky top-0 z-30 bg-main-background">
                    Editar categoría
                </h2>
                <CategoriesWrapper
                    isOpen={
                        selectedCategory._id !== "" ? true : false
                    }
                    onCancel={() => { setSelectedCategory(category); setShowModal(false) }} />
            </Modal>
        </>
    )
}

export { Categories }