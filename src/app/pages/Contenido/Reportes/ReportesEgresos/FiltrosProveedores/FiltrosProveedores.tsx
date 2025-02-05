import React, { useContext, useMemo } from 'react'
import { Providers } from '../../../../../../type/providers';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { IProvidersGetParams } from '../../../../../../api/types/providers';
import { useGlobalContext } from '../../../../../SmartwaterContext';
import { ReportesEgresosContext } from '../ReportesEgresosContext';
import { exportData, searchUser } from '../../../../../../utils/export.utils';
import moment from 'moment';
import { ProvidersApiConector } from '../../../../../../api/classes';
import { formatDateTime } from '../../../../../../utils/helpers';
import { User } from '../../../../../../type/User';

interface IProviderFilter {
    fromDate: string | null;
    toDate: string | null;
    provider: string | null;
    nit: string | null;
}

const initialState: IProviderFilter = {
    fromDate: null,
    toDate: null,
    provider: null,
    nit: null
}

const FiltrosProveedores = ({ providers, distribuidores }: {
    providers: Providers[]
    distribuidores: User[]
}) => {
    const { setProveedores } = useContext(ReportesEgresosContext)
    const { setLoading } = useGlobalContext()

    const { register, handleSubmit, watch } = useForm<IProviderFilter>({
        defaultValues: initialState || {},
    });

    const filterClients = (filters: IProviderFilter): IProvidersGetParams['filters'] => {
        const result: IProvidersGetParams['filters'] = {}

        if (filters.fromDate) { result.initialDate = filters.fromDate.toString() }
        if (filters.toDate) { result.finalDate = filters.toDate.toString() }
        if (filters.provider) { result.provider = filters.provider }
        if (filters.nit) { result.NIT = filters.nit }

        return result
    };

    const NITS = useMemo(() => {
        const nits = providers.map(p => p.NIT)
        return nits.filter((item, index) => nits.indexOf(item) === index)
    }, [providers])

    const onSubmit = async (data: IProviderFilter) => {
        setLoading(true)

        const fileName = "ReporteProveedores.xlsx";
        const dat = await getDataWithClientNames(filterClients(data));
        exportData(fileName, dat);

        setLoading(false)
        setProveedores(false);
    };

    const getDataWithClientNames = async (filtersParam: IProvidersGetParams['filters']) => {
        const filters = filtersParam || {}

        const data = (await ProvidersApiConector.get({ pagination: { page: 1, pageSize: 30000 }, filters }))?.data || []

        const dataWithClientNames: any[] = []

        for (let idx = 0; idx < data.length; idx++) {
            const provider = data[idx];

            const typeDataToExport = {
                NRO: `${idx + 1}`,
                USUARIO: provider.user ? searchUser(provider.user, distribuidores) : "Usuario desconocido",
                "NOMBRE PROVEEDOR": provider?.fullName || "Proveedor desconocido",
                "TELEFONO": provider?.phoneNumber || "N/A",
                "CORREO ELECTRONICO": provider?.email || "N/A",
                "DIRECCION": provider?.address || "N/A",
                "NIT": provider?.NIT || "N/A",
                "FECHA DE REGISTRO": formatDateTime(provider.created, "numeric", "2-digit", "2-digit", false, true)
            };

            dataWithClientNames.push(typeDataToExport)
        }

        return dataWithClientNames;
    };


    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="p-8 flex flex-col gap-2">
                <div className="flex flex-col sm:flex-row mb-4">
                    <div className="flex-1">
                        <div className="FiltroClientes-Fechastitulo mb-2">
                            <span className="text-blue_custom font-semibold">Fechas</span>
                        </div>
                        <div className="flex gap-3 flex-wrap">
                            <div className="shadow-xl rounded-3xl px-4 py-2 border-gray-100 border flex-1 relative">
                                <span className="text-left text-sm">De</span>
                                <img src="/desde.svg" alt="" className="w-[20px] h-[20px] absolute bottom-3 left-4 invert-0 dark:invert" />
                                <input
                                    max={watch('toDate')?.toString() || moment().format("YYYY-MM-DD")}
                                    type="date"
                                    {...register("fromDate")}
                                    className="border-0 rounded outline-none font-semibold w-full bg-transparent text-sm full-selector pl-10"
                                />
                            </div>
                            <div className="shadow-xl rounded-3xl px-4 py-2 border-gray-100 border flex-1 relative">
                                <span className="text-left text-sm">A</span>
                                <img src="/hasta.svg" alt="" className="w-[20px] h-[20px] absolute bottom-3 left-4 invert-0 dark:invert" />
                                <input
                                    min={watch('fromDate')?.toString()}
                                    max={moment().format("YYYY-MM-DD")}
                                    type="date"
                                    {...register("toDate")}
                                    className="border-0  rounded outline-none font-semibold w-full bg-transparent text-sm full-selector pl-10"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: 0.3 }}
                    className="w-full sm:w-1/2 flex flex-col gap-2"
                >
                    <label>Proveedor o beneficiario</label>
                    <select {...register("provider")} className="p-2 py-2.5 rounded-md font-pricedown focus:outline-4 bg-main-background outline outline-2 outline-black">
                        <option value="">Seleccione un proveedor</option>
                        {
                            providers.map((row, index) => (
                                <option value={row._id} key={index}>
                                    {row.fullName || "Sin nombre"}
                                </option>
                            ))
                        }
                    </select>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: 0.3 }}
                    className="w-full sm:w-1/2 flex flex-col gap-2"
                >
                    <label>NIT</label>
                    <select {...register("nit")} className="p-2 py-2.5 rounded-md font-pricedown focus:outline-4 bg-main-background outline outline-2 outline-black">
                        <option value="">Seleccione un NIT</option>
                        {
                            NITS.map((row, index) => (
                                <option value={row} key={index}>
                                    {row}
                                </option>
                            ))
                        }
                    </select>
                </motion.div>

                <div className="flex justify-between w-full items-center gap-3 px-4">
                    <button
                        type="button"
                        onClick={() => {
                            setProveedores(false)
                        }}
                        className="mt-4 border-blue-500 border-2 rounded-full px-4 py-2.5 shadow-xl text-blue-500 font-bold w-full"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="mt-4 bg-blue-500 border-2 border-blue-500 shadow-xl text-white rounded-full px-4 py-2.5 w-full font-bold"
                    >
                        Generar reporte
                    </button>
                </div>
            </form>
        </>
    )
}

export default FiltrosProveedores