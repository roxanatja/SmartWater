import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { IInitialBalanceBody } from "../../../../../../api/types/kardex";
import { MatchedElement } from "../../../../../../type/Kardex";
import moment from "moment";
import Input from "../../../../EntryComponents/Inputs";
import React from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { AuthService } from "../../../../../../api/services/AuthService";
import { KardexApiConector } from "../../../../../../api/classes/kardex";
import toast from "react-hot-toast";

interface Props {
    onCancel?: () => void;
    elemnts: MatchedElement[];
}

const AddEditInitialBalances = ({ elemnts, onCancel }: Props) => {
    const [active, setActive] = useState(false);

    const { register, formState: { errors, isValid }, handleSubmit } = useForm<IInitialBalanceBody['data']>({
        defaultValues: {
            elements: elemnts.map(e => ({
                product: e.isProduct ? e._id : undefined,
                item: e.isItem ? ((e.matchingItems && e.matchingItems?.length > 0) ? e.matchingItems[0]._id : e._id) : undefined,
                quantity: 0,
                inputImport: 0
            })),
            user: AuthService.getUser()?._id || ""
        },
        mode: 'all'
    })

    const onSubmit = async (data: IInitialBalanceBody['data']) => {
        let res = null
        setActive(true)
        const userData = AuthService.getUser()
        console.log(userData)

        res = await KardexApiConector.initialBalance({
            data: {
                ...data,
                elements: data.elements.map(e => {
                    const cpy: IInitialBalanceBody['data']['elements'][0] = {
                        quantity: parseFloat(String(e.quantity)),
                        inputImport: parseFloat(String(e.inputImport))
                    }
                    if (e.product) { cpy.product = e.product }
                    if (e.item) { cpy.item = e.item }

                    return cpy
                }),
                user: userData?._id || ""
            }
        })

        // if (selectedItem._id !== "") {
        //     res = await ItemsApiConector.update({ productId: selectedItem._id, data })
        // } else {
        //     res = await ItemsApiConector.create({ data })
        // }

        if (res) {
            toast.success(`Saldos iniciales registrados correctamente`, { position: "bottom-center" });
            window.location.reload();
        } else {
            toast.error("Upps error al registrar los saldos", { position: "bottom-center" });
            setActive(false)
        }
    }

    const columns: TableColumn<MatchedElement>[] = useMemo<TableColumn<MatchedElement>[]>(() => [
        {
            name: "Producto",
            selector: row => row.name,
            cell: (row, index) =>
                <div>
                    {row.name}
                </div>
        },
        {
            name: "Unidad",
            selector: row => row.unitMeasure?.name || "Unidad desconocida",
        },
        {
            name: "Cantidad",
            cell: (row, index) => <Input
                type="number"
                className="no-spinner outline-dashed my-4 text-right"
                min={0}
                label="Cantidad"
                isVisibleLable
                name={`elements.${index}.quantity`}
                register={register}
                errors={errors.elements?.[index]?.quantity}
                validateAmount={(val: number) => val < 0 ? "Indica un valor" : true}
            />
        },
        {
            name: "Costo unitario",
            cell: (row, index) => <Input
                type="number"
                className="no-spinner outline-dashed my-4 text-right"
                min={0}
                step={0.01}
                label="Costo unitario"
                isVisibleLable
                name={`elements.${index}.inputImport`}
                register={register}
                errors={errors.elements?.[index]?.inputImport}
                validateAmount={(val: number) => val < 0 ? "Indica un valor" : true}
            />
        },
    ], [errors.elements, register])

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6 justify-center items-center w-full p-6"
        >
            <div className="flex flex-col sm:flex-row gap-6 w-full">
                <Input
                    required
                    max={moment().format("YYYY-MM-DD")}
                    type="date"
                    label="Fecha de apertura"
                    iconContainerClassName="!border-0 !ps-1 flex-1"
                    name="openingDate"
                    register={register}
                    errors={errors.openingDate}
                    className="full-selector bg-transparent w-full"
                    icon={<img src="/desde.svg" alt="" className="w-[20px] h-[20px] absolute bottom-3 left-4 invert-0 dark:invert" />}
                />
                <Input
                    required
                    label="Número de documento"
                    name="documentNumber"
                    register={register}
                    errors={errors.documentNumber}
                />
            </div>


            <DataTable columns={columns} className="w-full no-inner-border border !border-font-color/20 !rounded-[10px]"
                data={elemnts} noDataComponent={<div className="min-h-[150px] flex items-center justify-center">Sin productos</div>} />

            <div className="w-full sticky bottom-0 bg-main-background h-full z-50">
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
                            // <>
                            //     {selectedInventario._id !== "" ? "Editar" : "Registrar"}
                            // </>
                            <span>Registrar</span>
                        )}
                    </button>
                </div>
            </div>
        </form>
    )
}

export default AddEditInitialBalances