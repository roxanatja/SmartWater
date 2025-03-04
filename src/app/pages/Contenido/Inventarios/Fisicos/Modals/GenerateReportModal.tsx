import { useContext, useState } from 'react'
import { InventariosFisicosContext } from '../InventariosFisicosProvider'
import { useForm } from 'react-hook-form'
import DataTable from 'react-data-table-component'
import Input from '../../../../EntryComponents/Inputs'
import { PhysicalInventoryApiConector } from '../../../../../../api/classes/physical-inventory'
import moment from 'moment'
import toast from 'react-hot-toast'

interface Props {
    onCancel: VoidFunction
}

const GenerateReportModal = ({ onCancel }: Props) => {
    const [active, setActive] = useState(false);
    const { selectedInventario } = useContext(InventariosFisicosContext)

    const { register, watch, handleSubmit, formState: { isValid } } = useForm<{
        [key: string]: number;
    }>({
        mode: 'all',
        defaultValues: selectedInventario.reduce<{ [key: string]: number }>((acc, c) => {
            const index = c.item || c.product
            if (index) acc[index] = 0
            return acc
        }, {})
    })

    const onSubmit = async (data: { [key: string]: number }) => {
        setActive(true)

        const res = await PhysicalInventoryApiConector.saveReport({
            data: {
                registerDate: moment.tz("America/La_Paz").format("YYYY-MM-DDTHH:mm:ssZ"),
                role: selectedInventario[0].role,
                user: selectedInventario[0].user,
                elements: selectedInventario.map(si => ({
                    deliveredDistributor: si.deliveredDistributor,
                    diff: si.ssg - (data[si.product || si.item || ''] || 0),
                    diffReportDistrib: si.diffReportDistrib,
                    initialBalance: si.initialBalance,
                    productionDelivered: si.productionDelivered,
                    providerPurchase: si.providerPurchase,
                    realBalance: si.realBalance,
                    returnClient: si.returnClient,
                    returnDistributor: si.returnDistributor,
                    role: si.role,
                    ssd: data[si.product || si.item || ''] || 0,
                    ssg: si.ssg || 0,
                    stockLoan: si.stockLoan,
                    stockSale: si.stockSale,
                    item: si.item,
                    product: si.product
                }))
            }
        })

        if (res) {
            const resp = res as unknown as any[]
            if (resp.length > 0 && resp.every(r => 'generated' in r && !!r.generated)) {
                toast.success("Reporte generado correctamente", { position: "bottom-center" });
                window.location.reload()
            } else {
                toast.error("Upps error al generar el reporte", { position: "bottom-center" });
                setActive(false)
            }
        } else {
            toast.error("Upps error al generar el reporte", { position: "bottom-center" });
            setActive(false)
        }
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6 justify-center items-center w-full p-6"
        >
            <div className="text-font-color w-full border !border-font-color/20 !rounded-[10px]">
                <DataTable columns={[
                    {
                        name: "Producto",
                        width: "25%",
                        selector: row => row.name || "Producto desconocido",
                    },
                    {
                        name: "Saldos iniciales",
                        width: "12.5%",
                        selector: row => row.initialBalance || 0,
                    },
                    {
                        name: "Stock vendidos",
                        selector: row => row.stockSale,
                    },
                    {
                        name: "Stock prestado",
                        selector: row => row.stockLoan,
                    },
                    {
                        name: "Devuelto",
                        selector: row => (row.returnClient || 0) + (row.returnDistributor || 0),
                    },
                    {
                        name: "Saldo sistema",
                        selector: row => row.ssg || 0,
                    },
                    {
                        name: "Saldo distribuidor",
                        cell: row => <Input
                            validateAmount={(val: number) => val >= 0 ? true : ""}
                            numericalOnly
                            name={row.product || row.item || ""}
                            register={register}
                            required
                            className='outline-dashed !outline-1'
                        />,
                    },
                    {
                        name: "Diferencia",
                        selector: row => (row.ssg || 0) - watch(row.product || row.item || ''),
                    },
                ]} data={selectedInventario} className='no-inner-border'
                    noDataComponent={<div className="min-h-[150px] flex items-center justify-center">Sin registros</div>} />
            </div>

            <div className="w-full  sticky bottom-0 bg-main-background h-full z-50">
                <div className="py-4 flex flex-row gap-4 items-center justify-center px-6">
                    <button
                        onClick={onCancel}
                        className="w-full outline outline-2 outline-blue-500 py-2 rounded-full text-blue-600 font-black shadow-xl"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={!isValid || active}
                        className="disabled:bg-gray-400 w-full bg-blue-500 py-2 rounded-full text-white font-black shadow-xl truncate"
                    >
                        {active ? (
                            <i className="fa-solid fa-spinner animate-spin"></i>
                        ) : (
                            <span>Guardar</span>
                        )}
                    </button>
                </div>
            </div>
        </form>
    )
}

export default GenerateReportModal