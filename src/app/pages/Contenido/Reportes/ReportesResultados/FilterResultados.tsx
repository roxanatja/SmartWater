import React, { useContext } from 'react'
import { ReportesResultadosContext } from './ReportesResultadosContext';
import { useGlobalContext } from '../../../../SmartwaterContext';
import { useForm } from 'react-hook-form';
import { exportData } from '../../../../../utils/export.utils';
import moment from 'moment';
import "moment/locale/es";
import { IReportDailyBody } from '../../../../../api/types/cash-registers';
import { CashRegisterApiConector } from '../../../../../api/classes';
import { ResultsReport } from '../../../../../type/Cash';

interface IResultsFilters {
    withMonth: boolean;
    withRange: boolean;
    fromDate: string | null;
    toDate: string | null;
    monthDate: string | null;
}

const initialState: IResultsFilters = {
    withMonth: false,
    withRange: true,
    fromDate: null,
    toDate: null,
    monthDate: null
}

const FilterResultados = () => {
    const { setResultados } = useContext(ReportesResultadosContext);
    const { setLoading } = useGlobalContext()

    const { register, handleSubmit, setValue, watch, formState: { isValid } } = useForm<IResultsFilters>({
        defaultValues: initialState,
    });

    const onSubmit = async (data: any) => {
        setLoading(true)

        const fileName = "ReporteResultados.xlsx";
        const dat = await getDataClients(filterClients(data));
        exportData(fileName, dat);

        setLoading(false)
        setResultados(false);
    };

    const filterClients = (filters: IResultsFilters): IReportDailyBody['data'] => {
        const result: IReportDailyBody['data'] = { startDate: "", endDate: "" }

        if (filters.withMonth && filters.monthDate) {
            const month = moment(filters.monthDate)
            result.startDate = month.startOf('month').format("YYYY-MM-DD")

            if (moment().month() === month.month()) {
                result.endDate = moment().format("YYYY-MM-DD")
            } else {
                result.endDate = month.endOf('month').format("YYYY-MM-DD")
            }
        } else if (filters.withRange && filters.fromDate && filters.toDate) {
            result.startDate = filters.fromDate.toString()
            result.endDate = filters.toDate.toString()
        }

        return result
    };

    const changeSelector = (from: "month" | "range") => {
        if (from === 'month') {
            const month = watch('withMonth')

            if (!month) {
                setValue('toDate', null, { shouldValidate: true })
                setValue('fromDate', null, { shouldValidate: true })
            }

            setValue('withMonth', !month, { shouldValidate: true })
            setValue('withRange', month, { shouldValidate: true })
        } else {
            const range = watch('withRange')

            if (!range) {
                setValue('monthDate', null, { shouldValidate: true })
            }

            setValue('withMonth', range, { shouldValidate: true })
            setValue('withRange', !range, { shouldValidate: true })
        }
    }

    const getDataClients = async (filters: IReportDailyBody['data']) => {
        // Cargar datos
        let datClients = await CashRegisterApiConector.reportDaily({ data: filters });
        const data = datClients?.dailyReports || [];
        let toPrintData: ResultsReport['dailyReports'] = []

        // Mapeo de datos
        const dataClientToExport: any[] = [];
        const isSameMonth = moment.utc(data[0].date).format("YYYY-MM") === moment.utc(data[data.length - 1].date).format("YYYY-MM")

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

        for (let idx = 0; idx < toPrintData.length; idx++) {
            let typeDataToExport = {}

            const reg = toPrintData[idx]
            const dateSplit = moment.utc(reg.date)

            if (isSameMonth) {
                typeDataToExport = {
                    "DIA": dateSplit.format("D"),
                    "MES": dateSplit.format("MMMM"),
                    "AÑO": dateSplit.format("YYYY"),
                    "VENTAS EFECTIVO": reg.cashSales,
                    "COBRO DE VENTAS CREDITO": reg.creditBillsSales,
                    "VENTAS CTA. CTE.": reg.cashCurrentAccount,
                    "COBROS DE VENTAS CTA. CTE.": reg.creditBillsSalesCurrentAccount,
                    "TOTAL INGRESOS": reg.incomeCashTotal + reg.incomeCurrentAccountTotal,
                    "EGRESOS EFECTIVO": reg.cashExpenses,
                    "PAGO DE OBLIGACIONES EFECTIVO": reg.paymentObligations,
                    "EGRESOS CTA. CTE": reg.expensePayCurrentAccount,
                    "PAGO DE OBLIGACIONES CTA. CTE": reg.expenseCurrentPayObligations,
                    "TOTAL EGRESOS": reg.expenseCashTotal + reg.expenseCurrentAccountTotal,
                    "UTILIDAD O PERDIDA EN BASE EFECTIVO": reg.profitOrLoss,
                }
            } else {
                typeDataToExport = {
                    "MES": dateSplit.format("MMMM"),
                    "AÑO": dateSplit.format("YYYY"),
                    "VENTAS EFECTIVO": reg.cashSales,
                    "COBRO DE VENTAS CREDITO": reg.creditBillsSales,
                    "VENTAS CTA. CTE.": reg.cashCurrentAccount,
                    "COBROS DE VENTAS CTA. CTE.": reg.creditBillsSalesCurrentAccount,
                    "TOTAL INGRESOS": reg.incomeCashTotal + reg.incomeCurrentAccountTotal,
                    "EGRESOS EFECTIVO": reg.cashExpenses,
                    "PAGO DE OBLIGACIONES EFECTIVO": reg.paymentObligations,
                    "EGRESOS CTA. CTE": reg.expensePayCurrentAccount,
                    "PAGO DE OBLIGACIONES CTA. CTE": reg.expenseCurrentPayObligations,
                    "TOTAL EGRESOS": reg.expenseCashTotal + reg.expenseCurrentAccountTotal,
                    "UTILIDAD O PERDIDA EN BASE EFECTIVO": reg.profitOrLoss,
                }

            }

            dataClientToExport.push(typeDataToExport)
        }

        return dataClientToExport;
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="p-8 flex flex-col gap-8">
            <div className="flex-1">
                <div className="FiltroClientes-Fechastitulo mb-2 flex items-center gap-2">
                    <input
                        className="input-check accent-blue_custom"
                        type="checkbox"
                        id="check1"
                        checked={watch('withRange')}
                        onChange={() => changeSelector('range')}
                    />
                    <label htmlFor='check1' className="text-blue_custom font-semibold">Por Fechas</label>
                </div>
                <div className="flex gap-3 w-full">
                    <div className="shadow-xl rounded-3xl px-4 py-2 border-gray-100 border flex-1 relative">
                        <span className="text-left text-sm">De {watch('withRange') && <span className='text-red-500'>*</span>}</span>
                        <img src="/desde.svg" alt="" className="w-[20px] h-[20px] absolute bottom-3 left-4 invert-0 dark:invert" />
                        <input
                            disabled={watch('withMonth')}
                            max={watch('toDate')?.toString() || moment().format("YYYY-MM-DD")}
                            type="date"
                            {...register("fromDate", {
                                required: watch('withRange')
                            })}
                            className="border-0 rounded outline-none font-semibold w-full bg-transparent text-sm full-selector pl-10 disabled:opacity-50"
                        />
                    </div>
                    <div className="shadow-xl rounded-3xl px-4 py-2 border-gray-100 border flex-1 relative">
                        <span className="text-left text-sm">A {watch('withRange') && <span className='text-red-500'>*</span>}</span>
                        <img src="/hasta.svg" alt="" className="w-[20px] h-[20px] absolute bottom-3 left-4 invert-0 dark:invert" />
                        <input
                            disabled={watch('withMonth')}
                            min={watch('fromDate')?.toString()}
                            max={moment().format("YYYY-MM-DD")}
                            type="date"
                            {...register("toDate", {
                                required: watch('withRange')
                            })}
                            className="border-0  rounded outline-none font-semibold w-full bg-transparent text-sm full-selector pl-10 disabled:opacity-50"
                        />
                    </div>
                </div>
            </div>
            <div className="flex-1">
                <div className="FiltroClientes-Fechastitulo mb-2 flex items-center gap-2">
                    <input
                        className="input-check accent-blue_custom"
                        type="checkbox"
                        id="check2"
                        checked={watch('withMonth')}
                        onChange={() => changeSelector('month')}
                    />
                    <label htmlFor='check2' className="text-blue_custom font-semibold">Por Mes</label>
                </div>
                <div className="flex gap-3 w-full">
                    <div className="shadow-xl rounded-3xl px-4 py-2 border-gray-100 border flex-1 relative">
                        <span className="text-left text-sm">Mes {watch('withMonth') && <span className='text-red-500'>*</span>}</span>
                        <img src="/desde.svg" alt="" className="w-[20px] h-[20px] absolute bottom-3 left-4 invert-0 dark:invert" />
                        <input
                            disabled={watch('withRange')}
                            max={moment().format("YYYY-MM")}
                            type="month"
                            {...register("monthDate", {
                                required: watch('withMonth')
                            })}
                            className="border-0  rounded outline-none font-semibold w-full bg-transparent text-sm full-selector pl-10 disabled:opacity-50"
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-between w-full items-center gap-3 px-4">
                <button
                    type="button"
                    onClick={() => {
                        setResultados(false)
                    }}
                    className="mt-4 border-blue-500 border-2 rounded-full px-4 py-2.5 shadow-xl text-blue-500 font-bold w-full"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={!isValid}
                    className="mt-4 bg-blue-500 border-2 border-blue-500 shadow-xl text-white rounded-full px-4 py-2.5 w-full font-bold disabled:bg-gray-400 disabled:border-gray-400"
                >
                    Generar reporte
                </button>
            </div>
        </form>
    )
}

export default FilterResultados