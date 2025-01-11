import React, { useEffect, useRef } from 'react'
import { useNotifications } from './NotificacionesContext'
import { motion } from 'framer-motion'

const NotificationsDropdown = () => {
    const { closeNotifications, isOpenNotifications, notifications, openNotifications } = useNotifications()

    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                ref.current &&
                !ref.current.contains(event.target as Node)
            ) {
                closeNotifications();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [closeNotifications]);

    return (
        <div ref={ref} className="bg-blue_custom text-xl text-white flex items-center justify-center px-4 rounded-full relative cursor-pointer hover:bg-blue-800 w-[45px] h-[45px]"
            onClick={() => {
                if (!isOpenNotifications) openNotifications()
                else closeNotifications()
            }}>
            <i className="fa-solid fa-bell"></i>
            {
                notifications.some(n => !n.read) &&
                < div className="bg-red-500 rounded-full p-2 absolute top-0 right-0" />
            }

            <motion.div
                onClick={(e) => { e.stopPropagation() }}
                initial={false}
                animate={{
                    height: isOpenNotifications ? 500 : 0,
                    borderWidth: isOpenNotifications ? 1 : 0,
                    paddingTop: isOpenNotifications ? '1rem' : 0,
                    paddingBottom: isOpenNotifications ? '1rem' : 0,
                }}
                className={`notifications-container absolute top-full translate-y-3 right-0 min-w-[350px] z-[500] bg-blocks border dark:border-blocks shadow-md dark:shadow-slate-500 rounded-[20px] py-4 px-6 text-sm overflow-y-auto overflow-x-hidden`}>
                <h3 className='text-font-color text-base font-semibold mb-3 px-1'>Notificaciones</h3>

                {
                    notifications.length > 0 ?
                        <div className="flex flex-col gap-3">
                            {
                                notifications.map((not, index) =>
                                    <div key={`notification_${index}`} className={`border rounded-[10px] text-font-color px-3 py-2 ${not.read ? "opacity-65 border-font-color/25" : "border-2 font-[500] border-font-color/60"}`}>
                                        {not.reason}
                                    </div>
                                )
                            }
                        </div> :
                        <div className='text-font-color min-h-[300px] flex items-center justify-center'>
                            Sin notificaciones
                        </div>
                }
            </motion.div>
        </div>

    )
}

export default NotificationsDropdown