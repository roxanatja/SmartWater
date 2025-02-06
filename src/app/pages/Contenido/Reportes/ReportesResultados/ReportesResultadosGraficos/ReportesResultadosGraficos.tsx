import { FC, useCallback, useEffect, useMemo, useState } from "react";
import "./ReportesResultadosGraficos.css";
import { useNavigate } from "react-router-dom";
import { PageTitle } from "../../../../components/PageTitle/PageTitle";
import { TablaReporteResultados } from "./TablaReporteResultados/TablaReporteResultados";
import { IReportDailyBody } from "../../../../../../api/types/cash-registers";
import { ResultsReport } from "../../../../../../type/Cash";
import FiltersResultadosGrafico from "./FiltersResultadosGrafico";
import { CashRegisterApiConector } from "../../../../../../api/classes";
import moment from "moment";
import { useGlobalContext } from "../../../../../SmartwaterContext";
import ResultsChart from "./ResultsChart";
import InOutChart from "./InOutChart";

export type IFormattedResults = {
    title: string;
    values: {
        date: string;
        value: number;
    }[]
}

const ReportesResultadosGraficos: FC = () => {
    const navigate = useNavigate();
    const { setLoading } = useGlobalContext()

    const [reports, setReports] = useState<ResultsReport['dailyReports']>([])
    const [mode, setMode] = useState<'month' | 'range'>('month')
    const [filters, setFilters] = useState<IReportDailyBody['data']>({ endDate: "", startDate: "" })

    const loadData = useCallback(async () => {
        if (filters.endDate !== "" && filters.startDate !== "") {
            setLoading(true)
            let datClients = await CashRegisterApiConector.reportDaily({ data: filters });
            const data = datClients?.dailyReports || [];
            let toPrintData: ResultsReport['dailyReports'] = []

            const isSameMonth = moment.utc(data[0].date).format("YYYY-MM") === moment.utc(data[data.length - 1].date).format("YYYY-MM")
            setMode(isSameMonth ? "range" : 'month')

            if (isSameMonth) {
                toPrintData = data
            } else {
                data.forEach(r => {
                    const date = moment.utc(r.date).startOf('month')
                    const dateIdx = toPrintData.findIndex(s => s.date === date.format("YYYY-MM-DD"))

                    if (dateIdx !== -1) {
                        const cpy = { ...toPrintData[dateIdx] }
                        toPrintData[dateIdx] = {
                            ...cpy,
                            cashSales: cpy.cashSales + r.cashSales,
                            creditBillsSales: cpy.creditBillsSales + r.creditBillsSales,
                            incomeCashTotal: cpy.incomeCashTotal + r.incomeCashTotal,
                            cashCurrentAccount: cpy.cashCurrentAccount + r.cashCurrentAccount,
                            creditBillsSalesCurrentAccount: cpy.creditBillsSalesCurrentAccount + r.creditBillsSalesCurrentAccount,
                            incomeCurrentAccountTotal: cpy.incomeCurrentAccountTotal + r.incomeCurrentAccountTotal,
                            cashExpenses: cpy.cashExpenses + r.cashExpenses,
                            paymentObligations: cpy.paymentObligations + r.paymentObligations,
                            expenseCashTotal: cpy.expenseCashTotal + r.expenseCashTotal,
                            expensePayCurrentAccount: cpy.expensePayCurrentAccount + r.expensePayCurrentAccount,
                            expenseCurrentPayObligations: cpy.expenseCurrentPayObligations + r.expenseCurrentPayObligations,
                            expenseCurrentAccountTotal: cpy.expenseCurrentAccountTotal + r.expenseCurrentAccountTotal,
                            profitOrLoss: cpy.profitOrLoss + r.profitOrLoss,
                        }
                    } else {
                        toPrintData.push({
                            date: date.format("YYYY-MM-DD"),
                            endDate: filters.endDate,
                            startDate: filters.startDate,
                            cashSales: r.cashSales,
                            creditBillsSales: r.creditBillsSales,
                            incomeCashTotal: r.incomeCashTotal,
                            cashCurrentAccount: r.cashCurrentAccount,
                            creditBillsSalesCurrentAccount: r.creditBillsSalesCurrentAccount,
                            incomeCurrentAccountTotal: r.incomeCurrentAccountTotal,
                            cashExpenses: r.cashExpenses,
                            paymentObligations: r.paymentObligations,
                            expenseCashTotal: r.expenseCashTotal,
                            expensePayCurrentAccount: r.expensePayCurrentAccount,
                            expenseCurrentPayObligations: r.expenseCurrentPayObligations,
                            expenseCurrentAccountTotal: r.expenseCurrentAccountTotal,
                            profitOrLoss: r.profitOrLoss,
                        })
                    }
                })
            }

            setReports(toPrintData)
            setLoading(false)
        } else {
            setReports([])
        }
    }, [filters, setLoading])

    const formattedReports = useMemo<IFormattedResults[]>(() => {
        return [
            {
                title: "Ingresos", values: reports.map(r => ({ date: moment.utc(r.date).format(mode === 'month' ? "MMM YYYY" : "DD/MM/YYYY"), value: Number((r.incomeCashTotal + r.incomeCurrentAccountTotal).toFixed(2)) }))
            },
            {
                title: "Egresos", values: reports.map(r => ({ date: moment.utc(r.date).format(mode === 'month' ? "MMM YYYY" : "DD/MM/YYYY"), value: Number((r.expenseCashTotal + r.expenseCurrentAccountTotal).toFixed(2)) }))
            },
            {
                title: "Resultados", values: reports.map(r => ({ date: moment.utc(r.date).format(mode === 'month' ? "MMM YYYY" : "DD/MM/YYYY"), value: Number((r.profitOrLoss).toFixed(2)) }))
            },
        ]
    }, [reports, mode])

    const headers = useMemo<string[]>(() => {
        return ["", ...reports.map(r => moment.utc(r.date).format(mode === 'month' ? "MMM YYYY" : "DD/MM/YYYY"))]
    }, [reports, mode])

    const headersCharts = useMemo<string[]>(() => {
        return reports.map(r => moment.utc(r.date).format("YYYY-MM-DD"))
    }, [reports])

    useEffect(() => { loadData() }, [loadData])

    return (
        <>
            <div className="px-10 h-full overflow-y-auto">
                <PageTitle titulo="Efectivo, egresos y gastos" icon="/Reportes-icon.svg" hasBack onBack={() => { navigate('/Reportes/Resultados'); }} />

                <FiltersResultadosGrafico onConfirm={setFilters} />
                {
                    reports.length > 0 &&
                    <div className="pb-16 pt-8 px-8 flex flex-col gap-12 Result-Report">
                        <div>
                            <TablaReporteResultados mode={mode || 'month'} className="no-border results-table" data={formattedReports} headers={headers} />
                        </div>

                        <h4 className="font-[600] text-lg -mb-6">Resultados</h4>
                        <ResultsChart headers={headersCharts} mode={mode} reports={formattedReports.length === 3 ? formattedReports[2] : { title: "Resultados", values: [] }} />

                        <h4 className="font-[600] text-lg -mb-6">Ingresos y egresos</h4>
                        <InOutChart headers={headersCharts} mode={mode} reports={formattedReports.length === 3 ? [formattedReports[0], formattedReports[1]] : []} />
                    </div>
                }
            </div>
        </>
    )
}

export { ReportesResultadosGraficos }