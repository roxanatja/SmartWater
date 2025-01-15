import { useContext, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { SchedulesApiConector } from "../../../../../api/classes";
import toast from "react-hot-toast";
import Input from "../../../EntryComponents/Inputs";
import { HorarioContext } from "./HorarioContext";
import { IScheduleBody } from "../../../../../api/types/schedule";

interface Props {
    isOpen: boolean;
    onCancel?: () => void
}

const WeekDays = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]

const HorariosForm = ({ isOpen, onCancel }: Props) => {
    const { selectedSchedule } = useContext(HorarioContext);
    const [active, setActive] = useState(false);

    const [selectedDays, setSelectedDays] = useState<{ day: string, active: boolean }[]>(WeekDays.map(wd => ({ active: false, day: wd })))

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<IScheduleBody['data']>({
        defaultValues: selectedSchedule._id === "" ? {} : { days: [], endTime: selectedSchedule.endTime, startTime: selectedSchedule.startTime },
        mode: 'all'
    });

    useEffect(() => {
        if (selectedSchedule._id !== "") {
            setSelectedDays(WeekDays.map(wd => ({ active: selectedSchedule.days.includes(wd), day: wd })))
        }
    }, [selectedSchedule])

    const onSubmit: SubmitHandler<IScheduleBody['data']> = async (data) => {
        let res = null
        setActive(true)

        console.log({
            ...data,
            days: selectedDays.filter(sd => sd.active).map(sd => sd.day)
        })

        if (selectedSchedule._id !== "") {
            res = await SchedulesApiConector.update({
                scheduleId: selectedSchedule._id, data: {
                    ...data,
                    days: selectedDays.filter(sd => sd.active).map(sd => sd.day)
                }
            })
        } else {
            res = await SchedulesApiConector.create({
                data: {
                    ...data,
                    days: selectedDays.filter(sd => sd.active).map(sd => sd.day)
                }
            })
        }

        if (res) {
            toast.success(`Horario ${selectedSchedule._id === "" ? "registrado" : "editado"} correctamente`, { position: "bottom-center" });
            window.location.reload();
        } else {
            toast.error("Upps error al crear el horario", { position: "bottom-center" });
            setActive(false)
        }
    };

    const handleChangeChecks = (day: string) => {
        setSelectedDays((prev) => prev.map(d => ({ day: d.day, active: d.day === day ? !d.active : d.active })))
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6 justify-center items-center w-full p-6"
        >
            <div className="w-full flex flex-col sm:flex-row gap-6">
                <Input
                    max={watch("endTime")}
                    type="time"
                    label="Hora de inicio"
                    name="startTime"
                    register={register}
                    errors={errors.startTime}
                    required
                    className="full-selector"
                />

                <Input
                    min={watch("startTime")}
                    type="time"
                    label="Hora de término"
                    name="endTime"
                    register={register}
                    errors={errors.endTime}
                    required
                    className="full-selector"
                />
            </div>

            <div className="w-full flex flex-wrap gap-6">
                {
                    WeekDays.map(wd =>
                        <div className="flex gap-2 items-center" key={wd}>
                            <input
                                type="checkbox"
                                checked={selectedDays.find(sd => sd.day === wd)?.active}
                                className="w-4 h-4 text-blue-900 bg-gray-100 border-gray-300 rounded accent-blue-700"
                                id={wd}
                                onChange={() => handleChangeChecks(wd)}
                            />
                            <label htmlFor={wd} className="mr-4">
                                {wd}
                            </label>
                        </div>
                    )
                }
            </div>

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
                        disabled={((!watch('endTime') || watch('endTime').trim() === "") || (!watch('startTime') || watch('startTime').trim() === "") || !selectedDays.some(sd => !!sd.active)) || active}
                        className="disabled:bg-gray-400 w-full bg-blue-500 py-2 rounded-full text-white font-black shadow-xl truncate"
                    >
                        {active ? (
                            <i className="fa-solid fa-spinner animate-spin"></i>
                        ) : (
                            <>
                                {selectedSchedule._id !== "" ? "Editar" : "Registrar"}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </form>
    )
}

export default HorariosForm