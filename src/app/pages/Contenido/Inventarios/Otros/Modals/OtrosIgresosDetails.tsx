import { useContext, useEffect, useMemo } from "react";
import { Item } from "../../../../../../type/Item";
import Product from "../../../../../../type/Products/Products";
import { InventariosOtrosContext } from "../InventariosOtrosProvider";
import { formatDateTime } from "../../../../../../utils/helpers";
import { UnitMeasure } from "../../../../../../type/Products/UnitMeasure";
import { MatchedElement } from "../../../../../../type/Kardex";


interface Props {
    onCancel?: () => void;
    elements: MatchedElement[]
}

const OtrosIgresosDetails = ({ elements, onCancel }: Props) => {
    const { selectedEntry } = useContext(InventariosOtrosContext)

    useEffect(() => {
        if (selectedEntry._id === "" && onCancel) { onCancel() }
    }, [selectedEntry, onCancel])

    const product = useMemo<Product | Item | null>(() => {
        const product = elements.find(p => p.name === selectedEntry.elementName)
        return product || null
    }, [elements, selectedEntry])

    return (
        <div className="flex flex-col gap-6 w-full p-6 relative text-sm">
            <div className="flex gap-4 items-center justify-end absolute top-4 right-4 print:hidden">
                <button type="button" className="border border-blue_bright w-20 h-12 flex items-center justify-center rounded-[30px]" onClick={() => alert("print")}>
                    <img src="/print.svg" alt="" />
                </button>
            </div>

            <div className="mt-14 flex flex-col gap-6">
                <p>{formatDateTime(selectedEntry.registerDate, 'numeric', '2-digit', '2-digit')}</p>
                <p><strong>Tipo:</strong> {selectedEntry.type === 'production_received' ? `Ingreso de producción` : `Ingreso por ajuste`}</p>
                <p><strong>Producto:</strong> {product?.name || "Producto desconocido"}</p>
                <p><strong>Cantidad:</strong> {selectedEntry.quantity.toLocaleString()} {(product?.unitMeasure as UnitMeasure)?.name || ""}</p>

                <div className="flex flex-col gap-1">
                    <strong>Comentario</strong>
                    <p className="h-[100px] p-4 rounded-[10px] border border-font-color">{selectedEntry.detail || "Sin comentario"}</p>
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