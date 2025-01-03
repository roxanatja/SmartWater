import { useContext, useEffect, useRef, useState } from 'react';
import { Account } from '../../../../../../type/AccountEntry'
import "./CuentasContales.css"
import { EgresosGastosContext } from '../EgresosGastosContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { AccountEntryApiConector } from '../../../../../../api/classes';
import { Option } from '../../../../components/Option/Option';

interface Props {
    account: Account
}

const CuentasItem = ({ account }: Props) => {
    const [showOptions, setShowOptions] = useState<boolean>(false);
    const { setSelectedAccount } = useContext(EgresosGastosContext);

    const optionsRef = useRef<HTMLDivElement>(null);

    const Opciones = () => {
        setShowOptions(!showOptions);
    };

    const Edit = () => {
        setSelectedAccount(account);
        setShowOptions(false);
    };

    const Delete = async () => {
        toast.error(
            (t) => (
                <div>
                    <p className="mb-4 text-center text-[#888]">
                        Se <b>eliminará</b> esta cuenta, <br /> pulsa <b>Proceder</b> para continuar
                    </p>
                    <div className="flex justify-center">
                        <button
                            className="bg-red-500 px-3 py-1 rounded-lg ml-2 text-white"
                            onClick={() => { toast.dismiss(t.id); }}
                        >
                            Cancelar
                        </button>
                        <button
                            className="bg-blue_custom px-3 py-1 rounded-lg ml-2 text-white"
                            onClick={async () => {
                                toast.dismiss(t.id);
                                const response = await AccountEntryApiConector.delete({ accountId: account?._id || '' });
                                if (!!response && response.message) {
                                    if (response.message.toLowerCase().includes("no")) {
                                        toast.error("No se puede eliminar la cuenta seleccionada porque está asignada a gastos", {
                                            position: "top-center",
                                            duration: 2000
                                        });
                                    } else {
                                        toast.success("Cuenta contable eliminada correctamente", {
                                            position: "top-center",
                                            duration: 2000
                                        });
                                        window.location.reload();
                                    }
                                } else {
                                    toast.error("Error al eliminar cliente", {
                                        position: "top-center",
                                        duration: 2000
                                    });
                                }
                            }}
                        >
                            Proceder
                        </button>
                    </div>
                </div >
            ),
            {
                className: "shadow-md dark:shadow-slate-400 border border-slate-100 bg-main-background",
                icon: null,
                position: "top-center"
            }
        );
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
                        <strong>{account.name}</strong>
                    </p>
                    <div className="flex gap-4 items-center">
                        <p className="text-sm">{account.description}</p>
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
                        eliminar={true}
                        deleteAction={Delete}
                    />
                </div>
            </motion.div>
        </>
    )
}

export default CuentasItem