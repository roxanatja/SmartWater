import { useEffect, useState } from "react";
import { useGlobalContext } from "../../../../../SmartwaterContext";
import { OutputsReport } from "../../../../../../type/Kardex";
import { formatDateTime } from "../../../../../../utils/helpers";
import TableOutputsReport from "../Tables/TableOutputsReport";
import { showGeneratePDF } from "../../../../../../utils/pdfHelper";
import { outputsReport } from "./pdfTemplates";
import { ValuedPhysicalApiConector } from "../../../../../../api/classes/valued-physical";

interface Props {
    toDate: string;
}

const OutputsReportModal = ({ toDate }: Props) => {
    const { setLoading } = useGlobalContext()
    const [loadingLocal, setLoadingLocal] = useState<boolean>(true)
    const [balanceReport, setBalanceReport] = useState<OutputsReport | undefined>()

    useEffect(() => {
        setLoadingLocal(true)

        ValuedPhysicalApiConector.kardexReports({ type: "outputs", filters: { toDate } }).then(res => {
            if (res) {
                setBalanceReport(res.balances)
            } else {
                setBalanceReport(undefined)
            }

            setLoadingLocal(false)
        })

    }, [toDate])

    const report = async () => {
        if (balanceReport) {
            const table: string[][] = balanceReport.data.map(row => {
                return [
                    `${row.elementName}`,
                    `${row.unitMeasure}`,
                    `${row.outputProduction.quantity}`,
                    `${row.outputProduction.import.toFixed(2)}`,
                    `${row.outputSales.quantity}`,
                    `${row.outputSales.import.toFixed(2)}`,
                    `${row.outputLoans.quantity}`,
                    `${row.outputLoans.import.toFixed(2)}`,
                    `${row.outputAdjustment.quantity}`,
                    `${row.outputAdjustment.import.toFixed(2)}`,
                    `${row.totalQuantitys}`,
                    `${row.totalImports.toFixed(2)}`
                ]
            });

            table.push([
                "TOTALES", "",
                `${balanceReport.data.reduce((sum, r) => sum += r.outputProduction.quantity, 0)}`,
                `${balanceReport.data.reduce((sum, r) => sum += r.outputProduction.import, 0).toFixed(2)}`,
                `${balanceReport.data.reduce((sum, r) => sum += r.outputSales.quantity, 0)}`,
                `${balanceReport.data.reduce((sum, r) => sum += r.outputSales.import, 0).toFixed(2)}`,
                `${balanceReport.data.reduce((sum, r) => sum += r.outputLoans.quantity, 0)}`,
                `${balanceReport.data.reduce((sum, r) => sum += r.outputLoans.import, 0).toFixed(2)}`,
                `${balanceReport.data.reduce((sum, r) => sum += r.outputAdjustment.quantity, 0)}`,
                `${balanceReport.data.reduce((sum, r) => sum += r.outputAdjustment.import, 0).toFixed(2)}`,
                `${balanceReport.data.reduce((sum, r) => sum += r.totalQuantitys, 0)}`,
                `${balanceReport.data.reduce((sum, r) => sum += r.totalImports, 0).toFixed(2)}`,
            ])

            const inputs = [
                {
                    subtitle: JSON.stringify({ date: formatDateTime(toDate, 'numeric', '2-digit', '2-digit', false, true) }),
                    table

                }
            ]

            showGeneratePDF(setLoading, outputsReport, inputs)
        }
    }

    return (
        <div className="flex flex-col gap-6 justify-center items-center w-full p-6">
            {
                loadingLocal && <div className="flex flex-col gap-2 items-center justify-center min-h-[250px] w-full">
                    <i className="fa-solid fa-spinner animate-spin text-4xl"></i>
                    <span className="text-lg">
                        Cargando reporte...
                    </span>
                </div>
            }

            {
                (!loadingLocal && !balanceReport) && <div className="flex flex-col gap-2 items-center justify-center min-h-[250px] w-full">
                    <span className="text-lg">
                        Sin datos del reporte
                    </span>
                </div>
            }

            {
                (!loadingLocal && !!balanceReport) &&
                <div className="flex flex-col gap-10 w-full">
                    <div className="relative w-full text-center text-blue_custom font-semibold">
                        <div className="flex gap-4 items-center justify-end absolute -top-4 right-0 print:hidden">
                            <button type="button" className="bg-blue_bright w-20 h-12 flex items-center justify-center rounded-[30px]" onClick={() => report()}>
                                <img src="/document.svg" alt="" />
                            </button>
                        </div>

                        <span>Reporte de inventarios al {formatDateTime(toDate, 'numeric', '2-digit', '2-digit', false, true)}</span>
                    </div>

                    <TableOutputsReport data={balanceReport.data} className='w-full with-vertical-border' total={balanceReport.count.toLocaleString()} />
                </div>
            }
        </div>
    )
}

export default OutputsReportModal