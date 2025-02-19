import React, { useContext } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form';
import { IPosponeRenovation } from '../../../../api/types/clients';
import { ClientsApiConector } from '../../../../api/classes';
import { MapaClientesContext } from './MapaClientesContext';
import toast from 'react-hot-toast';
import { Contador } from '../../components/Contador/Contador';

const PostponeModal = ({ onClose }: { onClose: () => void }) => {
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { isValid },
    } = useForm<IPosponeRenovation['data']>({
        defaultValues: {
            posponeInDays: 1
        },
        mode: 'all'
    });

    const { selectedClient } = useContext(MapaClientesContext)

    const onSubmit: SubmitHandler<IPosponeRenovation['data']> = async (data) => {
        const response = await ClientsApiConector.posponeClientRenovation({
            data: {
                client: selectedClient._id,
                posponeInDays: Number(String(data.posponeInDays))
            }
        });

        if (response) {
            toast.success("Fecha de renovación pospuesta");
            reset();
            onClose();
            window.location.reload();
        } else {
            toast.error("Uppss error al posponer la fecha de renovación");
        }
    };

    const validateAmount = (value: number) => {
        if (value <= 0) {
            return "El monto debe ser mayor que 0";
        }

        return true;
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='p-6 flex gap-6 flex-col'>
            <div className="flex items-center gap-3 justify-between">
                <span className="text-sm">Días a posponer</span>
                <div>
                    <Contador
                        initialValue={watch('posponeInDays')}
                        min={1}
                        onIncrementar={(count) => setValue("posponeInDays", count, { shouldValidate: true })}
                        onDecrementar={(count) => setValue("posponeInDays", count, { shouldValidate: true })}
                        iconsClassname="text-blue_bright"
                        numberClassname="border border-blue_bright px-4 rounded-md tabular-nums text-sm"
                    />
                </div>
                <input
                    type="hidden"
                    {...register("posponeInDays", {
                        validate: validateAmount
                    })}
                    defaultValue={0}
                />
            </div>


            <div className="w-full flex justify-center items-center sticky bottom-0 py-2 bg-main-background">
                <button
                    type="submit"
                    disabled={!isValid}
                    className="text-white bg-blue-500 hover:bg-blue-600 py-2 px-6 rounded-full text-base disabled:bg-gray-400"
                >
                    Confirmar
                </button>
            </div>
        </form>
    )
}

export default PostponeModal