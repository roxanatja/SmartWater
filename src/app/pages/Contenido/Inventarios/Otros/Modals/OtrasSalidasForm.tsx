import { useContext, useState } from "react"
import { InventariosOtrosContext } from "../InventariosOtrosProvider"
import { useForm } from "react-hook-form"
import { IMockInOuts } from "../../mock-data"
import Input from "../../../../EntryComponents/Inputs";
import { motion } from "framer-motion"
import moment from "moment";
import { MatchedElement, OutputItemBody } from "../../../../../../type/Kardex";
import { AuthService } from "../../../../../../api/services/AuthService";
import { IOthersOutputMoreBody } from "../../../../../../api/types/kardex";
import { KardexApiConector } from "../../../../../../api/classes/kardex";
import toast from "react-hot-toast";
import InventoriesOutputForm from "./InventoriesOutputForm";

interface Props {
    onCancel?: () => void;
    elements: MatchedElement[]
}

type FormType = {
    comment: string;
    documentNumber: string;
    registerDate: string;
}

const OtrasSalidasForm = ({ elements, onCancel }: Props) => {
    // const { selectedInventario } = useContext(InventariosOtrosContext)
    const [active, setActive] = useState(false);

    const { register, formState: { errors, isValid }, handleSubmit } = useForm<FormType>({
        defaultValues: {},
        mode: 'all'
    })

    const [inventories, setInventories] = useState<OutputItemBody[]>([])

    const onSubmit = async (data: FormType) => {
        const userData = AuthService.getUser()

        const reduced = inventories.reduce<{ [key: string]: IOthersOutputMoreBody['elementsDetails'][0]['elements'] }>((acc, prev) => {
            const entity: IOthersOutputMoreBody['elementsDetails'][0]['elements'][0] = {
                quantity: prev.quantity,
                // unitPrice: prev.unitPrice,
            }
            if (prev.item) {
                entity.item = prev.item
            }
            if (prev.product) {
                entity.product = prev.product
            }

            if (acc[prev.outputType]) {
                acc[prev.outputType].push(entity)
            } else {
                acc[prev.outputType] = [entity]
            }

            return acc
        }, {})

        const requestBody: IOthersOutputMoreBody = {
            comment: data.comment,
            documentNumber: data.documentNumber,
            registerDate: data.registerDate,
            user: userData?._id || '',
            elementsDetails: Object.keys(reduced).map(k => ({
                outputType: k as IOthersOutputMoreBody['elementsDetails'][0]['outputType'],
                elements: reduced[k]
            }))
        }

        let res = null
        setActive(true)

        // if (selectedItem._id !== "") {
        //     res = await ItemsApiConector.update({ productId: selectedItem._id, data })
        // } else {
        res = await KardexApiConector.registerOutputMore({ data: requestBody });
        // }

        if (res) {
            // toast.success(`Item ${selectedItem._id === "" ? "registrado" : "editado"} correctamente`, { position: "bottom-center" });
            toast.success(`Salida registrada correctamente`, { position: "bottom-center" });
            window.location.reload();
        } else {
            toast.error("Upps error al registrar la salida", { position: "bottom-center" });
            setActive(false)
        }
    }

    const onAddElements = (val: OutputItemBody, index: number = -1) => {
        if (index > -1) {
            const updateElements = [...inventories]
            updateElements[index] = val
            setInventories(updateElements)
        } else {
            const idx = inventories.findIndex(i => val.product ? i.product === val.product : i.item === val.item);
            if (idx !== -1) {
                setInventories(prev => prev.map(i => {
                    if ((!!val.product && i.product === val.product) || (!!val.item && i.item === val.item)) {
                        // return { ...i, unitPrice: val.unitPrice, quantity: val.quantity, inputType: val.inputType }
                        return { ...i, quantity: val.quantity, inputType: val.outputType }
                    } else {
                        return i
                    }
                }))
            } else {
                setInventories([...inventories, val])
            }
        }
    }

    const handleDeleteElement = (index: number) => {
        setInventories(inventories.filter((_, i) => i !== index));
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6 justify-center items-center w-full p-6"
        ><div className="flex gap-4 justify-between text-sm flex-wrap w-full">
                <Input
                    required
                    max={moment().format("YYYY-MM-DD")}
                    type="date"
                    label="Fecha"
                    iconContainerClassName="!border-0 !ps-1"
                    name="registerDate"
                    register={register}
                    errors={errors.registerDate}
                    containerClassName="flex-1"
                    className="full-selector bg-transparent w-full"
                    icon={<img src="/desde.svg" alt="" className="w-[20px] h-[20px] absolute bottom-3 left-4 invert-0 dark:invert" />}
                />

                <Input
                    containerClassName="flex-1"
                    label="Número de documento"
                    name="documentNumber"
                    required
                    register={register}
                    errors={errors.documentNumber}
                />
            </div>

            <InventoriesOutputForm elements={elements} handleDeleteElement={handleDeleteElement} inventories={inventories} updateDetails={onAddElements} />

            <Input
                rows={3}
                textarea
                label="Comentario"
                name="comment"
                register={register}
                errors={errors.comment}
            />

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
                            <>
                                Registrar
                                {/* {selectedInventario._id !== "" ? "Editar" : "Registrar"} */}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </form>
    )
}

export default OtrasSalidasForm