import React from 'react'
import { useForm } from 'react-hook-form';
import { IReportDailyBody } from '../../../../../../api/types/cash-registers';
import moment from 'moment';

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

const FiltersResultadosGrafico = ({ onConfirm }: {
    onConfirm: React.Dispatch<React.SetStateAction<IReportDailyBody['data']>>
}) => {
    const { register, handleSubmit, setValue, watch, formState: { isValid } } = useForm<IResultsFilters>({
        defaultValues: initialState,
    });

    const onSubmit = async (data: IResultsFilters) => {
        onConfirm(filterClients(data))
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

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="py-4 flex gap-8 flex-wrap flex-col md:flex-row">
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
                <div className="flex gap-3 w-full flex-wrap">
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

            <div className="flex justify-between items-center gap-3 px-4">
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

export default FiltersResultadosGrafico