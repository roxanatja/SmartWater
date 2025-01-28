import { useContext, useEffect, useMemo } from "react";
import { Item } from "../../../../../../type/Item";
import Product from "../../../../../../type/Products/Products";
import { InventariosOtrosContext } from "../InventariosOtrosProvider";
import { formatDateTime } from "../../../../../../utils/helpers";
import { UnitMeasure } from "../../../../../../type/Products/UnitMeasure";


interface Props {
    type: 'in' | 'out';
    onCancel?: () => void;
    products: Product[];
    items: Item[];
}

const OtrosIgresosDetails = ({ items, products, onCancel, type }: Props) => {
    const { selectedInventario } = useContext(InventariosOtrosContext)

    useEffect(() => {
        if (selectedInventario._id === "" && onCancel) { onCancel() }
    }, [selectedInventario, onCancel])

    const product = useMemo<Product | Item | null>(() => {
        const product = products.find(p => p._id === selectedInventario.item)
        const item = items.find(p => p._id === selectedInventario.item)

        return product ? product : item ? item : null
    }, [products, items, selectedInventario])

    return (
        <div className="flex flex-col gap-6 w-full p-6 relative text-sm">
            <div className="flex gap-4 items-center justify-end absolute top-4 right-4 print:hidden">
                <button type="button" className="border border-blue_bright w-20 h-12 flex items-center justify-center rounded-[30px]" onClick={() => alert("print")}>
                    <img src="/print.svg" alt="" />
                </button>
            </div>

            <div className="mt-14 flex flex-col gap-6">
                <p>{formatDateTime(selectedInventario.initialDate, 'numeric', '2-digit', '2-digit')}</p>
                <p><strong>Tipo:</strong> {selectedInventario.type === 'production' ? `${type === 'in' ? "Ingreso de" : "Salida a"} producción` : `${type === 'in' ? "Ingreso" : "Salida"} por ajuste`}</p>
                <p><strong>Producto:</strong> {product?.name || "Producto desconocido"}</p>
                <p><strong>Cantidad:</strong> {selectedInventario.quantity.toLocaleString()} {(product?.unitMeasure as UnitMeasure)?.name || "Otro"}</p>

                <div className="flex flex-col gap-1">
                    <strong>Comentario</strong>
                    <p className="h-[100px] p-4 rounded-[10px] border border-font-color">{selectedInventario.comment || "Sin comentario"}</p>
                </div>
            </div>

            <div className="w-full  sticky bottom-0 bg-main-background h-full z-50 text-base">
                <div className="py-4 flex flex-row gap-4 items-center justify-center px-6">
                    <button
                        onClick={onCancel}
                        className="w-full bg-blue_bright py-2 rounded-full text-white font-bold shadow-xl"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    )
}

export default OtrosIgresosDetails