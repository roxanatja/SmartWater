import React, { useContext, useEffect } from 'react'
import { MatchedElementRoot } from '../../../../../../type/Kardex'
import { InventariosFisicosContext } from '../InventariosFisicosProvider';
import { useGlobalContext } from '../../../../../SmartwaterContext';
import { formatDateTime } from '../../../../../../utils/helpers';
import { showGeneratePDF } from '../../../../../../utils/pdfHelper';
import { initialBalancesTemplate } from './pdfTemplates';

interface Props {
    elements: MatchedElementRoot[];
    onCancel: VoidFunction
}

const ShowInitialBalancesModal = ({ elements, onCancel }: Props) => {
    const { selectedBalance } = useContext(InventariosFisicosContext)
    const { setLoading } = useGlobalContext()

    useEffect(() => {
        if (selectedBalance.code === "" && onCancel) { onCancel() }
    }, [selectedBalance, onCancel])

    const report = async () => {
        if (selectedBalance.code !== "") {
            const inputs = [
                {
                    title: "Saldos iniciales",
                    field5: "Productos",
                    date: formatDateTime(selectedBalance.showDate.format("YYYY-MM-DD"), 'numeric', '2-digit', '2-digit'),
                    code: JSON.stringify({ code: selectedBalance.code }),
                    distribuidor: JSON.stringify({ distribuidor: `${selectedBalance.user.name || "Distribuidor desconocido"} ${selectedBalance.user.isAdmin ? "(Adiministrador)" : ""}` }),
                    table: selectedBalance.saldo.map(s => ([`${s.product ? s.product.name : s.item ? s.item.name : "Producto desconocido"}`, `${s.initialBalance || 0}`]))
                }
            ]

            showGeneratePDF(setLoading, initialBalancesTemplate, inputs)
        }
    }

    return (
        <div className="flex flex-col gap-6 w-full p-6 relative text-sm">
            <div className="flex gap-4 items-center justify-end absolute top-4 right-4 print:hidden">
                <button type="button" className="bg-blue_bright w-20 h-12 flex items-center justify-center rounded-[30px]" onClick={() => report()}>
                    <img src="/document.svg" alt="" />
                </button>
            </div>

            <div className="mt-14 flex flex-col gap-6">
                <p>Fecha final: <br />{formatDateTime(selectedBalance.showDate.format("YYYY-MM-DD"), 'numeric', '2-digit', '2-digit')}</p>
                <p className='-mb-4'>Código: {selectedBalance.code || "Sin código"}</p>
                <p>Distribuidor: {selectedBalance.user.name || "Distribuidor desconocido"} {selectedBalance.user.isAdmin ? "(Adiministrador)" : ""}</p>

                <div className="flex flex-col gap-5 px-3">
                    <p className='font-semibold -mb-2'>Pruductos</p>
                    {
                        selectedBalance.saldo.map(s =>
                            <div className="flex justify-between w-full" key={s.elementId}>
                                <p className='flex-[2]'>{s.product ? s.product.name : s.item ? s.item.name : "Producto desconocido"}</p>
                                <p className='flex-[1]'>{s.initialBalance || 0}</p>
                            </div>
                        )
                    }
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

export default ShowInitialBalancesModal