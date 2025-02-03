import { FC, useCallback, useContext, useEffect, useRef, useState } from "react";
import "./Items.css";
import { PageTitle } from "../../../components/PageTitle/PageTitle";
import { ItemsItem } from "./ItemsItem/ItemsItem";
import { useGlobalContext } from "../../../../SmartwaterContext";
import { item, ItemsContext } from "./ItemsContext";
import { Item } from "../../../../../type/Item";
import { CategoryProductApiConector, ItemsApiConector, UnitMeasureApiConector } from "../../../../../api/classes";
import { FiltroPaginado } from "../../../components/FiltroPaginado/FiltroPaginado";
import Modal from "../../../EntryComponents/Modal";
import ItemForm from "./ItemForm";
import { CategoryProduct } from "../../../../../type/Products/Category";
import { UnitMeasure } from "../../../../../type/Products/UnitMeasure";

const Items: FC = () => {

    const { setLoading } = useGlobalContext()
    const { setShowModal, showModal, setSelectedItem, selectedItem } = useContext(ItemsContext)

    const [filtro, setFiltro] = useState<boolean>(false)
    const [searchParam, setSearchParam] = useState<string>('');

    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const ITEMS_PER_PAGE = 15

    const [itemsToShow, setItemsToShow] = useState<Item[]>([])
    const [filteredItems, setFilteredItems] = useState<Item[]>([])
    const [items, setItems] = useState<Item[]>([])

    const [categories, setCategories] = useState<CategoryProduct[]>([])
    const [units, setUnits] = useState<UnitMeasure[]>([])
    const [checkedCategories, setCheckedCategories] = useState<string[]>([])

    const optionsRef = useRef<HTMLDivElement>(null);

    const fetchData = useCallback(async () => {
        setLoading(true)

        const res = await ItemsApiConector.get({ pagination: { page: 1, pageSize: 3000, sort: 'desc' } })
        const prods = res?.data || []
        setItems(prods)
        setTotalPages(Math.ceil(prods.length / ITEMS_PER_PAGE))

        const resC = await CategoryProductApiConector.get()
        setCategories(resC || [])

        const resU = await UnitMeasureApiConector.get({ pagination: { page: 1, pageSize: 3000 } })
        setUnits(resU || [])

        setLoading(false)
    }, [setLoading])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    useEffect(() => {
        if (items) {
            const prod = items.filter(d => {
                return checkedCategories.length > 0 ? checkedCategories.some(c => c === (d.category as CategoryProduct)?._id) : true
            }).filter(d => d.name.toLowerCase().includes(searchParam.toLowerCase()))
            setFilteredItems(prod);
            setTotalPages(Math.ceil(prod.length / ITEMS_PER_PAGE))
            setPage(1);
        }
    }, [items, searchParam, checkedCategories])

    useEffect(() => {
        if (filteredItems) {
            setItemsToShow(filteredItems.slice((page - 1) * ITEMS_PER_PAGE, (page * ITEMS_PER_PAGE)))
        }
    }, [filteredItems, page])

    const handleCheckbox1Change = (categoryId: string) => {
        if (checkedCategories.includes(categoryId)) {
            setCheckedCategories((prev) => prev.filter(p => p !== categoryId))
        } else {
            setCheckedCategories([...checkedCategories, categoryId])
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
                <PageTitle titulo="Configuración / Items" icon="../../../Configuracion-icon.svg" />
                <FiltroPaginado add={true} paginacion={totalPages > 1} totalPage={totalPages} currentPage={page} handlePageChange={setPage}
                    onAdd={() => setShowModal(true)} resultados order={false} total={filteredItems.length} search={setSearchParam}
                    filtro={true} hasFilter={checkedCategories.length > 0} onFilter={() => setFiltro(true)}
                    filterInject={<>
                        {
                            filtro &&
                            <div ref={optionsRef} className="z-[30] border border-[#f2f2f2] dark:border-blocks shadow-md dark:shadow-slate-200/25 absolute top-8 left-0 min-w-[148px] h-auto rounded-[20px] flex items-center justify-center flex-col bg-blocks">
                                <div className="w-full flex flex-col gap-2 py-3 px-5">
                                    <strong className="mb-2">Categoría</strong>
                                    {
                                        categories.map(z => (
                                            <div key={z._id} className="Barrios-grupo-check">
                                                <input
                                                    className="input-check accent-blue_custom"
                                                    type="checkbox"
                                                    checked={checkedCategories.includes(z._id)}
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

                            itemsToShow.length > 0 &&
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {
                                    itemsToShow.map(p => <ItemsItem key={p._id} item={p} />)
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
                <ItemForm isOpen={showModal} onCancel={() => setShowModal(false)} categories={categories} units={units} />
            </Modal>

            <Modal
                isOpen={selectedItem._id !== ""}
                onClose={() => { setSelectedItem(item); setShowModal(false) }}
            >
                <h2 className="text-blue_custom font-semibold p-6 pb-0 sticky top-0 z-30 bg-main-background">
                    Editar item
                </h2>
                <ItemForm categories={categories} units={units}
                    isOpen={
                        selectedItem._id !== "" ? true : false
                    }
                    onCancel={() => { setSelectedItem(item); setShowModal(false) }} />
            </Modal>
        </>
    )
}

export { Items }