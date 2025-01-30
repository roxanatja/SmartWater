import { useContext, useMemo } from "react"
import { EgresosGastosContext } from "../EgresosGastosContext"
import { EgresoItemItem, EgresoProductItem } from "../../../../../../type/Expenses"
import DataTable, { TableColumn } from "react-data-table-component"

interface Props {
    onCancel: () => void
}

const CuadroEgresoDetails = ({ onCancel }: Props) => {
    const { selectedExpense } = useContext(EgresosGastosContext)

    const columnsItems: TableColumn<EgresoItemItem>[] = useMemo<TableColumn<EgresoItemItem>[]>(() => [
        {
            name: "Item",
            width: "30%",
            selector: row => row.item.name,
        },
        {
            name: "Cantidad",
            selector: row => row.quantity.toLocaleString(),
        },
        {
            name: "Costo unitario",
            selector: row => row.unitPrice.toLocaleString(),
        },
        {
            name: "Subtotal",
            selector: row => row.subtotal.toLocaleString(),
        }
    ], [])
    const columnsProducts: TableColumn<EgresoProductItem>[] = useMemo<TableColumn<EgresoProductItem>[]>(() => [
        {
            name: "Producto",
            width: "30%",
            selector: row => row.product.name,
        },
        {
            name: "Cantidad",
            selector: row => row.quantity.toLocaleString(),
        },
        {
            name: "Costo unitario",
            selector: row => row.unitPrice.toLocaleString(),
        },
        {
            name: "Subtotal",
            selector: row => row.subtotal.toLocaleString(),
        }
    ], [])

    return (
        <div className="flex flex-col gap-6 justify-center items-center w-full p-6">
            {
                selectedExpense.products.length > 0 && <>
                    <h4 className="w-full -mb-4 pl-2 font-semibold">Productos</h4>
                    <div className="text-font-color w-full border !border-font-color/20 !rounded-[10px]">
                        <DataTable columns={columnsProducts} className=""
                            pagination
                            paginationPerPage={3000}
                            paginationComponent={({ currentPage, onChangePage, rowCount, rowsPerPage }) => (<>
                                <div className="flex gap-2 w-full justify-center py-4 border-t border-t-font-color/30">
                                    <div className="flex items-center justify-end w-full px-4">
                                        <span className='font-semibold'>Total:</span>&nbsp;
                                        <span>{selectedExpense.productsTotal.toLocaleString()} Bs.</span>
                                    </div>
                                </div>
                            </>)}
                            data={selectedExpense.products} noDataComponent={<div className="min-h-[150px] flex items-center justify-center">Sin registros</div>} />
                    </div>
                </>
            }
            {
                selectedExpense.items.length > 0 && <>
                    <h4 className="w-full -mb-4 pl-2 font-semibold">Items</h4>
                    <div className="text-font-color w-full border !border-font-color/20 !rounded-[10px]">
                        <DataTable columns={columnsItems} className=""
                            pagination
                            paginationPerPage={3000}
                            paginationComponent={({ currentPage, onChangePage, rowCount, rowsPerPage }) => (<>
                                <div className="flex gap-2 w-full justify-center py-4 border-t border-t-font-color/30">
                                    <div className="flex items-center justify-end w-full px-4">
                                        <span className='font-semibold'>Total:</span>&nbsp;
                                        <span>{selectedExpense.itemsTotal.toLocaleString()} Bs.</span>
                                    </div>
                                </div>
                            </>)}
                            data={selectedExpense.items} noDataComponent={<div className="min-h-[150px] flex items-center justify-center">Sin registros</div>} />
                    </div>
                </>
            }

            <div className="w-full text-end border-t pt-2"><span className="font-semibold">Total general:</span> {(selectedExpense.itemsTotal + selectedExpense.productsTotal).toLocaleString()} Bs.</div>
        </div>
    )
}

export default CuadroEgresoDetails