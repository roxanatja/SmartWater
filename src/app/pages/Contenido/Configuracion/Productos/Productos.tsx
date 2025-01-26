import { FC, useCallback, useContext, useEffect, useRef, useState } from "react";
import "./Productos.css";
import { PageTitle } from "../../../components/PageTitle/PageTitle";
import { ProductosItem } from "./ProductosItem/ProductosItem";
import { useGlobalContext } from "../../../../SmartwaterContext";
import { product, ProductosContext } from "./ProductosContext";
import Product from "../../../../../type/Products/Products";
import { CategoryProductApiConector, ProductsApiConector } from "../../../../../api/classes";
import { FiltroPaginado } from "../../../components/FiltroPaginado/FiltroPaginado";
import { CategoryProduct } from "../../../../../type/Products/Category";
import Modal from "../../../EntryComponents/Modal";
import ProductForm from "./ProductForm";
import { UnitMeasure } from "../../../../../type/Products/UnitMeasure";
import { UnitMeasureApiConector } from "../../../../../api/classes/unit-measure";

const Productos: FC = () => {
    const { setLoading } = useGlobalContext()
    const { setShowModal, showModal, setSelectedProduct, selectedProduct } = useContext(ProductosContext)

    const [filtro, setFiltro] = useState<boolean>(false)
    const [searchParam, setSearchParam] = useState<string>('');

    const [page, setPage] = useState<number>(1);
    const [sort, setSort] = useState<'asc' | 'desc'>('desc');
    const [totalPages, setTotalPages] = useState<number>(1);
    const ITEMS_PER_PAGE = 9

    const [productsToShow, setProductsToShow] = useState<Product[]>([])
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
    const [products, setProducts] = useState<Product[]>([])

    const optionsRef = useRef<HTMLDivElement>(null);

    const [categories, setCategories] = useState<CategoryProduct[]>([])
    const [units, setUnits] = useState<UnitMeasure[]>([])
    const [checkedCategories, setCheckedCategories] = useState<string[]>([])

    const fetchData = useCallback(async () => {
        setLoading(true)

        const res = await ProductsApiConector.get({ pagination: { page: 1, pageSize: 3000, sort } })
        const prods = res?.data || []
        setProducts(prods)
        setTotalPages(Math.ceil(prods.length / ITEMS_PER_PAGE))

        const resC = await CategoryProductApiConector.get()
        setCategories(resC || [])

        const resU = await UnitMeasureApiConector.get({ pagination: { page: 1, pageSize: 3000 } })
        setUnits(resU || [])

        setLoading(false)
    }, [setLoading, sort])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    useEffect(() => {
        if (products) {
            const prod = products.filter(d => {
                return checkedCategories.length > 0 ? checkedCategories.some(c => c === (d.category as CategoryProduct)._id) : true
            }).filter(d => d.name.toLowerCase().includes(searchParam.toLowerCase()))
            setFilteredProducts(prod);
            setTotalPages(Math.ceil(prod.length / ITEMS_PER_PAGE))
            setPage(1);
        }
    }, [products, searchParam, checkedCategories])

    useEffect(() => {
        if (filteredProducts) {
            setProductsToShow(filteredProducts.slice((page - 1) * ITEMS_PER_PAGE, (page * ITEMS_PER_PAGE)))
        }
    }, [filteredProducts, page])

    const order = (orden: string) => {
        if (orden === "new") {
            setSort('desc')
        } else if (orden === "older") {
            setSort('asc')
        }
    };

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
                <PageTitle titulo="Configuración / Productos" icon="../../../Configuracion-icon.svg" />
                <FiltroPaginado add={true} paginacion={totalPages > 1} totalPage={totalPages} currentPage={page} handlePageChange={setPage}
                    onAdd={() => setShowModal(true)} resultados total={filteredProducts.length} search={setSearchParam} orderArray={order}
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

                            productsToShow.length > 0 &&
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {
                                    productsToShow.map(p => <ProductosItem key={p._id} product={p} />)
                                }
                            </div>
                        }
                        {
                            productsToShow.length === 0 &&
                            <div className="font-semibold text-xl min-h-[300px] flex items-center justify-center">
                                Sin resultados
                            </div>
                        }
                    </div>
                </FiltroPaginado >
            </div>

            <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                <h2 className="text-blue_custom font-semibold p-6 pb-0 sticky top-0 z-30 bg-main-background">
                    Registro de producto
                </h2>
                <ProductForm isOpen={showModal} onCancel={() => setShowModal(false)} categories={categories} units={units} />
            </Modal>

            <Modal
                isOpen={selectedProduct._id !== ""}
                onClose={() => { setSelectedProduct(product); setShowModal(false) }}
            >
                <h2 className="text-blue_custom font-semibold p-6 pb-0 sticky top-0 z-30 bg-main-background">
                    Editar producto
                </h2>
                <ProductForm
                    isOpen={
                        selectedProduct._id !== "" ? true : false
                    }
                    onCancel={() => { setSelectedProduct(product); setShowModal(false) }} categories={categories} units={units}
                />
            </Modal>
        </>
    )
}

export { Productos }