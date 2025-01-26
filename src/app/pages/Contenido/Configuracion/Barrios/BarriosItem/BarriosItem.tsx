import { FC, useContext, useEffect, useRef, useState } from "react";
import "./BarriosItem.css";
import { Option } from "../../../../components/Option/Option";
import { motion } from 'framer-motion'
import { BarriosContext } from "../BarriosContext";
import { District, Zone } from "../../../../../../type/City";

interface Props {
    district: District & { zones: Zone[] }
}

const BarriosItem: FC<Props> = ({ district }) => {

    const [showOptions, setShowOptions] = useState<boolean>(false);
    const { setSelectedDistrict } = useContext(BarriosContext);

    const optionsRef = useRef<HTMLDivElement>(null);

    const Opciones = () => {
        setShowOptions(!showOptions);
    };

    const Edit = () => {
        setSelectedDistrict(district);
        setShowOptions(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                optionsRef.current &&
                !optionsRef.current.contains(event.target as Node)
            ) {
                setShowOptions(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <>
            <motion.div
                className={`mb-2 flex justify-between bg-blocks dark:border-blocks shadow-md border shadow-zinc-300/25 rounded-2xl p-2`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
            >
                <div className="flex flex-col gap-4 p-1">
                    <p>
                        <strong>{district.name}</strong>
                    </p>
                    <div className="flex gap-4 items-center">
                        <p className="text-sm">{district.zones.length > 0 ? district.zones.map(z => z.name).join(", ") : "Sin asignar"}</p>
                    </div>
                </div>
                <div className="flex gap-2 items-start flex-col pt-2 relative" ref={optionsRef}>
                    <button type="button" className="invert-0 dark:invert" onClick={() => Opciones()}>
                        <img src="/opcion-icon.svg" alt="" />
                    </button>
                    <Option
                        editAction={Edit}
                        visible={showOptions}
                        editar={true}
                    />
                </div>
            </motion.div>
        </>
    )
}

export { BarriosItem }