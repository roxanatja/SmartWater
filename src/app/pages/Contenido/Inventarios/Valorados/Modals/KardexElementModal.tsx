import { useEffect, useState } from "react";
import { useGlobalContext } from "../../../../../SmartwaterContext";
import { KardexApiConector } from "../../../../../../api/classes/kardex";
import { KardexDetail, KardexElement } from "../../../../../../type/Kardex";
import TableKardexDetails from "../Tables/TableKardexDetails";
import { formatDateTime } from "../../../../../../utils/helpers";
import { showGeneratePDF } from "../../../../../../utils/pdfHelper";
import { kardexTemplate } from "./pdfTemplates";

interface Props {
    kardexElement: KardexElement;
    date: string;
}

const KardexElementModal = ({ kardexElement, date }: Props) => {
    const { setLoading } = useGlobalContext()

    const [loadingLocal, setLoadingLocal] = useState<boolean>(true)
    const [balanceReport, setBalanceReport] = useState<KardexDetail | undefined>()

    useEffect(() => {
        setLoadingLocal(true)
        if (kardexElement) {
            KardexApiConector.reportDetails({ filters: { elementId: kardexElement.elementId, toDate: date } }).then(res => {
                if (res && res.balances.length > 0) {
                    setBalanceReport(res.balances[0])
                } else {
                    setBalanceReport(undefined)
                }

                setLoadingLocal(false)
            })
        }

    }, [kardexElement, date])


    const report = async () => {
        if (balanceReport) {
            const inputs = [
                {
                    title: JSON.stringify({ element: `${kardexElement.name} (hasta el ${formatDateTime(date, 'numeric', '2-digit', '2-digit', false, true)})` }),
                    table: balanceReport.movements.map(row => {
                        return [
                            `${row.detail}`,
                            `${formatDateTime(row.registerDate, 'numeric', '2-digit', '2-digit', false, true)}`,
                            `${row.documentNumber || ""}`,
                            `${row.code || ""}`,
                            `${row.comment || ""}`,
                            `${row.inputQuantity}`,
                            `${row.unitPriceInput}`,
                            `${row.inputImport}`,
                            `${row.outputQuantity}`,
                            `${row.unitPriceOutput}`,
                            `${row.outputImport}`,
                            `${row.balanceAmount}`,
                            `${row.weightedAverageCost}`,
                            `${row.balanceImport}`,
                        ]
                    })
                }
            ]

            showGeneratePDF(setLoading, kardexTemplate, inputs)
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
                    </div>

                    <TableKardexDetails data={balanceReport.movements} className='w-full with-vertical-border' />
                </div>
            }
        </div>
    )
}

export default KardexElementModal