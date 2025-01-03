import React from 'react'
import { FiltroPaginado } from '../../../../components/FiltroPaginado/FiltroPaginado'
import { useNavigate } from 'react-router-dom'

const RegistroEyG = () => {
    const navigate = useNavigate()

    return (
        <>
            <FiltroPaginado
                filtro
                resultados
                add
            >
                <div className="w-full pb-10 sticky top-0 bg-main-background z-[20]">
                    <div className="w-full sm:w-1/2">
                        <div className="switch-contenido">
                            <div
                                className={`switch-option`}
                                onClick={() => navigate("/Finanzas/EgresosGastos/Cuentas")}
                            >
                                Cuentas contables
                            </div>
                            <div
                                className={`switch-option selected`}
                                onClick={() => navigate("/Finanzas/EgresosGastos/Registro")}
                            >
                                Registros Egresos y Gastos
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-4 p-6">
                    <div className="RegistrosEyG-Cuadro1 bg-blocks dark:border-blocks">
                        {/* {data?.expeGroup &&
                            data.expeGroup.map((row, index) => (
                                <div className="RegistrosEyG-Cuadro1-text" key={index}>
                                    <span>
                                        {data.accounts?.find((x) => x._id === row.accountEntry)
                                            ?.name || "Cuenta no Reconociada"}
                                    </span>
                                    <span>{row.amount.toLocaleString()} Bs.</span>
                                </div>
                            ))} */}
                    </div>

                    {/* <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-4 pl-4">
                        {data?.expense &&
                            data?.expense.map((row, index) => (
                  ))}
                    </div> */}
                </div>
            </FiltroPaginado>
        </>
    )
}

export default RegistroEyG