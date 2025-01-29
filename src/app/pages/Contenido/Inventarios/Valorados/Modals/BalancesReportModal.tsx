import { useEffect, useState } from "react";
import { useGlobalContext } from "../../../../../SmartwaterContext";
import { KardexApiConector } from "../../../../../../api/classes/kardex";
import { BalanceReport } from "../../../../../../type/Kardex";
import TableBalancesReport from "../Tables/TableBalancesReport";
import { formatDateTime } from "../../../../../../utils/helpers";
import { showGeneratePDF } from "../../../../../../utils/pdfHelper";
import { reportTemplate } from "./pdfTemplates";

interface Props {
    toDate: string;
}

const BalancesReportModal = ({ toDate }: Props) => {
    const { setLoading } = useGlobalContext()
    const [loadingLocal, setLoadingLocal] = useState<boolean>(true)
    const [balanceReport, setBalanceReport] = useState<BalanceReport | undefined>()

    useEffect(() => {
        setLoadingLocal(true)

        KardexApiConector.reportBalance().then(res => {
            if (res) {
                setBalanceReport(res.balances)
            } else {
                setBalanceReport(undefined)
            }

            setLoadingLocal(false)
        })

    }, [])

    const report = async () => {
        if (balanceReport) {
            const inputs = [
                {
                    subtitle: JSON.stringify({ date: formatDateTime(toDate, 'numeric', '2-digit', '2-digit', false, true) }),
                    table: balanceReport.elements.map(row => {
                        return [`${row.nro}`, `${row.name}`, `${row.unit}`, `${row.quantity}`, `${row.weightedAverageCost}`, `${row.totalAmount}`]
                    })
                }
            ]

            showGeneratePDF(setLoading, reportTemplate, inputs)
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

                    <TableBalancesReport data={balanceReport.elements} className='w-full no-inner-border' total={balanceReport.totalGeneral} />
                </div>
            }
        </div>
    )
}

export default BalancesReportModal