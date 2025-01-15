import React, { useEffect, useRef } from 'react'
import { useNotifications } from './NotificacionesContext'
import { motion } from 'framer-motion'
import NotificationBlock from './NotificationBlock'
import { NotificationsApiConector } from '../../../../api/classes'

const NotificationsDropdown = () => {
    const { closeNotifications, isOpenNotifications, notifications, openNotifications, markAllAsRead, markOneAsRead } = useNotifications()

    const ref = useRef<HTMLDivElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

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

    useEffect(() => {
        if (isOpenNotifications && containerRef.current) {
            containerRef.current.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }, [isOpenNotifications])

    const markAsRead = (id: string) => {
        NotificationsApiConector.markAsRead({ notificationId: id }).then(res => {
            markOneAsRead(id)
        })
    }

    const markAllAsReadLocal = () => {
        NotificationsApiConector.markAllAsRead().then(res => {
            console.log(res)
            markAllAsRead()
        })
    }

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
                ref={containerRef}
                onClick={(e) => { e.stopPropagation() }}
                initial={false}
                animate={{
                    height: isOpenNotifications ? 500 : 0,
                    borderWidth: isOpenNotifications ? 1 : 0,
                    paddingTop: isOpenNotifications ? '1rem' : 0,
                    paddingBottom: isOpenNotifications ? '1rem' : 0,
                }}
                className={`notifications-container absolute top-full translate-y-3 right-0 min-w-[350px] z-[500] bg-blocks border dark:border-blocks shadow-md dark:shadow-slate-500 rounded-[20px] py-4 px-6 text-sm overflow-y-auto overflow-x-hidden`}>

                <div className="flex items-center justify-between mb-3 px-1">
                    <h3 className='text-font-color text-base font-semibold'>Notificaciones</h3>
                    <i className={`fa-solid fa-envelope-open text-font-color text-base ${notifications.some(n => !n.read) ? "cursor-pointer" : "opacity-50 pointer-events-none cursor-not-allowed"}`} onClick={() => { markAllAsReadLocal() }}></i>
                </div>

                {
                    notifications.length > 0 ?
                        <div className="flex flex-col gap-3">
                            {
                                notifications.map((not, index) =>
                                    <NotificationBlock key={`notification_${index}`} notification={not} markAsRead={markAsRead} />
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